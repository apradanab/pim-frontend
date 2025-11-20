import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Appointment } from '../../../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsRepoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`)
  }

  getUserAppointments(userId: string): Observable<Appointment[]> {
    const url = `${this.apiUrl}/users/${userId}/appointments`;
    return this.http.get<Appointment[]>(url);
  }

  requestAppointment(therapyId: string, appointmentId: string, notes?: string): Observable<{ message: string }> {
    const body = { notes };
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/request`,
      body
    );
  }

  joinGroupAppointment(therapyId: string, appointmentId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/join-group`,
      {}
    );
  }

  leaveGroupAppointment(therapyId: string, appointmentId: string, cancellationReason?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/leave-group`,
      { cancellationReason }
    );
  }

  requestCancellation(therapyId: string, appointmentId: string, notes: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/request-cancellation`,
      { notes }
    );
  }

  deleteAppointment(therapyId: string, appointmenId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/therapies/${therapyId}/appointments/${appointmenId}`);
  }
}
