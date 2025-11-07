import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsListComponent } from './appointments-list.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { signal } from '@angular/core';
import { AppointmentStatus } from '../../../models/appointment.model';

describe('AppointmentsListComponent', () => {
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let component: AppointmentsListComponent;

  const mockAppointmentsService = {
    appointmentsState: signal({
      userAppointments: [
        { appointmentId: '1', therapyId: 't1', date: '2025-11-05', startTime: '10:00', status: AppointmentStatus.OCCUPIED },
        { appointmentId: '2', therapyId: 't2', date: '2025-11-06', startTime: '09:00', status: AppointmentStatus.PENDING },
      ],
      error: null
    }),
    loadUserAppointments: jasmine.createSpy('loadUserAppointments'),
    requestCancellation: jasmine.createSpy('requestCancellation')
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

  const mockUsersService = {
    usersState: signal({
      currentUser: { userId: 'u1', name: 'Test User' }
    })
  };

  const mockDateTimeService = {
    formatDisplayDate: jasmine.createSpy('formatDisplayDate').and.callFake((date: string) => date),
    parseDateString: jasmine.createSpy('parseDateString').and.callFake((date: string) => {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }),
    timeToMinutes: jasmine.createSpy('timeToMinutes').and.callFake((time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    })
  };

  beforeEach(async () => {
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
    expect(sorted[0].date).toBe('2025-11-06');
  });

  it('should go to next and previous page correctly', () => {
    component.nextPage();
    expect(component.currentPage()).toBe(1);

    const originalState = mockAppointmentsService.appointmentsState();

    mockAppointmentsService.appointmentsState.set({
      userAppointments: new Array(15).fill(originalState.userAppointments[0]),
      error: null
    });
    fixture.detectChanges();

    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.previousPage();
    expect(component.currentPage()).toBe(1);

    mockAppointmentsService.appointmentsState.set(originalState);
    fixture.detectChanges();
  });

  it('should open and close cancellation modal', () => {
    component.openCancellationModal({ appointmentId: '1', therapyId: 't1' });
    expect(component.showCancellationModal()).toBeTrue();
    expect(component.selectedAppointment()).toEqual({ appointmentId: '1', therapyId: 't1' });

    component.closeCancellationModal();
    expect(component.showCancellationModal()).toBeFalse();
    expect(component.selectedAppointment()).toBeNull();
  });

  it('should call requestCancellation when confirming', () => {
    component.openCancellationModal({ appointmentId: '1', therapyId: 't1' });
    component.handleCancellationConfirm({ notes: 'Motivo de prueba' });

    expect(mockAppointmentsService.requestCancellation)
      .toHaveBeenCalledWith('t1', '1', 'Motivo de prueba');
  });
});
