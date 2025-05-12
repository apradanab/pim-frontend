import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntroSectionComponent } from './intro-section.component';

describe('IntroSectionComponent', () => {
  let component: IntroSectionComponent;
  let fixture: ComponentFixture<IntroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
});
