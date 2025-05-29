import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { Router } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate with /servicios/terapia-individual when navigateToServicesDetail is called', () => {
    component.navigateToServicesDetail();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/servicios/terapia-individual']);
  });

  describe('Modal', () => {
    it('should open contact modal', () => {
      expect(component.showContactModal).toBeFalse();
      component.openContactModal();
      expect(component.showContactModal).toBeTrue();
    });

    it('should close contact modal', () => {
      component.showContactModal = true;
      component.closeContactModal();
      expect(component.showContactModal).toBeFalse();
    })
  })

  it('should open Google Maps in new tab when openGoogleMaps is called', () => {
    spyOn(window, 'open');
    const expectedUrl = 'https://www.google.com/maps/search/?api=1&query=Calle%20Par%C3%ADs%201%2C%20Montcada%2C%20Barcelona%2C%2008110';

    component.openGoogleMaps();

    expect(window.open).toHaveBeenCalledWith(expectedUrl);
  });
});
