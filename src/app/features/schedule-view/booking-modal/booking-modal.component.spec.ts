import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingModalComponent } from './booking-modal.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';

class MockAppointmentsStateService {
  requestAppointment = jasmine.createSpy('requestAppointment');
}

class MockDateTimeService {
  formatDisplayDate = jasmine.createSpy('formatDisplayDate').and.returnValue('29 de octubre de 2025');
}

describe('BookingModalComponent', () => {
  let component: BookingModalComponent;
  let fixture: ComponentFixture<BookingModalComponent>;
  let mockAppointmentsService: MockAppointmentsStateService;
  let mockDateTimeService: MockDateTimeService;

  const mockAppointment: Appointment = {
    appointmentId: 'a1',
    therapyId: 't1',
    date: '2025-10-30',
    startTime: '10:00',
    endTime: '11:00',
    status: AppointmentStatus.AVAILABLE,
    maxParticipants: 1,
    currentParticipants: 0,
    createdAt: '',
  };
  const mockTherapy: Therapy = {
    therapyId: 't1',
    title: 'Terapia',
    description: 'Descripción',
    content: 'Contenido',
    maxParticipants: 1,
    createdAt: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingModalComponent],
      providers: [
        { provide: AppointmentsStateService, useClass: MockAppointmentsStateService },
        { provide: DateTimeService, useClass: MockDateTimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingModalComponent);
    component = fixture.componentInstance;

    mockAppointmentsService = TestBed.inject(AppointmentsStateService) as unknown as MockAppointmentsStateService;
    mockDateTimeService = TestBed.inject(DateTimeService) as unknown as MockDateTimeService;

    fixture.componentRef.setInput('appointment', mockAppointment);
    fixture.componentRef.setInput('therapy', mockTherapy);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockDateTimeService.formatDisplayDate).toHaveBeenCalledWith(mockAppointment.date);
  });

  it('should emit close when Cancel button is clicked', () => {
    spyOn(component.close, 'emit');

    const cancelButton = fixture.nativeElement.querySelector('.cancel-button');
    cancelButton.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should request appointment and emit bookingCompleted when Confirm button is clicked', () => {
    spyOn(component.bookingCompleted, 'emit');

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();

    expect(mockAppointmentsService.requestAppointment).toHaveBeenCalledWith(
      mockAppointment.therapyId,
      mockAppointment.appointmentId
    );

    expect(component.bookingCompleted.emit).toHaveBeenCalled();
  });
});
