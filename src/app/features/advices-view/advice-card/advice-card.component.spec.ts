import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdviceCardComponent } from './advice-card.component';
import { Advice } from '../../../models/advice.model';

describe('AdviceCardComponent', () => {
  let component: AdviceCardComponent;
  let fixture: ComponentFixture<AdviceCardComponent>;

  const mockAdvice: Advice = {
    adviceId: 'a1',
    therapyId: 't1',
    title: 'Título de prueba',
    description: 'Descripción de prueba',
    content: 'Contenido detallado de prueba',
    image: { key: 'img-1', url: 'test-image.jpg' },
    createdAt: '2024-01-01T00:00:00.000Z'
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

  it('should emit toggle when clicking card', () => {
    fixture.componentRef.setInput('isExpanded', false);
    fixture.detectChanges();

    spyOn(component.toggle, 'emit');

    component.handleToggle();

    expect(component.toggle.emit).toHaveBeenCalledWith(mockAdvice.adviceId);
  });

  it('should stop propagation and emit toggle when handleClose is called', () => {
    const mockEvent = jasmine.createSpyObj('Event', ['stopPropagation']);
    spyOn(component.toggle, 'emit');

    component.handleClose(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.toggle.emit).toHaveBeenCalledWith('a1');
  })
});
