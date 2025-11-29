import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ApptCreateFormComponent } from './appt-create-form.component';
import { Therapy } from '../../../../models/therapy.model';
import { UserOption } from '../../../../models/appointment.model';
import { AppointmentState } from '../../../../models/state.model';
import { signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsStateService } from '../../../../core/services/states/appointments.state.service';

const mockTherapies: Therapy[] = [
  { therapyId: 't1', title: 'Terapia Individual', description: 'description', content: 'content', maxParticipants: 1, createdAt: '' },
];

const mockUsers: UserOption[] = [
  { email: 'user@test.com', name: 'Test User' },
];
const mockNewAppt = { therapyId: 't1', appointmentId: 'a1', date: '2025-12-01', startTime: '09:00', endTime: '10:00' };

const validFormData = {
  therapyId: mockTherapies[0].therapyId,
  date: '2025-12-01',
  startTime: '09:00',
  endTime: '10:00',
  maxParticipants: 1,
  userEmail: mockUsers[0].email,
};

const dataWithNullMaxParticipants = {
  therapyId: mockTherapies[0].therapyId,
  date: '2025-12-01',
  startTime: '09:00',
  endTime: '10:00',
  maxParticipants: null,
  userEmail: '',
};

class MockAppointmentsStateService {
  private state = signal<AppointmentState>({
    userAppointments: [],
    availableAppointments: [],
    current: null,
    isLoading: false,
    error: null,
  });

  appointmentsState = this.state.asReadonly();

  createAppt = jasmine.createSpy('createAppt').and.returnValue(Promise.resolve(mockNewAppt));
  assignAppt = jasmine.createSpy('assignAppt').and.returnValue(Promise.resolve({ message: 'Assigned' }));

  setState(newState: Partial<AppointmentState>) {
      this.state.set({...this.state(), ...newState});
  }
}

describe('ApptCreateFormComponent', () => {
  let component: ApptCreateFormComponent;
  let fixture: ComponentFixture<ApptCreateFormComponent>;
  let apptsService: MockAppointmentsStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApptCreateFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AppointmentsStateService, useClass: MockAppointmentsStateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApptCreateFormComponent);
    component = fixture.componentInstance;
    apptsService = TestBed.inject(AppointmentsStateService) as unknown as MockAppointmentsStateService;

    fixture.componentRef.setInput('availableTherapies', mockTherapies);
    fixture.componentRef.setInput('availableUsers', mockUsers);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should mark form as touched and return if invalid', fakeAsync(() => {
      spyOn(component.apptForm, 'markAllAsTouched');
      component.submit();
      tick();

      expect(component.apptForm.markAllAsTouched).toHaveBeenCalled();
      expect(apptsService.createAppt).not.toHaveBeenCalled();
    }));

    it('should log error to console if createAppt fails', fakeAsync(() => {
      const mockError = new Error('API Error Test');
      (apptsService.createAppt as jasmine.Spy).and.returnValue(Promise.reject(mockError));

      spyOn(console, 'error');
      spyOn(component.apptCreated, 'emit');
      spyOn(component.apptForm, 'reset');

      component.apptForm.setValue(validFormData);

      component.submit();
      tick();

      expect(console.error).toHaveBeenCalledWith('Error creating appt:', mockError);
      expect(component.apptCreated.emit).not.toHaveBeenCalled();
      expect(component.apptForm.reset).not.toHaveBeenCalled();
    }));

    it('should submit and set maxParticipants to undefined if it is null in the form', fakeAsync(() => {
      spyOn(component.apptCreated, 'emit');
      spyOn(component.apptForm, 'reset');

      component.apptForm.setValue(dataWithNullMaxParticipants);
      component.submit();

      tick();

      const expectedPayload = {
        ...dataWithNullMaxParticipants,
        maxParticipants: undefined,
      };

      expect(apptsService.createAppt).toHaveBeenCalledWith(expectedPayload);

      expect(component.apptCreated.emit).toHaveBeenCalled();
      expect(component.apptForm.reset).toHaveBeenCalled();
      expect(apptsService.assignAppt).not.toHaveBeenCalled();
    }));

    it('should submit, create, and assign appointment (with userEmail)', fakeAsync(() => {
      spyOn(component.apptCreated, 'emit');
      spyOn(component.apptForm, 'reset');

      component.apptForm.setValue(validFormData);
      component.submit();

      tick();
      tick();

      expect(apptsService.createAppt).toHaveBeenCalled();

      expect(apptsService.assignAppt).toHaveBeenCalledWith(
        mockNewAppt.therapyId,
        mockNewAppt.appointmentId,
        validFormData.userEmail
      );

      expect(component.apptCreated.emit).toHaveBeenCalled();
      expect(component.apptForm.reset).toHaveBeenCalled();
    }));

    it('should submit, create, but not assign appointment (without userEmail)', fakeAsync(() => {
      spyOn(component.apptCreated, 'emit');
      spyOn(component.apptForm, 'reset');

      const dataWithoutUser = { ...validFormData, userEmail: '' };
      component.apptForm.setValue(dataWithoutUser);

      component.submit();
      tick();

      expect(apptsService.createAppt).toHaveBeenCalled();

      expect(apptsService.assignAppt).not.toHaveBeenCalled();

      expect(component.apptCreated.emit).toHaveBeenCalled();
      expect(component.apptForm.reset).toHaveBeenCalled();
    }));
  });
});
