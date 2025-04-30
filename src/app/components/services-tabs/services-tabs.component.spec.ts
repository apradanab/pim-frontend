import { TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [{
        provide: StateService,
        useValue: {
          state$: () => ({ services: [{ id: '1', title: 'Test', content: '' }] }),
          loadServices: jasmine.createSpy()
        }
      }]
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

  it('should handle tabs', () => {
    component.setActiveTab(0);
    expect(component.activeTab()).toBe(0);
  });

  it('should return service style', () => {
    expect(component.getServiceStyle(0)).toEqual({ bgColor: '#fea087' });
  });
});
