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
          state$: () => ({
            services: [
              {
                id: '1',
                title: 'Test',
                content: '<b style="color:red">content</b><br><script>alert()</script>'
              }
            ]
          }),
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
    it('should return empty string when content is empty', () => {
      const result = component.cleanContent('');
      const expected = sanitizer.bypassSecurityTrustHtml('');
      expect(result.toString()).toEqual(expected.toString());
    });

    it('should keep allowed tags', () => {
      const input = '<b>test</b><br>';
      const result = component.cleanContent(input);
      const expected = sanitizer.bypassSecurityTrustHtml('<b>test</b><br>');
      expect(result.toString()).toEqual(expected.toString());
    });

    it('should remove dangerous tags and attributes', () => {
      const input = '<script>alert()</script><b style="danger">test</b>';
      const result = component.cleanContent(input);
      const cleanedString = result.toString();
      expect(cleanedString).toContain('<b>test</b>');
      expect(cleanedString).not.toContain('<script>');
      expect(cleanedString).not.toContain('style="danger"');
    });
  });

  it('should change active tab', () => {
    component.setActiveTab(0);
    expect(component.activeTab()).toBe(0);
  });

  it('should return correct style for index within bounds', () => {
    const style = component.getServiceStyle(0);
    expect(style).toEqual({ bgColor: '#fea087' });
  });
});
