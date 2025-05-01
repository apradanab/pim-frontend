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
});
