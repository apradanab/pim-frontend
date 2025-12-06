import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsListComponent } from './appointments-list.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { signal } from '@angular/core';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { of } from 'rxjs';

describe('AppointmentsListComponent', () => {
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let component: AppointmentsListComponent;

  const mockAppointments = [
    { appointmentId: '1', therapyId: 't1', date: '2025-11-05', startTime: '10:00', status: AppointmentStatus.OCCUPIED },
    { appointmentId: '2', therapyId: 't2', date: '2025-11-06', startTime: '09:00', status: AppointmentStatus.PENDING },
  ] as Appointment[];

  const mockAppointment1 = mockAppointments.find(a => a.appointmentId === '1') as Appointment;

  const mockAppointmentsState = signal({
    userAppointments: mockAppointments,
    error: null
  });

  const mockAppointmentsService = {
    appointmentsState: mockAppointmentsState,
    getByUser: jasmine.createSpy('getByUser'),
    requestCancellation: jasmine.createSpy('requestCancellation').and.returnValue(of(true)),
    leaveGroupAppointment: jasmine.createSpy('leaveGroupAppointment'),
  };

  const mockTherapiesService = {
    therapiesState: signal({
      list: [
        { therapyId: 't1', title: 'Terapia 1' },
        { therapyId: 't2', title: 'Terapia 2' }
      ]
    }),
    listTherapies: jasmine.createSpy('listTherapies')
  };

  type UserState = {
    currentUser: { userId: string; name: string } | null;
  };

  const mockUsersService = {
    usersState: signal<UserState>({
      currentUser: { userId: 'u1', name: 'Test User' }
    })
  };

  const mockDateTimeService = {
    formatDisplayDate: jasmine.createSpy('formatDisplayDate').and.callFake((date: string) => date),
    formatShortDate: jasmine.createSpy('formatShortDate').and.returnValue('05 Nov'),
    sortItemsByDate: jasmine.createSpy('sortItemsByDate').and.callFake(
      (appointments: Appointment[], dateSelector: (a: Appointment) => string, timeSelector: (a: Appointment) => string) =>
        [...appointments].sort((a, b) => {
          const dateA = dateSelector(a);
          const dateB = dateSelector(b);
          const timeA = timeSelector(a);
          const timeB = timeSelector(b);

          if (dateA !== dateB) return dateB.localeCompare(dateA);
          return timeA.localeCompare(timeB);
        })
    )
  };

  beforeEach(async () => {
    mockAppointmentsService.getByUser.calls.reset();
    mockAppointmentsService.requestCancellation.calls.reset();
    mockAppointmentsService.leaveGroupAppointment.calls.reset();
    mockTherapiesService.listTherapies.calls.reset();
    mockDateTimeService.sortItemsByDate.calls.reset();

    mockAppointmentsState.set({ userAppointments: mockAppointments, error: null });

    await TestBed.configureTestingModule({
      imports: [AppointmentsListComponent],
      providers: [
        { provide: AppointmentsStateService, useValue: mockAppointmentsService },
        { provide: TherapiesStateService, useValue: mockTherapiesService },
        { provide: UsersStateService, useValue: mockUsersService },
        { provide: DateTimeService, useValue: mockDateTimeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute sorted appointments correctly', () => {
    const sorted = component.sortedAppointments();
    expect(mockDateTimeService.sortItemsByDate).toHaveBeenCalled();
    expect(sorted[0].date).toBe('2025-11-06');
  });

  it('should go to next and previous page correctly', () => {
    const originalAppointments = mockAppointmentsState().userAppointments;

    mockAppointmentsState.set({
      userAppointments: new Array(component.pageSize + 5).fill(originalAppointments[0]),
      error: null
    });
    fixture.detectChanges();

    component.currentPage.set(1);
    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.previousPage();
    expect(component.currentPage()).toBe(1);

    component.previousPage();
    expect(component.currentPage()).toBe(1);

    mockAppointmentsState.set({ userAppointments: originalAppointments, error: null });
    fixture.detectChanges();
  });

  it('should open and close cancellation modal', () => {
    const cancellationData = { appointmentId: '1', therapyId: 't1' };
    component.openCancellationModal(cancellationData);

    expect(component.showCancellationModal()).toBeTrue();
    expect(component.selectedAppointment()).toEqual(mockAppointment1);

    component.closeCancellationModal();
    expect(component.showCancellationModal()).toBeFalse();
    expect(component.selectedAppointment()).toBeNull();
  });

  it('should do nothing if appointment is not found in openCancellationModal', () => {
    const nonExistentData = { appointmentId: '999', therapyId: 't1' };

    component.selectedAppointment.set(mockAppointment1);
    component.showCancellationModal.set(true);

    component.openCancellationModal(nonExistentData);

    expect(component.showCancellationModal()).toBeTrue();
    expect(component.selectedAppointment()).toEqual(mockAppointment1);
  });

  describe('handleCancellationConfirm', () => {
    const mockCancellationDetails = { notes: 'Motivo de prueba' };

    beforeEach(() => {
      mockUsersService.usersState.set({ currentUser: { userId: 'u1', name: 'Test User' } });
      component.openCancellationModal({ appointmentId: '1', therapyId: 't1' });
      mockAppointmentsService.requestCancellation.calls.reset();
      mockAppointmentsService.getByUser.calls.reset();
    });

    it('should not attempt cancellation if selectedAppointment is null', async () => {
      mockUsersService.usersState.set({ currentUser: null });
      component.selectedAppointment.set(null);

      await component.handleCancellationConfirm(component.selectedAppointment()!, mockCancellationDetails);

      expect(component.isCancelling()).toBeFalse();
      expect(mockAppointmentsService.requestCancellation).not.toHaveBeenCalled();
    });

    it('should handle successful cancellation request and reload appointments for current user', async () => {
      mockAppointmentsService.requestCancellation.and.returnValue(Promise.resolve({ message: 'ok' }));

      await component.handleCancellationConfirm(mockAppointment1, mockCancellationDetails);

      expect(mockAppointmentsService.getByUser).toHaveBeenCalledWith('u1');
      expect(component.showCancellationModal()).toBeFalse();
      expect(mockAppointmentsService.requestCancellation).toHaveBeenCalledWith(mockAppointment1, mockCancellationDetails.notes);
      expect(component.isCancelling()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
    });

    it('should handle cancellation request error and finalize', async () => {
      mockAppointmentsService.requestCancellation.and.returnValue(Promise.reject(new Error('API failed')));

      spyOn(console, 'error');

      await component.handleCancellationConfirm(mockAppointment1, mockCancellationDetails);

      expect(console.error).toHaveBeenCalledWith('Cancelling error', jasmine.any(Error));
      expect(mockAppointmentsService.getByUser).toHaveBeenCalled();
      expect(component.isCancelling()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
    });
  });

  describe('handleLeaveGroup', () => {
    const data = { appointmentId: '1', therapyId: 't1' };
    const nonExistentData = { appointmentId: '999', therapyId: 't1' };

    const leaveGroupSpy = mockAppointmentsService.leaveGroupAppointment as jasmine.Spy;

    beforeEach(() => {
        mockAppointmentsService.getByUser.calls.reset();
        leaveGroupSpy.calls.reset();
    });

    it('should not proceed if appointment is not found in userAppointments', async () => {
      await component.handleLeaveGroup(nonExistentData);

      expect(component.isCancelling()).toBeFalse();
      expect(leaveGroupSpy).not.toHaveBeenCalled();
      expect(mockAppointmentsService.getByUser).not.toHaveBeenCalled();
    });

    it('should call leaveGroupAppointment, finalize action on success, and reload appointments', async () => {
      leaveGroupSpy.and.returnValue(Promise.resolve({ message: 'Left' }));
      mockAppointmentsService.getByUser.and.returnValue(Promise.resolve(mockAppointments));

      const promise = component.handleLeaveGroup(data);

      expect(component.isCancelling()).toBeTrue();

      await promise;

      expect(leaveGroupSpy).toHaveBeenCalledWith(data.therapyId, data.appointmentId);
      expect(component.isCancelling()).toBeFalse();
      expect(mockAppointmentsService.getByUser).toHaveBeenCalledWith('u1');
    });

    it('should handle error from leaveGroupAppointment and finalize action', async () => {
      const error = new Error('Leaving failed');
      leaveGroupSpy.and.returnValue(Promise.reject(error));
      mockAppointmentsService.getByUser.and.returnValue(Promise.resolve(mockAppointments));

      spyOn(console, 'error');

      await component.handleLeaveGroup(data);

      expect(leaveGroupSpy).toHaveBeenCalledWith(data.therapyId, data.appointmentId);
      expect(console.error).toHaveBeenCalledWith('Leaving error:', error);

      expect(mockAppointmentsService.getByUser).toHaveBeenCalledWith('u1');
      expect(component.isCancelling()).toBeFalse();
    });
  });
});
