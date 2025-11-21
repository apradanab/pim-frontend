import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileAvatarComponent } from './profile-avatar.component';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserState } from '../../../models/state.model';
import { User } from '../../../models/user.model';
import { signal, WritableSignal } from '@angular/core';

describe('ProfileAvatarComponent', () => {
  let component: ProfileAvatarComponent;
  let fixture: ComponentFixture<ProfileAvatarComponent>;
  let mockUsersStateService: UsersStateService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserSignal: WritableSignal<UserState>;

  const createMockUserState = (currentUser: User | null, isLoading: boolean = false): UserState => ({
    list: [],
    currentUser,
    error: null,
    isLoading
  });

  beforeEach(async () => {
    mockUserSignal = signal<UserState>(createMockUserState(null));

    mockUsersStateService = {
      usersState: mockUserSignal
    } as unknown as UsersStateService;

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileAvatarComponent, FontAwesomeModule],
      providers: [
        { provide: UsersStateService, useValue: mockUsersStateService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return currentUser from UsersStateService', () => {
    const mockUser: User = { userId: '1', name: 'Test User' } as User;

    mockUserSignal.set(createMockUserState(mockUser));
    fixture.detectChanges();

    expect(component.currentUser()).toEqual(mockUser);
  });

  it('should return early and not navigate when isMenuButton is true', () => {
    mockUserSignal.set(createMockUserState({ role: 'USER' } as User));
    fixture.detectChanges();

    spyOn(component, 'isMenuButton').and.returnValue(true);

    component.navigateToProfile();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to /admin when user is admin', () => {
    mockUserSignal.set(createMockUserState({ role: 'ADMIN' } as User));
    fixture.detectChanges();

    spyOn(component, 'isMenuButton').and.returnValue(false);

    component.navigateToProfile();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should navigate to /perfil when user is not admin', () => {
    mockUserSignal.set(createMockUserState({ role: 'USER' } as User));
    fixture.detectChanges();

    spyOn(component, 'isMenuButton').and.returnValue(false);

    component.navigateToProfile();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('should display avatar image when user has avatar', () => {
    mockUserSignal.set(
      createMockUserState({
        avatar: { url: 'test.jpg' }
      } as User)
    );

    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.src).toContain('test.jpg');
  });
});
