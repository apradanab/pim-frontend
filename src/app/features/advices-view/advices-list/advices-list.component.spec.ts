import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesListComponent } from './advices-list.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Advice } from '../../../models/advice.model';
import { Therapy } from '../../../models/therapy.model';

describe('AdvicesListComponent', () => {
  let component: AdvicesListComponent;
  let fixture: ComponentFixture<AdvicesListComponent>;
  let mockAdvicesService: jasmine.SpyObj<AdvicesStateService>;
  let mockTherapiesService: jasmine.SpyObj<TherapiesStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const paramsSubject = new BehaviorSubject<Params>({});

  const mockAdvices: Advice[] = [
    {
      adviceId: 'a1',
      therapyId: 't1',
      title: 'Consejo 1',
      description: 'Descripción 1',
      content: '<p>Contenido 1</p>',
      image: {
        key: 'image1-key',
        url: 'image1.jpg'
      },
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      adviceId: 'a2',
      therapyId: 'non-existing',
      title: 'Consejo sin terapia',
      description: 'Desc',
      content: 'Cont',
      image: { key: 'k2', url: 'u2' },
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  const mockTherapies: Therapy[] = [
    {
      therapyId: 't1',
      title: 'Terapia 1',
      bgColor: '#ddd',
      description: '',
      content: '',
      maxParticipants: 1,
      createdAt: ''
    }
  ];

  beforeEach(async () => {
    mockAdvicesService = jasmine.createSpyObj('AdvicesStateService', ['listAdvices'], {
      advicesState: jasmine.createSpy().and.returnValue({
        list: mockAdvices,
        filtered: [],
        current: null,
        error: null
      })
    });

    mockTherapiesService = jasmine.createSpyObj('TherapiesStateService', ['listTherapies'], {
      therapiesState: jasmine.createSpy().and.returnValue({ list: mockTherapies })
    })

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdvicesListComponent],
      providers: [
        { provide: AdvicesStateService, useValue: mockAdvicesService },
        { provide: TherapiesStateService, useValue: mockTherapiesService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: paramsSubject.asObservable() } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAllAdvices on init', () => {
    expect(mockAdvicesService.listAdvices).toHaveBeenCalled();
    expect(mockTherapiesService.listTherapies).toHaveBeenCalled();
  });

  it('should handle route params and update selectedAdvice', () => {
    paramsSubject.next({ adviceId: 'a1' });
    fixture.detectChanges();

    expect(component.expandedCardId()).toBe('a1');
    expect(component.selectedTherapyTitle()).toBe('Terapia 1');
  });

  it('should return null if advice therapyId is not found in therapies list', () => {
    paramsSubject.next({ adviceId: 'a2' });
    fixture.detectChanges();

    expect(component.selectedAdvice()?.adviceId).toBe('a2');
    expect(component.selectedTherapyTitle()).toBeNull();
  });

  it('should return null therapy title if no advice is selected', () => {
    paramsSubject.next({});
    fixture.detectChanges();
    expect(component.selectedTherapyTitle()).toBeNull();
  });

  it('should navigate to detail or back to list via handleCardAction', () => {
    paramsSubject.next({});
    fixture.detectChanges();
    component.handleCardAction('a1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos', 'a1']);

    paramsSubject.next({ adviceId: 'a1' });
    fixture.detectChanges();
    component.handleCardAction('a1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos']);
  });
});
