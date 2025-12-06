import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentsStateService } from './appointments.state.service';
import { AppointmentsRepoService } from '../repos/appointments.repo.service';
import { AppointmentStatus, Appointment, AppointmentInput } from '../../../models/appointment.model';
import { UsersStateService } from './users.state.service';
import { signal } from '@angular/core';

const mockUserState = {
  get currentUser() {
    return { userId: '1', email: 'test@example.com'}
  }
};

describe('AppointmentsStateService', () => {
  let service: AppointmentsStateService;
  let mockRepo: jasmine.SpyObj<AppointmentsRepoService>;
  let mockUsersStateService: jasmine.SpyObj<UsersStateService>;

  const therapyId = '2';
  const appointmentId = '3';
  const mockSuccessResponse = { message: 'ok' };
  const mockErrorResponse = { message: 'fail' };

  const mockInitialAppointment: Appointment = {
    appointmentId: appointmentId,
    date: '2025-11-08',
    startTime: '10:00',
    endTime: '11:00',
    status: AppointmentStatus.AVAILABLE,
    currentParticipants: 0,
    maxParticipants: 1,
    therapyId: therapyId,
    createdAt: ''
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('AppointmentsRepoService', [
      'listAppointments',
      'getByUser',
      'createAppt',
      'requestAppointment',
      'joinGroupAppointment',
      'leaveGroupAppointment',
      'requestCancellation',
      'assignAppt',
      'approveAppt',
      'approveCancellation',
      'deleteAppointment'
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
    mockRepo.getByUser.and.returnValue(of([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAppointments', () => {
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

    it('should update state on success', async () => {
      mockRepo.listAppointments.and.returnValue(of(appointments));

      await service.listAppointments();

      const state = service.appointmentsState();
      expect(state.availableAppointments).toEqual(appointments);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBeFalse();
    });

    it('should update state on error', async () => {
      const error = { message: 'Network error' };
      mockRepo.listAppointments.and.returnValue(throwError(() => error));

      await expectAsync(service.listAppointments()).toBeRejected();

      const state = service.appointmentsState();
      expect(state.error).toBe(error.message);
      expect(state.isLoading).toBeFalse();
    });
  });

  describe('getByUser', () => {
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
      mockRepo.getByUser.and.returnValue(of(userAppointments));
      service.getByUser('user1');
      expect(service.appointmentsState().userAppointments).toEqual(userAppointments);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should update state on error', () => {
      const error = { message: 'Network error' };
      mockRepo.getByUser.and.returnValue(throwError(() => error));
      service.getByUser('user1');
      expect(service.appointmentsState().error).toBe(error.message);
    });
  });

  describe('createAppt', () => {
    const apptInput: AppointmentInput = {
      date: '2025-11-28',
      startTime: '14:00',
      endTime: '15:00',
      maxParticipants: 1,
      therapyId: therapyId
    };
    const newAppt: Appointment = {
      ...apptInput,
      appointmentId: 'newId',
      status: AppointmentStatus.AVAILABLE,
      currentParticipants: 0,
      createdAt: ''
    };
    const initialAppointments: Appointment[] = [
      { appointmentId: 'oldId', date: '2025-11-08', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, maxParticipants: 1, therapyId: 't1', currentParticipants: 0, createdAt: '' },
    ];

    beforeEach(() => {
      mockRepo.listAppointments.and.returnValue(of(initialAppointments));
      service.listAppointments();
    });

    it('should call repo and update state with new appointment on success', async () => {
      mockRepo.createAppt.and.returnValue(of(newAppt));

      const result = await service.createAppt(apptInput);

      expect(mockRepo.createAppt).toHaveBeenCalledWith(apptInput);
      expect(result).toEqual(newAppt);
      const state = service.appointmentsState();
      expect(state.availableAppointments.length).toBe(initialAppointments.length + 1);
      expect(state.availableAppointments).toContain(newAppt);
      expect(state.error).toBeNull();
    });

    it('should handle error', async () => {
      const error = { message: 'Creation failed' };
      mockRepo.createAppt.and.returnValue(throwError(() => error));

      await expectAsync(service.createAppt(apptInput)).toBeRejected();
      expect(service.appointmentsState().availableAppointments).toEqual(initialAppointments);
    })
  })

  describe('requestAppointment', () => {
    const notes = 'nota';

    beforeEach(async () => {
      mockRepo.listAppointments.and.returnValue(of([mockInitialAppointment]));
      await service.listAppointments();
    });

    it('should reject if appointment is not found in availables', async () => {
      mockRepo.listAppointments.and.returnValue(of([]));
      await service.listAppointments();

      await expectAsync(service.requestAppointment(therapyId, appointmentId)).toBeRejectedWith(
        new Error('Appointment not found in availables')
      );

      expect(mockRepo.requestAppointment).not.toHaveBeenCalled();
      expect(service.appointmentsState().isLoading).toBeFalse();
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should call repo and return the response', async () => {
      mockRepo.requestAppointment.and.returnValue(of(mockSuccessResponse));

      const result = await service.requestAppointment(therapyId, appointmentId, notes);

      expect(mockRepo.requestAppointment).toHaveBeenCalledWith(therapyId, appointmentId, notes);
      expect(result).toEqual(mockSuccessResponse);
      expect(service.appointmentsState().availableAppointments.length).toBe(0);
      expect(service.appointmentsState().isLoading).toBeFalse();
    });

    it('should handle error and update state on failure', async () => {
      mockRepo.requestAppointment.and.returnValue(throwError(() => mockErrorResponse));

      await expectAsync(service.requestAppointment(therapyId, appointmentId)).toBeRejectedWith(mockErrorResponse);

      expect(service.appointmentsState().error).toBe(mockErrorResponse.message);
      expect(service.appointmentsState().isLoading).toBeFalse();
      expect(service.appointmentsState().availableAppointments.length).toBe(1);
    });
  });

  describe('joinGroupAppointment', () => {
    beforeEach(async () => {
        mockRepo.listAppointments.and.returnValue(of([mockInitialAppointment]));
        await service.listAppointments();
    });

    it('should reject if appointment is not found in availables', async () => {
      mockRepo.listAppointments.and.returnValue(of([]));
      await service.listAppointments();

      await expectAsync(service.joinGroupAppointment(therapyId, appointmentId)).toBeRejectedWith(
          new Error('Appointment not found in availables')
      );

      expect(mockRepo.joinGroupAppointment).not.toHaveBeenCalled();
      expect(service.appointmentsState().isLoading).toBeFalse();
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should call repo and return response', async () => {
      mockRepo.joinGroupAppointment.and.returnValue(of(mockSuccessResponse));
      const result = await service.joinGroupAppointment(therapyId, appointmentId);

      expect(mockRepo.joinGroupAppointment).toHaveBeenCalledWith(therapyId, appointmentId);
      expect(result).toEqual(mockSuccessResponse);
      expect(service.appointmentsState().isLoading).toBeFalse();
    });

    it('should handle error', async () => {
      mockRepo.joinGroupAppointment.and.returnValue(throwError(() => mockErrorResponse));
      await expectAsync(service.joinGroupAppointment(therapyId, appointmentId)).toBeRejectedWith(mockErrorResponse);

      expect(service.appointmentsState().error).toBe(mockErrorResponse.message);
      expect(service.appointmentsState().isLoading).toBeFalse();
    });
  });

  describe('leaveGroupAppointment', () => {
    it('should call repo and return the response', async () => {
      mockRepo.leaveGroupAppointment.and.returnValue(of(mockSuccessResponse));

      const result = await service.leaveGroupAppointment(therapyId, appointmentId);

      expect(mockRepo.leaveGroupAppointment).toHaveBeenCalledWith(therapyId, appointmentId);
      expect(result).toEqual(mockSuccessResponse);
    });

    it('should handle error', async () => {
      mockRepo.leaveGroupAppointment.and.returnValue(throwError(() => mockErrorResponse));
      await expectAsync(service.leaveGroupAppointment(therapyId, appointmentId)).toBeRejectedWith(mockErrorResponse);
    });
  });

  describe('requestCancellation', () => {
    const notes = 'notes';

    const apptToCancel: Appointment = {
      ...mockInitialAppointment,
      status: AppointmentStatus.OCCUPIED,
      currentParticipants: 1,
    };

    it('should call repo and return the response', async () => {
      mockRepo.requestCancellation.and.returnValue(of(mockSuccessResponse));

      const result = await service.requestCancellation(apptToCancel, notes);

      expect(mockRepo.requestCancellation).toHaveBeenCalledWith(apptToCancel.therapyId, apptToCancel.appointmentId, notes);
      expect(result).toEqual(mockSuccessResponse);
      expect(service.appointmentsState().isLoading).toBeFalse();
    });

    it('should handle error and update state', async () => {
      mockRepo.requestCancellation.and.returnValue(throwError(() => mockErrorResponse));

      await expectAsync(service.requestCancellation(apptToCancel, notes)).toBeRejectedWith(mockErrorResponse);

      expect(service.appointmentsState().error).toBe(mockErrorResponse.message);
      expect(service.appointmentsState().isLoading).toBeFalse();
    });
  });

  describe('assignAppt', () => {
    const userEmail = 'user@example.com';
    const appointmentToAssign: Appointment = {
      therapyId: therapyId,
      appointmentId: appointmentId,
      date: '2025-11-08',
      startTime: '10:00',
      endTime: '11:00',
      status: AppointmentStatus.AVAILABLE,
      currentParticipants: 0,
      maxParticipants: 1,
      createdAt: ''
    };
    const initialAppointments: Appointment[] = [
      appointmentToAssign,
      { therapyId: 't1', appointmentId: 'other', date: '2025-11-09', startTime: '12:00', endTime: '13:00', status: AppointmentStatus.AVAILABLE, currentParticipants: 0, maxParticipants: 1, createdAt: '' }
    ];

    beforeEach(() => {
      mockRepo.listAppointments.and.returnValue(of(initialAppointments));
      service.listAppointments();
    });

    it('should call repo and update appointment status and userEmail in state on success', async () => {
      mockRepo.assignAppt.and.returnValue(of(mockSuccessResponse));

      await service.assignAppt(therapyId, appointmentId, userEmail);

      expect(mockRepo.assignAppt).toHaveBeenCalledWith(therapyId, appointmentId, userEmail);

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.OCCUPIED);
      expect(updatedAppointment?.userEmail).toBe(userEmail);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should handle error and not change state', async () => {
      mockRepo.assignAppt.and.returnValue(throwError(() => mockErrorResponse));

      await expectAsync(service.assignAppt(therapyId, appointmentId, userEmail)).toBeRejected();

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.AVAILABLE);
      expect(updatedAppointment?.userEmail).toBeUndefined();
    });
  })

  describe('approveAppt', () => {
    const appointmentToApprove: Appointment = {
      therapyId: therapyId,
      appointmentId: appointmentId,
      date: '2025-11-08',
      startTime: '10:00',
      endTime: '11:00',
      status: AppointmentStatus.PENDING,
      currentParticipants: 0,
      maxParticipants: 1,
      createdAt: ''
    };
    const initialAppointments: Appointment[] = [
      appointmentToApprove,
      { therapyId: 't1', appointmentId: 'other', date: '2025-11-09', startTime: '12:00', endTime: '13:00', status: AppointmentStatus.AVAILABLE, currentParticipants: 0, maxParticipants: 1, createdAt: '' }
    ];

    beforeEach(async () => {
      mockRepo.listAppointments.and.returnValue(of(initialAppointments));
      await service.listAppointments();
    });

    it('should call repo and update appointment status to OCCUPIED in state on success', async () => {
      mockRepo.approveAppt.and.returnValue(of(mockSuccessResponse));

      await service.approveAppt(therapyId, appointmentId);

      expect(mockRepo.approveAppt).toHaveBeenCalledWith(therapyId, appointmentId);

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.OCCUPIED);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should handle error and not change state', async () => {
      mockRepo.approveAppt.and.returnValue(throwError(() => mockErrorResponse));

      await expectAsync(service.approveAppt(therapyId, appointmentId)).toBeRejected();

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.PENDING);
    });
  })

  describe('approveCancellation', () => {
    const appointmentToCancel: Appointment = {
      therapyId: therapyId,
      appointmentId: appointmentId,
      date: '2025-11-08',
      startTime: '10:00',
      endTime: '11:00',
      status: AppointmentStatus.CANCELLATION_PENDING,
      currentParticipants: 1,
      maxParticipants: 1,
      createdAt: ''
    };
    const initialAppointments: Appointment[] = [
      appointmentToCancel,
      { therapyId: 't1', appointmentId: 'other', date: '2025-11-09', startTime: '12:00', endTime: '13:00', status: AppointmentStatus.OCCUPIED, currentParticipants: 1, maxParticipants: 1, createdAt: '' }
    ];

    beforeEach(async () => {
      mockRepo.listAppointments.and.returnValue(of(initialAppointments));
      await service.listAppointments();
    });

    it('should call repo and update appointment status to CANCELLED in state on success', async () => {
      mockRepo.approveCancellation.and.returnValue(of(mockSuccessResponse));

      await service.approveCancellation(therapyId, appointmentId);

      expect(mockRepo.approveCancellation).toHaveBeenCalledWith(therapyId, appointmentId);

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.CANCELLED);
      expect(service.appointmentsState().error).toBeNull();
    });

    it('should handle error and not change state', async () => {
      mockRepo.approveCancellation.and.returnValue(throwError(() => mockErrorResponse));

      await expectAsync(service.approveCancellation(therapyId, appointmentId)).toBeRejected();

      const updatedAppointment = service.appointmentsState().availableAppointments.find(a => a.appointmentId === appointmentId);
      expect(updatedAppointment?.status).toBe(AppointmentStatus.CANCELLATION_PENDING);
    });
  });

  describe('deleteAppointment', () => {
    it('should call repo and remove the appointemnt by its ID from state on success', () => {
      const initialAppointments: Appointment[] = [
        { therapyId: 't1', appointmentId: appointmentId, date: '2025-11-08', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, createdAt: '' },
        { therapyId: 't1', appointmentId: 'other', date: '2025-11-09', startTime: '12:00', endTime: '13:00', status: AppointmentStatus.AVAILABLE, createdAt: '' }
      ];

      mockRepo.listAppointments.and.returnValue(of(initialAppointments));
      service.listAppointments();

      mockRepo.getByUser.and.returnValue(of(initialAppointments));
      service.getByUser('1');

      mockRepo.deleteAppointment.and.returnValue(of(void 0));
      service.deleteAppointment(therapyId, appointmentId);

      expect(mockRepo.deleteAppointment).toHaveBeenCalledWith(therapyId, appointmentId);

      const state = service.appointmentsState();
      expect(state.availableAppointments.find(a => a.appointmentId === appointmentId)).toBeUndefined();
      expect(state.userAppointments.find(a => a.appointmentId === appointmentId)).toBeUndefined();
    });

    it('should handle error', () => {
      const consoleSpy = spyOn(console, 'error');
      mockRepo.deleteAppointment = jasmine.createSpy().and.returnValue(throwError(() => new Error('Delete failed')));

      service.deleteAppointment(therapyId, appointmentId);

      expect(mockRepo.deleteAppointment).toHaveBeenCalledWith(therapyId, appointmentId);
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting appointment', appointmentId, jasmine.any(Error));
    });
  })
});
