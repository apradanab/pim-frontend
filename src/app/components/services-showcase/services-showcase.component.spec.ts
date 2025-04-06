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
    },
    {
      id: '2',
      title: 'Terapia 2',
      description: 'Descripción 2',
      content: 'Contenido 2',
      image: 'image2.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    mockStateService = {
      state$: signal({
        services: mockServices,
        currentService: null
      }),
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

  it('should have correct service styles', () => {
    expect(component.serviceStyles.length).toBe(3);
    expect(component.serviceStyles[0].bgColor).toBe('#fea087');
    expect(component.serviceStyles[1].tags).toContain('Grupos abiertos');
  });

  it('should apply correct styles based on index', () => {
    const style1 = component.getServiceStyle(0);
    const style2 = component.getServiceStyle(1);
    const style3 = component.getServiceStyle(2);
    const style4 = component.getServiceStyle(3);

    expect(style1.bgColor).toBe('#fea087');
    expect(style2.bgColor).toBe('#e0f15e');
    expect(style3.bgColor).toBe('#b7a8ed');
    expect(style4.bgColor).toBe('#fea087');
  });
});
