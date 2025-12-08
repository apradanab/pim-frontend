import { Component, computed, inject, input, output, signal } from '@angular/core';
import { AppointmentsStateService } from '../../../../core/services/states/appointments.state.service';
import { TherapiesStateService } from '../../../../core/services/states/therapies.state.service';
import { UsersStateService } from '../../../../core/services/states/users.state.service';
import { DateTimeService } from '../../../../core/services/utils/date-time.service';
import { AppointmentKeys, AppointmentDisplay, FilterCriteria, FilterOptions } from '../../../../models/appointment.model';
import { AppointmentCardComponent } from "../appointment-card/appointment-card.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApptCreateFormComponent } from "../appt-create-form/appt-create-form.component";
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { AppointmentsFilterComponent } from "../appointments-filter/appointments-filter.component";

@Component({
  selector: 'pim-appointments-list',
  standalone: true,
  imports: [AppointmentCardComponent, FontAwesomeModule, ApptCreateFormComponent, AppointmentsFilterComponent],
  template: `
  <pim-appointments-filter
    [filterOptions]="availableFilterOptions()"
    (filterChange)="filterCriteria.set($event)"
  />
  <div class="list">
  @if (!isCreateForm()) {
    <button class="create-card card" (click)="toggleCreateForm.emit(true)">
      <fa-icon [icon]="faPlus" size="2x" class="create-icon"/>
    </button>
  } @else {
    <div class="form-wrapper card">
      <pim-appt-create-form
        (apptCreated)="apptCreated.emit()"
        (cancelClick)="toggleCreateForm.emit(false)"
        [availableTherapies]="therapiesForForm()"
        [availableUsers]="usersForForm()"
      />
    </div>
  }

  @if (mappedAppts().length === 0) {
    <p>No hay citas disponibles actualmente.</p>
  } @else {
    @for (appt of mappedAppts(); track appt.appointmentId) {
      <pim-appointment-card
        [appt]="appt"
        [therapyTitle]="appt.therapyTitle"
        [userName]="appt.userName"
        [participants]="appt.participantsNames"
        (requestApproval)="requestApproval.emit($event)"
        (requestCancelApproval)="requestCancelApproval.emit($event)"
        (requestDeletion)="requestDeletion.emit($event)"
        (noteSaved)="noteSaved.emit($event)"
      />
    }
  }
  </div>
  `,
  styles: `
  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .form-wrapper {
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #e8e8e8ff;
  }

  .card {
    width: 250px;
    height: 165px;
    border-radius: 20px;
    border: 1px solid lightgray;
    color: white;
  }
  `
})
export class AppointmentsListComponent {
  private readonly apptsService = inject(AppointmentsStateService);
  private readonly therapiesService = inject(TherapiesStateService);
  private readonly usersService = inject(UsersStateService);
  private readonly dateTimeService = inject(DateTimeService);

  apptsState = this.apptsService.appointmentsState;
  therapiesState = this.therapiesService.therapiesState;
  usersState = this.usersService.usersState;

  isCreateForm = input.required<boolean>();
  requestApproval = output<AppointmentKeys>();
  requestCancelApproval = output<AppointmentKeys>();
  requestDeletion = output<AppointmentKeys>();
  noteSaved = output<{ notes: string, therapyId: string, appointmentId: string }>();
  toggleCreateForm = output<boolean>();
  apptCreated = output<void>();

  filterCriteria = signal<FilterCriteria>({});
  faPlus = faCirclePlus;

  therapiesForForm = computed(() => this.therapiesState().list);
  private readonly therapyMap = computed<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const therapy of this.therapiesState().list) {
      map.set(therapy.therapyId, therapy.title);
    }
    return map;
  });

  usersForForm = computed(() =>
    this.usersService.usersState().list
      .map(u => ({ email: u.email || '', name: u.name || '' }))
      .filter(u => !!u.email && !!u.name)
  );
  private readonly userMap = computed<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const user of this.usersState().list) {
      if (user.email && user.name) {
        map.set(user.email, user.name);
      }
    }
    return map;
  });

  availableFilterOptions = computed<FilterOptions>(() => {
    const appts = this.apptsState().availableAppointments;

    const therapies = this.therapiesForForm().map(t => ({
      id: t.therapyId,
      title: t.title
    }));

    const users = this.usersForForm();

    const uniqueMonths = new Set<string>();
    for (const appt of appts) {
      if (appt.date) {
        uniqueMonths.add(appt.date.substring(0, 7));
      }
    }
    const availableMonths = Array.from(uniqueMonths).sort((a, b) => a.localeCompare(b));

    return {
      availableMonths,
      therapies,
      users
    }
  });

  mappedAppts = computed<AppointmentDisplay[]>(() => {
    const appts = this.apptsState().availableAppointments;
    const criteria = this.filterCriteria();
    const tMap = this.therapyMap();
    const uMap = this.userMap();

    if(!appts || appts.length === 0) return [];

    const filtered = appts.filter(appt => {
      if (criteria.month) {
        const apptMonth = appt.date?.substring(0, 7);
        if(apptMonth !== criteria.month) return false;
      }

      if (criteria.therapyId && appt.therapyId !== criteria.therapyId) return false;

      if (criteria.userEmail) {
        const userEmail = criteria.userEmail;
        const isMainUser = appt.userEmail === userEmail;
        const isParticipant = appt.participants?.some(p => p.userEmail === userEmail);

        if (!isMainUser && !isParticipant) return false;
      }

      return true;
    })

    const ordered = this.dateTimeService.sortItemsByDate(
      filtered,
      (appt) => appt.date,
      (appt) => appt.startTime
    );

    return ordered.map(appt => {
      const participantsNames = appt.participants ?
      appt.participants.map(participant => uMap.get(participant.userEmail) || participant.userEmail) :
      undefined;

      return {
        ...appt,
        therapyTitle: tMap.get(appt.therapyId) || 'Terapia',
        userName: appt.userEmail ? (uMap.get(appt.userEmail) || appt.userEmail) : '',
        participantsNames: participantsNames
      }
    })
  });
}
