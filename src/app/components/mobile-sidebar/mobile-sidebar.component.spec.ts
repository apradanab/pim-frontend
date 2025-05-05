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

  it('should call router.navigate with /servicios/terapia-individual when navigateToServicesDetail is called', () => {
    component.navigateToServicesDetail();
    expect(router.navigate).toHaveBeenCalledWith(['/servicios/terapia-individual']);
  });
});
