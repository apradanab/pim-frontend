import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentCardComponent } from './appointment-card.component';
import { Appointment, AppointmentStatus } from '../../../../models/appointment.model';
import { DateTimeService } from '../../../../core/services/utils/date-time.service';

class MockDateTimeService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public formatShortDate(dateStr: string): string {
    return 'vie, 28/11/25';
  }
}

const mockAppt: Appointment = {
  therapyId: 't1',
  appointmentId: 'a1',
  date: '2025-11-28T10:00:00Z',
  startTime: '10:00',
  endTime: '11:00',
  currentParticipants: 1,
  maxParticipants: 2,
  status: AppointmentStatus.PENDING,
  notes: 'Nota',
  createdAt: ''
}

const mockTherapyTitle = 'Terapia';
const mockParticipantsNames = ['Ana', 'Pedro'];

describe('AppointmentCardComponent', () => {
  let component: AppointmentCardComponent;
  let fixture: ComponentFixture<AppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardComponent],
      providers: [
        { provide: DateTimeService, useClass: MockDateTimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('appt', mockAppt);
    fixture.componentRef.setInput('therapyTitle', mockTherapyTitle);
    fixture.componentRef.setInput('participants', mockParticipantsNames);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('participantsCount', () => {
    it('should calculate count correctly for defined values', () => {
      expect(component.participantsCount()).toBe('1/2');
    });

    it('should default current and max values if undefined/null', () => {
      const defAppt = { ...mockAppt, currentParticipants: undefined, maxParticipants: undefined};
      fixture.componentRef.setInput('appt', defAppt);
      fixture.detectChanges();

      expect(component.participantsCount()).toBe('0/1');
    });
  });

  describe('showToggleButton', () => {
    it('should show button for single appointment with notes', () => {
      const singleApptWithNotes = { ...mockAppt, maxParticipants: 1, notes: 'Note'};
      fixture.componentRef.setInput('appt', singleApptWithNotes);
      fixture.componentRef.setInput('participants', undefined);
      fixture.detectChanges();

      expect(component.showToggleButton()).toBeTrue();
    });

    it('should hide button for single appointment without notes', () => {
      const singleApptWithoutNotes = { ...mockAppt, maxParticipants: 1, notes: undefined };
      fixture.componentRef.setInput('appt', singleApptWithoutNotes);
      fixture.detectChanges();

      expect(component.showToggleButton()).toBeFalse();
    });

    it('should hide button for group appointment when participants are empty', () => {
      const groupAppt = { ...mockAppt, maxParticipants: 2, notes: undefined };
      fixture.componentRef.setInput('appt', groupAppt);
      fixture.componentRef.setInput('participants', []);
      fixture.detectChanges();

      expect(component.showToggleButton()).toBeFalse();
    });

    it('should hide button for group appointment when participants input is undefined', () => {
      fixture.componentRef.setInput('participants', undefined);
      fixture.detectChanges();

      expect(component.showToggleButton()).toBeFalse();
    })
  });

  describe('statusDisplay', () => {
    it('should return known status - PENDING', () => {
      const result = component.statusDisplay();
      expect(result.text).toBe('Pendiente');
    });

    it('should return default structure for an unknown status', () => {
      const unknownAppt = { ...mockAppt, status: 'UNKNOWN' as AppointmentStatus };

      fixture.componentRef.setInput('appt', unknownAppt);
      fixture.detectChanges();

      const result = component.statusDisplay();

      expect(result.text).toBe('Unknown');
      expect(result.colorClass).toBe('default-color');
      expect(result.color).toBe('#ddd');
    })
  });

  it('should use DateTimeService to format date correctly', () => {
    expect(component.formattedDate).toBe('vie, 28/11/25');
  });

  it('should toggle expanded state', () => {
    expect(component.isExpanded()).toBeFalse();
    component.toggleExpanded();
    expect(component.isExpanded()).toBeTrue();
  });

  it('should emit noteSaved event and set isEditingNote to false', () => {
    const newNote = 'Nota';
    const expectedPayload = {
      notes: newNote,
      therapyId: mockAppt.therapyId,
      appointmentId: mockAppt.appointmentId
    };

    spyOn(component.noteSaved, 'emit');
    component.isEditingNote.set(true);

    component.handleNoteSave(newNote);
    expect(component.noteSaved.emit).toHaveBeenCalledWith(expectedPayload);
    expect(component.isEditingNote()).toBeFalse();
  })

  describe('should emit requestApproval on approveAppt', () => {
    const expectedPayload = {
      therapyId: mockAppt.therapyId,
      appointmentId: mockAppt.appointmentId,
    };

    it('should emit requestApproval on approveAppt', () => {
      spyOn(component.requestApproval, 'emit');
      component.approveAppt();
      expect(component.requestApproval.emit).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit requestCancelApproval on approveCancelAppt', () => {
      spyOn(component.requestCancelApproval, 'emit');
      component.approveCancelAppt();
      expect(component.requestCancelApproval.emit).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit requestDeletion on requestDeletionAppt', () => {
      spyOn(component.requestDeletion, 'emit');
      component.requestDeletionAppt();
      expect(component.requestDeletion.emit).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
