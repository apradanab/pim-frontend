import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';

describe('HeaderComponent Navigation', () => {
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
        }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should call router.navigate with /home when navigateToHome is called', () => {
    component.navigateToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should call router.navigate with /services-detail when navigateToServicesDetail is called', () => {
    component.navigateToServicesDetail();
    expect(router.navigate).toHaveBeenCalledWith(['/services-detail']);
  });

  it('should toggle sidebarActive value', () => {
    expect(component.sidebarActive).toBeFalse();

    component.toggleSidebar();
    expect(component.sidebarActive).toBeTrue();

    component.toggleSidebar();
    expect(component.sidebarActive).toBeFalse();
  });
});
