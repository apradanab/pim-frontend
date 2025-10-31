import { Component, inject, input, output, signal } from '@angular/core';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-booking-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule],
  template: `
  <div class="modal-overlay" (click)="onClose()" (keyup.enter)="onClose()" tabindex="0">
    <div class="modal-content" (click)="$event.stopPropagation()" (keyup.enter)="$event.stopPropagation()" tabindex="0">

      @if (!isSuccess()) {
        <div class="modal-header">
          <h2>Confirmar cita</h2>
        </div>

        <button class="close-button"
              (click)="onClose()"
              (keyup.enter)="onClose()"
              aria-label="Cerrar modal"
              tabindex="0">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>

        @if (appointment() && therapy()) {
          <div class="details">
            <p class="therapy-name"> {{ therapy()!.title }} </p>
            <div class="time-details">
              <p> {{ dateTimeService.formatDisplayDate(appointment().date)}} </p>
              <p> {{appointment().startTime}} - {{appointment().endTime}} </p>
            </div>
            <div class="note-field">
              <label for="user-note"></label>
              <textarea id="user-note"
                        [(ngModel)]="note"
                        rows="3"
                        placeholder="Deja un mensaje">
              </textarea>
            </div>
          </div>
        }
          <button class="confirm-button" (click)="onConfirm()">Confirmar reserva</button>
      } @else {
        <div class="modal-header-2">
          <button class="close-button"
                (click)="onClose()"
                (keyup.enter)="onClose()"
                aria-label="Cerrar modal"
                tabindex="0">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
        <div class="success-content">
          <div class="success-icon">
            <fa-icon [icon]="faCircleCheck"></fa-icon>
          </div>
          <h3>¡Cita reservada con éxito!</h3>
          <p>Te enviaremos un correo de confirmación pronto</p>
        </div>
      }
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
    z-index: 2;
    padding: 20px;
  }

  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 100%;
    text-align: center;
    position: relative;
    font-family: 'Carlito', sans-serif;
  }

  .modal-header {
    margin-left: -1.85rem;
    margin-right: -1.85rem;
    margin-top: -1.8rem;
    padding-top: 2rem;
    border-radius: 1rem 1rem 0 0;
    background-color: #ebece9;
    border-bottom: 1px solid #b3b3b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .modal-header h2 {
    font-family: 'Caprasimo', cursive;
    font-weight: 500;
    color: #2f2929;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #2f2929;
    z-index: 10;
  }

  .details {
    margin: 20px 0;
    text-align: left;
    line-height: 1.5;
    font-size: 1.1rem;
    font-family: 'Carlito', sans-serif;
  }

  .time-details {
    margin-top: 5px;
    margin-bottom: -17px;
    color: #878484;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
  }

  .therapy-name {
    font-size: 1.2rem;
  }

  .note-field {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .note-field label {
    font-weight: bold;
  }

  .note-field textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
  }

  .confirm-button {
    background-color: #f3552d;
    width: 100%;
    padding: 1rem;
    color: white;
    border: none;
    border-radius: 2rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .confirm-button:hover {
    background-color: #e04a24;
  }

  .modal-header-2 {
    margin-left: -1.85rem;
    margin-right: -1.85rem;
    margin-top: -2rem;
    padding: 1.6rem;
    border-radius: 1rem 1rem 0 0;
    background-color: #ebece9;
    border-bottom: 1px solid #b3b3b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    margin-top: 1rem;
  }

  .success-icon {
    color: #e0f15e;
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .success-content h3 {
    font-family: 'Caprasimo', cursive;
    color: #2f2929;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .success-content p {
    font-family: 'Carlito', sans-serif;
    color: #878484;
    font-size: 1rem;
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

  note = signal<string>('');
  isSuccess = signal<boolean>(false);

  faCircleCheck = faCircleCheck;
  faTimes = faTimes;

  onConfirm() {
    this.aptsService.requestAppointment(
      this.appointment().therapyId,
      this.appointment().appointmentId,
      this.note().trim() || undefined
    );

    this.isSuccess.set(true);

    setTimeout(() => {
      this.bookingCompleted.emit();
      this.modalClosed.emit();
    }, 5000);
  }

  onClose() {
    this.modalClosed.emit();
  }
}
