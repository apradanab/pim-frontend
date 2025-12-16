import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentsFilterComponent } from './appointments-filter.component';
import { FilterOptions } from '../../../../models/appointment.model';
import { FormsModule } from '@angular/forms';

const mockFilterOptions: FilterOptions = {
  availableMonths: [
    '2024-01-01T00:00:00Z',
    '2024-02-01T00:00:00Z'
  ],
  therapies: [
    { id: 't1', title: 'Terapia1' },
    { id: 't2', title: 'Terapia2' }
  ],
  users: [
    { name: 'Usuario1', email: 'user1@test.com' },
    { name: 'Usuario2', email: 'user2@test.com' }
  ]
}

describe('AppointmentsFilterComponent', () => {
  let component: AppointmentsFilterComponent;
  let fixture: ComponentFixture<AppointmentsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsFilterComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filterOptions', mockFilterOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange output with current criteria when emitCriteria is called', () => {
    spyOn(component.filterChange, 'emit');

    component.monthFilter = mockFilterOptions.availableMonths[0];
    component.therapyFilter = mockFilterOptions.therapies[1].id;

    component.emitCriteria();

    expect(component.filterChange.emit).toHaveBeenCalledWith({
      month: mockFilterOptions.availableMonths[0],
      therapyId: mockFilterOptions.therapies[1].id,
      userEmail: null,
    });
  });

  it('should clear all filters and emit empty criteria when clearFilters is called', () => {
    spyOn(component, 'emitCriteria');

    component.monthFilter = 'month';
    component.therapyFilter = 'therapy';
    component.userFilter = 'user';

    component.clearFilters();

    expect(component.monthFilter).toBeNull();
    expect(component.therapyFilter).toBeNull();
    expect(component.userFilter).toBeNull();

    expect(component.emitCriteria).toHaveBeenCalled();
  });
});
