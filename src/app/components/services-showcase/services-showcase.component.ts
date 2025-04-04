import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { ServiceStyle } from '../../models/service.model';

@Component({
  selector: 'pim-services-showcase',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="services-showcase">
      <div class="header">
        <h2>Terapias que impulsan el cambio</h2>
        <fa-icon [icon]="iconHeart"></fa-icon>
      </div>

      <div class="services-grid">
        @for (service of stateService.services(); track service.id; let i = $index) {
          <div class="service-box" [style.background]="serviceStyles[i % 3].bgColor">
            <h3>{{ service.title }}</h3>
            <div class="tags">
              @for (tag of serviceStyles[i % 3].tags; track tag) {
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

      .header {
        text-align: center;
        margin-bottom: 2rem;

        h2 {
          font: 400 3rem/1 'Caprasimo', cursive;
          margin-bottom: 1rem;
        }

        fa-icon {
          color: #74A57F;
          font-size: 2.5rem;
        }
      }

      .services-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }

      .service-box {
        padding: 1.5rem;
        border-radius: 1.5rem;
        color: #2f2929;

        h3 {
          font: 400 1.8rem/1.2 'Caprasimo', sans-serif;
          margin-bottom: 1rem;
        }

        .tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;

          .tag {
            background: #fcfcf9;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
          }
        }

        img {
          width: 100%;
          height: auto;
          border-radius: 1rem;
        }
      }
    }
  `
})
export class ServicesShowcaseComponent implements OnInit{
  stateService = inject(StateService);
  iconHeart = faHandHoldingHeart;

  serviceStyles: ServiceStyle[] = [
    { bgColor: '#fea087', tags: ['3-20 años', 'Consulta horarios'] },
    { bgColor: '#e0f15e', tags: ['Grupos abiertos'] },
    { bgColor: '#b7a8ed', tags: ['Apoyo educativo'] }
  ];

  ngOnInit() {
    this.stateService.loadServices();
  }
}
