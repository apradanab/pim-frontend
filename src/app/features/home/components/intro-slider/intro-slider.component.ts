import { Component, input, signal, effect, inject } from '@angular/core';
import { Slide } from '../../../../models/slide.model';
import { ImageService } from '../../../../core/services/image.service';

@Component({
  selector: 'pim-intro-slider',
  standalone: true,
  imports: [],
  template: `
  <div class="slider-container">
    <div class="image-container">
      <img [src]="backgroundImage" width="613" height="460" class="background-image" alt="Niños alegres" fetchpriority="high">

      <div class="slides">
        @for (slide of slides(); track $index) {
          <div
            class="slide"
            [class.center]="$index === currentSlide()"
            [class.left-1]="$index === (currentSlide() + 1) % slides().length"
            [class.left-2]="$index === (currentSlide() + 2) % slides().length"
          >
            <div class="text-container">
              <h2>{{ slide.text }}</h2>
              <img [src]="logoInline" width="150" height="70" alt="Logo">
            </div>
          </div>
        }
      </div>

      @if (indicatorsVisible()) {
        <div id="indicators">
          @for (slide of slides(); track $index) {
            <button (click)="jumpToSlide($index)"
                    class="indicator"
                    [class.active]="$index === currentSlide()"
                    [attr.aria-label]="'Ir al slide ' + ($index + 1)">
            </button>
          }
        </div>
      }
    </div>
    <img [src]="triangle" width="200" height="200" class="overlay-image" alt="Triángulo" >
  </div>
  `,
  styles: `
  :host {
    display: block;
    width: 100%;
  }

  .slider-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 460px;
    position: relative;
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 32px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .background-image {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .slides {
    position: absolute;
    top: 78%;
    left: 70%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 140px;
  }

  .slide {
    position: absolute;
    transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
    opacity: 0;
  }

  .center {
    transform: scale(1) translateX(0);
    opacity: 1;
    z-index: 3;
  }

  .left-1 {
    transform: scale(0.75) translateX(-55px);
    opacity: 0.8;
    z-index: 2;
  }

  .left-2 {
    transform: scale(0.55) translateX(-135px);
    opacity: 0.6;
    z-index: 1;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: white;
    border-radius: 32px;
    width: 250px;
    height: 140px;
  }

  .text-container h2 {
    font-family: "Carlito", sans-serif;
    text-align: center;
  }

  .text-container img {
    width: 65px;
  }

  #indicators {
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 1;
    position: relative;
    top: 29%;
    left: 45%
  }

  .indicator {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
    display: inline-block;
    margin: 5px;
    cursor: pointer;
    transition: background-color 0.5s ease-in-out;
  }

  .indicator.active {
    background-color: #ffffff;
  }

  .overlay-image {
    position: absolute;
    width: 80px;
    height: 80px;
    top: -58px;
    left: 15px;
  }

  @media (max-width: 768px) {
    .slider-container {
      height: 300px;
      width: auto;
    }

    .background-image {
      width: 100%;
    }

    .slides {
      top: 75%;
      left: 70%;
    }

    .center {
      transform: scale(0.8) translateX(0);
    }

    .left-1 {
      transform: scale(0.6) translateX(-30px);
      right: 16%;
    }

    .left-2 {
      transform: scale(0.4) translateX(-110px);
      right: 18%;
    }

    #indicators {
      top: 23%
    }

    .indicator {
      width: 12px;
      height: 12px;
    }

    .overlay-image {
      width: 60px;
      height: 60px;
      top: -43px;
      left: 20px;
    }
  }
  `
})
export class IntroSliderComponent {
  slides = input<Slide[]>([]);
  indicatorsVisible = input(true);
  animationSpeed = input(800);
  autoPlay = input(true);
  autoPlaySpeed = input(3000);
  currentSlide = signal(0);
  hidden = signal(false);


  private readonly imageService = inject(ImageService);
  readonly backgroundImage = this.imageService.images.introSlider;
  readonly logoInline = this.imageService.icons.logoInline;
  readonly triangle = this.imageService.icons.triangle;

  constructor() {
    effect((onCleanup) => {

      if(!this.autoPlay()) return;
      const interval = setInterval(() => {
        this.next();
      }, this.autoPlaySpeed());

      onCleanup(() => {
        clearInterval(interval);
      });
    });
  }

  next() {
    const nextIndex = (this.currentSlide() + 1) % this.slides().length;
    this.jumpToSlide(nextIndex);
  }

  jumpToSlide(index: number) {
    if (index < 0 || index >= this.slides().length) return;
    this.hidden.set(true);
    setTimeout(() => {
      this.currentSlide.set(index);
      this.hidden.set(false);
    }, this.animationSpeed());
  }
}
