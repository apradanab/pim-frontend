import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { ImageService } from '../../../../core/services/utils/image.service';

@Component({
  selector: 'pim-advices-showcase',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="advices-showcase">
      <div class="info-section">
        <h2 class="title">Explora nuestros consejos profesionales</h2>
        <p class="description">
          Encuentra material especializado que ofrecemos en la web, para abordar temas clave del desarrollo emocional y familiar.
        </p>
        <button class="cta-button"
                (click)="navigateToAdvices()"
                (keyup.enter)="navigateToAdvices()"
                tabindex="0"
                >Ver todos
        </button>
      </div>

      <div class="bento-section">
        <div class="bento-rectangle">
          <img [src]="backgroundImage" alt="Imagen de fondo" class="background-img">
          <div class="content-overlay">
            <div class="content">
              <h3>Apoyo a tu alcance</h3>
              <p>Accede a materiales prácticos para acompañar el desarrollo emocional de tu familia</p>
            </div>
          </div>
        </div>

        <div class="bento-row">
          <div class="bento-square support-box">
            <h4 class="support-title">Soporte integral</h4>

              <img [src]="iconShapes" width="200" height="176" alt="Support icon" class="support-icon">

            <p class="support-text">Hemos acompañado a una amplia variedad de casos con éxito</p>
          </div>

          <div class="bento-square growth-box">
            <h4 class="growth-title">Crecemos juntos</h4>
            <div class="growth-icons">
              <img [src]="iconTriangle" width="150" height="164" alt="Growth icon" class="growth-icon1">
              <img [src]="together" width="200" height="160" alt="Growth icon" class="growth-icon2">
            </div>
            <p class="growth-text">Celebramos cada avance hacia una mejor salud emocional</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .advices-showcase {
      display: flex;
      padding: 4rem 8.4vw 2.5rem;
      background-color: #fcfcf9;
      font-family: 'Carlito', sans-serif;
    }

    .info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 1.5rem;
      padding: 1rem;
      max-width: 600px;
    }

    .title {
      font: 400 3.5rem/1 'Caprasimo', cursive;
      color: #2f2929;
      margin: 0;
    }

    .description {
      font-size: 1.3rem;
      color: #9e9e9b;
      max-width: 360px;
    }

    .cta-button {
      background: #f3552d;
      font-size: 1.15rem;
      color: white;
      border: none;
      padding: 20px 70px;
      border-radius: 30px;
      box-shadow: inset 0px -5px 2px #b64022;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;
    }

    .cta-button:active {
      background: #e8512b;
      box-shadow: inset 0px 3px 2px #aa3e22;
      transform: translateY(2px);
    }

    .bento-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bento-rectangle {
      position: relative;
      overflow: hidden;
      border-radius: 1.5rem;
      height: 280px;
    }

    .background-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .content-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 2rem;
    }

    .content {
      padding: 1.5rem;
      border-radius: 1rem;
      width: 100%;
      max-width: 600px;
    }

    .bento-rectangle h3 {
      font: 400 1.8rem/1.2 'Caprasimo', cursive;
      color: #fcfcf9;
      max-width: 250px;
    }

    .bento-rectangle p {
      font-size: 1rem;
      color: #fcfcf9;
      margin: 0;
      max-width: 350px;
    }

    .bento-row {
      display: flex;
      gap: 1rem;
      height: 240px;
    }

    .support-box {
      flex: 3.5;
      background-color: #e0f15e;
      position: relative;
    }

    .growth-box {
      flex: 4;
      background-color: #b7a8ed;
      position: relative;
    }

    .bento-square {
      border-radius: 1.5rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .bento-square h4 {
      font: 400 1.7rem/1 'Caprasimo', cursive;
      z-index: 1;
    }

    .support-title {
      text-align: right;
      align-self: flex-end;
      max-width: 200px;
    }

    .growth-title {
      text-align: left;
      align-self: flex-start;
      max-width: 200px;
    }

    .support-icon {
      position: absolute;
      width: 220px;
      bottom: 30px;
      left: 25px;
    }

    .support-text {
      position: absolute;
      bottom: 30px;
      font-size: 1rem;
      color: #2f2929;
      text-align: left;
    }

    .growth-icons {
      position: absolute;
    }

    .growth-icon1 {
      width: 75px;
      height: 75px;
      position: relative;
      top: -25px;
    }

    .growth-icon2 {
      width: 150px;
      position: relative;
      bottom: -5px;
      left: 40px;
    }

    .growth-text {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.95rem;
      font-style: italic;
      color: #2f2929;
      width: 80%;
      text-align: right;
    }

    @media (max-width: 768px) {
      .advices-showcase {
        flex-direction: column;
        padding: 1.5rem 8.4vw 1rem 8.4vw;
        gap: 1rem;
      }

      .info-section {
        position: relative;
        padding: 0rem 1rem;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .title {
        font-size: 2.3rem;
      }

      .description {
        font-size: 0.88rem;
        max-width: 240px;
      }

      .cta-button {
        font-size: 1rem;
        position: absolute;
        right: 18px;
        padding: 18px 50px;
      }

      .bento-rectangle {
        height: 200px;
      }

      .support-box {
        flex: 3;
        min-height: 180px;
      }

      .growth-box {
        flex: 4;
        min-height: 180px;
      }

      .content-overlay {
        padding: 1rem;
      }

      .bento-row {
        height: auto;
      }

      .bento-square {
        height: 150px;
      }

      .support-icon {
        width: 180px;
        top: 0px;
        left: 5px;
      }

      .growth-icon1 {
        width: 50px;
        height: 50px;
        top: 5px;
      }

      .growth-icon2 {
        width: 120px;
        height: 100px;
        bottom: 0px;
        left: 35px;
      }

      .support-text {
        bottom: 20px;
      }

      .growth-text {
        bottom: 20px;
      }
    }
  `
})
export class AdvicesShowcaseComponent {
  private readonly router = inject(Router);
  private readonly imageService = inject(ImageService);

  readonly backgroundImage = this.imageService.images.backgroundAdvices;
  readonly iconShapes = this.imageService.icons.shapes;
  readonly iconTriangle = this.imageService.icons.iconTriangle;
  readonly together = this.imageService.icons.together;

  navigateToAdvices() {
    this.router.navigate(['/consejos'])
  }
}
