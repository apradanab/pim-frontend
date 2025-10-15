import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TherapiesShowcaseComponent } from './therapies-showcase.component';
import { StateService } from '../../../../core/services/state.service';
import { Therapy } from '../../../../models/therapy.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TherapiesShowcaseComponent', () => {
  let component: TherapiesShowcaseComponent;
  let fixture: ComponentFixture<TherapiesShowcaseComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockTherapies: Therapy[] = [
    {
      therapyId: '1',
      title: 'Terapia antigua',
      description: 'Descripción 1',
      content: 'Contenido 1',
      maxParticipants: 1,
      image: {
      key: 'therapy1-key',
      url: 'image1.jpg'
    },
    createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
      therapyId: '2',
      title: 'Terapia reciente',
      description: 'Descripción 2',
      content: 'Contenido 2',
      maxParticipants: 1,
      image: {
        key: 'therapy2-key',
        url: 'image2.jpg'
      },
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['loadTherapies'], {
      state$: {
        therapies: {
          list: mockTherapies
        }
      },
      therapiesState: jasmine.createSpy().and.returnValue({
        list: mockTherapies,
        current: null,
        error: null
      })
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TherapiesShowcaseComponent, FontAwesomeModule],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withFetch()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TherapiesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadTherapies on init', () => {
    expect(mockStateService.loadTherapies).toHaveBeenCalled();
  });

  it('should have correct therapy styles', () => {
    expect(component.therapyStyles.length).toBe(3);
    expect(component.therapyStyles[0].bgColor).toBe('#fea087');
    expect(component.therapyStyles[1].tags).toContain('grupos abiertos');
  });

  it('should apply correct styles based on index', () => {
    const style1 = component.getTherapyStyle(0);
    const style2 = component.getTherapyStyle(1);
    const style3 = component.getTherapyStyle(2);
    const style4 = component.getTherapyStyle(3);

    expect(style1.bgColor).toBe('#fea087');
    expect(style2.bgColor).toBe('#e0f15e');
    expect(style3.bgColor).toBe('#b7a8ed');
    expect(style4.bgColor).toBe('#fea087');
  });

  it('should sort therapies by createdAt date', fakeAsync(() => {
    fixture.detectChanges();
    tick(0);

    const therapies = component.therapies();
    expect(therapies[0].title).toBe('Terapia antigua');
    expect(therapies[1].title).toBe('Terapia reciente');
  }));

  it('should navigate to terapia-individual', () => {
    component.navigateToTherapies();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/terapias/terapia-individual']);
  });

  it('should navigate to correct therapy by index', () => {
    component.navigateToTherapyByIndex(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/terapias', 'terapia-individual']);

    component.navigateToTherapyByIndex(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/terapias', 'grupo-de-madres']);

    component.navigateToTherapyByIndex(2);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/terapias', 'terapia-pedagogica']);
  });
});
