import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesTabsComponent } from './services-tabs.component';
import { StateService } from '../../services/state.service';

describe('ServicesTabsComponent', () => {
  let component: ServicesTabsComponent;
  let fixture: ComponentFixture<ServicesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesTabsComponent],
      providers: [
        {
          provide: StateService,
          useValue: {
            state$: () => ({ services: [{ id: '1', title: 'Test', description: '', content: '' }]}),
            loadServices: jasmine.createSpy('loadServices')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sanitize content correctly', () => {
    expect(component.cleanContent('<b>safe</b><script>bad</script>'))
      .toBe('<b>safe</b>bad');
    expect(component.cleanContent('<b onclick="alert()">test</b>'))
      .toBe('<b>test</b>');
  });

  it('should change active tab', () => {
    component.setActiveTab(0);
    expect(component.activeTab()).toBe(0);
  });
});
