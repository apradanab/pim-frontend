import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TherapyCardComponent } from './therapy-card.component';
import { Therapy } from '../../../../models/therapy.model';

describe('TherapyCardComponent', () => {
  let component: TherapyCardComponent;
  let fixture: ComponentFixture<TherapyCardComponent>;

  const mockTherapy: Therapy = {
    therapyId: '1',
    title: 'Terapia',
    description: 'Descripcion',
    content: 'Contenido',
    maxParticipants: 1,
    image: { key: 'img', url: 'test.jpg' },
    bgColor: '#ccc',
    createdAt: '2025-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapyCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TherapyCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('therapy', mockTherapy);
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

    const updatedTherapy: Therapy = {
      ...mockTherapy,
      title: 'Terapia Modificada'
    };

    component.isEdit = true;
    component.handleUpdate(updatedTherapy);

    expect(component.edit.emit).toHaveBeenCalledWith(updatedTherapy);
    expect(component.isEdit).toBeFalse();
  });
});
