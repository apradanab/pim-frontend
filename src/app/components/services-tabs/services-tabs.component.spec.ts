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
          state$: () => ({
            services: [
              { id: '1', title: 'Test', content: '<b>content</b>' },
              { id: '2', title: 'Empty', content: '' }
            ]
          }),
          loadServices: jasmine.createSpy()
        }
      }]
    });

    component = TestBed.createComponent(ServicesTabsComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cleanContent()', () => {
    it('should handle empty content', () => {
      expect(component.cleanContent('')).toBe('');
      expect(component.cleanContent(null!)).toBe('');
      expect(component.cleanContent(undefined!)).toBe('');
    });

    it('should clean non-empty content', () => {
      expect(component.cleanContent('<b>text</b><script>')).toBe('<b>text</b>');
    });
  });

  it('should change tab', () => {
    component.setActiveTab(0);
    expect(component.activeTab()).toBe(0);
  });

  it('should return correct service style', () => {
    expect(component.getServiceStyle(0)).toEqual({ bgColor: '#fea087' });
    expect(component.getServiceStyle(3)).toEqual({ bgColor: '#fea087' });
  });
});
