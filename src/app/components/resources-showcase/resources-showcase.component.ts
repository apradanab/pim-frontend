import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-resources-showcase',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="resources-showcase">
      <div class="info-section">
        <h2 class="title">Explora nuestros consejos profesionales</h2>
        <p class="description">
          Encuentra material especializado que ofrecemos en la web, para abordar temas clave del desarrollo emocional y familiar.
        </p>
        <button class="cta-button">Ver todos</button>
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
            <div class="support-icons">
              <img [src]="iconShapes" alt="Support icon" class="support-icon">
            </div>
            <p class="support-text">Hemos acompañado a una amplia variedad de casos con éxito</p>
          </div>

          <div class="bento-square growth-box">
            <h4 class="growth-title">Crecemos juntos</h4>
            <div class="growth-icons">
              <img [src]="iconTriangle" alt="Growth icon" class="growth-icon1">
              <img [src]="together" alt="Growth icon" class="growth-icon2">
            </div>
            <p class="growth-text">Celebramos cada avance hacia una mejor salud emocional</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .resources-showcase {
      display: flex;
      padding: 4rem 8.4vw;
      gap: 2rem;
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
      font-size: 1.2rem;
      color: #555;
      margin: 0;
      max-width: 300px;
    }

    .cta-button {
      background: #f3552d;
      font-size: 1.15rem;
      color: white;
      border: none;
      padding: 20px 45px;
      border-radius: 30px;
      box-shadow: inset 0px -5px 2px #b64022;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: bold;
      align-self: flex-start;
    }

    .cta-button:active {
      background: #e8512b;
      box-shadow: inset 0px 6px 2px #aa3e22;
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

    .support-icons {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin: 1rem 0;
    }

    .support-icon {
      position: absolute;
      width: 200px;
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
      width: 60px;
      position: relative;
      top: 15px;
    }

    .growth-icon2 {
      width: 150px;
      position: relative;
      bottom: -25px;
      left: 60px;
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
      .resources-showcase {
        flex-direction: column;
        padding: 2rem 1rem;
      }

      .bento-rectangle {
        height: 200px;
      }

      .content-overlay {
        padding: 1rem;
      }

      .bento-row {
        flex-direction: column;
        height: auto;
      }

      .bento-square {
        height: 150px;
      }

      .support-box,
      .growth-box {
        flex: 1 1 100%;
        height: auto;
        min-height: 180px;
      }

    }
  `
})
export class ResourcesShowcaseComponent {
  private readonly cloudinary = inject(CloudinaryService);
  readonly backgroundImage = this.cloudinary.image('v1744292048/pim-images/image1_rlpbxb.webp');
  readonly iconShapes = this.cloudinary.svg('v1744294373/pim-images/icon-shapes_x3tykr.svg');
  readonly iconTriangle = this.cloudinary.svg('v1744294371/pim-images/icon-triangle_ggdxxr.svg');
  readonly together = this.cloudinary.svg('v1744294373/pim-images/together_d4gwhr.svg');
}
