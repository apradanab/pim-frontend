import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;
  let fixture: ComponentFixture<ServicesTabsComponent>;

  const mockStateService = {
    state$: () => ({
      services: [
        {
          id: '1',
          title: 'Terapia 1',
          description: 'Descripción 1',
          content: 'Texto<b>importante</b><br>con salto'
        },
        {
          id: '2',
          title: 'Terapia 2',
          description: 'Descripción 2',
          content: 'Contenido'
        }
      ]
    }),
    loadServices: jasmine.createSpy('loadServices')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [
        { provide: StateService, useValue: mockStateService }
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

  describe('cleanContent', () => {
    it('should allow only <br> and <b> tags', () => {
      const content = 'Texto<b>negrita</b><br>salto';
      const result = component.cleanContent(content);
      expect(result).toBe(content);
    });

    it('should remove all other HTML tags but keep their content', () => {
      const content = '<p>Hola</p><script>alert()</script><i>itálica</i><b>negrita</b>';
      const result = component.cleanContent(content);
      expect(result).toBe('Holaalert()itálica<b>negrita</b>');
    });

    it('should handle empty/null/undefined content', () => {
      expect(component.cleanContent('')).toBe('');
      expect(component.cleanContent(null!)).toBe('');
      expect(component.cleanContent(undefined!)).toBe('');
    });

    it('should keep plain text unchanged', () => {
      const content = 'Texto sin formato';
      const result = component.cleanContent(content);
      expect(result).toBe(content);
    });
  });

  it('should render service information correctly', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('.tab-button');

    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toContain('Terapia 1');
    expect(buttons[1].textContent).toContain('Terapia 2');
  });
});
