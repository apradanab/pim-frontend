import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileSidebarComponent } from './mobile-sidebar.component';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { computed, signal } from '@angular/core';
import { UsersStateService } from '../../../core/services/states/users.state.service';

class MockUser implements User {
  role: 'USER' | 'ADMIN';
  userId = 'test-id';
  email = 'test@example.com';
  name = 'Test User';
  approved: boolean = true;

  constructor(role: 'USER' | 'ADMIN') {
    this.role = role;
  }
}

class MockUsersStateService {
  private currentUserSignal = signal<User | null>(null);

  usersState = computed(() => ({
    currentUser: this.currentUserSignal(),
    isLoggedIn: !!this.currentUserSignal()
  }));

  setCurrentUser(user: User | null) {
    this.currentUserSignal.set(user);
  }
}

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

describe('MobileSidebarComponent', () => {
  let component: MobileSidebarComponent;
  let fixture: ComponentFixture<MobileSidebarComponent>;
  let usersStateService: MockUsersStateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MobileSidebarComponent],
      providers: [
        { provide: UsersStateService, useClass: MockUsersStateService },
        { provide: Router, useValue: mockRouter },
      ]
    });

    fixture = TestBed.createComponent(MobileSidebarComponent);
    component = fixture.componentInstance;

    usersStateService = TestBed.inject(UsersStateService) as unknown as MockUsersStateService;
    router = TestBed.inject(Router);

    (router.navigate as jasmine.Spy).calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToProfile', () => {

    it('should navigate to /perfil when the user is not an Admin', () => {
      usersStateService.setCurrentUser(new MockUser('USER'));
      fixture.detectChanges();

      component.navigateToProfile();

      expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
    });

    it('should navigate to /admin when the user is an Admin', () => {
      usersStateService.setCurrentUser(new MockUser('ADMIN'));
      fixture.detectChanges();

      component.navigateToProfile();

      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    });
  });

  it('should open login modal', () => {
    expect(component.showLoginModal).toBeFalse();
    component.openLoginModal();
    expect(component.showLoginModal).toBeTrue();
  });

  it('should close login modal', () => {
    component.showLoginModal = true;
    component.closeLoginModal();
    expect(component.showLoginModal).toBeFalse();
  });

  it('should call router.navigate with /perfil when navigateToProfile is called', () => {
    component.navigateToProfile();
    expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  it('should call router.navigate with /terapias/terapia-individual when navigateToTherapies is called', () => {
    component.navigateToTherapies();
    expect(router.navigate).toHaveBeenCalledWith(['/terapias/terapia-individual']);
  });

  it('should call router.navigate with /consejos when navigateToAdvices is called', () => {
    component.navigateToAdvices();
    expect(router.navigate).toHaveBeenCalledWith(['/consejos']);
  });

  it('should call router.navigate with /horarios when navigateToSchedule is called', () => {
    component.navigateToSchedule();
    expect(router.navigate).toHaveBeenCalledWith(['/horarios']);
  })

  it('should open Google Maps in new tab when openGoogleMaps is called', () => {
    spyOn(window, 'open');
    const expectedUrl = 'https://www.google.com/maps/search/?api=1&query=Calle%20Par%C3%ADs%201%2C%20Montcada%2C%20Barcelona%2C%2008110';

    component.openGoogleMaps();

    expect(window.open).toHaveBeenCalledWith(expectedUrl);
  });
});
