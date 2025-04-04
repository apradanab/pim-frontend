import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesShowcaseComponent } from './services-showcase.component';
import { StateService } from '../../services/state.service';
import { Service } from '../../models/service.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { signal } from '@angular/core';

describe('ServicesShowcaseComponent', () => {
  let component: ServicesShowcaseComponent;
  let fixture: ComponentFixture<ServicesShowcaseComponent>;
  let mockStateService: Partial<StateService>;
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Terapia 1',
      description: 'Descripción 1',
      content: 'Contenido 1',
      image: 'image1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    mockStateService = {
      services: signal(mockServices),
      loadServices: jasmine.createSpy('loadServices')
    };

    await TestBed.configureTestingModule({
      imports: [ServicesShowcaseComponent, FontAwesomeModule],
      providers: [
        { provide: StateService, useValue: mockStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadServices on init', () => {
    expect(mockStateService.loadServices).toHaveBeenCalled();
  });

  it('should display services', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Terapia 1');
  });

  it('should have correct service styles', () => {
    expect(component.serviceStyles.length).toBe(3);
    expect(component.serviceStyles[0].bgColor).toBe('#fea087');
  });
});
