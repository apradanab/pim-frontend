import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentCardComponent } from './appointment-card.component';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { AppointmentStatus } from '../../../models/appointment.model';

describe('AppointmentCardComponent', () => {
  let component: AppointmentCardComponent;
  let fixture: ComponentFixture<AppointmentCardComponent>;
  let dateTimeServiceSpy: jasmine.SpyObj<DateTimeService>;

  const mockAppointment = {
    appointmentId: 'a1',
    therapyId: 't1',
    date: '2025-11-05',
    startTime: '10:00',
    endTime: '11:00',
    status: AppointmentStatus.OCCUPIED,
    notes: 'Nota'
  };

  const mockTherapyMap = {
    t1: { id: 't1', title: 'Terapia' }
  };

  beforeEach(async () => {
    dateTimeServiceSpy = jasmine.createSpyObj('DateTimeService', ['formatDisplayDate']);
    dateTimeServiceSpy.formatDisplayDate.and.returnValue('05/11/2025');

    await TestBed.configureTestingModule({
      imports: [AppointmentCardComponent],
      providers: [{ provide: DateTimeService, useValue: dateTimeServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('appointment', mockAppointment);
    fixture.componentRef.setInput('therapiesMap', mockTherapyMap);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state', () => {
    const initial = component.isExpanded();
    component.toggleExpanded();
    expect(component.isExpanded()).toBe(!initial);
  });

  it('should compute therapy title correctly', () => {
    expect(component.therapy().title).toBe('Terapia');
  });

  it('should translate status correctly', () => {
    expect(component.translatedStatus().text).toBe('Confirmada');
  });

  it('should emit cancelRequest when requestCancellation is called', () => {
    spyOn(component.cancelRequest, 'emit');
    component.requestCancellation();
    expect(component.cancelRequest.emit).toHaveBeenCalledWith({
      appointmentId: 'a1',
      therapyId: 't1'
    });
  });

  it('should translate all status values correctly', () => {
    const statusCases = [
      { status: 'OCCUPIED', expected: { text: 'Confirmada', class: 'occupied' } },
      { status: 'COMPLETED', expected: { text: 'Completada', class: 'completed' } },
      { status: 'PENDING', expected: { text: 'Pendiente', class: 'pending' } },
      { status: 'CANCELLED', expected: { text: 'Cancelada', class: 'cancelled' } },
      { status: 'UNKNOWN', expected: { text: 'Desconocido', class: 'unknown' } },
    ] as const;

    for (const { status, expected } of statusCases) {
      fixture.componentRef.setInput('appointment', { ...mockAppointment, status });
      fixture.detectChanges();
      const result = component.translatedStatus();
      expect(result).toEqual(expected);
    }
  });

  it('should compute maxHeight based on expansion state', () => {
    expect(component.maxHeight()).toBe('40px');

    component.toggleExpanded();
    expect(component.maxHeight()).toBe('400px');
  });

  it('should compute needsExpansion correctly', () => {
    fixture.componentRef.setInput('appointment', {
      ...mockAppointment,
      notes: 'Notas breves'
    });
    fixture.detectChanges();
    expect(component.needsExpansion()).toBeFalse();
  });

  it('should handle undefined notes in needsExpansion', () => {
    fixture.componentRef.setInput('appointment', {
      ...mockAppointment,
      notes: undefined as unknown as string
    });
    fixture.detectChanges();

    expect(component.needsExpansion()).toBeFalse();
  });
});
