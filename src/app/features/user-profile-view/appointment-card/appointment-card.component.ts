import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-appointment-card',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="card" [class]="translatedStatus().class">

      <p>{{ dateTimeService.formatDisplayDate(appointment().date) }}</p>
      <div class="time-status-row">
      <p class="time">{{ appointment().startTime }} - {{ appointment().endTime }}</p>
      <p class="status-badge" [class]="translatedStatus().class">{{ translatedStatus().text }}</p>
      </div>

      <p class="title">{{ therapy().title }}</p>

      @if (appointment().notes; as notes) {

        <div class="notes-area" [class.notes-expanded]="isExpanded()" [style.maxHeight]="maxHeight()">
          <p class="notes-text"> {{ notes }}</p>


        </div>

        @if (needsExpansion()) {
          <button (click)="toggleExpanded()"
                  class="toggle-notes-button"
                  [class.toggle-expanded-button]="isExpanded()">
                  @if (isExpanded()) {
                    <fa-icon [icon]="faChevronDown"></fa-icon>
                  } @else {
                    <fa-icon [icon]="faChevronUp"></fa-icon>
                  }
          </button>
        }
      }

      @if (appointment().status === AppointmentStatus.OCCUPIED) {
        <button class="cancel-btn" (click)="requestCancellation()">
          <fa-icon [icon]="faBan"/>
        </button>
      }

    </div>
  `,
  styles: `
  .card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    min-height: 180px;
    width: 250px;
    border-radius: 20px;
    position: relative;
  }

  .card.occupied { background-color: #d4c8ffff; color: #2e3235ff; border: 4px solid #c4bbe9b8; box-shadow: 0 0 4px 0 rgba(166, 158, 198, 0.5) }
  .card.pending { background-color: #fbc3b4ff; color: #6c5203ff; border: 4px solid #e3beb4e8; box-shadow: 0 0 4px 0 rgba(200, 158, 148, 0.5) }
  .card.completed { background-color: #c6c6c6ff; color: #093841ff; border: 4px solid #bbbabae6; box-shadow: 0 0 4px 0 rgba(175, 174, 174, 0.5) }
  .card.cancelled { background-color: #fbc3b4ff; color: #5d161dff; border: 4px solid #c89e94ff; box-shadow: 0 0 4px 0 rgba(200, 158, 148, 0.5) }

  .date {
    font-size: 0.9rem;
    font-weight: 700;
  }

  .time-status-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 0.5rem;
  }

  .time {
    font-weight: 500;
  }

  .status-badge {
    padding: 2px 8px;
    border-radius: 12px;
    margin-bottom: 5px;
    font-size: 1.15rem;
    background-color: white;
    border: 1px solid #51454561;
  }

  .title {
    position: relative;
    top: 7px;
  }

  .notes-area {
    margin-top: 0.5rem;
    min-width: 215px;
    padding: 5px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #51454585;
    overflow: hidden;
  }

  .notes-area.notes-expanded {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100px;
    z-index: 2;
    padding: 10px;
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .notes-label {
    font-weight: 700;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .notes-text {
    font-size: 0.85rem;
  }

  .toggle-notes-button {
    margin-top: 4px;
    align-self: flex-start;
    font-size: 0.75rem;
    color: #717171ff;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    padding: 4px 7px 2px;
    position: absolute;
    bottom: 74px;
    right: 19px;
    z-index: 3;
  }

  .toggle-notes-button.toggle-expanded-button {
    position: absolute;
    bottom: 164px;
    right: 12px;
  }

  .cancel-btn {
    padding: 5.5px;
    border-radius: 15px 5px;
    color: #717171ff;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    cursor: pointer;
    width: fit-content;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .cancel-btn fa-icon {
    font-size: 1rem;
  }
  `
})
export class AppointmentCardComponent {
  public readonly dateTimeService = inject(DateTimeService);

  appointment = input.required<Appointment>();
  therapiesMap = input.required<Record<string, Therapy>>();

  cancelRequest = output<{ appointmentId: string; therapyId: string }>();

  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faBan = faBan;
  AppointmentStatus = AppointmentStatus;

  isExpanded = signal(false);
  private readonly collapsedHeight = 40;

  therapy = computed(() => this.therapiesMap()[this.appointment().therapyId]);

  maxHeight = computed(() =>
    this.isExpanded() ? '400px' : `${this.collapsedHeight}px`
  );

  needsExpansion = computed(() => (this.appointment().notes?.length ?? 0) > 150)

  translatedStatus = computed(() => {
    const status = this.appointment().status;

    switch (status) {
      case 'COMPLETED':
        return { text: 'Completada', class: 'completed' };
      case 'PENDING':
        return { text: 'Pendiente', class: 'pending' };
      case 'CANCELLED':
        return { text: 'Cancelada', class: 'cancelled' };
      case 'OCCUPIED':
        return { text: 'Confirmada', class: 'occupied' };
      default:
        return { text: 'Desconocido', class: 'unknown'};
    }
  });

  toggleExpanded() {
    this.isExpanded.update(value => !value);
  }

  requestCancellation() {
    this.cancelRequest.emit({
      appointmentId: this.appointment().appointmentId,
      therapyId: this.appointment().therapyId
    });
  }
}
