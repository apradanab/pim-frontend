import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdviceCardComponent } from './advice-card.component';
import { Advice } from '../../../../models/advice.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
      imports: [AdviceCardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdviceCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('advice', mockAdvice);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle edit mode', () => {
    expect(component.isEdit).toBeFalse();
    component.toggleEditMode();
    expect(component.isEdit).toBeTrue();
    component.toggleEditMode();
    expect(component.isEdit).toBeFalse();
  });

  it('should emit updated advice and exit edit mode', () => {
    spyOn(component.edit, 'emit');
    component.isEdit = true;

    const updatedAdvice = { ...mockAdvice, title: 'Modificado' };
    component.handleUpdate(updatedAdvice);

    expect(component.edit.emit).toHaveBeenCalledWith(updatedAdvice);
    expect(component.isEdit).toBeFalse();
  });

  it('should expose outputs', () => {
    expect(typeof component.edit.emit).toBe('function');
    expect(typeof component.delete.emit).toBe('function');
  });

  it('should call delete emit', () => {
    spyOn(component.delete, 'emit');
    component.delete.emit(mockAdvice.adviceId);
    expect(component.delete.emit).toHaveBeenCalledWith(mockAdvice.adviceId);
  });
});
