import { inject, Injectable, signal } from '@angular/core';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { UsersStateService } from './users.state.service';
import { Appointment } from '../../../models/appointment.model';
import { catchError, lastValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsStateService {
  private readonly appointmentsRepo = inject(AppointmentsRepoService);
  private readonly userStateService = inject(UsersStateService);

  readonly #state = signal<AppointmentState>({
    userAppointments: [],
    availableAppointments: [],
    current: null,
    isLoading: false,
    error: null
  });
  appointmentsState = this.#state.asReadonly();

  listAppointments = (): Promise<Appointment[]> => {
    this.#state.update(s => ({ ...s, error: null, isLoading: true }));
    return lastValueFrom(
      this.appointmentsRepo.listAppointments().pipe(
        tap((apts: Appointment[]) => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: apts,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error listing available appointments:', err.message);
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            error: err.message,
          }));
          throw err;
        })
      )
    )
  }

  getByUser = (userId: string) => {
    this.appointmentsRepo.getByUser(userId).subscribe({
      next: (appointments) => this.#state.update(s => ({
        ...s,
        userAppointments: appointments,
        error: null
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        error: err.message
      }))
    });
  }

  private reloadUserAppointments() {
    const userId = this.userStateService.usersState().currentUser?.userId;
    if (userId) this.getByUser(userId);
  }

  requestAppointment = (therapyId: string, appointmentId: string, notes?: string) => {
    return this.appointmentsRepo.requestAppointment(therapyId, appointmentId, notes).subscribe({
      next: () => this.reloadUserAppointments(),
      error: (err: ApiError) => console.error('Error requesting appointment:', err)
    });
  }

  joinGroupAppointment = (therapyId: string, appointmentId: string) => {
    return this.appointmentsRepo.joinGroupAppointment(therapyId, appointmentId).subscribe({
      next: () => this.reloadUserAppointments(),
      error: (err: ApiError) => console.error('Error joining group appointment:', err)
    });
  }

  leaveGroupAppointment = (therapyId: string, appointmentId: string, cancellationReason?: string) => {
    return this.appointmentsRepo.leaveGroupAppointment(therapyId, appointmentId, cancellationReason).subscribe({
      next: () => this.reloadUserAppointments(),
      error: (err: ApiError) => console.error('Error leaving group appointment:', err)
    });
  }

  requestCancellation = (therapyId: string, appointmentId: string, notes: string) => {
    return this.appointmentsRepo.requestCancellation(therapyId, appointmentId, notes).subscribe({
      next: () => this.reloadUserAppointments(),
      error: (err: ApiError) => console.error('Error requesting cancellation:', err)
    });
  }

  deleteAppointment = (therapyId: string, appointmentId: string) => {
  return this.appointmentsRepo.deleteAppointment(therapyId, appointmentId).subscribe({
      next: () => this.#state.update(s => ({
        ...s,
        availableAppointments: s.availableAppointments.filter(
          apt => apt.appointmentId !== appointmentId
        ),
        userAppointments: s.userAppointments.filter(
          apt => apt.appointmentId !== appointmentId
        )
      })),
      error: (err) => {
        console.error('Error deleting appointment', appointmentId, err);
      }
    });
  }
}
