import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-feature-boxes',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  template: `
  <div class="feature-boxes-container">
    <div class="bento-box bento-box-1">
      <div class="icon-and-admin">
        <button
          class="icon-button"
          [routerLink]="['/home']"
          fragment="about-me"
          aria-label="Más información">
          <fa-icon [icon]="faLightbulb" class="icon"></fa-icon>
        </button>

        <div class="admin-image">
          <img [src]="lydiaImg" width="894" height="984" alt="Psicóloga Lydia" loading="eager" decoding="async" />
        </div>

        <h2 class="text-left">Psicóloga</h2>
        <h3 class="text-right">Profesional</h3>
      </div>
    </div>

    <div class="bento-box bento-box-2">
      <h2>Todo niño merece crecer en un ambiente de apoyo</h2>
      <div class="icons-container">
        @for (icon of icons; track icon.name) {
          <img [src]="icon.src" [class]="icon.class" [alt]="icon.alt" width="500" height="500" loading="lazy"/>
        }
      </div>
    </div>
  </div>
  `,
  styles: `
  .feature-boxes-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .bento-box {
    border-radius: 32px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    width: 268px;
  }

  .bento-box-1 {
    background-color: #E0F15E;
    height: 199px;
    position: relative;
  }

  .bento-box-1 h2 {
    font-family: 'Carlito', sans-serif;
    font-size: 2.2rem;
    font-weight: bold;
    color: black;
    margin: 0;
    position: absolute;
    bottom: 58px;
    left: 20px;
  }

  .bento-box-1 h3 {
    font-family: 'Carlito', sans-serif;
    font-size: 2.2rem;
    font-weight: bold;
    color: black;
    margin: 0;
    position: absolute;
    bottom: 30px;
    right: 20px;
    line-height: 0.8;
  }

  .icon-button {
    background-color: #F3552D;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 60px;
    cursor: pointer;
    transform: rotate(-20deg);
    transition: transform 0.3s ease;
  }

  .icon-button:hover {
    transform: rotate(30deg);
  }

  .icon {
    color: white;
    font-size: 20px;
  }

  .admin-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    bottom: 100px;
    left: 40px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .admin-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transform: scale(1.25);
  }

  .bento-box-2 {
    background-color: #B7A8ED;
    height: 243px;
  }

  .bento-box-2 h2 {
    font-family: 'Carlito', sans-serif;
    font-size: 2.1rem;
    font-weight: bold;
    color: black;
    line-height: 0.8;
    position: relative;
    bottom: 35px;
  }

  .icons-container {
    position: relative;

    img {
      position: absolute;

      &.circle {
        width: 25px;
        left: -70px;
        bottom: -250px;
      }

      &.star {
        width: 21px;
        right: 3px;
        bottom: -280px;
      }

      &.flower {
        width: 120px;
        height: 120px;
        left: 2px;
        bottom: -60px;
      }

      &.heart {
        width: 30px;
        top: -380px;
        right: -100px;
        transform: rotate(-30deg)
      }
    }
  }
  @media (max-width: 768px) {
    .feature-boxes-container {
      width: auto;
      align-items: start;
    }

    .bento-box {
      width: 200px;
      box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    }

    .bento-box-1 {
      height: 150px
    }

    .admin-image {
      width: 65px;
      height: 65px;
      bottom: 70px;
      left: 30px;
    }

    .bento-box-1 h2 {
      font-size: 1.6rem;
      bottom: 38px;
      left: 15px;
    }

    .bento-box-1 h3 {
      font-size: 1.6rem;
      bottom: 18px;
      right: 15px;
    }

    .icon-button {
      width: 35px;
      height: 35px;
      right: 40px;
      bottom: 45px;
    }

    .bento-box-2 {
      height: 200px
    }

    .bento-box-2 h2 {
      font-size: 1.53rem;
    }

    .icons-container {
      img {
        &.circle {
          width: 18px;
          left: -50px;
        }

        &.star {
          width: 15px;
          right: 0px;
        }

        &.flower {
          width: 100px;
          height: 100px;
          left: -5px;
          bottom: -50px;
        }

        &.heart {
          width: 22px;
          top: -355px;
          right: -80px;
        }
      }
    }
  }
  `
})
export class FeatureBoxesComponent {
  private cloudinary = inject(CloudinaryService);

  lydiaImg = this.cloudinary.image('v1742987718/pim-images/Lydia_o0fwbi.webp');

  icons = [
    {
      src: this.cloudinary.svg('v1742987877/pim-images/purple-doble-circle_vgbgeq.svg'),
      class: 'circle',
      alt: 'Doble círculo',
      name: 'doubleCircle'
    },
    {
      src: this.cloudinary.svg('v1742987918/pim-images/purple-star_sztmgu.svg'),
      class: 'star',
      alt: 'Estrella',
      name: 'star'
    },
    {
      src: this.cloudinary.svg('v1742987854/pim-images/mom-flower_hjh8tr.svg'),
      class: 'flower',
      alt: 'Estrella',
      name: 'flower'
    },
    {
      src: this.cloudinary.svg('v1742987898/pim-images/purple-heart_s2odmn.svg'),
      class:  'heart',
      alt: 'Corazón',
      name: 'heart'
    },
  ]

  faLightbulb = faLightbulb;
}
