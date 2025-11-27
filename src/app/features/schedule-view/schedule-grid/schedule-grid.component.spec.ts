import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleGridComponent } from '../schedule-grid/schedule-grid.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { signal } from '@angular/core';
import { AuthStateService } from '../../../core/services/states/auth.state.service';

const mockAppointments: Appointment[] = [
  {
    appointmentId: 'a1',
    therapyId: 't1',
    date: '2025-10-20',
    startTime: '10:00',
    endTime: '10:30',
    status: AppointmentStatus.AVAILABLE,
    currentParticipants: 0,
    maxParticipants: 1,
    createdAt: '2025-10-20T10:00:00.000Z',
  }
];

const mockTherapies: Therapy[] = [
  {
    therapyId: 't1',
    title: 'Test Therapy 1',
    description: 'Desc 1',
    content: 'Contenido 1',
    maxParticipants: 1,
    createdAt: '2025-10-20T10:00:00.000Z',
  }
];

class MockAppointmentsStateService {
  appointmentsState = signal({
    availableAppointments: mockAppointments,
  });
  listAppointments = jasmine.createSpy('listAppointments');
  requestAppointment = jasmine.createSpy('requestAppointment');
}

class MockScheduleLogicService {
  hours = ['9:00', '9:30', '10:00'];
  weekDays = signal([
    { name: 'Mon', date: 20, isoDate: '2025-10-20' },
  ]);
  getNextHour(hour: string) {
    const hours = ['9:00', '9:30', '10:00', '10:30'];
    const index = hours.indexOf(hour);
    return hours[index + 1] || hour;
  }
}

class MockTherapiesStateService {
  therapiesState = signal({
    list: mockTherapies,
  });
  listTherapies = jasmine.createSpy('listTherapies');
}

class MockAuthStateService {
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
}

describe('ScheduleGridComponent', () => {
  let component: ScheduleGridComponent;
  let fixture: ComponentFixture<ScheduleGridComponent>;
  let mockAppointmentsStateService: MockAppointmentsStateService;
  let mockTherapiesStateService: MockTherapiesStateService;
  let mockLogicService: MockScheduleLogicService;
  let mockAuthService: MockAuthStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleGridComponent],
      providers: [
        { provide: AppointmentsStateService, useClass: MockAppointmentsStateService },
        { provide: DateTimeService, useClass: MockScheduleLogicService },
        { provide: TherapiesStateService, useClass: MockTherapiesStateService },
        { provide: AuthStateService, useClass: MockAuthStateService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleGridComponent);
    component = fixture.componentInstance;

    mockAppointmentsStateService = TestBed.inject(AppointmentsStateService) as unknown as MockAppointmentsStateService;
    mockTherapiesStateService = TestBed.inject(TherapiesStateService) as unknown as MockTherapiesStateService;
    mockLogicService = TestBed.inject(DateTimeService) as unknown as MockScheduleLogicService;
    mockAuthService = TestBed.inject(AuthStateService) as unknown as MockAuthStateService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute therapiesMap correctly', () => {
    expect(component.therapiesMap()).toEqual({
      't1': mockTherapies[0]
    });
    expect(component.therapiesMap()['t1'].title).toBe('Test Therapy 1');
  });

  describe('onCellHover', () => {
    it('should set hoveredAppointmentId on hover', () => {
      component.onCellHover({ appointmentId: 'a1', hover: true });
      expect(component.hoveredAppointmentId()).toBe('a1');
    });

    it('should clear hovered appointmenId on leave', () => {
      component.hoveredAppointmentId.set('a1');
      component.onCellHover({ appointmentId: 'a1', hover: false });
      expect(component.hoveredAppointmentId()).toBeNull();
    });

  });

  describe('ngOnInit', () => {
    it('should call listAppointments and listTherapies if weekDays has elements', () => {
      component.ngOnInit();
      expect(mockAppointmentsStateService.listAppointments).toHaveBeenCalled();
      expect(mockTherapiesStateService.listTherapies).toHaveBeenCalled();
    });

    it('should NOT call listAppointments and listTherapies if weekDays is empty', () => {
      mockAppointmentsStateService.listAppointments.calls.reset();
      mockTherapiesStateService.listTherapies.calls.reset();

      mockLogicService.weekDays.set([]);

      component.ngOnInit();
      expect(mockAppointmentsStateService.listAppointments).not.toHaveBeenCalled();
      expect(mockTherapiesStateService.listTherapies).not.toHaveBeenCalled();
    });
  });

  describe('onCellClick', () => {
    const availableEvent = {
      dateIso: '2025-10-20',
      time: '10:00',
      status: 'available',
      appointment: mockAppointments[0]
    };

    it('should request appointment for available status', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      component.onCellClick(availableEvent);

      expect(mockAppointmentsStateService.requestAppointment).not.toHaveBeenCalled();
      expect(component.isModalOpen()).toBeTrue();
      expect(component.selectedAppointment()).toEqual(availableEvent.appointment);
      expect(component.selectedTherapy()!.therapyId).toBe(availableEvent.appointment.therapyId);
    });

    it('should not request appointment for other statuses', () => {
      const bookedEvent = {
        dateIso: '2025-10-20',
        time: '10:00',
        status: 'occupied',
        appointment: mockAppointments[0]
      };

      component.onCellClick(bookedEvent);

      expect(mockAppointmentsStateService.requestAppointment).not.toHaveBeenCalled();
      expect(component.isModalOpen()).toBeFalse();
    });

    it('should not open the modal if user is not logged in', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);
      component.onCellClick(availableEvent);

      expect(component.isModalOpen()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
      expect(component.selectedTherapy()).toBeUndefined();
    })
  });

  describe('onCloseModal', () => {
    it('should close the modal and reset selected signals', () => {
      component.isModalOpen.set(true);
      component.selectedAppointment.set(mockAppointments[0]);
      component.selectedTherapy.set(mockTherapies[0]);

      component.onCloseModal();

      expect(component.isModalOpen()).toBeFalse();
      expect(component.selectedAppointment()).toBeNull();
      expect(component.selectedTherapy()).toBeUndefined();
    })
  })
});
