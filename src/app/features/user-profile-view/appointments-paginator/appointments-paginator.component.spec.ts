import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsPaginatorComponent } from './appointments-paginator.component';

describe('AppointmentsPaginatorComponent', () => {
  let component: AppointmentsPaginatorComponent;
  let fixture: ComponentFixture<AppointmentsPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsPaginatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsPaginatorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalItems', 24);
    fixture.componentRef.setInput('pageSize', 12);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute total pages correctly', () => {
    expect(component.totalPages()).toBe(2);
  });

  it('should emit nextPage event', () => {
    spyOn(component.nextPage, 'emit');
    component.nextPage.emit();
    expect(component.nextPage.emit).toHaveBeenCalled();
  });

  it('should emit previousPage event', () => {
    spyOn(component.previousPage, 'emit');
    component.previousPage.emit();
    expect(component.previousPage.emit).toHaveBeenCalled();
  });
});
