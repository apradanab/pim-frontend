import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppointmentsListComponent } from './appointments-list.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { signal } from '@angular/core';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { delay, of, throwError } from 'rxjs';

describe('AppointmentsListComponent', () => {
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let component: AppointmentsListComponent;

  const mockAppointments = [
    { appointmentId: '1', therapyId: 't1', date: '2025-11-05', startTime: '10:00', status: AppointmentStatus.OCCUPIED },
    { appointmentId: '2', therapyId: 't2', date: '2025-11-06', startTime: '09:00', status: AppointmentStatus.PENDING },
  ] as Appointment[];

  const mockAppointmentsState = signal({
    userAppointments: mockAppointments,
    error: null
  });

  const mockAppointmentsService = {
    appointmentsState: mockAppointmentsState,
    getByUser: jasmine.createSpy('getByUser'),
    requestCancellation: jasmine.createSpy('requestCancellation').and.returnValue(of(true))
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
    mockTherapiesService.listTherapies.calls.reset();
    mockDateTimeService.sortItemsByDate.calls.reset();
    mockDateTimeService.formatDisplayDate.calls.reset();

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
    expect(component.selectedAppointment()).toEqual(cancellationData);

    component.closeCancellationModal();
    expect(component.showCancellationModal()).toBeFalse();
    expect(component.selectedAppointment()).toBeNull();
  });

  describe('handleCancellationConfirm', () => {
    const mockCancellationDetails = { notes: 'Motivo de prueba' };

    beforeEach(() => {
      mockUsersService.usersState.set({ currentUser: { userId: 'u1', name: 'Test User' } });
      component.openCancellationModal({ appointmentId: '1', therapyId: 't1' });
      mockAppointmentsService.requestCancellation.calls.reset();
      mockAppointmentsService.getByUser.calls.reset();
    });

    it('should not attempt cancellation if selectedAppointment is null', () => {
      mockUsersService.usersState.set({ currentUser: null });
      component.selectedAppointment.set(null);
      component.handleCancellationConfirm(mockCancellationDetails);

      expect(component.isCancelling()).toBeFalse();
      expect(mockAppointmentsService.requestCancellation).not.toHaveBeenCalled();
    });

    it('should handle successful cancellation request and reload appointments for current user', fakeAsync(() => {
      mockAppointmentsService.requestCancellation.and.returnValue(of(true).pipe(delay(0)));

      component.handleCancellationConfirm(mockCancellationDetails);

      tick(1);

      expect(mockAppointmentsService.getByUser).toHaveBeenCalledWith('u1');

      expect(component.showCancellationModal()).toBeFalse();
      expect(mockAppointmentsService.requestCancellation).toHaveBeenCalledWith('t1', '1', mockCancellationDetails.notes);
      expect(component.isCancelling()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
    }));

    it('should handle cancellation request error and finalize', fakeAsync(() => {
      mockAppointmentsService.requestCancellation.and.returnValue(throwError(() => new Error('API failed')));

      spyOn(console, 'error');

      component.handleCancellationConfirm(mockCancellationDetails);

      tick(0);

      expect(console.error).toHaveBeenCalledWith('Error requesting cancellation:', jasmine.any(Error));
      expect(mockAppointmentsService.getByUser).not.toHaveBeenCalled();
      expect(component.isCancelling()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
    }));
  });
});
