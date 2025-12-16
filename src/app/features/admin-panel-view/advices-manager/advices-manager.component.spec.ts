import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesManagerComponent } from './advices-manager.component';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { Advice } from '../../../models/advice.model';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';

class MockAdvicesStateService {
  advicesState = jasmine.createSpy().and.returnValue({
    list: [],
    filtered: [],
    current: null,
    error: null
  });

  listAdvices = jasmine.createSpy('listAdvices');
  updateAdvice = jasmine.createSpy('updateAdvice');
  deleteAdvice = jasmine.createSpy('deleteAdvice');
}

class MockTherapiesStateService {
  therapiesState = jasmine.createSpy('therapiesState').and.returnValue({
    list: [
      { therapyId: '3', title: 'Terapia3' },
      { therapyId: '4', title: 'Terapia4' }
    ],
    filtered: [],
    current: null,
    error: null
  });
}

describe('AdvicesManagerComponent', () => {
  let component: AdvicesManagerComponent;
  let fixture: ComponentFixture<AdvicesManagerComponent>;
  let mockService: MockAdvicesStateService;
  let mockTherapyService: MockTherapiesStateService;

  const mockAdvice: Advice = {
    adviceId: '1',
    therapyId: '1',
    title: 'Test Advice',
    description: 'Test Description',
    content: 'Test Content',
    image: { key: 'key', url: 'http://test.com' },
    createdAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(async () => {
    mockService = new MockAdvicesStateService();
    mockTherapyService = new MockTherapiesStateService();

    await TestBed.configureTestingModule({
      imports: [AdvicesManagerComponent],
      providers: [
        { provide: AdvicesStateService, useValue: mockService },
        { provide: TherapiesStateService, useValue: mockTherapyService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvicesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listAdvices on init', () => {
    expect(mockService.listAdvices).toHaveBeenCalled();
  });

  it('should toggle isCreateForm signal', () => {
    expect(component.isCreateForm()).toBeFalse();

    component.toggleCreateForm(true)
    expect(component.isCreateForm()).toBeTrue();

    component.toggleCreateForm(false);
    expect(component.isCreateForm()).toBeFalse();
  })

  it('should call updateAdvice when handleEdit is triggered', () => {
    component.handleEdit(mockAdvice);
    expect(mockService.updateAdvice).toHaveBeenCalledWith('1', mockAdvice);
  });

  it('should set adviceToDelete when handleDelete is called', () => {
    component.handleDelete(mockAdvice);
    expect(component.adviceToDelete()).toBe(mockAdvice);
  });

  it('should clear adviceToDelete when cancelDelete is called', () => {
    component.adviceToDelete.set(mockAdvice);
    component.cancelDelete();
    expect(component.adviceToDelete()).toBeNull();
  });

  it('should call deleteAdvice and clear adviceToDelete on confirmDelete', () => {
    component.adviceToDelete.set(mockAdvice);
    component.confirmDelete();
    expect(mockService.deleteAdvice).toHaveBeenCalledWith(mockAdvice);
    expect(component.adviceToDelete()).toBeNull();
  });
});
