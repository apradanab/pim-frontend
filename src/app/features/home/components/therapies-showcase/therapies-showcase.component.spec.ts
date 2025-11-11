import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TherapiesStateService } from '../../../../core/services/states/therapies.state.service';
import { TherapiesShowcaseComponent } from './therapies-showcase.component';
import { Therapy } from '../../../../models/therapy.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TherapiesShowcaseComponent', () => {
  let component: TherapiesShowcaseComponent;
  let fixture: ComponentFixture<TherapiesShowcaseComponent>;
  let mockTherapiesService: jasmine.SpyObj<TherapiesStateService>;
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
    mockTherapiesService = jasmine.createSpyObj('StateService', ['listTherapies'], {
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
        { provide: TherapiesStateService, useValue: mockTherapiesService },
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
    expect(mockTherapiesService.listTherapies).toHaveBeenCalled();
  });

  it('should have correct therapy tags', () => {
    expect(component.therapyTags.length).toBe(3);
    expect(component.therapyTags[1]).toContain('grupos abiertos');
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
