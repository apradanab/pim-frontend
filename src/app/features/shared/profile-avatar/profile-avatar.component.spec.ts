import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileAvatarComponent } from './profile-avatar.component';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserState } from '../../../models/state.model';
import { User } from '../../../models/user.model';

describe('ProfileAvatarComponent', () => {
  let component: ProfileAvatarComponent;
  let fixture: ComponentFixture<ProfileAvatarComponent>;
  let mockUsersStateService: jasmine.SpyObj<UsersStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUsersStateService = jasmine.createSpyObj('UsersStateService', ['usersState']);
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return currentUser from UsersStateService', () => {
    const mockUserState: UserState = {
      list: [],
      currentUser: { id: 1, name: 'Test User' } as unknown as User,
      error: null
    };
    mockUsersStateService.usersState.and.returnValue(mockUserState);

    expect(component.currentUser()).toEqual(mockUserState.currentUser);
  });

  it('should navigate to /perfil when isMenuButton is false', () => {
    spyOn(component, 'isMenuButton').and.returnValue(false);
    component.navigateToProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('should display avatar image when user has avatar', () => {
    const mockUserState: UserState = {
      list: [],
      currentUser: { avatar: { url: 'test.jpg' } } as User,
      error: null
    };
    mockUsersStateService.usersState.and.returnValue(mockUserState);

    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('test.jpg');
  });
});
