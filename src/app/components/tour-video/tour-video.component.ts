import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-tour-video',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="tour-video-container">

      <div class="video-wrapper">
        <video
          class="video"
          [src]="cloudinary.local.tourVideo"
          autoplay
          loop
          [muted]="true"
          [playsInline]="true"
        ></video>
      </div>

      <div class="info-box">
        <div class="info-text">
          <p>Calle París, 1</p>
          <p>Montcada, Barcelona, 08110</p>
          <h3>Conoce nuestro centro</h3>
        </div>
        <button class="round-button" aria-label="Más información">
          <fa-icon [icon]="faArrowRight" class="icon"></fa-icon>
        </button>
      </div>
      <img [src]="starFlower" width="200" height="200" alt="overlay-image" class="overlay-image" />
    </div>


  `,
  styles: `
    .tour-video-container {
      position: relative;
      width: 327px;
      height: 459px;
      border-radius: 30px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .video-wrapper {
      width: 100%;
      height: 100%;
    }

    .video {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 30px;
      object-fit: cover;
    }

    .info-box {
      font-family: "Carlito", sans-serif;
      position: absolute;
      bottom: 20px;
      border-radius: 32px;
      background-color: white;
      display: flex;
      align-items: center;
      padding: 15px;
    }

    .info-text {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-text p {
      font-size: 1.15rem;
      line-height: 0.9;
      color: black;
    }

    .info-text h3 {
      margin: 5px 0 0;
      font-size: 1.5rem;
      color: black;
    }

    .round-button {
      background-color: #DBE87C;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      right: -5px;
    }

    .icon {
      color: black;
      font-size: 1rem;
    }

    .round-button:hover .icon {
      transition: transform 0.5s ease;
      transform: translateX(3px);
    }

    .overlay-image {
      position: absolute;
      top: -25px;
      right: -35px;
      width: 90px;
      height: 90px;
      transform: rotate(25deg);
    }
    @media (max-width: 768px) {
      .tour-video-container {
        height: 365px;
        width: 220px;
      }

      .info-box {
        bottom: 10px;
      }

      .info-text p {
        font-size: 0.8rem;
        line-height: 0.5;
      }

      .info-text h3 {
        font-size: 1rem;
      }

      .round-button {
        width: 25px;
        height: 25px;
      }

      .overlay-image {
        top: -20px;
        right: -25px;
        width: 65px;
        height: 65px;
      }
    }
  `
})
export class TourVideoComponent {
  cloudinary = inject(CloudinaryService);
  starFlower = this.cloudinary.svg.starFlower;
  faArrowRight = faArrowRight;
}
