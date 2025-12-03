import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppointmentsStateService } from '../../../core/services/states/appointments.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { AppointmentCardComponent } from "../appointment-card/appointment-card.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CancellationModalComponent } from "../cancellation-modal/cancellation-modal.component";
import { CancellationDetails } from '../../../models/appointment.model';
import { AppointmentsPaginatorComponent } from "../appointments-paginator/appointments-paginator.component";
import { finalize } from 'rxjs';

@Component({
  selector: 'pim-appointments-list',
  standalone: true,
  imports: [AppointmentCardComponent, FontAwesomeModule, CancellationModalComponent, AppointmentsPaginatorComponent],
  template: `
  <div class="appointments-section">
    <div class="tab-header">
      <div class="icon-circle">
        <pim-appointments-paginator
        [currentPage]="currentPage()"
        [totalItems]="sortedAppointments().length"
        [pageSize]="pageSize"
        (nextPage)="nextPage()"
        (previousPage)="previousPage()"
        />
      </div>
    </div>

    @if (appointmentsState().error) {
      <p class="error-message">Error al cargar las citas: {{ appointmentsState().error }}</p>
    } @else if (sortedAppointments().length > 0) {

      <div class="appointment-box">
        @for (appointment of paginatedAppointments(); track appointment.appointmentId) {
          <div>
            <pim-appointment-card
              [appointment]="appointment"
              [therapiesMap]="therapiesMap()"
              (cancelRequest)="openCancellationModal($event)"
            />
          </div>
        }
      </div>

    } @else {
      <p>No tienes citas programadas.</p>
    }

    @if (showCancellationModal()) {
      <pim-cancellation-modal
        (confirm)="handleCancellationConfirm($event)"
        (modalClose)="closeCancellationModal()"
      />
    }

    <div class="footer"></div>
  </div>
  `,
  styles: `
  .appointments-section {
    margin: 0 8.4vw;
    font-family: 'Carlito', sans-serif;
    margin-bottom: 2rem;
  }

  .tab-header {
    display: flex;
    justify-content: flex-start;
    gap: 0.8rem;
    position: relative;
    right: -30px;
    padding: 0.8rem 1.8rem;
    border: 1px solid #dddddd4d;
    border-radius: 1.5rem 1.5rem 0 0;
    background-color: #ebece9;
    width: fit-content;
    box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.2);
  }

  .appointment-box {
    background-color: white;
    box-shadow:
      8px 0 15px -10px rgba(0, 0, 0, 0.2),
      -8px 0 15px -10px rgba(0, 0, 0, 0.2);
    border-top: 4px solid #ebece9;
    gap: 1.5rem;
    padding: 2rem 3.45rem;
    display: flex;
    flex-wrap: wrap;
    min-height: 450px;
  }

  .footer {
    height: 30px;
    background-color: #ebece9;
    border-radius: 0 0 12px 12px;
    box-shadow:
      8px 0 15px -10px rgba(0, 0, 0, 0.2),
      -8px 0 15px -10px rgba(0, 0, 0, 0.2);
  }
  `
})
export class AppointmentsListComponent implements OnInit {
  private readonly appointmentsService = inject(AppointmentsStateService);
  private readonly usersService = inject(UsersStateService);
  private readonly therapiesService = inject(TherapiesStateService);
  public readonly dateTimeService = inject(DateTimeService);

  readonly pageSize = 12;
  currentPage = signal(1);
  isCancelling = signal(false);

  showCancellationModal = signal(false);
  selectedAppointment = signal<{ appointmentId: string; therapyId: string } | null>(null);

  appointmentsState = this.appointmentsService.appointmentsState;
  userAppointments = computed(() => this.appointmentsService.appointmentsState().userAppointments);

  therapiesMap = computed(() => {
    const therapies = this.therapiesService.therapiesState().list;
    return Object.fromEntries(therapies.map(t => [t.therapyId, t]));
  });

  sortedAppointments = computed(() => {
    const appointments = this.userAppointments();

    if (!appointments || appointments.length === 0) {
      return [];
    }

    return this.dateTimeService.sortItemsByDate(
      appointments,
      (apt) => apt.date,
      (apt) => apt.startTime
    );
  });

  paginatedAppointments = computed(() => {
    const sorted = this.sortedAppointments();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return sorted.slice(start, end);
  });

  nextPage() {
    const totalPages = Math.ceil(this.sortedAppointments().length / this.pageSize);
    if (this.currentPage() < totalPages) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  openCancellationModal(cancellationData: { appointmentId: string; therapyId: string }) {
    this.selectedAppointment.set(cancellationData);
    this.showCancellationModal.set(true);
  }

  closeCancellationModal() {
    this.showCancellationModal.set(false);
    this.selectedAppointment.set(null);
  }

  handleCancellationConfirm(cancellationDetails: CancellationDetails) {
    const appointment = this.selectedAppointment();
    if (!appointment) return;

    this.isCancelling.set(true);
    this.closeCancellationModal();

    this.appointmentsService.requestCancellation(
      appointment.therapyId,
      appointment.appointmentId,
      cancellationDetails.notes
    ).pipe(
      finalize(() => {
        this.isCancelling.set(false);
        this.selectedAppointment.set(null);
      })
    ).subscribe({
        next: () => {
          const userId = this.usersService.usersState().currentUser?.userId;
          if (userId) {
            this.appointmentsService.getByUser(userId);
          }
        },
        error: (err: unknown) => {
          console.error('Error requesting cancellation:', err);
        }
      });
  }

  ngOnInit(): void {
    const currentUser = this.usersService.usersState().currentUser;
    const userId = currentUser?.userId;

    if (userId) {
      this.appointmentsService.getByUser(userId);
    }

    this.therapiesService.listTherapies();
  }
}
