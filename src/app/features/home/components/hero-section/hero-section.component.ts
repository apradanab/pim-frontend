import { Component, signal } from '@angular/core';
import { IntroSliderComponent } from '../intro-slider/intro-slider.component';
import { FeatureBoxesComponent } from "../feature-boxes/feature-boxes.component";
import { TourVideoComponent } from "../tour-video/tour-video.component";
import { Slide } from '../../../../models/slide.model';

@Component({
  selector: 'pim-hero-section',
  standalone: true,
  imports: [
    IntroSliderComponent,
    FeatureBoxesComponent,
    TourVideoComponent
  ],
  template: `
  <div class="hero-section">
    <pim-intro-slider
      [indicatorsVisible]="true"
      [animationSpeed]="50"
      [slides]="slides()"
      [autoPlay]="true"
      [autoPlaySpeed]="6000"
    ></pim-intro-slider>

  <div class="bottom-container">
    <pim-feature-boxes></pim-feature-boxes>
    <pim-tour-video></pim-tour-video>
  </div>



  </div>
  `,
  styles: `
    .hero-section {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 8.4vw;
      gap: 20px;
      box-sizing: border-box;
      background-color: #fcfcf9;
    }

    .bottom-container {
      display: flex;
      gap: 20px;
    }

    pim-intro-slider {
      min-width: 0;
      flex: 5;
    }

    pim-feature-boxes {
      flex: 1.6;
    }

    pim-tour-video {
      min-width: 0;
      flex: 2.6;
    }

    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
      }

      .bottom-container {
        position: relative;
        right: 5px;
      }
      pim-intro-slider {

      }


      pim-feature-boxes {
        flex: 1;
      }

      pim-tour-video {
        flex: 1;
      }
    }

  `
})
export class HeroSectionComponent {
  slides = signal<Slide[]>([
    {
      title:'First slide',
      text:'Descubre nuestros servicios de terapia',
    },
    {
      title:'Second slide',
      text:'Métodos adaptados para cada etapa',
    },
    {
      title:'Third slide',
      text:'Un lugar donde expresar y compartir',
    },
  ]);
}
