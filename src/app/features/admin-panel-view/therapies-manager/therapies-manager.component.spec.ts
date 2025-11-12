import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TherapiesManagerComponent } from './therapies-manager.component';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Therapy } from '../../../models/therapy.model';

class MockTherapiesStateService {
  therapiesState = jasmine.createSpy().and.returnValue({
    list: [],
    error: null
  });

  listTherapies = jasmine.createSpy('listTherapies');
  updateTherapy = jasmine.createSpy('updateTherapy');
  deleteTherapy = jasmine.createSpy('deleteTherapy');
}

describe('TherapiesManagerComponent', () => {
  let component: TherapiesManagerComponent;
  let fixture: ComponentFixture<TherapiesManagerComponent>;
  let mockService: MockTherapiesStateService;

  beforeEach(async () => {
    mockService = new MockTherapiesStateService();

    await TestBed.configureTestingModule({
      imports: [TherapiesManagerComponent],
      providers: [
        { provide: TherapiesStateService, useValue: mockService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapiesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listTherapies on init', () => {
    expect(mockService.listTherapies).toHaveBeenCalled();
  });

  it('should call updateTherapy when handleEdit is triggered', () => {
    const therapy = { therapyId: '1' } as Therapy;
    component.handleEdit(therapy);
    expect(mockService.updateTherapy).toHaveBeenCalledWith('1', therapy);
  });

  it('should set therapyToDelete when handleDelete is called', () => {
    component.handleDelete('123');
    expect(component.therapyToDelete()).toBe('123');
  });

  it('should clear therapyToDelete when cancelDelete is called', () => {
    component.therapyToDelete.set('123');
    component.cancelDelete();
    expect(component.therapyToDelete()).toBeNull();
  });

  it('should call deleteTherapy and clear therapyToDelete on confirmDelete', () => {
    component.therapyToDelete.set('123');
    component.confirmDelete('123');
    expect(mockService.deleteTherapy).toHaveBeenCalledWith('123');
    expect(component.therapyToDelete()).toBeNull();
  });
});
