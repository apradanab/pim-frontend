import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AppointmentsManagerComponent } from './appointments-manager.component';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { AppointmentState } from '../../../models/state.model';
import { AppointmentKeys } from '../../../models/appointment.model';

const mockAppointmentState: AppointmentState = {
    availableAppointments: [],
    userAppointments: [],
    current: null,
    isLoading: false,
    error: null
};

class MockAppointmentsStateService {
    appointmentsState = signal(mockAppointmentState);
    listAppointments = jasmine.createSpy('listAppointments');
    approveAppt = jasmine.createSpy('approveAppt');
    approveCancellation = jasmine.createSpy('approveCancellation');
    deleteAppointment = jasmine.createSpy('deleteAppointment');
}

class MockTherapiesStateService {
    therapiesState = signal({ list: [], current: null, error: null });
    listTherapies = jasmine.createSpy('listTherapies');
}

class MockUsersStateService {
    usersState = signal({ list: [], currentUser: null, isLoading: false, error: null });
    listUsers = jasmine.createSpy('listUsers');
}

describe('AppointmentsManagerComponent', () => {
  let component: AppointmentsManagerComponent;
  let fixture: ComponentFixture<AppointmentsManagerComponent>;
  let apptsService: MockAppointmentsStateService;
  let therapiesService: MockTherapiesStateService;
  let usersService: MockUsersStateService;

  const mockKeys: AppointmentKeys = { therapyId: 'T1', appointmentId: 'A1' };

  beforeEach(async () => {
      await TestBed.configureTestingModule({
          imports: [AppointmentsManagerComponent],
          providers: [
              { provide: AppointmentsStateService, useClass: MockAppointmentsStateService },
              { provide: TherapiesStateService, useClass: MockTherapiesStateService },
              { provide: UsersStateService, useClass: MockUsersStateService },
          ]
      }).compileComponents();

      fixture = TestBed.createComponent(AppointmentsManagerComponent);
      component = fixture.componentInstance;

      apptsService = TestBed.inject(AppointmentsStateService) as unknown as MockAppointmentsStateService;
      therapiesService = TestBed.inject(TherapiesStateService) as unknown as MockTherapiesStateService;
      usersService = TestBed.inject(UsersStateService) as unknown as MockUsersStateService;

      fixture.detectChanges();
  });

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('should call list methods on ngOnInit', () => {
      expect(apptsService.listAppointments).toHaveBeenCalled();
      expect(therapiesService.listTherapies).toHaveBeenCalled();
      expect(usersService.listUsers).toHaveBeenCalled();
  });

  it('should set isCreateForm to false on handleCreateSuccess', () => {
      component.isCreateForm.set(true);
      component.handleCreateSuccess();
      expect(component.isCreateForm()).toBeFalse();
  });

  it('should set appointmentToDelete on handleDelete', () => {
      component.handleDelete(mockKeys);
      expect(component.appointmentToDelete()).toEqual(mockKeys);
  });

  it('should reset appointmentToDelete on cancelDelete', () => {
      component.appointmentToDelete.set(mockKeys);
      component.cancelDelete();
      expect(component.appointmentToDelete()).toBeNull();
  });

  it('should call approveAppt on handleApprove', () => {
      component.handleApprove(mockKeys);
      expect(apptsService.approveAppt).toHaveBeenCalledWith(mockKeys.therapyId, mockKeys.appointmentId);
  });

  it('should call approveCancellation on handleApproveCancel', () => {
      component.handleApproveCancel(mockKeys);
      expect(apptsService.approveCancellation).toHaveBeenCalledWith(mockKeys.therapyId, mockKeys.appointmentId);
  });

  it('should call deleteAppointment and clear the modal on confirmDelete when info is present', () => {
      component.appointmentToDelete.set(mockKeys);
      component.confirmDelete();

      expect(apptsService.deleteAppointment).toHaveBeenCalledWith(mockKeys.therapyId, mockKeys.appointmentId);
      expect(component.appointmentToDelete()).toBeNull();
  });
});
