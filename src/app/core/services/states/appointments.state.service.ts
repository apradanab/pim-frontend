import { inject, Injectable, signal } from '@angular/core';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { UsersStateService } from './users.state.service';
import { Appointment, AppointmentInput, AppointmentStatus } from '../../../models/appointment.model';
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

  createAppt = (data: AppointmentInput): Promise<Appointment> => {
    return lastValueFrom(
      this.appointmentsRepo.createAppt(data).pipe(
        tap((newAppt: Appointment) => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: [...s.availableAppointments, newAppt],
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error creating appointment:', err.message);
          throw err;
        })
      )
    )
  }

  requestAppointment = (therapyId: string, appointmentId: string, notes?: string) => {
    return this.appointmentsRepo.requestAppointment(therapyId, appointmentId, notes);
  }

  joinGroupAppointment = (therapyId: string, appointmentId: string) => {
    return this.appointmentsRepo.joinGroupAppointment(therapyId, appointmentId);
  }

  leaveGroupAppointment = (therapyId: string, appointmentId: string, cancellationReason?: string) => {
    return this.appointmentsRepo.leaveGroupAppointment(therapyId, appointmentId, cancellationReason);
  }

  requestCancellation = (therapyId: string, appointmentId: string, notes: string) => {
    return this.appointmentsRepo.requestCancellation(therapyId, appointmentId, notes);
  }

  assignAppt = (therapyId: string, apptId: string, userEmail: string): Promise<{ message: string }> => {
    return lastValueFrom(
      this.appointmentsRepo.assignAppt(therapyId, apptId, userEmail).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: s.availableAppointments.map(appt =>
              appt.appointmentId === apptId
                ? { ...appt, status: AppointmentStatus.OCCUPIED, userEmail: userEmail}
                : appt
            ),
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error assigning appointment:', err.message);
          throw err;
        })
      )
    )
  }

  approveAppt = (therapyId: string, apptId: string): Promise<{ message: string }> => {
    return lastValueFrom(
      this.appointmentsRepo.approveAppt(therapyId, apptId).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: s.availableAppointments.map(appt =>
              appt.appointmentId === apptId
              ? { ...appt, status: AppointmentStatus.OCCUPIED}
              : appt
            ),
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error approving appointment:', err.message);
          throw err;
        })
      )
    )
  }

  approveCancellation = (therapyId: string, apptId: string): Promise<{ message: string }> => {
    return lastValueFrom(
      this.appointmentsRepo.approveCancellation(therapyId, apptId).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: s.availableAppointments.map(appt =>
              appt.appointmentId === apptId
              ? { ...appt, status: AppointmentStatus.CANCELLED }
              : appt
            ),
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error approving cancellation:', err.message);
          throw err;
        })
      )
    )
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
