import { Component, input, output, inject } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-grid-section',
  standalone: true,
  imports: [],
  template: `
    <section class="grid-section">
      <div class="grid-background"></div>

      <div class="content">
        <img
          [src]="logoColor() === 'purple' ? cloudinary.svg.purpleLogo : cloudinary.svg.greenLogo"
          width="200"
          height="138"
          class="logo"
          alt="Logo"
          loading="eager"
        >

        <h2 class="title">{{ sectionTitle() }}</h2>

        @if(showDecorations()) {
          <div class="decorations">
            @for(decoration of decorations(); track decoration.alt) {
              <img
                [src]="decoration.src"
                [class]="decoration.class"
                [alt]="decoration.alt"
                width="200"
                height="200"
                loading="lazy"
              >
            }
          </div>
        }

        @if(showButton()) {
          <button class="cta-button" (click)="buttonAction.emit()">
            {{ buttonText() }}
          </button>
        }
      </div>
    </section>
  `,
  styles: `
    .grid-section {
    position: relative;
    text-align: center;
    padding: 4rem 8.4vw 8rem 8.4vw;
    background: #fcfcf9;
    display: flex;
    justify-content: center;
    font-family: 'Carlito', sans-serif;
    overflow: hidden;
  }

  .grid-background {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    width: 83%;
    height: 280px;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 16) calc(100% / 4);
    border: 2px solid #f4f2ed;
    z-index: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    z-index: 1;
    gap: 2rem;
    width: 100%;
  }

  .logo {
    background-color: #fcfcf9;
    width: 80px;
    height: 80px;
    position: absolute;
    top: -12px;
  }

  .title {
    font: 400 3.5rem / 1 'Caprasimo', cursive;
    color: #2f2929;
    width: 600px;
  }

  .decorations {
    position: relative;
  }

  .purple-circle {
    width: 45px;
    height: 45px;
    position: absolute;
    bottom: -20px;
    right: 480px;
  }

  .purple-star {
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 125px;
    right: 330px;
  }

  .orange-square {
    width: 35px;
    height: 35px;
    position: absolute;
    bottom: 70px;
    left: 315px;
  }

  .green-circle {
    width: 45px;
    height: 45px;
    position: absolute;
    bottom: -75px;
    left: 475px;
  }

  .cta-button {
    background: #f3552d;
    font-size: 1.15rem;
    color: white;
    border: none;
    padding: 20px 50px;
    border-radius: 30px;
    box-shadow: inset 0px -5px 2px #b64022;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Carlito', sans-serif;
    position: absolute;
    bottom: 65px;
  }

  .cta-button:active {
    background: #e8512b;
    box-shadow: inset 0px 6px 2px #aa3e22;
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    .grid-section {
      padding: 60px 20px;
    }

    .grid-background {
      height: 160px;
      background-size: calc(100% / 10) calc(100% / 4);
    }

    .logo {
      width: 55px;
      height: 55px;
      top: 0px;
    }

    .title {
      font-size: 2rem;
      width: 300px;
    }

    .cta-button {
      font-size: 1rem;
      padding: 12px 30px;
      bottom: 40px;
    }

    .purple-circle {
      width: 25px;
      height: 25px;
      bottom: 15px;
      right: 180px;
    }

    .purple-star {
      width: 20px;
      height: 20px;
      bottom: 95px;
      right: 150px;
    }

    .orange-square {
      width: 20px;
      height: 20px;
      bottom: 65px;
      left: 155px;
    }

    .green-circle {
      width: 25px;
      height: 25px;
      bottom: -15px;
      left: 180px;
    }
  }
  `
})
export class GridSectionComponent {
  readonly cloudinary = inject(CloudinaryService);

  sectionTitle = input<string>('');
  logoColor = input<'purple' | 'green'>('purple');
  showButton = input(false);
  buttonText = input('Pide información');
  showDecorations = input(false);

  buttonAction = output<void>();

  decorations = input([
    { src: this.cloudinary.svg.purpleCircle, class: 'purple-circle', alt: 'Círculo morado' },
    { src: this.cloudinary.svg.purpleStar2, class: 'purple-star', alt: 'Estrella morada' },
    { src: this.cloudinary.svg.orangeSquare, class: 'orange-square', alt: 'Cuadrado naranja' },
    { src: this.cloudinary.svg.greenCircle, class: 'green-circle', alt: 'Círculo verde' }
  ]);
}
