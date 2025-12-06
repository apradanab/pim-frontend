import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileHeaderComponent } from './profile-header.component';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/states/auth.state.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { signal, WritableSignal } from '@angular/core';
import { UserState } from '../../../models/state.model';
import { User } from '../../../models/user.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;
  let router: jasmine.SpyObj<Router>;
  let mockUsersStateService: jasmine.SpyObj<UsersStateService>;
  let usersStateSignal: WritableSignal<UserState>;
  let mockAuthStateService: jasmine.SpyObj<AuthStateService>;
  let mockDateTimeService: jasmine.SpyObj<DateTimeService>;

  beforeEach(async () => {
    usersStateSignal = signal<UserState>({
      currentUser: null,
      list: [],
      error: null,
      isLoading: false,
    });

    mockUsersStateService = jasmine.createSpyObj('UsersStateService', ['setCurrentUser', 'updateUserProfile'], {
      usersState: usersStateSignal.asReadonly(),
    });

    mockAuthStateService = jasmine.createSpyObj('AuthStateService', ['logout']);
    mockDateTimeService = jasmine.createSpyObj('DateTimeService', ['formatDisplayDate']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UsersStateService, useValue: mockUsersStateService },
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: DateTimeService, useValue: mockDateTimeService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate with /horarios when navigateToSchedule is called', () => {
    component.navigateToSchedule();
    expect(router.navigate).toHaveBeenCalledWith(['/horarios']);
  });

  it('should call logout and navigate to /home when logout is called', () => {
    component.logout();
    expect(mockAuthStateService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set isModalOpen to true when openEditModal is called', () => {
    expect(component.isModalOpen()).toBeFalse();
    component.openEditModal();
    expect(component.isModalOpen()).toBeTrue();
  });

  describe('formattedCreationDate', () => {
    it('should return formatted date when currentUser has createdAt', () => {
      usersStateSignal.set({
        currentUser: { createdAt: '2024-05-20T12:00:00Z' } as User,
        list: [],
        error: null,
        isLoading: false,
      });
      mockDateTimeService.formatDisplayDate.and.returnValue('lunes 20 mayo, 2024');

      fixture.detectChanges();

      const result = component.formattedCreationDate();

      expect(mockDateTimeService.formatDisplayDate).toHaveBeenCalledWith('2024-05-20');
      expect(result).toBe('20 mayo 2024');
    });

    it('should return "Fecha no disponible" when currentUser has no createdAt', () => {
      usersStateSignal.set({
        currentUser: { name: 'Test' } as User,
        list: [],
        error: null,
        isLoading: false,
      });

      fixture.detectChanges();

      const result = component.formattedCreationDate();
      expect(result).toBe('Fecha no disponible');
    });

    it('should return "Fecha no disponible" when currentUser is null', () => {
      usersStateSignal.set({
        currentUser: null,
        list: [],
        error: null,
        isLoading: false
      });

      fixture.detectChanges();

      const result = component.formattedCreationDate();
      expect(result).toBe('Fecha no disponible');
    });
  });
});
