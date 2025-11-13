import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdviceCardComponent } from './advice-card.component';
import { Advice } from '../../../../models/advice.model';

describe('AdviceCardComponent', () => {
  let component: AdviceCardComponent;
  let fixture: ComponentFixture<AdviceCardComponent>;

  const mockAdvice: Advice = {
    adviceId: 'a1',
    therapyId: 't1',
    title: 'Terapia',
    description: 'Descripcion',
    content: 'Contenido',
    image: { key: 'img', url: 'test.jpg' },
    createdAt: '2025-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdviceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdviceCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('advice', mockAdvice);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle edit mode correctly', () => {
    expect(component.isEdit).toBeFalse();
    component.toggleEditMode();
    expect(component.isEdit).toBeTrue();
    component.toggleEditMode();
    expect(component.isEdit).toBeFalse();
  });

  it('should emit updated therapy and exit edit mode', () => {
    spyOn(component.edit, 'emit');

    const updatedAdvice: Advice = {
      ...mockAdvice,
      title: 'Terapia Modificada'
    };

    component.isEdit = true;
    component.handleUpdate(updatedAdvice);

    expect(component.edit.emit).toHaveBeenCalledWith(updatedAdvice);
    expect(component.isEdit).toBeFalse();
  });
});
