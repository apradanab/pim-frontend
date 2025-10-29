import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeaderComponent } from './profile-header.component';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/states/auth.state.service';
import { UsersStateService } from '../../../core/services/states/users.state.service';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;
  let router: Router;
  let mockUsersStateService: jasmine.SpyObj<UsersStateService>;
  let mockAuthStateService: jasmine.SpyObj<AuthStateService>;

  beforeEach(async () => {
    mockUsersStateService = jasmine.createSpyObj('UsersStateService', ['usersState']);
    mockAuthStateService = jasmine.createSpyObj('AuthStateService', ['logout']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileHeaderComponent],
      providers: [
        { provide: UsersStateService, useValue: mockUsersStateService },
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
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
  })
});
