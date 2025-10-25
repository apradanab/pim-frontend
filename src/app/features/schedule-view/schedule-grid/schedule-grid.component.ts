import { Component, computed, effect, inject, signal } from '@angular/core';
import { ScheduleCellComponent } from "../schedule-cell/schedule-cell.component";
import { Appointment } from '../../../models/appointment.model';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Therapy } from '../../../models/therapy.model';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';

@Component({
  selector: 'pim-schedule-grid',
  standalone: true,
  imports: [ScheduleCellComponent, FontAwesomeModule],
  template: `
    <div class="schedule">
      <div class="grid">
        <div class="header-row">
          <div class="time-header">
            <fa-icon [icon]="faClock" [size]="'2x'"></fa-icon>
          </div>
          @for (day of logicService.weekDays(); track day.isoDate) {
            <div class="day-header">
              <span class="day-name">{{ day.name }}</span><br>
              <span class="day-number">{{ day.date }}</span>
            </div>
          }
        </div>

        @for (hour of logicService.hours; track hour) {
          <div class="row">
            <div class="time">{{ hour }}</div>

            @for (day of logicService.weekDays(); track day.isoDate) {
              <pim-schedule-cell
                [dateIso]="day.isoDate"
                [hour]="hour"
                [appointments]="availableAppointments()"
                [hours]="logicService.hours"
                [therapiesMap]="therapiesMap()"
                [hoveredId]="hoveredAppointmentId()"
                (cellClick)="onCellClick($event)"
                (cellHover)="onCellHover($event)">
              </pim-schedule-cell>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .schedule {
      padding: 0 2rem;
      max-width: 1000px;
      margin: 0 auto;
      font-family: "Carlito", sans-serif;
    }

    .grid {
      border: 1px solid #ddd;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-row {
      display: grid;
      grid-template-columns: 80px repeat(5, 1fr);
      background: #f5f5f5;
    }

    .day-header {
      padding: 0.5rem;
      text-align: center;
      border-right: 1px solid #ddd;
      border-bottom: 3px solid #ddd;
      font-weight: bold;
      color: #676762ff;
    }

    .day-name {
      font-size: 0.9rem;
      font-weight: 100;
    }

    .day-number {
      font-size: 1.75rem;
      font-weight: bold;
    }

    .time-header {
      border-right: 3px solid #ddd;
      border-bottom: 3px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    fa-icon {
      color: #676762ff;
    }

    .row {
      display: grid;
      grid-template-columns: 80px repeat(5, 1fr);
    }

    .row:last-child {
      border-bottom: none;
    }

    .row:not(:last-child):nth-child(odd) {
      border-bottom: 1px solid #ddd
    }

    .row:not(:last-child):nth-child(even) {
      border-bottom: 1px dashed #ddd;
    }

    .time {
      background: #f9f9f9;
      border-right: 3px solid #ddd;
      text-align: center;
      font-size: 0.9rem;
      justify-content: end;
      color: #676762ff;
    }
  `
})
export class ScheduleGridComponent {
  private readonly appointmentService = inject(AppointmentsStateService);
  protected readonly logicService = inject(DateTimeService);
  protected readonly therapyService = inject(TherapiesStateService);

  faClock = faClock;
  hoveredAppointmentId = signal<string | null>(null);

  availableAppointments = computed(() => this.appointmentService.appointmentsState().availableAppointments);

  therapiesMap = computed<Record<string, Therapy>>(() => {
    const therapies: Therapy[] = this.therapyService.therapiesState().list;

    return therapies.reduce((acc, t) => {
      acc[t.therapyId] = t;
      return acc;
    }, {} as Record<string, Therapy>);
  })

  constructor() {
    effect(() => {
      const weekDays = this.logicService.weekDays();
      if (weekDays.length > 0) {
        this.appointmentService.loadAllAppointments();
        this.therapyService.listTherapies();
        console.log('Appointments loaded:', weekDays);
      }
    });
  }

  onCellHover(event: {appointmentId: string | null; hover: boolean}) {
    if (event.hover) {
      this.hoveredAppointmentId.set(event.appointmentId);
    } else if (this.hoveredAppointmentId() === event.appointmentId) {
      this.hoveredAppointmentId.set(null);
    }
  }

  onCellClick(event: { dateIso: string; time: string; appointment?: Appointment; status: string }) {
    const { appointment, status } = event;

    if (status === 'available' || status === 'empty') {
      if (appointment?.appointmentId && appointment.therapyId) {
        this.appointmentService.requestAppointment(appointment.therapyId, appointment.appointmentId);
      }
    } else {
      console.log('Cell not available for booking:', status);
    }
  }
}
