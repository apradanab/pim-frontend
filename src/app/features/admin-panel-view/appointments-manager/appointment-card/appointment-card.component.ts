import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Appointment } from '../../../../models/appointment.model';
import { DateTimeService } from '../../../../core/services/utils/date-time.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan, faChevronDown, faChevronUp, faThumbsUp, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-appointment-card',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="card" [class]="statusDisplay().colorClass">
      <div class="header">
        <p class="title">{{ therapyTitle() }}</p>
        @if (isGroupAppointment()) {
          <p class="participants-counter"> {{ participantsCount() }} </p>
        }
      </div>
      <div class="time">
        <p class="date">{{ formattedDate }}</p>
        <p class="hour">{{ appt().startTime }} - {{ appt().endTime }}</p>
      </div>
      <div class="info" [class]="statusDisplay().colorClass">
        <p class="status" [style.backgroundColor]="statusDisplay().color">
          {{ statusDisplay().text }}</p>
        <p>{{ userName() || ' ' }} </p>
      </div>

      <div class="actions">
        @if (appt().status === 'PENDING') {
          <button class="approve-btn" (click)="approveAppt()" title="Aprobar">
            <fa-icon [icon]="faThumbsUp"></fa-icon>
          </button>
        } @else if (appt().status === 'CANCELLATION_PENDING') {
          <button class="approve-btn" (click)="approveCancelAppt()" title="Aprobar cancelación">
            <fa-icon [icon]="faBan"></fa-icon>
          </button>
        }
        <button class="delete-btn" (click)="requestDeletionAppt()" title="Borrar">
          <fa-icon [icon]="faTrash"></fa-icon>
        </button>

        @if (showToggleButton()) {
          <button (click)="toggleExpanded()"
                  class="toggle-notes-btn"
                  [class.toggle-expanded-button]="isExpanded()">
          @if (isExpanded()) {
            <fa-icon [icon]="faDown"></fa-icon>
          } @else {
            <fa-icon [icon]="faUp"></fa-icon>
          }
          </button>
        }

        @if (isExpanded()) {
          <div class="message-area expanded">
            @if (isGroupAppointment() && participants(); as namesList) {
              <div class="list-content">
                <ul class="participants-list">
                  @for (name of namesList; track $index) {
                    <li>{{ name }}</li>
                  }
                </ul>
              </div>
            } @else if (appt().notes) {
              <div class="note-content">
                <p>{{ appt().notes }}</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    height: 165px;
    width: 250px;
    border: 1px solid lightgray;
    border-radius: 20px;
    border-left: 2px solid lightgray;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
  }

  .card.occupied-color { border-left: 7px solid #b7a8ed; }
  .card.completed-color { border-left: 7px solid #d1d1d1ff; }
  .card.pending-color { border-left: 7px solid #fea087; }
  .card.available-color { border-left: 7px solid #e0f15e; }
  .card.cancelled-color { border-left: 7px solid #f15e5eff; }

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

  .participants-counter {
    position: absolute;
    top: 7px;
    border-width: 2px;
    border-style: solid;
    border-color: #d1d1d1ff;
    padding: 3px 5px;
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
    padding: 3px 5px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 3px 14px 0 0;
    position: relative;
    top: 35px;
  }

  .status {
    padding: 6px 10px;
    border-radius: 0 12px 12px 0;
    position: relative;
    left: -10px
  }

  .status.occupied-color { background-color: #b7a8ed; }
  .status.completed-color { background-color: #d1d1d1ff; }
  .status.pending-color { background-color: #fea087; }
  .status.available-color { background-color: #e0f15e; }
  .status.cancelled-color { background-color: #f15e5eff; }

  .actions {
    position: relative;
    top: 44px;
    z-index: 5;
  }

  .toggle-notes-btn {
    color: #717171ff;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    padding: 6px 12px;
    position: absolute;
    top: -1px;
    z-index: 8;
  }

  .toggle-notes-button.toggle-expanded-button {
    top: 10px;
    left: auto;
    z-index: 12;
  }

  .message-area {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 0px;
    width: 0px;
    border-radius: 20px;
    padding: 0.3rem 1rem;
    overflow: hidden;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    color: #717171ff;
    transition: all 0.3s ease-in-out;
    z-index: 1;
  }

  .message-area.expanded {
    top: -137px;
    left: -10px;
    width: 242px;
    height: 163px;
    border-radius: 15px;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    z-index: 7;
    background-color: #f5f5f5;
  }

  .note-content {
    font-size: 0.9rem;
    text-align: left;
    margin-top: 5px;
    color: #343a40;
  }

  .approve-btn {
    padding: 6px 12px;
    color: #717171ff;
    border-radius: 12px 12px 0 0;
    position: absolute;
    cursor: pointer;
    top: -1px;
    left: 44px;
    border: 1px solid #ddd;
  }

  .delete-btn {
    padding: 8px;
    border-radius: 15px 3px;
    color: #717171ff;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    cursor: pointer;
    position: absolute;
    top: -4px;
    right: -11px;
  }
  `
})
export class AppointmentCardComponent {
  private readonly dateTimeService = inject(DateTimeService);

  appt = input.required<Appointment>();
  therapyTitle = input.required<string>();
  participants = input<string[] | undefined>(undefined);
  userName = input('');

  requestApproval = output<{ therapyId: string; appointmentId: string }>();
  requestCancelApproval = output<{ therapyId: string; appointmentId: string }>()
  requestDeletion = output<{ therapyId: string; appointmentId: string }>();

  private readonly statusMap = {
    OCCUPIED: { text: 'Ocupada', colorClass: 'occupied-color', color: '#b7a8ed' },
    PENDING: { text: 'Pendiente', colorClass: 'pending-color', color: '#fea087' },
    CANCELLATION_PENDING: { text: 'Pendiente', colorClass: 'pending-color', color: '#fea087' },
    AVAILABLE: { text: 'Libre', colorClass: 'available-color', color: '#e0f15e' },
    COMPLETED: { text: 'Completada', colorClass: 'completed-color', color: '#d1d1d1ff' },
    CANCELLED: { text: 'Cancelada', colorClass: 'cancelled-color', color: '#f15e5eff' },
  }

  faThumbsUp = faThumbsUp;
  faBan = faBan;
  faDown = faChevronDown;
  faUp = faChevronUp;
  faTrash = faTrash;

  isExpanded = signal(false);

  isGroupAppointment = computed(() => (this.appt().maxParticipants ?? 1) > 1);

  participantsCount = computed<string>(() => {
    const current = this.appt().currentParticipants ?? 0;
    const max = this.appt().maxParticipants ?? 1;
    return `${current}/${max}`;
  })

  showToggleButton = computed(() => {
    if (this.isGroupAppointment()) {
      return (this.participants()?.length ?? 0) > 0;
    } else {
      return !!this.appt().notes
    }
  })

  statusDisplay = computed(() => {
    const status = this.appt().status;
    const info = this.statusMap[status as keyof typeof this.statusMap];

    if(info) return info;

    return {
      text: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
      colorClass: 'default-color',
      color: '#ddd'
    };
  });

  get formattedDate(): string {
    return this.dateTimeService.formatShortDate(this.appt().date);
  }

  toggleExpanded() {
    this.isExpanded.update(value => !value);
  }

  approveAppt() {
    const payload = {
      therapyId: this.appt().therapyId,
      appointmentId: this.appt().appointmentId
    };
    console.log('card emit: solicitando aprobación para:', payload);
    this.requestApproval.emit(payload);
  }

  approveCancelAppt() {
    const payload = {
      therapyId: this.appt().therapyId,
      appointmentId: this.appt().appointmentId
    }
    this.requestCancelApproval.emit(payload);
  }

  requestDeletionAppt() {
    const payload = {
      therapyId: this.appt().therapyId,
      appointmentId: this.appt().appointmentId
    };
    this.requestDeletion.emit(payload);
  }
}
