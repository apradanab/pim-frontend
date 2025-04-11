import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-about-me',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="about-me-section" id="about-me">
      <div class="grid-background"></div>

      <div class="content">
        <img [src]="logoOrange" width="200" height="140" class="logo" alt="Logo" loading="eager">

        <h2 class="highlight-text">
          <span class="bold">+ 12 años</span> ayudando y acompañando a niños, jóvenes y familias
        </h2>

        <p>
          Soy <span class="bold">Lydia</span>, <span class="bold">psicóloga general sanitaria</span>, especializada en infancia y adolescencia.
          Me he formado en <span class="bold">SAAC</span> (Sistemas Aumentativos y Alternativos de la Comunicación) y tengo experiencia
          trabajando con niños y jóvenes con <span class="bold">trastornos del espectro autista y dificultades de aprendizaje</span>.
          Acompaño su desarrollo emocional a través de terapia asistida, trabajo en grupos de habilidades sociales y apoyo individualizado.
        </p>

        <p>
          También he dirigido <span class="bold">proyectos inclusivos</span> para asociaciones sin ánimo de lucro con niños de diversidad funcional.
          En los últimos años, he desarrollado un especial interés en la <span class="bold">psicología perinatal</span>, facilitando espacios de
          acompañamiento durante la maternidad y crianza.
        </p>

        <div class="motivational-quote">
          <fa-icon [icon]="faLeaf" class="icon"></fa-icon>
          <span>Sembrando semillas a lo largo del crecimiento para un desarrollo emocional equilibrado.</span>
        </div>
      </div>
    </div>
  `,
  styles: `
  .about-me-section {
    position: relative;
    text-align: center;
    padding: 100px 40px 0px 40px;
    background: #fcfcf9;
    display: flex;
    justify-content: center;
    font-family: 'Carlito', sans-serif;
  }

  .grid-background {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 83%;
    height: 420px;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 16) calc(100% / 6);
    border-top: 3px solid #f4f2ed;
    border-bottom: 3px solid #f4f2ed;
    border-left: 2px solid #f4f2ed;
    border-right: 2px solid #f4f2ed;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    z-index: 1;
  }

  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
    position: relative;
    bottom: 58px;
    background-color: #fcfcf9;
  }

  .highlight-text {
    font-size: 1.6rem;
    font-weight: bold;
    color: #9e9e9b;
    margin-bottom: 20px;
    position: relative;
    bottom: 80px;
  }

  .highlight-text .bold {
    color: black;
  }

  p {
    font-size: 1.4rem;
    font-weight: bold;
    color: #9e9e9b;
    line-height: 1.5;
    margin-bottom: 15px;
    text-align: justify;
    position: relative;
    bottom: 70px;
  }

  .bold {
    font-weight: bold;
    color: black;
  }

  .motivational-quote {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: bold;
    font-style: italic;
    color: #666;
    margin-top: 20px;
    position: relative;
    bottom: 90px;
    left: 250px;
  }

  .icon {
    font-size: 1.2rem;
    margin-right: 8px;
    color: #74A57F;
  }

  @media (max-width: 768px) {
    .about-me-section {
      padding: 60px 55px;
      height: 400px;
    }

    .grid-background {
      height: 350px;
      background-size: calc(100% / 10) calc(100% / 8);
      top: 40px;
    }

    .logo {
      width: 55px;
      height: 55px;
      margin-top: 20px;
    }

    .content {
      max-width: 500px;
    }

    .highlight-text {
      font-size: 0.95rem;
      margin-top: 5px;
    }

    p {
      font-size: 0.8rem;
    }

    .motivational-quote {
      font-size: 0.8rem;
      left: 0px;
    }
  }
  `
})
export class AboutMeComponent {
  readonly logoOrange = inject(CloudinaryService).svg.orangeLogo;
  faLeaf = faLeaf;
}
