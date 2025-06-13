import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesListComponent } from './advices-list.component';
import { StateService } from '../../../core/services/state.service';

describe('AdvicesListComponent', () => {
  let component: AdvicesListComponent;
  let fixture: ComponentFixture<AdvicesListComponent>;
  let mockStateService: jasmine.SpyObj<StateService>;

  const mockAdvices = [
    {
      id: '1',
      title: 'Consejo 1',
      description: 'Descripción 1',
      content: '<p>Contenido 1</p>',
      image: 'image1.jpg',
      serviceId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Consejo 2',
      description: 'Descripción 2',
      content: '<p>Contenido 2</p>',
      image: 'image2.jpg',
      serviceId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['loadAllAdvices'], {
      state$: {
        advices: {
          list: mockAdvices
        }
      }
    });

    await TestBed.configureTestingModule({
      imports: [AdvicesListComponent],
      providers: [
        { provide: StateService, useValue: mockStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdvicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with advices from state service', () => {
    expect(component.advices()).toEqual(mockAdvices);
  });

  it('should call loadAllAdvices on init', () => {
    expect(mockStateService.loadAllAdvices).toHaveBeenCalled();
  });

  describe('toggleCard', () => {
    it('should expand card when clicked', () => {
      component.toggleCard('1');
      expect(component.expandedCard()).toBe('1');
    });

    it('should collapse card when clicked twice', () => {
      component.toggleCard('1');
      component.toggleCard('1');
      expect(component.expandedCard()).toBeNull();
    });
  });

  it('should collapse expanded card', () => {
    component.expandedCard.set('1');
    const mockEvent = { stopPropagation: jasmine.createSpy() } as unknown as Event;

    component.closeCard(mockEvent);

    expect(component.expandedCard()).toBeNull();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  describe('cleanContent', () => {
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

  it('should render advice cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.advice-card');
    expect(cards.length).toBe(mockAdvices.length);
  });

  it('should show expanded content when card is clicked', () => {
    const card = fixture.nativeElement.querySelector('.advice-card');
    card.click();
    fixture.detectChanges();

    const expandedContent = fixture.nativeElement.querySelector('.expanded-content');
    expect(expandedContent).toBeTruthy();
  });
});
