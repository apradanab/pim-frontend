import { TestBed } from '@angular/core/testing';
import { AppointmentsRepoService } from './appointments.repo.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Appointment, AppointmentInput, AppointmentStatus } from '../../../models/appointment.model';

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
    service.listAppointments().subscribe((appointments) => {
      expect(appointments).toEqual(mockAppointments as Appointment[]);
    });

    const req = httpMock.expectOne(`${apiUrl}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAppointments as Appointment[]);
  });

  it('should retrieve appointments for a single user when userId is provided', () => {
    const userId = 'u1';
    const relatedAppointments = mockAppointments.filter(a => a.userId === userId);

    service.getByUser(userId).subscribe((appointments) => {
      expect(appointments).toEqual(relatedAppointments as Appointment[]);
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${userId}/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(relatedAppointments as Appointment[]);
  });

  it('should create an appointment', () => {
    const payload: AppointmentInput = {
      date: '2025-01-01',
      therapyId: 't10',
      startTime: '10:00',
      endTime: '11:00',
      userEmail: 'test@test.com'
    };

    const mockResponse = {
      appointmentId: 'abc',
      status: AppointmentStatus.PENDING,
      createdAt: '2025-01-01T00:00:00.000Z',
      ...payload
    } as Appointment

    service.createAppt(payload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${payload.therapyId}/appointments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should update appointment notes using PATCH method', () => {
    const therapyId = 't1';
    const appointmentId = 'a1';
    const notes = 'Nota';

    const mockUpdatedAppt: Partial<Appointment> = {
      appointmentId,
      notes
    };

    service.updateNote(therapyId, appointmentId, notes).subscribe((appt) => {
      expect(appt).toEqual(mockUpdatedAppt as Appointment);
    });

    const expectedUrl = `${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}`;
    const expectedBody = { notes: notes };

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(expectedBody);

    req.flush(mockUpdatedAppt as Appointment);
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

  it('should leave a group appointment', () => {
    const therapyId = 't1';
    const appointmentId = '1';
    const mockResponse = { message: 'Left group successfully' };

    service.leaveGroupAppointment(therapyId, appointmentId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}/actions/leave-group`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
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
  });

  it('should assign an appointment to a user (assignAppt)', () => {
    const therapyId = 't1';
    const apptId = 'a1';
    const userEmail = 'user@example.com';
    const mockResponse = { message: 'Assigned successfully' };

    service.assignAppt(therapyId, apptId, userEmail).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/assign`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userEmail });
    req.flush(mockResponse);
  });

  it('should approve an appointment (approveAppt)', () => {
    const therapyId = 't1';
    const apptId = 'a1';
    const mockResponse = { message: 'Approved successfully' };

    service.approveAppt(therapyId, apptId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/approve`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('should approve a cancellation (approveCancellation)', () => {
    const therapyId = 't1';
    const apptId = 'a1';
    const mockResponse = { message: 'Cancellation approved' };

    service.approveCancellation(therapyId, apptId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/therapies/${therapyId}/appointments/${apptId}/actions/approve-cancellation`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('should delete an appointment', () => {
    const therapyId = 't1';
    const appointmentId = 'a1';

    service.deleteAppointment(therapyId, appointmentId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/therapies/${therapyId}/appointments/${appointmentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
