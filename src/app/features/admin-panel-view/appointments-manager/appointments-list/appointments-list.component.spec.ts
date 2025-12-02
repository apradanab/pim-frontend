import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsListComponent } from './appointments-list.component';
import { Therapy } from '../../../../models/therapy.model';
import { User } from '../../../../models/user.model';
import { Appointment, AppointmentStatus, FilterCriteria } from '../../../../models/appointment.model';
import { AppointmentState, TherapyState, UserState } from '../../../../models/state.model';
import { signal, Component } from '@angular/core';
import { AppointmentsStateService } from '../../../../core/services/states/appointments.state.service';
import { TherapiesStateService } from '../../../../core/services/states/therapies.state.service';
import { UsersStateService } from '../../../../core/services/states/users.state.service';
import { DateTimeService } from '../../../../core/services/utils/date-time.service';

const mockTherapies: Therapy[] = [
  { therapyId: 'T1', title: 'Terapia Individual', description: '' } as Therapy,
  { therapyId: 'T2', title: 'Terapia Grupal', description: '' } as Therapy,
];
const mockTherapiesState: TherapyState = { list: mockTherapies, current: null, error: null };

const mockUsers: User[] = [
  { email: 'user1@test.com', name: 'Usuario Uno', userId: 'U1' } as User,
  { email: 'user2@test.com', name: 'Usuario Dos', userId: 'U2' } as User,
  { email: 'user3@test.com', name: 'Usuario Tres', userId: 'U3' } as User,
  { email: null, name: 'Usuario Nulo', userId: 'U4' } as unknown as User,
  { email: 'user5@test.com', name: null, userId: 'U5' } as unknown as User,
];
const mockUsersState: UserState = { list: mockUsers, currentUser: null, isLoading: false, error: null };

const mockAppointments: Appointment[] = [
  {
    appointmentId: 'A1', therapyId: 'T1', userEmail: 'user1@test.com', date: '2025-10-15', startTime: '10:00',
    participants: [{ userEmail: 'user2@test.com' }], status: AppointmentStatus.OCCUPIED
  } as Appointment,
  {
    appointmentId: 'A2', therapyId: 'T2', userEmail: 'user3@test.com', date: '2025-11-20', startTime: '14:30',
    participants: [], status: AppointmentStatus.PENDING
  } as unknown as Appointment,
  {
    appointmentId: 'A3', therapyId: 'T1', userEmail: 'user1@test.com', date: '2025-10-10', startTime: '09:00',
    participants: undefined, status: AppointmentStatus.OCCUPIED
  } as unknown as Appointment,
  {
    appointmentId: 'A4', therapyId: 'UNKNOWN', userEmail: null, date: '2025-12-01', startTime: '10:00',
    participants: [{ userEmail: 'user99@test.com' }], status: AppointmentStatus.PENDING
  } as unknown as Appointment,
  {
    appointmentId: 'A5', therapyId:'T2', userEmail: 'not_in_map@test.com', date: '2025-10-01', startTime: '11:00',
    participants: [], status: AppointmentStatus.OCCUPIED
  } as unknown as Appointment,
];
const mockAppointmentsState: AppointmentState = {
  userAppointments: [], availableAppointments: mockAppointments, current: null, isLoading: false, error: null
};
const mockAppointmentsStateEmpty: AppointmentState = {
  userAppointments: [], availableAppointments: [], current: null, isLoading: false, error: null
};

class MockAppointmentsStateService { appointmentsState = signal(mockAppointmentsState); }
class MockAppointmentsStateServiceEmpty { appointmentsState = signal(mockAppointmentsStateEmpty); }
class MockTherapiesStateService { therapiesState = signal(mockTherapiesState); }
class MockUsersStateService { usersState = signal(mockUsersState); }
class MockDateTimeService {
  public formatShortDate(dateStr: string): string {
    return dateStr;
  }

  sortItemsByDate<T>(
    items: T[],
    dateSelector: (item: T) => string | undefined,
    timeSelector: (item: T) => string | undefined
  ): T[] {
    return items.slice().sort((a: T, b: T) => {
      const dateA = dateSelector(a) || '';
      const timeA = timeSelector(a) || '';
      const dateB = dateSelector(b) || '';
      const timeB = timeSelector(b) || '';

      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return timeA.localeCompare(timeB);
    });
  }

  public parseDateString(dateStr: string): Date { return new Date(dateStr); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public timeToMinutes(timeStr: string): number { return 0; }
}

@Component({
  standalone: true,
  imports: [AppointmentsListComponent],
  template: `
    <pim-appointments-list
      [isCreateForm]="false"
      (toggleCreateForm)="null"
      (apptCreated)="null"
      (requestApproval)="null"
      (requestCancelApproval)="null"
      (requestDeletion)="null"
    />
  `,
})
class TestHostComponent {}

describe('AppointmentsListComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: AppointmentsListComponent;
  let mockApptsService: MockAppointmentsStateService;

  beforeEach(async () => {
    mockApptsService = new MockAppointmentsStateService();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: AppointmentsStateService, useValue: mockApptsService },
        { provide: TherapiesStateService, useClass: MockTherapiesStateService },
        { provide: UsersStateService, useClass: MockUsersStateService },
        { provide: DateTimeService, useClass: MockDateTimeService },
      ]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    component = hostFixture.debugElement.children[0].componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly map available users (usersForForm) and handle null properties', () => {
    const expectedUsers = [
      { email: 'user1@test.com', name: 'Usuario Uno' },
      { email: 'user2@test.com', name: 'Usuario Dos' },
      { email: 'user3@test.com', name: 'Usuario Tres' },
    ];
    expect(component.usersForForm().length).toBe(3);
    expect(component.usersForForm()).toEqual(expectedUsers);
  });

  it('should correctly map available users (usersForForm) and filter incomplete users', () => {
    const expectedUsers = [
      { email: 'user1@test.com', name: 'Usuario Uno' },
      { email: 'user2@test.com', name: 'Usuario Dos' },
      { email: 'user3@test.com', name: 'Usuario Tres' },
    ];
    expect(component.usersForForm()).toEqual(expectedUsers);
  });

  it('should compute available filter options correctly', () => {
    const options = component.availableFilterOptions();
    expect(options.therapies.length).toBe(2);
    expect(options.availableMonths).toEqual(['2025-10', '2025-11', '2025-12']);
  });

  it('should map appointments and handle undefined participants and non-mapped userEmail', () => {
    const mapped = component.mappedAppts();

    const appt3 = mapped.find(a => a.appointmentId === 'A3')!;
    expect(appt3.participantsNames).toBeUndefined();

    const appt4 = mapped.find(a => a.appointmentId === 'A4')!;
    expect(appt4.userName).toBe('');

    const appt5 = mapped.find(a => a.appointmentId === 'A5')!;
    expect(appt5.userName).toBe('not_in_map@test.com');
    expect(appt5.therapyTitle).toBe('Terapia Grupal');
  });

  it('should filter appointments by month', () => {
    component.filterCriteria.set({ month: '2025-11' } as FilterCriteria);
    hostFixture.detectChanges();

    const filtered = component.mappedAppts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].appointmentId).toBe('A2');
  });

  it('should filter appointments by therapyId', () => {
    component.filterCriteria.set({ therapyId: 'T2' } as FilterCriteria);
    hostFixture.detectChanges();

    const filtered = component.mappedAppts();
    expect(filtered.length).toBe(2);
    expect(filtered.some(a => a.appointmentId === 'A2')).toBeTrue();
    expect(filtered.some(a => a.appointmentId === 'A5')).toBeTrue();
  });

  it('should filter appointments by participant user (userEmail: user2@test.com)', () => {
    component.filterCriteria.set({ userEmail: 'user2@test.com' } as FilterCriteria);
    hostFixture.detectChanges();

    const filtered = component.mappedAppts();
    expect(filtered.length).toBe(1);
    expect(filtered[0].appointmentId).toBe('A1');
  });

  it('should display appointment cards when appointments are available', () => {
    hostFixture.detectChanges();
    const cards = hostFixture.nativeElement.querySelectorAll('pim-appointment-card');
    expect(cards.length).toBe(mockAppointments.length);
  });

  describe('AppointmentsListComponent - Empty State Coverage', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: AppointmentsListComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
          imports: [TestHostComponent],
          providers: [
              { provide: AppointmentsStateService, useClass: MockAppointmentsStateServiceEmpty },
              { provide: TherapiesStateService, useClass: MockTherapiesStateService },
              { provide: UsersStateService, useClass: MockUsersStateService },
              { provide: DateTimeService, useClass: MockDateTimeService },
          ]
      })
      .compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.debugElement.children[0].componentInstance;
      fixture.detectChanges();
    });

    it('should return an empty array if available appointments list is empty (L154)', () => {
        expect(component.mappedAppts()).toEqual([]);
    });
  });
});
