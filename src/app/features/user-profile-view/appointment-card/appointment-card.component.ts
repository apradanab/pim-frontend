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
    <div class="card" [class]="translatedStatus().class + '-color'">

      <div class="header">
        <p class="title">{{ therapy().title }}</p>
      </div>
      <div class="time">
        <p>{{ dateTimeService.formatShortDate(appointment().date) }}</p>
        <p class="hour">{{ appointment().startTime }} - {{ appointment().endTime }}</p>
      </div>

      <div class="info">
      <p class="status-badge" [style.backgroundColor]="translatedStatus().color">{{ translatedStatus().text }}</p>
      </div>

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

      @if (canBeModified()) {
        @if (isGroupAppt()) {
          <button class="cancel-btn" (click)="leaveGroup()">
            <fa-icon [icon]="faBan"/>
          </button>
        } @else {
          <button class="cancel-btn" (click)="requestCancellation()">
            <fa-icon [icon]="faBan"/>
          </button>
        }
      }

    </div>
  `,
  styles: `
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    min-height: 180px;
    width: 250px;
    border-radius: 20px;
    border: 1px solid lightgray;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .card.occupied-color { border-left: 7px solid #b7a8ed; background-color: #f7f5ffff; }
  .card.pending-color { border-left: 7px solid #fea087; background-color: #fffaf7ff; }
  .card.completed-color { border-left: 7px solid #d1d1d1ff; background-color: #f7f7f7ff; }
  .card.cancelled-color { border-left: 7px solid #f15e5eff; background-color: #fffafa; }

  .header {
    position: relative;
  }

  .title {
    display: inline-block;
    justify-content: flex-end;
    padding: 8px 10px 8px 30px;
    border-radius: 20px 0 0 20px;
    background-color: #e8e8e8ff;
    margin-top: 4px;
    position: absolute;
    right: -10px;
  }

  .time {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #d1d1d1ff;
    margin: 7px -10px 12px -10px;
    position: relative;
    top: 45px;
  }

  .date {
    position: relative;
    top: 5px;
  }

  .hour {
    border-width: 2px 2px 1px;
    border-style: solid;
    border-color: #d1d1d1ff;
    background-color: white;
    padding: 3px 5px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 3px 14px 0 0;
    position: relative;
    top: 30px;
  }

  .status-badge {
    padding: 6px 10px;
    border-radius: 0 12px 12px 0;
    position: relative;
    left: -10px
  }

  .notes-area {
    margin-top: 2.2rem;
    width: 193px;
    padding: 3px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid lightgray;
    overflow: hidden;
  }

  .notes-area.notes-expanded {
    position: absolute;
    top: 0;
    left: 0;
    width: 242px;
    height: 180px;
    margin-top: 0;
    border-radius: 16px;
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
    bottom: 50px;
    right: 50px;
  }

  .toggle-notes-button.toggle-expanded-button {
    bottom: 178px;
    right: 20px;
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
  leaveRequest = output<{ appointmentId: string; therapyId: string }>();

  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faBan = faBan;
  AppointmentStatus = AppointmentStatus;

  isExpanded = signal(false);
  private readonly collapsedHeight = 40;

  isGroupAppt = computed<boolean>(() => { return (this.appointment().maxParticipants || 0) > 1 });
  canBeModified = computed<boolean>(() =>
    this.appointment().status === this.AppointmentStatus.OCCUPIED ||
    this.appointment().status === this.AppointmentStatus.AVAILABLE
  );

  therapy = computed(() => this.therapiesMap()[this.appointment().therapyId]);

  maxHeight = computed(() =>
    this.isExpanded() ? '400px' : `${this.collapsedHeight}px`
  );

  needsExpansion = computed(() => !!this.appointment().notes)

  translatedStatus = computed(() => {
    const status = this.appointment().status;

    switch (status) {
      case 'COMPLETED':
        return { text: 'Completada', class: 'completed', color: '#d1d1d1ff' };
      case 'PENDING':
        return { text: 'Pendiente', class: 'pending', color: '#fea087' };
      case 'CANCELLATION_PENDING':
        return { text: 'Pendiente', class: 'pending', color: '#fea087' };
      case 'CANCELLED':
        return { text: 'Cancelada', class: 'cancelled', color: '#f15e5eff' };
      case 'OCCUPIED':
        return { text: 'Confirmada', class: 'occupied', color: '#b7a8ed' };
      case 'AVAILABLE':
        return { text: 'Confirmada', class: 'occupied', color: '#b7a8ed' }
      default:
        return { text: 'Desconocido', class: 'unknown', color: '#ddd' };
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

  leaveGroup() {
    this.leaveRequest.emit({
      appointmentId: this.appointment().appointmentId,
      therapyId: this.appointment().therapyId
    });
  }
}
