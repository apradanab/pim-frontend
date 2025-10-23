import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleGridComponent } from '../schedule-grid/schedule-grid.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { ScheduleLogicService } from '../../../core/services/logic/schedule.logic.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { signal } from '@angular/core';

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
  loadAllAppointments = jasmine.createSpy('loadAllAppointments');
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

describe('ScheduleGridComponent', () => {
  let component: ScheduleGridComponent;
  let fixture: ComponentFixture<ScheduleGridComponent>;
  let mockAppointmentsStateService: MockAppointmentsStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleGridComponent],
      providers: [
        { provide: AppointmentsStateService, useClass: MockAppointmentsStateService },
        { provide: ScheduleLogicService, useClass: MockScheduleLogicService },
        { provide: TherapiesStateService, useClass: MockTherapiesStateService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleGridComponent);
    component = fixture.componentInstance;

    mockAppointmentsStateService = TestBed.inject(AppointmentsStateService) as unknown as MockAppointmentsStateService;

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

  describe('onCellClick', () => {
    it('should request appointment for available status', () => {
      const availableEvent = {
        dateIso: '2025-10-20',
        time: '10:00',
        status: 'available',
        appointment: mockAppointments[0]
      };

      component.onCellClick(availableEvent);

      expect(mockAppointmentsStateService.requestAppointment).toHaveBeenCalledWith(
        't1',
        'a1'
      );
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
    });
  });
});
