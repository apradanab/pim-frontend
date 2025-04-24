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
      expect(component.cleanContent('').toString()).toBe('');
      expect(component.cleanContent(null!).toString()).toBe('');
      expect(component.cleanContent(undefined!).toString()).toBe('');
    });

    it('should convert markdown-style to HTML', () => {
      const result = component.cleanContent('**bold**\nnewline').toString();
      expect(result).toContain('<b>bold</b>');
      expect(result).toContain('<br>');
    });

    it('should resist ReDoS attacks', () => {
      const attackString = '<!'.repeat(10000) + '>'; 
      const start = performance.now();
      component.cleanContent(attackString);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
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
