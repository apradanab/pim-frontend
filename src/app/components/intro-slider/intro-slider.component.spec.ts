import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { IntroSliderComponent } from './intro-slider.component';
import { Slide } from '../../models/slide.model';

interface MutableIntroSliderComponent {
  slides: WritableSignal<Slide[]>;
  animationSpeed: WritableSignal<number>;
  autoPlay: WritableSignal<boolean>;
  autoPlaySpeed: WritableSignal<number>;
  currentSlide: WritableSignal<number>;
  hidden: WritableSignal<boolean>;
  jumpToSlide: (index: number) => void;
  next: () => void;
  ngOnInit: () => void;
}

describe('IntroSliderComponent', () => {
  let component: MutableIntroSliderComponent;
  let fixture: ComponentFixture<IntroSliderComponent>;

  const mockSlides: Slide[] = [
    { title: 'First slide', text: 'Slide 1 text' },
    { title: 'Second slide', text: 'Slide 2 text' },
    { title: 'Third slide', text: 'Slide 3 text' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroSliderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroSliderComponent);
    component = fixture.componentInstance as unknown as MutableIntroSliderComponent;

    component.slides = signal(mockSlides);
    component.animationSpeed = signal(50);
    component.autoPlay = signal(false);
    component.autoPlaySpeed = signal(3000);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the first slide', () => {
    expect(component.currentSlide()).toBe(0);
  });

  it('should jump to a specific slide', fakeAsync(() => {
    component.jumpToSlide(2);
    expect(component.hidden()).toBeTrue();
    tick(component.animationSpeed());
    expect(component.currentSlide()).toBe(2);
    expect(component.hidden()).toBeFalse();
  }));

  it('should move to the next slide', fakeAsync(() => {
    component.next();
    tick(component.animationSpeed());
    expect(component.currentSlide()).toBe(1);
  }));

  it('should loop back to the first slide after the last slide', fakeAsync(() => {
    component.currentSlide.set(mockSlides.length - 1);
    component.next();
    tick(component.animationSpeed());
    expect(component.currentSlide()).toBe(0);
  }));

  it('should autoPlay slides when enabled', fakeAsync(() => {
    component.autoPlay.set(true);
    component.autoPlaySpeed.set(1000);
    component.ngOnInit();

    expect(component.autoPlay()).toBeTrue();

    tick(500);

    tick(1000);
    fixture.detectChanges();
    expect(component.currentSlide()).toBe(1);

    tick(1000);
    fixture.detectChanges();
    expect(component.currentSlide()).toBe(2);

    tick(1000);
    fixture.detectChanges();
    expect(component.currentSlide()).toBe(0);

    discardPeriodicTasks();
  }));

  it('should not change slide when given an out-of-bounds index (negative)', fakeAsync(() => {
    component.jumpToSlide(-1);
    tick(component.animationSpeed());
    expect(component.currentSlide()).toBe(0);
  }));

  it('should not change slide when given an out-of-bounds index (too large)', fakeAsync(() => {
    component.jumpToSlide(component.slides().length);
    tick(component.animationSpeed());
    expect(component.currentSlide()).toBe(0);
  }));
});
