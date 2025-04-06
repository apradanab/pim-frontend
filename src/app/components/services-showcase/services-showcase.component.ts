import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { ServiceStyle } from '../../models/service.model';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-services-showcase',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="services-showcase">
      <div class="header-section">
        <div class="header-content">
          <h2>Terapias que impulsan el cambio</h2>
          <img [src]="circleStar" width="200" height="200" class="icon" alt="icon">
          <p class="description">Ofrecemos soluciones psicológicas centradas en el bienestar de los niños y la mejora de las relaciones familiares</p>
          <button class="cta-button">Saber más</button>
        </div>
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
              @for (tag of getServiceStyle(i).tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <img [src]="service.image" [alt]="service.title" loading="lazy">
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .services-showcase {
      padding: 2rem;
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 0 8.4vw;
      margin: 0 auto;
      background-color: #fcfcf9;
    }

    .header-section {
      display: flex;
      justify-content: center;
      margin-bottom: 3rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .header-content h2 {
      font: 400 4rem/1 'Caprasimo', cursive;
      margin: 0;
      color: #2f2929;
      width: 650px;
    }

    .icon {
      position: relative;
      width: 50px;
      height: 50px;
      right: 90px;
      top: -25px;
    }

    .description {
      font-size: 1.1rem;
      color: #555;
      margin: 0;
      max-width: 290px;
    }

    .cta-button {
      background: #f3552d;
      font-size: 1rem;
      color: white;
      border: none;
      padding: 20px 45px;
      border-radius: 30px;
      box-shadow: inset 0px -5px 2px #b64022;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: bold;
    }

    .services-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .service-box {
      padding: 1.2rem;
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
      font: 400 1.85rem/1.2 'Caprasimo', sans-serif;
      max-width: 265px;
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

    .service-button:hover {
      transform: translateX(3px);
    }

    .service-button fa-icon {
      color: black;
      font-size: 0.8rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .tag {
      background: rgba(255, 255, 255, 0.9);
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8rem;
    }

    img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 1rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .services-showcase {
        padding: 1rem;
      }
    }
  `
})
export class ServicesShowcaseComponent implements OnInit {
  private readonly stateService = inject(StateService);

  readonly circleStar = inject(CloudinaryService).svg('v1743950619/pim-images/star-circle_oa3bpf.svg');
  faArrowRight = faArrowRight;

  serviceStyles: ServiceStyle[] = [
    { bgColor: '#fea087', tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios'] },
    { bgColor: '#e0f15e', tags: ['Grupos abiertos'] },
    { bgColor: '#b7a8ed', tags: ['apoyo educativo', 'personalizada'] }
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
