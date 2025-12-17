import { Component, input, output } from '@angular/core';
import { Advice } from '../../../models/advice.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-advice-card',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div
      class="advice-card"
      [class.expanded]="isExpanded()"
      (click)="handleToggle()"
      (keyup.enter)="handleToggle()"
      tabindex="0"
      role="button">

      <div class="card-layout">
        <div class="text-content">
          <h3>{{ advice().title }}</h3>
          <p class="description">{{ advice().description }}</p>

          @if (therapyTitle()) {
            <p class="therapy-title">{{ therapyTitle() }}</p>
          }

          @if (isExpanded()) {
            <div class="content">
              <p>{{ advice().content }}</p>
            </div>
            <button class="close-btn" (click)="handleClose($event)">
              <fa-icon [icon]="faLeft"></fa-icon>
            </button>
          }
        </div>

        <div class="image-container">
          <img [src]="advice().image?.url" [alt]="advice().title" class="card-image">
        </div>
      </div>
    </div>
  `,
  styles: `
  :host { display: block; height: 100%; }

  .advice-card {
    background: white;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    cursor: pointer;
    position: relative;
  }

  .card-layout {
    display: flex;
    flex-direction: column-reverse;
    padding: 1.5rem;
    gap: 1rem;
  }

  .text-content h3 {
    font: 400 2rem/1 'Caprasimo', cursive;
    margin-bottom: 10px;
  }

  .description {
    color: #9e9e9b;
    font-size: 1.15rem;
  }

  .therapy-title {
    padding: 10px;
    background-color: #e8e8e8ff;
    color: #717171ff;
    border-radius: 20px 0 0 20px;
    position: absolute;
    top: 37px;
    right: 272px;
  }

  .image-container { width: 100%; }

  .card-image {
    width: 100%;
    height: 220px;
    object-fit: cover;
    border-radius: 1rem;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .advice-card.expanded {
    cursor: default;
    border: 1px solid #eee;
  }

  .expanded .card-layout {
    flex-direction: row;
    padding: 20px;
    align-items: start;
  }

  .expanded .text-content { flex: 1.5; }
  .expanded .image-container { flex: 1; }
  .expanded .card-image {
    width: 250px;
    height: 305px;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }

  .expanded h3 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .expanded .description {
    margin-bottom: 1rem;
  }

  .expanded .content {
    width: 885px;
  }

  .close-btn {
    position: absolute; top: 1.65rem; right: 1.95rem;
    background: #f4f2ed; border: none; width: 45px; height: 45px;
    border-radius: 50%;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex; align-items: center;
    justify-content: center; cursor: pointer;
    z-index: 2;
  }

  @media (max-width: 768px) {
    .expanded .card-layout { flex-direction: column-reverse; padding: 1.5rem; }
    .expanded .card-image { width: 100%; height: 220px; }
    .expanded .content { width: 100%; }
    .expanded .therapy-title { top: 245px; right: 45px; border-radius: 0 0 15px 15px; }

    .close-btn {
      rotate: 90deg;
      top: 1.95rem;
    }
  }
  `
})
export class AdviceCardComponent {
  advice = input.required<Advice>();
  therapyTitle = input<string | null>(null);
  isExpanded = input<boolean>(false);
  toggle = output<string>();

  faLeft = faAngleLeft;

  handleToggle() {
    if (!this.isExpanded()) this.toggle.emit(this.advice().adviceId);
  }

  handleClose(event: Event) {
    event.stopPropagation();
    this.toggle.emit(this.advice().adviceId);
  }
}
