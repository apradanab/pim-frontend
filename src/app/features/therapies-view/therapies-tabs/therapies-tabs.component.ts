import { Component, inject, signal, effect } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'pim-therapies-tabs',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="therapies-tabs">
      <div class="grid-background"></div>

      <div class="tabs-header">
        @for (therapy of therapies(); track therapy.id; let i = $index) {
          <button class="tab-button"
                  [class.active]="activeTab() === i"
                  (click)="navigateToTab(i)"
                  [style.background]="activeTab() === i ? getTherapyStyle(i).bgColor : '#ebece9'"
                  [style.color]="activeTab() === i ? 'white' : '#2f2929'">
            {{ therapy.title }}
            <span class="icon-circle" [style.background]="activeTab() === i ? 'rgba(255,255,255,0.3)' : 'white'">
              <fa-icon [icon]="faArrowDown"
                      [class.rotated]="activeTab() === i"
                      [style.color]="activeTab() === i ? 'white' : 'black'"/>
            </span>
          </button>
        }
      </div>

      <div class="tab-content-wrapper" [style.border-top-color]="getTherapyStyle(activeTab()).bgColor">
        <div class="tab-content">
          @if (therapies()[activeTab()]) {
            <div class="therapy-detail">
              <h3>{{ therapies()[activeTab()].title }}</h3>
              <p class="description">{{ therapies()[activeTab()].description }}</p>
              <div class="content" [innerHTML]="cleanContent(therapies()[activeTab()].content)"></div>
            </div>
          }
        </div>
        <div class="tab-footer" [style.background]="getTherapyStyle(activeTab()).bgColor"></div>
      </div>
    </div>
  `,
  styles: `
    .therapies-tabs {
      position: relative;
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 2rem 8.4vw;
      padding-top: 65px;
      background-color: #fcfcf9;
    }

    .grid-background {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 83%;
      height: 165px;
      background-image:
        repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
        repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
      background-size: calc(100% / 16) calc(100% / 3);
      border: 2px solid #f4f2ed;
      border-top: none;
      z-index: 0;
      opacity: 0.8;
    }

    .tabs-header {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0;
      position: relative;
      top: -10px;
    }

    .tab-button {
      border: none;
      border-radius: 1.5rem 1.5rem 0 0;
      padding: 1rem 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      transition: all 0.3s ease;
      font-family: 'Carlito', sans-serif;
      font-size: 1.25rem;
      cursor: pointer;
      position: relative;
      background: #ebece9;

      &.active {
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1;
        transform: translateY(-2px);
      }
    }

    .icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transition: all 0.3s ease;

      fa-icon {
        font-size: 12px;
        transition: all 0.3s ease;
      }
    }

    .tab-button.active .icon-circle fa-icon {
      transform: rotate(180deg);
    }

    .tab-content-wrapper {
      position: relative;
      margin-top: -1rem;
      border-top: 4px solid;
      z-index: 1;
      box-shadow:
        8px 0 15px -10px rgba(0,0,0,0.2),
        -8px 0 15px -10px rgba(0,0,0,0.2);
    }

    .tab-content {
      padding: 2rem;
      background: white;
      position: relative;
      z-index: 1;
      animation: fadeIn 0.5s ease;
    }

    .tab-footer {
      height: 10px;
      border-radius: 0 0 1rem 1rem;
    }

    .therapy-detail h3 {
      font-size: 3rem;
      font-weight: 500;
      color: #2f2929;
      margin-bottom: 1.2rem;
      font-family: 'Caprasimo', cursive;
    }

    .description {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 1.8rem;
      line-height: 1.5;
    }

    .content {
      line-height: 1.6;
      color: #555;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .therapies-tabs {
        padding-top: 120px;
        padding-bottom: 1rem;
      }

      .grid-background {
        height: 150px;
        top: 85px;
        background-size: calc(100% / 10) calc(100% / 4);
      }

      .tabs-header {
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .tab-button {
        padding: 0.8rem 0.7rem;
        font-size: 1rem;
        width: 145px;
        top: 13px;
        gap: 0.3rem;
      }

      .tab-content {
        padding: 1.5rem;
      }

      .therapy-detail h3 {
        font-size: 2.5rem;
      }

      .icon-circle {
        width: 25px;
        height: 22px;

        fa-icon {
          font-size: 10px;
        }
      }
    }
  `
})
export class TherapiesTabsComponent {
  private readonly stateService = inject(StateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  faArrowDown = faArrowDown;
  activeTab = signal(0);

  therapiesConfig = [
    {
      route: 'terapia-individual',
      style: { bgColor: '#fea087', tags: ['de 3 a 20 años', 'pide cita', 'consulta horarios'] }
    },
    {
      route: 'grupo-de-madres',
      style: { bgColor: '#e0f15e', tags: ['grupos abiertos'] }
    },
    {
      route: 'terapia-pedagogica',
      style: { bgColor: '#b7a8ed', tags: ['personalizada', 'apoyo educativo'] }
    }
  ];

  therapies = signal(this.stateService.state$.therapies.list);

  constructor() {
    this.stateService.loadTherapies();

    this.route.paramMap.subscribe(params => {
      const therapyType = params.get('therapyType');
      const tabIndex = this.therapiesConfig.findIndex(config => config.route === therapyType);
      if (tabIndex > -1) {
        this.activeTab.set(tabIndex);
      }
    });

    effect(() => {
      const list = this.stateService.state$.therapies.list;
      this.therapies.set(list);
    }, { allowSignalWrites: true });
  }

  navigateToTab(index: number) {
    this.activeTab.set(index);
    this.router.navigate(['/servicios', this.therapiesConfig[index].route]);
  }

  cleanContent(content: string) {
    return DOMPurify.sanitize(content || '', {
      ALLOWED_TAGS: ['b', 'br'],
      ALLOWED_ATTR: []
    });
  }

  getTherapyStyle(index: number) {
    return this.therapiesConfig[index]?.style || this.therapiesConfig[0].style;
  }
}
