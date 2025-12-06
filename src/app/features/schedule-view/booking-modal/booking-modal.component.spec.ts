import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BookingModalComponent } from './booking-modal.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

class MockAppointmentsStateService {
  requestAppointment = jasmine.createSpy('requestAppointment').and.returnValue(Promise.resolve(null));
  joinGroupAppointment = jasmine.createSpy('joinGroupAppointment').and.returnValue(Promise.resolve(null));
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
        provideHttpClient(),
        provideHttpClientTesting(),
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

  it('should evaluate isGroupAppt to false when maxParticipants is 0', () => {
    const mockZeroParticipantAppt: Appointment = { ...mockAppointment, maxParticipants: 0 };
    fixture.componentRef.setInput('appointment', mockZeroParticipantAppt);
    fixture.detectChanges();
    expect(component.isGroupAppt()).toBeFalse();
  })

  it('should emit close when close button is clicked', () => {
    spyOn(component.modalClosed, 'emit');

    const closeButton = fixture.nativeElement.querySelector('.close-button');
    closeButton.click();

    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should request appointment and emit bookingCompleted when Confirm button is clicked', fakeAsync(() => {
    spyOn(component.bookingCompleted, 'emit');
    spyOn(component.modalClosed, 'emit');

    component.note.set('');
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();

    fixture.detectChanges();

    expect(mockAppointmentsService.requestAppointment).toHaveBeenCalledWith(
      mockAppointment.therapyId,
      mockAppointment.appointmentId,
      ''
    );

    tick();
    tick(3500);

    expect(component.bookingCompleted.emit).toHaveBeenCalled();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  }));

  it('should request appointemnt with notes when note is entered', fakeAsync(() => {
    spyOn(component.bookingCompleted, 'emit');
    spyOn(component.modalClosed, 'emit');
    const testNote = 'nota';

    component.note.set(testNote);
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();

    fixture.detectChanges();

    expect(mockAppointmentsService.requestAppointment).toHaveBeenCalledWith(
      mockAppointment.therapyId,
      mockAppointment.appointmentId,
      testNote
    );

    tick();
    tick(3500);

    expect(component.bookingCompleted.emit).toHaveBeenCalled();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  }));

  it('should handle requestAppointment error and call onClose (single appointment)', fakeAsync(() => {
    spyOn(component, 'onClose');
    spyOn(console, 'error');
    spyOn(component.bookingCompleted, 'emit');
    spyOn(component.modalClosed, 'emit');

    const error = new Error('Test API Error');
    mockAppointmentsService.requestAppointment.and.returnValue(Promise.reject(error));

    fixture.componentRef.setInput('appointment', mockAppointment);
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();

    tick();

    expect(console.error).toHaveBeenCalledWith('Error request appointment', error);
    expect(component.onClose).toHaveBeenCalled();
    expect(component.bookingCompleted.emit).not.toHaveBeenCalled();
  }));

  it('should handle joinGroupAppointment error and call onClose (group appointment)', fakeAsync(() => {
    const mockGroupAppointment: Appointment = { ...mockAppointment, maxParticipants: 5 };
    fixture.componentRef.setInput('appointment', mockGroupAppointment);
    fixture.detectChanges();

    spyOn(component, 'onClose');
    spyOn(console, 'error');
    spyOn(component.bookingCompleted, 'emit');
    spyOn(component.modalClosed, 'emit');

    const error = new Error('Test Group API Error');
    mockAppointmentsService.joinGroupAppointment.and.returnValue(Promise.reject(error));
    mockAppointmentsService.requestAppointment.calls.reset();

    const confirmButton = fixture.nativeElement.querySelector('.confirm-button');
    confirmButton.click();

    tick();

    expect(mockAppointmentsService.joinGroupAppointment).toHaveBeenCalled();
    expect(mockAppointmentsService.requestAppointment).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error join group', error);
    expect(component.onClose).toHaveBeenCalled();
    expect(component.bookingCompleted.emit).not.toHaveBeenCalled();
  }));
});
