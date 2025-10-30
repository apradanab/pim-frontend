import { TestBed } from '@angular/core/testing';
import { AppointmentsRepoService } from './appointments.repo.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Appointment } from '../../../models/appointment.model';

describe('AppointmentsRepoService', () => {
  let service: AppointmentsRepoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockAppointments: Partial<Appointment>[] = [
    { appointmentId: '1', date: '2025-10-19', userId: 'u1' },
    { appointmentId: '2', date: '2025-10-20', userId: 'u2' },
    { appointmentId: '3', date: '2025-10-21', userId: 'u3' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppointmentsRepoService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AppointmentsRepoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all appointments', () => {
    service.getAllAppointments().subscribe((appointments) => {
      expect(appointments).toEqual(mockAppointments as Appointment[]);
    });

    const req = httpMock.expectOne(`${apiUrl}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments as Appointment[]);
  });

  it('should retrieve appointments for a single user when userId is provided', () => {
    const userId = 'u1';
    const relatedAppointments = mockAppointments.filter(a => a.userId === userId);

    service.getUserAppointments(userId).subscribe((appointments) => {
      expect(appointments).toEqual(relatedAppointments as Appointment[]);
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(relatedAppointments as Appointment[]);
  });

  it('should request an appointment', () => {
    const therapyId = 't1';
    const appointmentId = '1';
    const notes = 'note';
    const mockResponse = { message: 'Appointment requested successfully' };

    service.requestAppointment(therapyId, appointmentId, notes).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/request`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ notes });
    req.flush(mockResponse);
  });

  it('should join a group appointment', () => {
    const therapyId = 't1';
    const appointmentId = '1';
    const mockResponse = { message: 'Joined group successfully' };

    service.joinGroupAppointment(therapyId, appointmentId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/join-group`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('should leave a group appointment with a cancellation reason', () => {
    const therapyId = 't1';
    const appointmentId = '1';
    const cancellationReason = 'Not available';
    const mockResponse = { message: 'Left group successfully' };

    service.leaveGroupAppointment(therapyId, appointmentId, cancellationReason).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/leave-group`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ cancellationReason });
    req.flush(mockResponse);
  });

  it('should request cancellation of an appointment', () => {
    const therapyId = 't1';
    const appointmentId = '1';
    const notes = 'Cannot attend this session';
    const mockResponse = { message: 'Cancellation requested successfully' };

    service.requestCancellation(therapyId, appointmentId, notes).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/request-cancellation`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ notes });
    req.flush(mockResponse);
  })
});
