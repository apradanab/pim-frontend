import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { StateService } from '../../../core/services/state.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        {
          provide: StateService,
          useValue: {}
        }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation', () => {
    it('should call router.navigate with /home when navigateToHome is called', () => {
      component.navigateToHome();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should call router.navigate with /terapias/terapia-individual when navigateToTherapiesView is called', () => {
      component.navigateToTherapiesView();
      expect(router.navigate).toHaveBeenCalledWith(['/terapias/terapia-individual']);
    });

    it('should call router.navigate with /consejos when navigateToAdvicesView is called', () => {
      component.navigateToAdvicesView();
      expect(router.navigate).toHaveBeenCalledWith(['/consejos']);
    })
  });

  describe('Sidebar', () => {
    it('should toggle sidebarActive value', () => {
      expect(component.sidebarActive).toBeFalse();

      component.toggleSidebar();
      expect(component.sidebarActive).toBeTrue();

      component.toggleSidebar();
      expect(component.sidebarActive).toBeFalse();
    });
  });

  describe('Modals', () => {
    it('should open contact modal', () => {
      expect(component.showContactModal).toBeFalse();
      component.openContactModal();
      expect(component.showContactModal).toBeTrue();
    });

    it('should close contact modal', () => {
      component.showContactModal = true;
      component.closeContactModal();
      expect(component.showContactModal).toBeFalse();
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
  });

  describe('Google Maps', () => {
    it('should open Google Maps with correct address', () => {
      spyOn(window, 'open');
      const expectedAddress = encodeURIComponent('Calle París 1, Montcada, Barcelona, 08110');
      const expectedUrl = `https://www.google.com/maps/search/?api=1&query=${expectedAddress}`;

      component.openGoogleMaps();

      expect(window.open).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
