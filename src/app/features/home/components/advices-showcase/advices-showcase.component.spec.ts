import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesShowcaseComponent } from './advices-showcase.component';
import { Router } from '@angular/router';

describe('AdvicesShowcaseComponent', () => {
  let component: AdvicesShowcaseComponent;
  let fixture: ComponentFixture<AdvicesShowcaseComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdvicesShowcaseComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvicesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /consejos', () => {
    component.navigateToAdvices();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos']);
  })
});
