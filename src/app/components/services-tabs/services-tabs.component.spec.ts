import { TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;
  let sanitizer: DomSanitizer;

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
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cleanContent()', () => {
    it('should handle empty content', () => {
      spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
      component.cleanContent('');
      expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
    });

    it('should clean content with allowed tags', () => {
      const result = component.cleanContent('<b style="color:red">test</b><br>');
      expect(result.toString()).toContain('SafeValue');
      expect(result.toString()).toContain('test');
    });

    it('should remove dangerous tags', () => {
      const result = component.cleanContent('<script>alert()</script><b>test</b>');
      expect(result.toString()).not.toContain('script');
      expect(result.toString()).toContain('test');
    });
  });

  it('should handle tabs', () => {
    component.setActiveTab(0);
    expect(component.activeTab()).toBe(0);
    expect(component.getServiceStyle(0)).toBeTruthy();
  });
});
