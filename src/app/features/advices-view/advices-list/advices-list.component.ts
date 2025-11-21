import { Component, effect, inject, signal } from '@angular/core';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pim-advices-list',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
        <div class="advices-container">
      <div class="grid-background"></div>

      <div class="header-section">
        <h2>Recursos y consejos profesionales</h2>
        <p>Material especializado para abordar temas clave del desarrollo emocional y familiar</p>
      </div>

      <div class="advices-grid">
        @for (advice of advices(); track advice.adviceId; let i = $index) {
          <div class="advice-card"
              [class.expanded]="expandedCard() === advice.adviceId"
              (click)="toggleCard(advice.adviceId)"
              (keyup.enter)="toggleCard(advice.adviceId)"
              tabindex="0">
            <div class="card-content">
              <img [src]="advice.image.url" alt="{{advice.title}}" class="card-image">
              <h3>{{ advice.title }}</h3>
              <p class="description">{{ advice.description }}</p>

              @if (expandedCard() === advice.adviceId) {
                <div class="expanded-content" [innerHTML]="cleanContent(advice.content)"></div>
                <button class="close-btn" (click)="closeCard($event)">
                  <fa-icon [icon]="faArrowRight" [class.rotated]="true"></fa-icon>
                </button>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
  .advices-container {
      position: relative;
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 4rem 8.4vw;
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
      background-color: white;
      border: 2px solid #f4f2ed;
      border-top: none;
      z-index: 0;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      z-index: 1;
    }

    .header-section h2 {
      font: 400 3.5rem/1 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 1rem;
      position: relative;
      bottom: 30px;
    }

    .header-section p {
      font-size: 1.2rem;
      color: #9e9e9b;
      max-width: 650px;
      margin: 0 auto;
      position: relative;
      bottom: 20px;
    }

    .advices-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      position: relative;
      z-index: 1;
    }

    .advice-card {
      background: white;
      border-radius: 1.5rem;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .advice-card.expanded {
      grid-column: span 3;
      position: relative;
      z-index: 2;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 1rem;
      margin-bottom: 1rem;
    }

    .advice-card h3 {
      font: 400 1.8rem/1.2 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 1rem;
      color: #9e9e9b;
      margin-bottom: 1rem;
    }

    .expanded-content {
      padding: 1rem 0;
      line-height: 1.6;
      color: #555;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .close-btn fa-icon {
      color: #2f2929;
      transition: transform 0.3s ease;
    }

    .close-btn fa-icon.rotated {
      transform: rotate(90deg);
    }

    @media (max-width: 768px) {
      .advices-container {
        padding: 2rem 8.4vw;
      }

      .header-section h2 {
        font-size: 2.5rem;
      }

      .header-section p {
        font-size: 1rem;
      }

      .advices-grid {
        grid-template-columns: 1fr;
      }

      .advice-card.expanded {
        grid-column: span 1;
      }

      .grid-background {
        height: 120px;
        background-size: calc(100% / 10) calc(100% / 4);
      }
    }
    `
})
export class AdvicesListComponent {
  private readonly stateService = inject(AdvicesStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  faArrowRight = faArrowRight;
  expandedCard = signal<string | null>(null);
  advices = signal(this.stateService.advicesState().list);

  constructor() {
    this.stateService.listAdvices();

    effect(() => {
      const params = this.route.snapshot.params;
      const adviceId = params['adviceId'];
      if (adviceId) {
        this.expandedCard.set(adviceId);
        this.scrollToExpandedCard();
      }
    }, { allowSignalWrites: true });

    effect(() => {
      const list = this.stateService.advicesState().list;
      this.advices.set(list);
    }, { allowSignalWrites: true });
  }

  toggleCard(id: string) {
    if(this.expandedCard() === id) {
      this.expandedCard.set(null);
      this.router.navigate(['/consejos']);
    } else {
      this.expandedCard.set(id);
      this.router.navigate(['/consejos', id]);
    }
  }

  closeCard(event: Event) {
    event.stopPropagation();
    this.expandedCard.set(null);
    this.router.navigate(['/consejos']);
  }

  private scrollToExpandedCard() {
    setTimeout(() => {
      const expandedElement = document.querySelector('.advice-card.expanded');
      if (expandedElement) {
        expandedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }

  cleanContent(content: string) {
    return DOMPurify.sanitize(content || '', {
      ALLOWED_TAGS: ['b', 'br', 'p', 'ul', 'li', 'strong'],
      ALLOWED_ATTR: []
    });
  }
}
