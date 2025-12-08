import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Appointment, AppointmentInput } from '../../../models/appointment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsRepoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`)
  }

  getByUser(userId: string): Observable<Appointment[]> {
    const url = `${this.apiUrl}/users/${userId}/appointments`;
    return this.http.get<Appointment[]>(url);
  }

  createAppt(data: AppointmentInput): Observable<Appointment> {
    const therapyId = data.therapyId;
    const url = `${this.apiUrl}/therapies/${therapyId}/appointments`;
    return this.http.post<Appointment>(url, data);
  }

  updateNote(therapyId: string, appointmentId: string, notes: string): Observable<Appointment> {
    const url = `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}`;
    const payload = { notes: notes };
    return this.http.patch<Appointment>(url, payload);
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

  leaveGroupAppointment(therapyId: string, appointmentId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/leave-group`,
      {}
    );
  }

  requestCancellation(therapyId: string, appointmentId: string, notes: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/request-cancellation`,
      { notes }
    );
  }

  assignAppt(therapyId: string, apptId: string, userEmail: string): Observable<{ message: string }> {
    const body = { userEmail };
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/assign`,
      body
    );
  }

  approveAppt(therapyId: string, apptId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/approve`,
      {}
    );
  }

  approveCancellation(therapyId: string, apptId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/approve-cancellation`,
      {}
    )
  }

  deleteAppointment(therapyId: string, appointmenId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/therapies/${therapyId}/appointments/${appointmenId}`);
  }
}
