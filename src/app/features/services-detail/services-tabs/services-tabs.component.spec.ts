import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../../core/services/state.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { ParamMap } from '@angular/router';

describe('ServicesTabsComponent (effect-based)', () => {
  let fixture: ComponentFixture<ServicesTabsComponent>;
  let component: ServicesTabsComponent;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStateService: jasmine.SpyObj<StateService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockStateService = jasmine.createSpyObj<StateService>('StateService', ['loadServices']);

    Object.defineProperty(mockStateService, 'state$', {
      get: () => ({
        services: {
          list: [
            { id: '1', title: 'Terapia Individual', content: '' },
            { id: '2', title: 'Grupo de Madres', content: '' }
          ]
        }
      }),
      configurable: true
    });

    TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StateService, useValue: mockStateService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(
              convertToParamMap({ serviceType: 'grupo-de-madres' }) as ParamMap
            )
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ServicesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadServices on effect init', () => {
    expect(mockStateService.loadServices).toHaveBeenCalled();
  });

  it('should activate tab based on paramMap', fakeAsync(() => {
    tick();
    expect(component.activeTab()).toBe(1);
  }));

  it('should navigate to correct tab', () => {
    component.navigateToTab(0);
    expect(component.activeTab()).toBe(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/servicios', 'terapia-individual']);
  });

  describe('cleanContent()', () => {
    it('should return empty string for empty content', () => {
      expect(component.cleanContent('')).toBe('');
    });

    it('should allow <b> tags', () => {
      expect(component.cleanContent('<b>hola</b>')).toBe('<b>hola</b>');
    });

    it('should remove <script> tags', () => {
      expect(component.cleanContent('<script>alert(1)</script>')).toBe('');
    });
  });

  it('should return default style if index is out of bounds', () => {
    expect(component.getServiceStyle(100)).toEqual({
      bgColor: '#fea087',
      tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios']
    });
  });
});
