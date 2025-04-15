import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ServiceStyle } from '../../models/service.model';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-services-showcase',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="services-showcase">
      <div class="header-section">
        <div class="title-section">
          <h2>Terapias que impulsan el cambio</h2>
          <img [src]="circleStar" width="200" height="200" class="icon" alt="icon">
        </div>
          <p class="description">Ofrecemos soluciones psicológicas centradas en el bienestar de los niños y la mejora de las relaciones familiares</p>
          <button class="cta-button">Saber más</button>
      </div>

      <div class="services-grid">
        @for (service of services; track service.id; let i = $index) {
          <div class="service-box" [style.background]="getServiceStyle(i).bgColor">
            <div class="service-header">
              <h3>{{ service.description }}</h3>
              <button class="service-button">
                <fa-icon [icon]="faArrowRight" />
              </button>
            </div>
            <div class="tags">
              @for (tag of getServiceStyle(i).tags; track tag; let tagIndex = $index) {
                <span class="tag tag-{{tagIndex + 1}} tag-pos-{{i}}-{{tagIndex}}">{{ tag }}</span>
              }
            </div>
            <img [src]="service.image"
                [alt]="service.title"
                loading="lazy"
                [class]="'service-image service-image-' + (i + 1)">
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .services-showcase {
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 0 8.4vw;
      background-color: #fcfcf9;
    }

    .header-section {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 3rem;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .title-section {
      position: relative;
    }

    .title-section h2 {
      font: 400 4rem/1 'Caprasimo', cursive;
      margin: 0;
      color: #2f2929;
      width: 650px;
    }

    .icon {
      position: absolute;
      width: 40px;
      height: 40px;
      right: 5px;
      bottom: 60px;
    }

    .description {
      font-size: 1.3rem;
      color: #555;
      margin: 0;
      max-width: 330px;
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
    }

    .cta-button:active {
      background: #e8512b;
      box-shadow: inset 0px 6px 2px #aa3e22;
    }

    .services-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      padding-bottom: 1rem;
    }

    .service-box {
      padding: 2rem 0.8rem 0.8rem 0.8rem;
      border-radius: 1.5rem;
      color: #2f2929;
      transition: transform 0.3s ease;
    }

    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .service-header h3 {
      font: 400 1.75rem/1.2 'Caprasimo', sans-serif;
      max-width: 270px;
      max-height: 100px;
    }

    .service-button {
      background: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      top: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .service-button fa-icon {
      color: black;
      font-size: 1.15rem;
    }

    .service-button fa-icon:hover {
      transition: transform 0.5s ease;
      transform: translateX(5px);
    }

    .tags {
      position: relative;
      z-index: 1;
    }

    .tag {
      position: absolute;
      font: 600 1.2rem/1 'Carlito', sans-serif;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
    }

    .tag-1 { background: #fcfcf9; }
    .tag-2 { background: #e0f15e; }
    .tag-3 { background: #b7a8ed; }
    .tag-pos-0-0 { top: 190px; left: 20px; }
    .tag-pos-0-1 { top: 240px; left: 140px; }
    .tag-pos-0-2 { top: 165px; left: 190px; }
    .tag-pos-1-0 { top: 80px; left: 20px; }
    .tag-pos-2-0 { top: 210px; left: 170px; }
    .tag-pos-2-1 { top: 160px; left: 40px; }

    .service-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .service-image-1 {
      border-radius: 9rem 2rem 1rem 1rem;
      clip-path: polygon(100% 5%, 94% 0, 10% 17%, 0% 23%, 0% 100%, 100% 100%);
    }

    .service-image-2 {
      border-radius: 1rem;
    }

    .service-image-3 {
      border-radius: 2rem 9rem 1rem 1rem;
      clip-path: polygon(0 5%, 6% 0, 90% 17%, 100% 23%, 100% 100%, 0 100%);
    }

    @media (max-width: 768px) {
      .services-showcase {
        padding: 0rem 1rem;
      }

      .header-section {
        position: relative;
        margin: 0;
        justify-content: flex-start;
        padding: 1rem;
      }

      .title-section h2 {
        font-size: 2.5rem;
        width: 400px;
      }

      .icon {
        width: 33px;
        right: -2px;
        bottom: 35px;
      }

      .description {
        font-size: 1.2rem;
        max-width: 280px;
      }

      .cta-button {
        font-size: 1rem;
        position: absolute;
        right: 30px;
        bottom: 45px;
      }

      .services-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        grid-template-columns: unset;
        scrollbar-width: none;
        gap: 1rem;

      }

      .services-grid::-webkit-scrollbar {
        display: none;
      }

      .service-box {
        flex: 0 0 85%;
        scroll-snap-align: start;
        max-width: 280px;
      }

      .service-header h3 {
        font-size: 1.4rem;
        max-width: 220px;
      }

      .service-button {
        width: 35px;
        height: 35px;
        top: 10px;
      }

      .service-button fa-icon {
        font-size: 0.9rem;
      }

      .tag {
        font-size: 0.85rem;
      }

      .tag-pos-0-0 { top: 160px; left: 15px; }
      .tag-pos-0-1 { top: 200px; left: 120px; }
      .tag-pos-0-2 { top: 125px; left: 120px; }
      .tag-pos-1-0 { top: 75px; left: 15px; }
      .tag-pos-2-0 { top: 180px; left: 130px; }
      .tag-pos-2-1 { top: 135px; left: 20px; }

      .service-image {
        height: 250px;
      }
    }
  `
})
export class ServicesShowcaseComponent implements OnInit {
  private readonly stateService = inject(StateService);

  readonly circleStar = inject(CloudinaryService).svg.circleStar;
  faArrowRight = faArrowRight;

  serviceStyles: ServiceStyle[] = [
    { bgColor: '#fea087', tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios'] },
    { bgColor: '#e0f15e', tags: ['grupos abiertos'] },
    { bgColor: '#b7a8ed', tags: ['personalizada' ,'apoyo educativo'] }
  ];

  get services() {
    return this.stateService.state$().services;
  }

  ngOnInit() {
    this.stateService.loadServices();
  }

  getServiceStyle(index: number): ServiceStyle {
    return this.serviceStyles[index % this.serviceStyles.length];
  }
}
