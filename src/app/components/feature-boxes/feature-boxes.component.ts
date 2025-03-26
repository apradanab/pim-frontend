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
          <img [src]="lydiaImage" alt="Psicóloga" />
        </div>

        <h2 class="text-left">Psicóloga</h2>
        <h3 class="text-right">Profesional</h3>
      </div>
    </div>

    <div class="bento-box bento-box-2">
      <h2>Todo niño merece crecer en un ambiente de apoyo</h2>
      <div class="icons-container">
        <img [src]="icons.doubleCircle" class="circle" alt="" />
        <img [src]="icons.star" class="star" alt="" />
        <img [src]="icons.flower" class="flower" alt="" />
        <img [src]="icons.heart" class="heart" alt="" />
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

  .bento-box-1 h2.text-left {

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
    bottom: 30px;
  }

  .icons-container {
    margin-top: 20px;
  }

  .icons-container img {
    object-fit: contain;
  }

  .circle {
    width: 25px;
    position: absolute;
    bottom: 50px;
    left: 70px;
  }

  .star {
    width: 21px;
    position: absolute;
    right: 140px;
    bottom: 30px;
  }

  .flower {
    width: 120px;
    position: absolute;
    right: 20px;
    bottom: 5px;
  }

  .heart {
    width: 30px;
    position: absolute;
    top: 25px;
    right: 30px;
    transform: rotate(-40deg)
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

    .circle {
      width: 18px;
      left: 50px;
    }

    .star {
      width: 15px;
      right: 100px;
    }

    .flower {
      width: 100px;
      right: 5px;
      bottom: 10px;
    }

    .heart {
      width: 22px;
      top: 20px;
      right: 20px;
    }
  }
  `
})
export class FeatureBoxesComponent {
  faLightbulb = faLightbulb;
  private cloudinary = inject(CloudinaryService);
  lydiaImage = this.cloudinary.getImage('v1742987718/pim-images/Lydia_o0fwbi.webp', 200);
  icons = {
    doubleCircle: this.cloudinary.getSvg('v1742987877/pim-images/purple-doble-circle_vgbgeq.svg'),
    star: this.cloudinary.getSvg('v1742987918/pim-images/purple-star_sztmgu.svg'),
    flower: this.cloudinary.getSvg('v1742987854/pim-images/mom-flower_hjh8tr.svg'),
    heart: this.cloudinary.getSvg('v1742987898/pim-images/purple-heart_s2odmn.svg')
  };
}
