import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { TherapiesTabsComponent } from './therapies-tabs.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { Advice } from '../../../models/advice.model';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';

class MockTherapiesStateService {
  therapiesState = signal({
    list: [
      {
        therapyId: '1',
        title: 'Terapia Individual',
        description: 'Descripción 1',
        content: '',
        maxParticipants: 1,
        image: { key: 'img1', url: 'image1.jpg' },
        bgColor: '#fea087',
        createdAt: '2023-01-01'
      },
      {
        therapyId: '2',
        title: 'Grupo de Madres',
        description: 'Descripción 2',
        content: '',
        maxParticipants: 8,
        image: { key: 'img2', url: 'image2.jpg' },
        bgColor: '#e0f15e',
        createdAt: '2024-01-01'
      }
    ],
    current: null,
    error: null
  });

  listTherapies = jasmine.createSpy('listTherapies');
}

class MockAdvicesStateService {
  advicesState = signal<{
    filtered: Advice[];
    list: Advice[];
    current: Advice | null;
    error: string | null
  }>({
    filtered: [],
    list: [],
    current: null,
    error: null
  });

  listAdvices = jasmine.createSpy('listAdvices');
  listAdvicesByTherapy = jasmine.createSpy('listAdvicesByTherapy');
}


describe('TherapiesTabsComponent', () => {
  let fixture: ComponentFixture<TherapiesTabsComponent>;
  let component: TherapiesTabsComponent;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTherapiesService: MockTherapiesStateService;
  let mockAdvicesService: MockAdvicesStateService;
  let paramMapSubject: BehaviorSubject<ParamMap>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockTherapiesService = new MockTherapiesStateService();
    mockAdvicesService = new MockAdvicesStateService();
    paramMapSubject = new BehaviorSubject(convertToParamMap({ therapyType: 'grupo-de-madres' }));

    TestBed.configureTestingModule({
      imports: [TherapiesTabsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TherapiesStateService, useValue: mockTherapiesService },
        { provide: AdvicesStateService, useValue: mockAdvicesService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMapSubject.asObservable(),
            snapshot: { params: {} }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(TherapiesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load data', () => {
    expect(mockTherapiesService.listTherapies).toHaveBeenCalled();
    expect(mockAdvicesService.listAdvices).toHaveBeenCalled();
  });

  it('should activate correct tab and load related advices', fakeAsync(() => {
    component.therapies.set(mockTherapiesService.therapiesState().list);
    tick();

    paramMapSubject.next(convertToParamMap({ therapyType: 'grupo-de-madres' }));
    tick();
    fixture.detectChanges();

    expect(component.activeTab()).toBe(1);
    expect(mockAdvicesService.listAdvicesByTherapy).toHaveBeenCalledWith('2');
  }));

  it('should navigate to correct tab', () => {
    component.navigateToTab(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/terapias', 'terapia-individual']);
  });

  it('should navigate to selected advice', () => {
    component.navigateToAdvice('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos', '123']);
  });

  it('should update relatedAdvices when advicesState changes', fakeAsync(() => {
    const newAdvices = [{ adviceId: 'a1', title: 'Consejo' }] as Advice[];

    mockAdvicesService.advicesState.update(state => ({ ...state, filtered: newAdvices }));
    tick();
    fixture.detectChanges();

    expect(component.relatedAdvices()).toEqual(newAdvices);
  }));

  it('should set relatedAdvices to empty array when filtered is undefined', fakeAsync(() => {
    mockAdvicesService.advicesState.update(state => ({ ...state, filtered: undefined as unknown as Advice[] }));
    tick(0);
    fixture.detectChanges();

    expect(component.relatedAdvices()).toEqual([]);
  }));

  it('should clean malicious HTML', () => {
    const result = component.cleanContent('<script>alert("x")</script><b>ok</b>');
    expect(result).toBe('<b>ok</b>');
  });

  it('should sort therapies by createdAt date', fakeAsync(() => {
    tick();
    const therapies = component.therapies();
    expect(therapies[0].title).toBe('Terapia Individual');
    expect(therapies[1].title).toBe('Grupo de Madres');
  }));
});
