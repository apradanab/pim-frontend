import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppointmentsStateService } from '../../../../core/services/states/appointments.state.service';
import { faCalendarPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AppointmentInput, UserOption } from '../../../../models/appointment.model';
import { Therapy } from '../../../../models/therapy.model';

@Component({
  selector: 'pim-appt-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
  <form [formGroup]="apptForm"
        (submit)="submit()"
        class="create-form"
  >
  @if (apptsState().error) {
    <div class="error-message">Error: {{ apptsState().error }}</div>
  }
    <div class="form-grid">

      <div class="form-group grid-col-">
        <label for="therapyId"></label>
        <select id="therapyId" formControlName="therapyId" class="input-field">
          <option value="" disabled>Terapia</option>
          @for (therapy of availableTherapies(); track therapy.therapyId) {
            <option [value]="therapy.therapyId">{{ therapy.title }}</option>
          }
        </select>
        @if (apptForm.get('therapyId')?.invalid && apptForm.get('therapyId')?.touched) {
          <div class="error-text">La terapia es obligatoria</div>
        }
      </div>
      <div class="form-group grid-col-2">
        <label for="userEmail">
          <select id="userEmail" formControlName="userEmail" class="input-field">
            <option value="">Paciente</option>
            @for (user of availableUsers(); track user.email) {
              <option [value]="user.email">{{ user.name }}</option>
            }
          </select>
        </label>

          <div class="form-group">
            <label for="maxParticipants">
              <input id="maxParticipants" type="number" formControlName="maxParticipants" class="participants-input-field" min="1" placeholder="Participantes" />
            </label>
          </div>
      </div>

      <div class="form-group">
        <label for="date"></label>
        <input id="date" type="date" formControlName="date" class="input-field" />
      </div>

      <div class="duration-row">
        <div class="form-group">
          <label for="startTime">Hora Inicio</label>
          <input id="startTime" type="time" formControlName="startTime" class="input-field" />
        </div>

        <div class="form-group">
          <label for="endTime">Hora Fin</label>
          <input id="endTime" type="time" formControlName="endTime" class="input-field" />
        </div>
      </div>
    </div>

    <div class="actions">
      <button
        type="submit"
        class="save-btn"
        [disabled]="apptForm.invalid || apptsState().isLoading"
      >
        <fa-icon [icon]="apptsState().isLoading ? faCheck : faCalendar"/>
        {{ apptsState().isLoading ? 'Creando...' : 'Crear Cita' }}
      </button>

      <button
        type="button"
        class="cancel-btn"
        (click)="cancelClick.emit()"
        [disabled]="apptsState().isLoading"
      >
        <fa-icon [icon]="faTimes"/>
      </button>
    </div>
  </form>
  `,
  styles: `
  .create-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    width: 250px;
    height: 165px;
    border: 1px solid lightgray;
    border-radius: 20px;
    position: relative;
  }

  .grid-col-2 {
    display: flex;
  }

  .duration-row {
    display: flex;
  }

  .participants-input-field {
    width: 60px;
  }

  .actions {
    display: flex;
    justify-content: space-around;
  }

  .save-btn {
    padding: 8px 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #e8e8e8ff;
    gap: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 30px;
    cursor: pointer;
    color: #717171ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .cancel-btn {
    padding: 6.5px;
    border-radius: 15px 5px;
    color: #717171ff;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .cancel-btn fa-icon {
    font-size: 1.2rem;
  }
  `
})
export class ApptCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apptsService = inject(AppointmentsStateService);

  availableTherapies = input.required<Therapy[]>();
  availableUsers = input.required<UserOption[]>();

  apptCreated = output<void>();
  cancelClick = output<void>();

  apptsState = this.apptsService.appointmentsState;

  faCalendar = faCalendarPlus;
  faTimes = faTimes;
  faCheck = faCheck;

  apptForm!: FormGroup;

  ngOnInit(): void {
    this.apptForm = this.fb.group({
      therapyId: ['', Validators.required],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      maxParticipants: [null, [Validators.min(1)]],
      userEmail: ['']
    });
  }

  async submit() {
    if (this.apptForm.invalid) {
      return this.apptForm.markAllAsTouched();
    }

    const formData: AppointmentInput = this.apptForm.value;

    formData.maxParticipants = formData.maxParticipants ? Number(formData.maxParticipants) : undefined;

    try {
      const newAppt = await this.apptsService.createAppt(formData);

      if (formData.userEmail) {
        await this.apptsService.assignAppt(
          newAppt.therapyId,
          newAppt.appointmentId,
          formData.userEmail
        );
      }

      this.apptCreated.emit();
      this.apptForm.reset();
    } catch (err) {
      console.error('Error creating appt:', err)
    }
  }
}
