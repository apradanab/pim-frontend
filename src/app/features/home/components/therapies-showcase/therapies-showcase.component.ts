import { Component, effect, inject, signal } from '@angular/core';
import { StateService } from '../../../../core/services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { TherapyStyle } from '../../../../models/therapy.model';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pim-therapies-showcase',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="therapies-showcase">
      <div class="header-section">
        <div class="title-section">
          <h2>Terapias que impulsan el cambio</h2>
          <img [src]="circleStar" width="200" height="200" class="icon" alt="icon">
        </div>
          <p class="description">Ofrecemos soluciones psicológicas centradas en el bienestar de los niños y la mejora de las relaciones familiares</p>
          <button class="cta-button"
                  (click)="navigateToTherapies()"
                  (keyup.enter)="navigateToTherapies()"
                  tabindex="0"
                  >Saber más
          </button>
      </div>

      <div class="therapies-grid">
        @for (therapy of therapies(); track therapy.therapyId; let i = $index) {
          <div class="therapy-box" [style.background]="getTherapyStyle(i).bgColor">
            <div class="therapy-header">
              <h3>{{ therapy.description }}</h3>
              <button class="therapy-button"
                      (click)="navigateToTherapyByIndex($index)"
                      (keyup.enter)="navigateToTherapyByIndex($index)">
                <fa-icon [icon]="faChevron" />
              </button>
            </div>
            <div class="tags">
              @for (tag of getTherapyStyle(i).tags; track tag; let tagIndex = $index) {
                <span class="tag tag-{{tagIndex + 1}} tag-pos-{{i}}-{{tagIndex}}">{{ tag }}</span>
              }
            </div>
            <img [src]="therapy.image?.url"
                [alt]="therapy.title"
                loading="lazy"
                [class]="'therapy-image therapy-image-' + (i + 1)">
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .therapies-showcase {
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 1.5rem 8.4vw;
      background-color: #fcfcf9;
    }

    .header-section {
      display: flex;
      justify-content: center;
      margin-bottom: 3rem;
      align-items: flex-end;
      gap: 1.5rem;
    }

    .title-section {
      position: relative;
    }

    .title-section h2 {
      font: 400 3.5rem/1 'Caprasimo', cursive;
      margin: 0;
      color: #2f2929;
      width: 600px;
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
      color: #9e9e9b;
      margin: 0;
      max-width: 330px;
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
    }

    .cta-button:active {
      background: #e8512b;
      box-shadow: inset 0px 6px 2px #aa3e22;
    }

    .therapies-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      padding-bottom: 1rem;
    }

    .therapy-box {
      padding: 2rem 0.8rem 0.8rem 0.8rem;
      border-radius: 1.5rem;
      color: #2f2929;
      transition: transform 0.3s ease;
    }

    .therapy-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .therapy-header h3 {
      font: 400 1.75rem/1.2 'Caprasimo', sans-serif;
      max-width: 270px;
      max-height: 100px;
    }

    .therapy-button {
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

    .therapy-button fa-icon {
      color: black;
      font-size: 1.15rem;
    }

    .therapy-button fa-icon:hover {
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

    .therapy-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .therapy-image-1 {
      border-radius: 9rem 2rem 1rem 1rem;
      clip-path: polygon(100% 5%, 94% 0, 10% 17%, 0% 23%, 0% 100%, 100% 100%);
      object-position: top;
    }

    .therapy-image-2 {
      border-radius: 1rem;
      object-position: 100% 43%;
    }

    .therapy-image-3 {
      border-radius: 2rem 9rem 1rem 1rem;
      clip-path: polygon(0 5%, 6% 0, 90% 17%, 100% 23%, 100% 100%, 0 100%);
    }

    @media (max-width: 768px) {
      .therapies-showcase {
        padding: 0;
        overflow: hidden;
      }

      .header-section {
        position: relative;
        flex-direction: column;
        align-items: flex-start;
        padding: 0.2rem 8.4vw 1rem 8.4vw;
        margin: 0rem 1rem;
        gap: 1rem;
      }

      .title-section h2 {
        font-size: 2.5rem;
        width: 400px;
      }

      .icon {
        width: 35px;
        right: -10px;
        bottom: 40px;
      }

      .description {
        font-size: 0.9rem;
        max-width: 240px;
      }

      .cta-button {
        font-size: 1rem;
        position: absolute;
        right: 48px;
        bottom: 18px;
        padding: 18px 50px;
      }

      .therapies-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 1rem;
        padding: 1rem 8.4vw;
      }

      .therapies-grid::-webkit-scrollbar {
        display: none;
      }

      .therapy-box {
        flex: 0 0 85%;
        max-width: 280px;
      }

      .therapy-header h3 {
        font-size: 1.4rem;
        max-width: 220px;
      }

      .therapy-button {
        width: 35px;
        height: 35px;
        top: 10px;
      }

      .therapy-button fa-icon {
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

      .therapy-image {
        height: 250px;
      }
    }
  `
})
export class TherapiesShowcaseComponent {
  private readonly stateService = inject(StateService);
  private readonly router = inject(Router);

  readonly circleStar = inject(CloudinaryService).svg.circleStar;
  faChevron = faChevronRight;

  therapyStyles: TherapyStyle[] = [
    { bgColor: '#fea087', tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios'] },
    { bgColor: '#e0f15e', tags: ['grupos abiertos'] },
    { bgColor: '#b7a8ed', tags: ['personalizada' ,'apoyo educativo'] }
  ];

  therapies = signal(this.stateService.state$.therapies.list);

  constructor() {
    this.stateService.loadTherapies();

    effect(() => {
      const list = this.stateService.state$.therapies.list;
      this.therapies.set(list);
    }, { allowSignalWrites: true });
  }

  getTherapyStyle(index: number): TherapyStyle {
    return this.therapyStyles[index % this.therapyStyles.length];
  }

  navigateToTherapies() {
    this.router.navigate(['/terapias/terapia-individual'])
  }

  navigateToTherapyByIndex(index: number) {
    const routes = ['terapia-individual', 'grupo-de-madres', 'terapia-pedagogica'];
    this.router.navigate(['/terapias', routes[index]]);
  }
}
