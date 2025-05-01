import { TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [
        {
          provide: StateService,
          useValue: {
            state$: () => ({
              services: [{ id: '1', title: 'Test', content: '' }]
            }),
            loadServices: jasmine.createSpy()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'terapia-individual' })
          }
        },
        { provide: Router, useValue: mockRouter }
      ]
    });

    component = TestBed.createComponent(ServicesTabsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load services on init', () => {
    const stateService = TestBed.inject(StateService);
    component.ngOnInit();
    expect(stateService.loadServices).toHaveBeenCalled();
  });

  describe('cleanContent()', () => {
    it('should handle empty content', () => {
      expect(component.cleanContent('')).toBe('');
    });

    it('should keep allowed tags', () => {
      expect(component.cleanContent('<b>test</b>')).toBe('<b>test</b>');
    });

    it('should remove dangerous tags', () => {
      expect(component.cleanContent('<script>alert(1)</script>')).toBe('');
    });
  });

  it('should navigate when changing tabs', () => {
    component.navigateToTab(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/servicios', 'terapia-individual']);
    expect(component.activeTab()).toBe(0);
  });

  it('should return default style for invalid index', () => {
    expect(component.getServiceStyle(100)).toEqual({
      bgColor: '#fea087',
      tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios']
    });
  });
});
