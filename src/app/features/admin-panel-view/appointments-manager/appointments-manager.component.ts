import { Component, inject, OnInit, signal } from '@angular/core';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";
import { AppointmentKeys } from '../../../models/appointment.model';
import { AppointmentsListComponent } from "./appointments-list/appointments-list.component";
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-appointments-manager',
  standalone: true,
  imports: [ConfirmationModalComponent, AppointmentsListComponent, FontAwesomeModule],
  template: `
  <div class="management">
    @if (apptsState().isLoading) {
      <div class="loading-overlay">
        <fa-icon [icon]="faSpinner" class="fas fa-spinner fa-spin"/>
      </div>
    } @else if (apptsState().error) {
      <div>Error en la carga de terapias: {{ apptsState().error }}</div>
    } @else {
      <div class="list">

        <pim-appointments-list
          [isCreateForm]="isCreateForm()"
          (toggleCreateForm)="isCreateForm.set($event)"
          (apptCreated)="handleCreateSuccess()"
          (requestApproval)="handleApprove($event)"
          (requestCancelApproval)="handleApproveCancel($event)"
          (requestDeletion)="handleDelete($event)"
          (noteSaved)="saveEditedNote($event)"
        />

      </div>
    }

  </div>
  <div class="footer"></div>
    @if (appointmentToDelete(); as info) {
      <pim-confirmation-modal
        [id]="info.appointmentId"
        (confirm)="confirmDelete()"
        (modalClosed)="cancelDelete()"
      />
    }
  `,
  styles: `
  .management {
    min-height: 500px;
    position: relative;
    border-top: 4px solid #ebece9;
    background-color: white;
    animation: fadeIn 0.5s ease;
    box-shadow:
        8px 0 15px -10px rgba(0,0,0,0.2),
        -8px 0 15px -10px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loading-overlay fa-icon {
    color: #1bbdbf;
    font-size: 45px;
    position: relative;
    top: -35px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    gap: 1rem;
    padding: 2rem 4rem;
    background-color: white;
    z-index: 1;
    animation: fadeIn 0.5s ease;
  }

  .card {
    display: flex;
  }

  .footer {
    height: 30px;
    background-color: #ebece9;
    border-radius: 0 0 12px 12px;
    box-shadow: 8px 0 15px -10px rgba(0, 0, 0, 0.2),
                -8px 0 15px -10px rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  `
})
export class AppointmentsManagerComponent implements OnInit {
  private readonly apptsService = inject(AppointmentsStateService);
  private readonly therapiesService = inject(TherapiesStateService);
  private readonly usersService = inject(UsersStateService);

  apptsState = this.apptsService.appointmentsState;
  appointmentToDelete = signal<AppointmentKeys | null>(null);
  isCreateForm = signal(false);
  faSpinner = faSpinner;

  ngOnInit(): void {
    this.apptsService.listAppointments();
    this.therapiesService.listTherapies();
    this.usersService.listUsers();
  }

  handleCreateSuccess() {
    this.isCreateForm.set(false);
  }

  handleDelete(event: AppointmentKeys) {
    this.appointmentToDelete.set(event);
  }

  handleApprove(event: AppointmentKeys) {
    this.apptsService.approveAppt(event.therapyId, event.appointmentId);
  }

  handleApproveCancel(event: AppointmentKeys) {
    this.apptsService.approveCancellation(event.therapyId, event.appointmentId);
  }

  cancelDelete() {
    this.appointmentToDelete.set(null);
  }

  confirmDelete() {
  const info = this.appointmentToDelete();
    if (info) {
      this.apptsService.deleteAppointment(info.therapyId, info.appointmentId);
      this.appointmentToDelete.set(null);
    }
  }

  saveEditedNote(editedAppt: { notes: string, therapyId: string, appointmentId: string }) {
    this.apptsService.updateAppointmentNote(
      editedAppt.therapyId,
      editedAppt.appointmentId,
      editedAppt.notes
    ).catch(error => {
      console.error('Error saving note:', error);
    })
  }
}
