import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdvicesListComponent } from './advices-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';

describe('AdvicesListComponent', () => {
  let component: AdvicesListComponent;
  let fixture: ComponentFixture<AdvicesListComponent>;
  let mockStateService: jasmine.SpyObj<AdvicesStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockAdvices = [
    {
      adviceId: '1',
      therapyId: '1',
      title: 'Consejo 1',
      description: 'Descripción 1',
      content: '<p>Contenido 1</p>',
      image: {
        key: 'image1-key',
        url: 'image1.jpg'
      },
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('AdvicesStateService', ['listAdvices'], {
      advicesState: jasmine.createSpy().and.returnValue({
        list: mockAdvices,
        filtered: [],
        current: null,
        error: null
      })
    });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AdvicesListComponent],
      providers: [
        { provide: AdvicesStateService, useValue: mockStateService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} }, params: of({}) } },
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
    expect(mockStateService.listAdvices).toHaveBeenCalled();
  });

  it('should expand and collapse card', () => {
    component.toggleCard('1');
    expect(component.expandedCard()).toBe('1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos', '1']);

    component.toggleCard('1');
    expect(component.expandedCard()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos']);
  });

  it('should handle route params with adviceId', () => {
    const mockActivatedRoute = TestBed.inject(ActivatedRoute);
    Object.defineProperty(mockActivatedRoute, 'snapshot', {
      get: () => ({ params: { adviceId: '1' } })
    });

    fixture = TestBed.createComponent(AdvicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.expandedCard()).toBe('1');
  });

  it('should clean content', () => {
    expect(component.cleanContent('<script>alert(1)</script>')).toBe('');
  });

  it('should clean content when input is undefined or empty', () => {
    expect(component.cleanContent('')).toBe('');
    expect(component.cleanContent(undefined as unknown as string)).toBe('');
  });

  it('should close card with event stop propagation', () => {
    const mockEvent = { stopPropagation: jasmine.createSpy() } as unknown as Event;
    component.expandedCard.set('1');

    component.closeCard(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.expandedCard()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/consejos']);
  });

  it('should scroll to expanded card when element exists', fakeAsync(() => {
    const mockElement = document.createElement('div');
    const scrollSpy = spyOn(mockElement, 'scrollIntoView');
    spyOn(document, 'querySelector').and.returnValue(mockElement);

    component['scrollToExpandedCard']();
    tick(100);

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'nearest' });
  }));
});
