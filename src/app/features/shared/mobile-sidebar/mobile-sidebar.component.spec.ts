import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileSidebarComponent } from './mobile-sidebar.component';
import { Router } from '@angular/router';

describe('MobileSidebarComponent', () => {
  let component: MobileSidebarComponent;
  let fixture: ComponentFixture<MobileSidebarComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MobileSidebarComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    });

    fixture = TestBed.createComponent(MobileSidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
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
