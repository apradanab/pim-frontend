import { Component, inject, signal, effect } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { ActivatedRoute, Router } from '@angular/router';
import { Advice } from '../../../models/advice.model';
import { CommonModule } from '@angular/common';
import { Therapy } from '../../../models/therapy.model';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';

@Component({
  selector: 'pim-therapies-tabs',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  template: `
    <div class="therapies-tabs">
      <div class="grid-background"></div>

      <div class="tabs-header">
        @for (therapy of therapies(); track therapy.therapyId; let i = $index) {
          <button class="tab-button"
                  [class.active]="activeTab() === i"
                  (click)="navigateToTab(i)"
                  [style.background]="activeTab() === i ? therapy.bgColor : '#ebece9'"
                  [style.color]="activeTab() === i ? 'white' : '#2f2929'">
            {{ therapy.title }}
            <span class="icon-circle" [style.background]="activeTab() === i ? 'rgba(255,255,255,0.3)' : 'white'">
              <fa-icon [icon]="faChevron"
                      [class.rotated]="activeTab() === i"
                      [style.color]="activeTab() === i ? 'white' : 'black'"/>
            </span>
          </button>
        }
      </div>

      <div class="tab-content-wrapper" [style.border-top-color]="getActiveTabBgColor()">
        <div class="tab-content">
          @if (therapies()[activeTab()]) {
            <div class="therapy-detail">
              <h3>{{ therapies()[activeTab()].title }}</h3>
              <p class="description">{{ therapies()[activeTab()].description }}</p>
              <div class="image-container">
                <img [src]="therapies()[activeTab()].image?.url" alt="imagen" loading="lazy" class="therapy-image">
              </div>
              <div class="content" [innerHTML]="cleanContent(therapies()[activeTab()].content)"></div>
            </div>
          }
        </div>
        <div class="tab-footer" [style.background]="getActiveTabBgColor()">

            <h4>Consejos relacionados</h4>
            @for (advice of relatedAdvices(); track advice.adviceId) {
              <button class="advice-button"
                      [style.background]="getActiveTabBgColor()"
                      (click)="navigateToAdvice(advice.adviceId)">
                    {{ advice.title }}
              </button>
            }

        </div>
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
      padding: 4rem;
      background: white;
      position: relative;
      z-index: 1;
      animation: fadeIn 0.5s ease;
    }

    .tab-footer {
      height: 100px;
      border-radius: 0 0 1rem 1rem;
    }

    .therapy-detail h3 {
      font-size: 3rem;
      font-weight: 500;
      color: #2f2929;
      margin-bottom: 1.2rem;
      margin-top: 4.5rem;
      font-family: 'Caprasimo', cursive;
    }

    .description {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 1.8rem;
      line-height: 1.5;
    }

    .image-container {
      position: absolute;
      right: 70px;
      top: 40px;
    }

    .therapy-image {
      max-height: 200px;
      width: 550px;
      border-radius: 12px;
      object-fit: cover;
      object-position: 100% 25%;
    }

    .content {
      line-height: 1.6;
      color: #555;
    }

    .advice-button {
      padding: 0.8rem 1.5rem;
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

      .therapy-image {
        max-height: 80px;
        max-width: 430px;
        position: relative;
        top: -25px;
        right: -50px;
      }

      .tab-content {
        padding: 1.5rem;
      }

      .therapy-detail h3 {
        font-size: 2.5rem;
        margin-top: 5rem;
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
  private readonly therapiesService = inject(TherapiesStateService);
  private readonly advicesService = inject(AdvicesStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  faChevron = faChevronUp;
  activeTab = signal(0);
  relatedAdvices = signal<Advice[]>([]);
  therapies = signal<Therapy[]>([]);

  private readonly therapyRoutes = ['terapia-individual', 'grupo-de-madres', 'terapia-pedagogica'];

  constructor() {
    this.therapiesService.listTherapies();
    this.advicesService.listAdvices();

    this.route.paramMap.subscribe(params => {
      const therapyType = params.get('therapyType');
      const tabIndex = this.therapyRoutes.findIndex(route => route === therapyType);

      if (tabIndex > -1) {
        this.activeTab.set(tabIndex);
        this.loadRelatedAdvices(tabIndex);
      }
    });

    effect(() => {
      const list = [...this.therapiesService.therapiesState().list];
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.therapies.set(list);
    }, { allowSignalWrites: true });

    effect(() => {
      this.relatedAdvices.set(this.advicesService.advicesState().filtered ?? []);
    }, { allowSignalWrites: true });
  }

  private loadRelatedAdvices(tabIndex: number) {
    const therapy = this.therapies()[tabIndex];
    if (!therapy?.therapyId) return;

    this.advicesService.listAdvicesByTherapy(therapy.therapyId);
  }

  navigateToTab(index: number) {
    this.activeTab.set(index);
    this.router.navigate(['/terapias', this.therapyRoutes[index]]);
  }

  navigateToAdvice(adviceId: string) {
    this.router.navigate(['/consejos', adviceId]);
  }

  cleanContent(content: string) {
    return DOMPurify.sanitize(content || '', {
      ALLOWED_TAGS: ['b', 'br'],
      ALLOWED_ATTR: []
    });
  }

  getActiveTabBgColor(): string {
    const therapy = this.therapies()[this.activeTab()];
    return therapy?.bgColor || '#ccc'
  }
}
