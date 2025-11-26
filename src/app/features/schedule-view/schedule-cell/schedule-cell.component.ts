import { Component, computed, inject, input, output, HostBinding } from '@angular/core';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';
import { Therapy } from '../../../models/therapy.model';
import { DateTimeService } from '../../../core/services/utils/date-time.service';

@Component({
  selector: 'pim-schedule-cell',
  standalone: true,
  imports: [],
  template: `
    <div class="cell"
        [class]="cellClass()"
        [attr.data-appointment-id]="mainAppointment()?.appointmentId"
        [attr.data-status]="cellClass().split(' ')[0]"
        (mouseenter)="handleMouseEnter()"
        (mouseleave)="handleMouseLeave()"
        (click)="handleClick()"
        (keyup.enter)="handleClick()"
        tabindex="0">

      @if (firstCellInAppointment()) {
        <div class="appointment-content" [innerHTML]="getAppointmentContent(mainAppointment()!)"></div>
      }

      @if (lastCellInAppointment() && mainAppointment()) {
        <div class="therapy-label">{{ therapyTitle() }}</div>

        @if (participantsCount(); as count) {
          <div class="participants-count">{{ count }}</div>
        }
      }
    </div>
  `,
  styles: `
    .cell {
      padding: 0.25rem;
      min-height: 40px;
      transition: all 0.12s ease;
      font-size: 0.8rem;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .cell.empty { background-color: white; }

    .cell.available, .cell.occupied, .cell.pending, .cell.completed, .cell.cancelled {
      border-right: 1px solid rgba(0,0,0,0.1);
      border-bottom: 1px solid #ddd;
    }

    .cell.available { background-color: #eafa74ff; color: #145523ff; }
    .cell.occupied  { background-color: #d4c8ffff; color: #2e3235ff; }
    .cell.pending   { background-color: #fbc3b4ff; color: #6c5203ff; }
    .cell.completed { background-color: #c6c6c6ff; color: #093841ff; }
    .cell.cancelled { background-color: #fbc3b4ff; color: #5d161dff; text-decoration: line-through; }

    .cell.first-cell { border-top-left-radius: 8px; border-top-right-radius: 8px; }
    .cell.last-cell  { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }

    :host.hover-group .cell {
      filter: brightness(1.02);
      transform: translateZ(0) scale(1.01);
      z-index: 2;
      cursor: pointer;
    }

    .appointment-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 90%;
    }

    .therapy-label {
      position: absolute;
      bottom: 8px;
      left: 5%;
      padding: 2px 4px;
      background-color: rgba(0, 0, 0, 0.3);
      color: white;
      border-radius: 4px;
    }

    .participants-count {
      position: absolute;
      right: 3%;
      top: 25%;
      padding: 4px 4px;
      background-color: rgba(0, 0, 0, 0.3);
      color: white;
      border-radius: 50px;
    }
  `
})
export class ScheduleCellComponent {
  protected readonly logicService = inject(DateTimeService);

  dateIso = input.required<string>();
  hour = input.required<string>();
  appointments = input.required<Appointment[]>();
  therapiesMap = input.required<Record<string, Therapy>>();
  hours = input.required<string[]>();
  hoveredId = input<string | null>(null);

  cellClick = output<{
    dateIso: string;
    time: string;
    status: string;
    appointment?: Appointment;
  }>();

  cellHover = output<{ appointmentId: string | null; hover: boolean }>();

  @HostBinding('class.hover-group') get isHostHovered() {
    return this.isHovered();
  }

  private readonly appointmentsInRange = computed(() =>
    this.appointments().filter(appointment => {
      if (appointment.date !== this.dateIso()) return false;
      const startIndex = this.hours().indexOf(appointment.startTime);
      const endIndex = this.hours().indexOf(appointment.endTime);
      const currentIndex = this.hours().indexOf(this.hour());
      return currentIndex >= startIndex && currentIndex < endIndex;
    })
  );

  mainAppointment = computed<Appointment | undefined>(() => {
    return  this.appointmentsInRange()[0];
  });

  firstCellInAppointment = computed(() => {
    const appointment = this.mainAppointment();
    if (!appointment) return false;
    const normalizedAppointmentStartTime = this.logicService.normalizeTime(appointment.startTime);
    return normalizedAppointmentStartTime === this.hour();
  });

  lastCellInAppointment = computed(() => {
    const appointment = this.mainAppointment();
    return !!appointment && appointment.endTime === this.logicService.getNextHour(this.hour());
  });

  isHovered = computed(() => {
    const appointment = this.mainAppointment();
    return (
      !!appointment &&
      appointment.appointmentId === this.hoveredId() &&
      appointment.status === AppointmentStatus.AVAILABLE
    );
  });

  cellClass = computed(() => {
    const appointment = this.mainAppointment();
    let baseClass = 'empty';

    if (appointment) {
      baseClass = this.getStatusClass(appointment.status);
      if(!this.firstCellInAppointment()) baseClass += ' continuation';
    }

    const modifiers: string[] = [];
    if (this.firstCellInAppointment()) modifiers.push('first-cell');
    if (this.lastCellInAppointment()) modifiers.push('last-cell');

    return [baseClass, ...modifiers].join(' ');
  });

  therapyTitle = computed<string>(() => {
    const appointment = this.mainAppointment();
    if (!appointment?.therapyId) return '';

    return this.therapiesMap()[appointment.therapyId]?.title || 'Terapia';
  });

  participantsCount = computed<string | undefined>(() => {
    const appointment = this.mainAppointment();

    if (appointment && (appointment.maxParticipants || 0) > 1) {
      const current = appointment.currentParticipants || 0;
      const max = appointment.maxParticipants;
      return `${current}/${max}`;
    }

    return undefined;
  })

  private getStatusClass(status: AppointmentStatus): string {
    const statusMap: Record<AppointmentStatus, string> = {
      [AppointmentStatus.AVAILABLE]: 'available',
      [AppointmentStatus.OCCUPIED]: 'occupied',
      [AppointmentStatus.PENDING]: 'pending',
      [AppointmentStatus.COMPLETED]: 'completed',
      [AppointmentStatus.CANCELLED]: 'cancelled',
      [AppointmentStatus.CANCELLATION_PENDING]: 'pending'
    };
    return statusMap[status] || 'empty';
  }

  protected getAppointmentContent(appointment: Appointment): string {
    const current = appointment.currentParticipants || 0;
    const max = appointment.maxParticipants || 1;
    const countText = max > 1 ? ` (${current}/${max})` : '';

    switch (appointment.status) {
      case 'AVAILABLE': return `<strong>Disponible</strong><br>${appointment.startTime}-${appointment.endTime}`;
      case 'OCCUPIED':  return `Ocupada${countText}`;
      case 'PENDING':   return `Pendiente${countText}`;
      case 'CANCELLATION_PENDING': return 'Pendiente';
      case 'COMPLETED': return 'Completada';
      case 'CANCELLED': return 'Cancelada';
      default: return '';
    }
  }

  handleClick() {
    const appointment = this.mainAppointment();
    const status = this.cellClass().split(' ')[0];
    this.cellClick.emit({ dateIso: this.dateIso(), time: this.hour(), appointment, status });
  }

  handleMouseEnter() {
    const id = this.mainAppointment()?.appointmentId;
    if (id) this.cellHover.emit({ appointmentId: id, hover: true });
  }

  handleMouseLeave() {
    const id = this.mainAppointment()?.appointmentId;
    if(id) this.cellHover.emit({ appointmentId: id, hover: false });
  }
}
