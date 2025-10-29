import { Component, inject, input, output } from '@angular/core';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';

@Component({
  selector: 'pim-booking-modal',
  standalone: true,
  imports: [],
  template: `
  <div class="modal-overlay" (click)="onClose()" (keyup.enter)="onClose()" tabindex="0">
    <div class="modal-content" (click)="$event.stopPropagation()" (keyup.enter)="$event.stopPropagation()" tabindex="0">
      <h2>Confirmar cita</h2>
      @if (appointment() && therapy()) {
        <div class="details">
          <p> {{ therapy()!.title }} </p>
          <p> {{ dateTimeService.formatDisplayDate(appointment().date)}} </p>
          <p> {{appointment().startTime}} - {{appointment().endTime}} </p>
          <p> Confirma que deseas solicitar esta cita. </p>
        </div>
      }
      <div class="actions">
        <button class="confirm-button" (click)="onConfirm()">Confirmar reserva</button>
        <button class="cancel-button" (click)="onClose()">Cancelar</button>
      </div>
    </div>
  </div>
  `,
  styles: `
.modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
        max-width: 450px;
        width: 100%;
        text-align: center;
    }

    .details {
        margin: 20px 0;
        text-align: left;
        line-height: 1.5;
        font-size: 1.1rem;
    }

    .details p:first-child { font-weight: bold; margin-bottom: 10px; }
    .details p:last-child { margin-top: 15px; font-style: italic; }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
    }

    .actions button {
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .confirm-button {
        background-color: #eafa74ff;
        border: 1px solid #c3d060ff;
    }

    .confirm-button:hover {
        background-color: #d1e264ff;
    }

    .cancel-button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;
    }

    .cancel-button:hover {
        background-color: #e0e0e0;
    }
  `
})
export class BookingModalComponent {
  readonly dateTimeService = inject(DateTimeService);
  private readonly aptsService = inject(AppointmentsStateService);

  appointment = input.required<Appointment>();
  therapy = input.required<Therapy | undefined>();

  modalClosed = output<void>();
  bookingCompleted = output<void>();

  onConfirm() {
    this.aptsService.requestAppointment(
      this.appointment().therapyId,
      this.appointment().appointmentId
    );

    this.bookingCompleted.emit();
  }

  onClose() {
    this.modalClosed.emit();
  }
}
