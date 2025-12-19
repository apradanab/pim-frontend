import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCellComponent } from './schedule-cell.component';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';

const testDate = '2025-10-20';
const testHour = '09:30';
const lastCellHour = '10:00';
const emptyHour = '09:00';

const mockHours = ['09:00', '09:30', '10:00', '10:30', '11:00'];
const mockTherapiesMap: Record<string, Therapy> = {
  't1': { therapyId: 't1', title: 'Terapia 1', description: '', content: '', maxParticipants: 5, createdAt: '' },
  't2': { therapyId: 't2', title: 'Terapia 2', description: '', content: '', maxParticipants: 1, createdAt: '' },
  'sin titulo': { therapyId: '', title: '', description: '', content: '', maxParticipants: 1, createdAt: '' },
};

const baseAppointment: Appointment = {
  appointmentId: 'a1',
  therapyId: 't1',
  date: testDate,
  startTime: '09:30',
  endTime: '10:30',
  status: AppointmentStatus.AVAILABLE,
  currentParticipants: 1,
  maxParticipants: 5,
  createdAt: '2025-10-20T09:30:00.000Z',
};

class MockScheduleLogicService {
  getNextHour(hour: string): string {
    const index = mockHours.indexOf(hour);
    return mockHours[index + 1] || hour;
  }
  normalizeTime(time: string): string {
    return time
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBlocked(dateIso: string, hour: string): boolean {
    return false
  }
}

class TestScheduleCellComponent extends ScheduleCellComponent {
  public getAppointmentContentPublic(appointment: Appointment): string {
    return this.getAppointmentContent(appointment);
  }
}

describe('ScheduleCellComponent', () => {
  let component: TestScheduleCellComponent;
  let fixture: ComponentFixture<TestScheduleCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestScheduleCellComponent],
      providers: [
        { provide: DateTimeService, useClass: MockScheduleLogicService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestScheduleCellComponent);
    component = fixture.componentInstance;
  });

  const setInputs = (dateIso: string, hour: string, appointments: Appointment[] = [], hoveredId: string | null = null) => {
    fixture.componentRef.setInput('dateIso', dateIso);
    fixture.componentRef.setInput('hour', hour);
    fixture.componentRef.setInput('appointments', appointments);
    fixture.componentRef.setInput('therapiesMap', mockTherapiesMap);
    fixture.componentRef.setInput('hours', mockHours);
    fixture.componentRef.setInput('hoveredId', hoveredId);
    fixture.detectChanges();
  };

  const createAppointment = (modifications: Partial<Appointment> = {}): Appointment => ({
    ...baseAppointment,
    ...modifications
  });

  const setupCell = (hour: string, appointments: Appointment[] = [], hoveredId: string | null = null) => {
    setInputs(testDate, hour, appointments, hoveredId);
  };
  const setupEmptyCell = () => setupCell(emptyHour, []);
  const setupFirstCell = () => setupCell(testHour, [createAppointment()]);
  const setupLastCell = () => setupCell(lastCellHour, [createAppointment()]);
  const setupAvailableCell = () => setupCell(testHour, [createAppointment()]);

  it('should create', () => {
    setupEmptyCell();
    expect(component).toBeTruthy();
  });

  describe('Appointments Logic', () => {
    it('should filter appointments by date', () => {
      setupCell(testHour, [createAppointment()]);
      expect(component.mainAppointment()?.appointmentId).toBe('a1');

      const appointmentsOtherDate = [createAppointment({ date: '2025-10-22' })];
      setupCell(testHour, appointmentsOtherDate);
      expect(component.mainAppointment()).toBeUndefined();
      expect(component.cellClass()).toBe('empty');
    });
  });

  describe('Therapy Title Logic', () => {
    it('should return empty string when appointment has no therapyId', () => {
      setupCell(testHour, [createAppointment({ therapyId: undefined as unknown as string })]);
      expect(component.therapyTitle()).toBe('');
    });

    it('should return "Terapia" when therapy has no title', () => {
      setupCell(testHour, [createAppointment({ therapyId: 'sin titulo' })]);
      expect(component.therapyTitle()).toBe('Terapia');
    });
  });

  describe('Participants Count Logic', () => {
    it('should format participants count correctly', () => {
      setupCell(lastCellHour, [createAppointment({
        currentParticipants: 0,
        maxParticipants: 5,
        startTime: '10:00',
        endTime: '10:30'
      })]);
      expect(component.participantsCount()).toBe('0/5');
    });
  });

  describe('Empty Cell Logic', () => {
    beforeEach(setupEmptyCell);

    it('should emit cellClick event with status "empty"', () => {
      const clickSpy = spyOn(component.cellClick, 'emit');
      component.handleClick();
      expect(clickSpy).toHaveBeenCalledWith({
        dateIso: testDate,
        time: emptyHour,
        appointment: undefined,
        status: 'empty'
      });
    });
  });

  describe('Appointment Cell Logic', () => {
    describe('First Cell', () => {
      beforeEach(setupFirstCell);

      it('should display appointment content', () => {
        const contentDiv = fixture.nativeElement.querySelector('.appointment-content');
        expect(contentDiv).not.toBeNull();
      });
    });

    describe('Last Cell', () => {
      beforeEach(setupLastCell);

      it('should handle appointment with maxParticipants as 0', () => {
        setupCell(lastCellHour, [createAppointment({
          appointmentId: 'appointmentNoCapacity',
          maxParticipants: 0,
          currentParticipants: 0,
        })]);
        expect(component.participantsCount()).toBeUndefined();
      });
    });
  });

  describe('Rendering and Status Tests', () => {
    const testStatus = (status: AppointmentStatus, expectedClass: string, expectedContent: string) => {
      setupCell(testHour, [createAppointment({ status })]);
      expect(component.cellClass().startsWith(expectedClass)).toBeTrue();
      expect(component.getAppointmentContentPublic(createAppointment({ status }))).toBe(expectedContent);
    };

    it('should apply correct class and content for PENDING status', () => {
      setupFirstCell();
      testStatus(AppointmentStatus.PENDING, 'pending', 'Pendiente (1/5)');
    });

    it('should apply correct class and content for CANCELLATION_PENDING status', () => {
      setupFirstCell();
      const appointment = createAppointment({ status: AppointmentStatus.CANCELLATION_PENDING });
      setupCell(testHour, [appointment]);
      expect(component.cellClass().startsWith('pending')).toBeTrue();
      expect(component.getAppointmentContentPublic(appointment)).toBe('Pendiente');
    })

    it('should apply correct class and content for CANCELLED status', () => {
      testStatus(AppointmentStatus.CANCELLED, 'cancelled', 'Cancelada');
    });

    it('should apply correct class and content for COMPLETED status', () => {
      testStatus(AppointmentStatus.COMPLETED, 'completed', 'Completada');
    });

    it('should return empty string for unknown status', () => {
      setupCell(testHour, [createAppointment({ status: 'UNEXPECTED' as AppointmentStatus })]);
      expect(component.getAppointmentContentPublic(createAppointment({ status: 'UNEXPECTED' as AppointmentStatus }))).toBe('');
    });

    it('should return empty countText when maxParticipants is 1', () => {
      const appointment = createAppointment({
        maxParticipants: 1,
        currentParticipants: 1,
        status: AppointmentStatus.OCCUPIED,
      });
      setupCell(testHour, [appointment]);
      expect(component.getAppointmentContentPublic(appointment)).toBe('Ocupada');
    });

    it('should return empty countText when maxParticipants is undefined', () => {
      const appointment = createAppointment({
        maxParticipants: undefined,
        currentParticipants: 1,
        status: AppointmentStatus.OCCUPIED,
      });
      setupCell(testHour, [appointment]);
      expect(component.getAppointmentContentPublic(appointment)).toBe('Ocupada');
    });
  });

  describe('Hover Logic', () => {
    beforeEach(setupAvailableCell);

    it('should emit cellHover on mouse enter', () => {
      const hoverSpy = spyOn(component.cellHover, 'emit');
      component.handleMouseEnter();
      expect(hoverSpy).toHaveBeenCalledWith({ appointmentId: 'a1', hover: true });
    });

    it('should emit cellHover on mouse leave', () => {
      const hoverSpy = spyOn(component.cellHover, 'emit');
      component.handleMouseLeave();
      expect(hoverSpy).toHaveBeenCalledWith({ appointmentId: 'a1', hover: false });
    });

    it('should NOT be hovered if status is not AVAILABLE', () => {
      setupCell(testHour, [createAppointment({
        appointmentId: 'occupied',
        status: AppointmentStatus.OCCUPIED
      })], 'occupied');
      expect(component.isHovered()).toBeFalse();
      expect(component.isHostHovered).toBeFalse();
    });
  });
});
