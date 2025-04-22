import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;
  let fixture: ComponentFixture<ServicesTabsComponent>;

  const mockStateService = {
    state$: () => ({
      services: [
        {
          id: '1',
          title: 'Terapia Individual',
          description: 'Descripción de prueba',
          content: 'Contenido<br>con saltos'
        },
        {
          id: '2',
          title: 'Terapia Grupal',
          description: 'Otra descripción',
          content: 'Más<br>contenido'
        }
      ]
    }),
    loadServices: jasmine.createSpy('loadServices')
  };

  const mockSanitizer = {
    bypassSecurityTrustHtml: jasmine.createSpy('bypassSecurityTrustHtml').and.callFake((val) => val)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: DomSanitizer, useValue: mockSanitizer }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with services', () => {
    expect(component.services.length).toBe(2);
    expect(mockStateService.loadServices).toHaveBeenCalled();
  });

  it('should change active tab', () => {
    component.setActiveTab(1);
    expect(component.activeTab()).toBe(1);
  });

  it('should sanitize content safely', () => {
    const testContent = 'safe<br>content';
    const result = component.cleanContent(testContent);
    expect(result).toBe(testContent);
    expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(testContent);
  });

  it('should render service information correctly', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.tab-button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Terapia Individual');
    expect(buttons[1].textContent).toContain('Terapia Grupal');

    expect(compiled.querySelector('h3').textContent).toContain('Terapia Individual');
    expect(compiled.querySelector('.description').textContent).toContain('Descripción de prueba');
  });

  it('should handle empty content safely', () => {
    const emptyContent = '';
    const result = component.cleanContent(emptyContent);
    expect(result).toBe('');
    expect(mockSanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('');
  });
});
