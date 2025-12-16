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
        tap((appts: Appointment[]) => {
          this.#state.update(s => ({
            ...s,
            availableAppointments: appts,
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

  getByUser = (userId: string): Promise<Appointment[]> => {
    this.#state.update(s => ({ ...s, error: null, isLoading: true }));

    return lastValueFrom(
      this.appointmentsRepo.getByUser(userId).pipe(
        tap((appts: Appointment[]) => {
          this.#state.update(s => ({
            ...s,
            userAppointments: appts,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error loading user appointments:', err.message);
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            error: err.message,
          }));
          throw err;
        })
      )
    );
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

  updateAppointmentNote = (therapyId: string, appointmentId: string, notes: string): Promise<Appointment> => {
    return lastValueFrom(
      this.appointmentsRepo.updateNote(therapyId, appointmentId, notes).pipe(
        tap((updateAppt: Appointment) => {
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            availableAppointments: s.availableAppointments.map(appt =>
              appt.appointmentId === appointmentId
                ? updateAppt
                : appt
            ),
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error updating appointment note:', err.message);
          this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
          throw err;
        })
      )
    );
  }

  requestAppointment = (therapyId: string, appointmentId: string, notes?: string): Promise<{ message: string }> => {
    const apptTorequest = this.#state().availableAppointments.find(
      (appt) => appt.appointmentId === appointmentId
    );

    if (!apptTorequest) {
      return Promise.reject(new Error('Appointment not found in availables'))
    }

    this.#state.update(s => ({ ...s, isLoading: true, error: null }));

    return lastValueFrom(
      this.appointmentsRepo.requestAppointment(therapyId, appointmentId, notes).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            availableAppointments: s.availableAppointments.filter(appt => appt.appointmentId !== appointmentId),
            error: null
          }));
        }),
        catchError((err: ApiError) => {
          this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
          throw err;
        })
      )
    );
  }

  requestCancellation = (appt: Appointment, notes: string): Promise<{ message: string }> => {
    this.#state.update(s => ({ ...s, isLoading: true, error: null }));

    return lastValueFrom(
      this.appointmentsRepo.requestCancellation(
        appt.therapyId,
        appt.appointmentId,
        notes
      ).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
          throw err;
        })
      )
    );
  }

  joinGroupAppointment = (therapyId: string, appointmentId: string): Promise<{ message: string }> => {
    const appointmentToJoin = this.#state().availableAppointments.find(
      (appt) => appt.appointmentId === appointmentId
    );

    if (!appointmentToJoin) {
      return Promise.reject(new Error("Appointment not found in availables"));
    }

    this.#state.update(s => ({ ...s, isLoading: true, error: null }));

    return lastValueFrom(
      this.appointmentsRepo.joinGroupAppointment(therapyId, appointmentId).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
          throw err;
        })
      )
    );
  }

  leaveGroupAppointment = (therapyId: string, appointmentId: string): Promise<{ message: string }> => {
    this.#state.update(s => ({ ...s, isLoading: true, error: null }));
    return lastValueFrom(
      this.appointmentsRepo.leaveGroupAppointment(therapyId, appointmentId).pipe(
        tap(() => {
          this.#state.update(s => ({
            ...s,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
          throw err;
        })
      )
    )
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
