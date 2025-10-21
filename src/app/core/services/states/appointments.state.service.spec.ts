import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentsStateService } from './appointments.state.service';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentStatus, Appointment } from '../../../models/appointment.model';

describe('AppointmentsStateService', () => {
  let service: AppointmentsStateService;
  let mockRepo: jasmine.SpyObj<AppointmentsRepoService>;

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('AppointmentsRepoService', [
      'getAllAppointments',
      'getUserAppointments',
      'requestAppointment',
      'joinGroupAppointment',
      'leaveGroupAppointment',
      'requestCancellation'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AppointmentsStateService,
        { provide: AppointmentsRepoService, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(AppointmentsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAllAppointments', () => {
    it('should update state on success', () => {
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
    it('should update state on success', () => {
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
      mockRepo.requestAppointment.and.returnValue(of({ message: 'ok' }));
      mockRepo.getUserAppointments.and.returnValue(of([]));
      service.requestAppointment('therapy1', 'appointment1');
      expect(mockRepo.requestAppointment).toHaveBeenCalledWith('therapy1', 'appointment1');
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.requestAppointment.and.returnValue(throwError(() => ({ message: 'fail' })));
      service.requestAppointment('therapy1', 'appointment1');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('joinGroupAppointment', () => {
    it('should call repo and reload user appointments', () => {
      mockRepo.joinGroupAppointment.and.returnValue(of({ message: 'ok' }));
      mockRepo.getUserAppointments.and.returnValue(of([]));
      service.joinGroupAppointment('therapy1', 'appointment1');
      expect(mockRepo.joinGroupAppointment).toHaveBeenCalledWith('therapy1', 'appointment1');
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.joinGroupAppointment.and.returnValue(throwError(() => ({ message: 'fail' })));
      service.joinGroupAppointment('therapy1', 'appointment1');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('leaveGroupAppointment', () => {
    it('should call repo and reload user appointments', () => {
      mockRepo.leaveGroupAppointment.and.returnValue(of({ message: 'ok' }));
      mockRepo.getUserAppointments.and.returnValue(of([]));
      service.leaveGroupAppointment('therapy1', 'appointment1');
      expect(mockRepo.leaveGroupAppointment).toHaveBeenCalledWith('therapy1', 'appointment1', undefined);
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.leaveGroupAppointment.and.returnValue(throwError(() => ({ message: 'fail' })));
      service.leaveGroupAppointment('therapy1', 'appointment1');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('requestCancellation', () => {
    it('should call repo and reload user appointments', () => {
      mockRepo.requestCancellation.and.returnValue(of({ message: 'ok' }));
      mockRepo.getUserAppointments.and.returnValue(of([]));
      service.requestCancellation('therapy1', 'appointment1', 'notes');
      expect(mockRepo.requestCancellation).toHaveBeenCalledWith('therapy1', 'appointment1', 'notes');
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.requestCancellation.and.returnValue(throwError(() => ({ message: 'fail' })));
      service.requestCancellation('therapy1', 'appointment1', 'notes');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
