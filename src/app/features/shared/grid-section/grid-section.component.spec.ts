import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridSectionComponent } from './grid-section.component';

describe('GridSectionComponent', () => {
  let component: GridSectionComponent;
  let fixture: ComponentFixture<GridSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridSectionComponent);
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
