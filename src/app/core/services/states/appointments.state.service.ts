import { inject, Injectable, signal } from '@angular/core';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsStateService {
  private readonly appointmentsRepo = inject(AppointmentsRepoService);

  readonly #state = signal<AppointmentState>({
    userAppointments: [],
    availableAppointments: [],
    current: null,
    error: null
  });
  appointmentsState = this.#state.asReadonly();

  loadAllAppointments = () => {
    this.appointmentsRepo.getAllAppointments().subscribe({
      next: (appointments) => this.#state.update(s => ({
        ...s,
        availableAppointments: appointments,
        error: null
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        error: err.message
      }))
    });
  }

  loadUserAppointments = (userId?: string) => {
    this.appointmentsRepo.getUserAppointments(userId).subscribe({
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

  requestAppointment = (therapyId: string, appointmentId: string) => {
    return this.appointmentsRepo.requestAppointment(therapyId, appointmentId).subscribe({
      next: () => this.loadUserAppointments(),
      error: (err: ApiError) => console.error('Error requesting appointment:', err)
    });
  }

  joinGroupAppointment = (therapyId: string, appointmentId: string) => {
    return this.appointmentsRepo.joinGroupAppointment(therapyId, appointmentId).subscribe({
      next: () => this.loadUserAppointments(),
      error: (err: ApiError) => console.error('Error joining group appointment:', err)
    });
  }

  leaveGroupAppointment = (therapyId: string, appointmentId: string, cancellationReason?: string) => {
    return this.appointmentsRepo.leaveGroupAppointment(therapyId, appointmentId, cancellationReason).subscribe({
      next: () => this.loadUserAppointments(),
      error: (err: ApiError) => console.error('Error leaving group appointment:', err)
    });
  }

  requestCancellation = (therapyId: string, appointmentId: string, notes: string) => {
    return this.appointmentsRepo.requestCancellation(therapyId, appointmentId, notes).subscribe({
      next: () => this.loadUserAppointments(),
      error: (err: ApiError) => console.error('Error requesting cancellation:', err)
    });
  }
}
