import { Component, input, output } from '@angular/core';
import { Advice } from '../../../models/advice.model';

@Component({
  selector: 'pim-therapy-footer',
  standalone: true,
  imports: [],
  template: `
    <div class="tab-footer">
      <div class="advices-container">
        @for (advice of advices(); track advice.adviceId) {
          <button (click)="onAdviceClick.emit(advice.adviceId)"> {{ advice.title }}</button>
        } @empty {
          <p>No hay consejos relacionados</p>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class TherapyFooterComponent {
  advices = input.required<Advice[]>();
  onAdviceClick = output<string>();
}
