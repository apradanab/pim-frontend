import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdviceCardComponent } from "../advice-card/advice-card.component";
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pim-advices-list',
  standalone: true,
  imports: [AdviceCardComponent],
  template: `
    <div class="advices-container">
      <div class="grid-background"></div>

      @if (selectedAdvice(); as advice) {
        <div class="featured-slot">
          <pim-advice-card
            [advice]="advice"
            [therapyTitle]="getTherapyTitle(advice.therapyId)"
            [isExpanded]="true"
            (toggleAdvice)="handleCardAction($event)"/>
        </div>
      }

      <div class="advices-grid">
        @for (advice of advices(); track advice.adviceId) {
          @if (expandedCardId() !== advice.adviceId) {
            <pim-advice-card
              [advice]="advice"
              (toggleAdvice)="handleCardAction($event)"/>
          }
        }
      </div>

    </div>
  `,
  styles: `
  .advices-container {
      position: relative;
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 8rem 8.4vw 2rem;
      background-color: #fcfcf9;
    }

    .grid-background {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      width: 83%;
      height: 105px;
      background-image:
        repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
        repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
      background-size: calc(100% / 16) calc(100% / 2);
      background-color: white;
      border: 2px solid #f4f2ed;
      border-top: none;
      z-index: 0;
    }

    .featured-slot {
      margin-bottom: 4rem;
      animation: slideDown 0.5s ease-out;
    }

    .advices-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .advices-container {
        padding: 12rem 8.4vw 1rem;
      }

      .grid-background {
        top: 90px;
        height: 80px;
        background-size: calc(100% / 10) calc(100% / 2);
      }

      .advices-grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    `
})
export class AdvicesListComponent implements OnInit {
  private readonly advicesService = inject(AdvicesStateService);
  private readonly therapiesService = inject(TherapiesStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private routeParams = toSignal(this.route.params);

  expandedCardId = computed(() => this.routeParams()?.['adviceId'] || null);

  advices = computed(() => this.advicesService.advicesState().list);
  therapies = computed(() => this.therapiesService.therapiesState().list);

  selectedAdvice = computed(() =>
    this.advices().find(a => a.adviceId === this.expandedCardId())
  );

  selectedTherapyTitle = computed(() => {
    const advice = this.selectedAdvice();
    if (!advice) return null;

    const therapy = this.therapies().find(t => t.therapyId === advice.therapyId);
    return therapy ? therapy.title : null;
  })

  constructor() {
    effect(() => {
      if (this.expandedCardId()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  ngOnInit() {
    this.advicesService.listAdvices();
    this.therapiesService.listTherapies();
  }

  getTherapyTitle(therapyId: string) {
    return this.therapies().find(t => t.therapyId === therapyId)?.title || null;
  }

  handleCardAction(adviceId: string) {
    const isClosing = this.expandedCardId() === adviceId;
    this.router.navigate(isClosing ? ['/consejos'] : ['/consejos', adviceId]);
  }
}
