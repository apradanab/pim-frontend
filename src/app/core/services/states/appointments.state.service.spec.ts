import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentsStateService } from './appointments.state.service';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentStatus, Appointment } from '../../../models/appointment.model';
import { UsersStateService } from './users.state.service';
import { signal } from '@angular/core';

const mockUserState = {
  currentUser: { userId: '1', email: 'test@example.com'}
};

describe('AppointmentsStateService', () => {
  let service: AppointmentsStateService;
  let mockRepo: jasmine.SpyObj<AppointmentsRepoService>;
  let mockUsersStateService: jasmine.SpyObj<UsersStateService>;

  const userId = '1';
  const therapyId = '2';
  const appointmentId = '3';
  const mockSuccessResponse = { message: 'ok' };
  const mockErrorResponse = { message: 'fail' };

  const createReloadSpy = () => {
    return spyOn(service, 'loadUserAppointments').and.callThrough();
  }

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('AppointmentsRepoService', [
      'getAllAppointments',
      'getUserAppointments',
      'requestAppointment',
      'joinGroupAppointment',
      'leaveGroupAppointment',
      'requestCancellation'
    ]);

    mockUsersStateService = jasmine.createSpyObj('UsersStateService', ['loadCurrentUser'], {
      usersState: signal({ currentUser: mockUserState.currentUser, error: null })
    });

    TestBed.configureTestingModule({
      providers: [
        AppointmentsStateService,
        { provide: AppointmentsRepoService, useValue: mockRepo },
        { provide: UsersStateService, useValue: mockUsersStateService}
      ]
    });

    service = TestBed.inject(AppointmentsStateService);
    mockRepo.getUserAppointments.and.returnValue(of([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAllAppointments', () => {

    const appointments: Appointment[] = [
      {
        appointmentId: '1',
        date: '2025-10-21',
        startTime: '10:00',
        endTime: '11:00',
        status: AppointmentStatus.AVAILABLE,
        currentParticipants: 0,
        maxParticipants: 1,
        therapyId: 'id1',
        createdAt: ''
      }
    ];

    it('should update state on success', () => {
      mockRepo.getAllAppointments.and.returnValue(of(appointments));
      service.loadAllAppointments();
      expect(service.appointmentsState().availableAppointments).toEqual(appointments);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should update state on error', () => {
      const error = { message: 'Network error' };
      mockRepo.getAllAppointments.and.returnValue(throwError(() => error));
      service.loadAllAppointments();
      expect(service.appointmentsState().error).toBe(error.message);
    });
  });

  describe('loadUserAppointments', () => {
    const userAppointments: Appointment[] = [
      {
        appointmentId: '2',
        date: '2025-10-21',
        startTime: '12:00',
        endTime: '13:00',
        status: AppointmentStatus.OCCUPIED,
        currentParticipants: 1,
        maxParticipants: 1,
        therapyId: 'id2',
        createdAt: ''
      }
    ];

    it('should update state on success', () => {
      mockRepo.getUserAppointments.and.returnValue(of(userAppointments));
      service.loadUserAppointments('user1');
      expect(service.appointmentsState().userAppointments).toEqual(userAppointments);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should update state on error', () => {
      const error = { message: 'Network error' };
      mockRepo.getUserAppointments.and.returnValue(throwError(() => error));
      service.loadUserAppointments('user1');
      expect(service.appointmentsState().error).toBe(error.message);
    });
  });

  describe('requestAppointment', () => {
    it('should call repo and reload user appointments', () => {
      const reloadSpy = createReloadSpy();
      mockRepo.requestAppointment.and.returnValue(of(mockSuccessResponse));
      service.requestAppointment(therapyId, appointmentId);
      expect(mockRepo.requestAppointment).toHaveBeenCalledWith(therapyId, appointmentId);
      expect(reloadSpy).toHaveBeenCalledWith(userId);
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.requestAppointment.and.returnValue(throwError(() => mockErrorResponse));
      service.requestAppointment(therapyId, appointmentId);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('joinGroupAppointment', () => {
    it('should call repo and reload user appointments', () => {
      const reloadSpy = createReloadSpy();
      mockRepo.joinGroupAppointment.and.returnValue(of(mockSuccessResponse));
      service.joinGroupAppointment(therapyId, appointmentId);
      expect(mockRepo.joinGroupAppointment).toHaveBeenCalledWith(therapyId, appointmentId);
      expect(reloadSpy).toHaveBeenCalledWith(userId);
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.joinGroupAppointment.and.returnValue(throwError(() => mockErrorResponse));
      service.joinGroupAppointment(therapyId, appointmentId);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('leaveGroupAppointment', () => {
    it('should call repo and reload user appointments', () => {
      const reloadSpy = createReloadSpy();
      const cancellationReason = 'Not attending';
      mockRepo.leaveGroupAppointment.and.returnValue(of(mockSuccessResponse));
      service.leaveGroupAppointment(therapyId, appointmentId, cancellationReason);
      expect(mockRepo.leaveGroupAppointment).toHaveBeenCalledWith(therapyId, appointmentId, cancellationReason);
      expect(reloadSpy).toHaveBeenCalledWith(userId);
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.leaveGroupAppointment.and.returnValue(throwError(() => mockErrorResponse));
      service.leaveGroupAppointment(therapyId, appointmentId);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('requestCancellation', () => {
    it('should call repo and reload user appointments', () => {
      const reloadSpy = createReloadSpy();
      const notes = 'notes';
      mockRepo.requestCancellation.and.returnValue(of(mockSuccessResponse));
      service.requestCancellation(therapyId, appointmentId, notes);
      expect(mockRepo.requestCancellation).toHaveBeenCalledWith(therapyId, appointmentId, notes);
      expect(reloadSpy).toHaveBeenCalledWith(userId);
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      const notes = 'notes';
      mockRepo.requestCancellation.and.returnValue(throwError(() => mockErrorResponse));
      service.requestCancellation(therapyId, appointmentId, notes);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
