import { Component, computed, inject, signal } from '@angular/core';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { AdviceCardComponent } from "./advice-card/advice-card.component";
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Advice } from '../../../models/advice.model';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'pim-advices-manager',
  standalone: true,
  imports: [AdviceCardComponent, ConfirmationModalComponent],
  template: `
  <div class="management">
    @if (advicesState().error) {
      <div>Error en la carga de terapias: {{ advicesState().error }}</div>
    } @else {
      <div class="list">
        @for (advice of advicesState().list; track advice.adviceId) {
          <pim-advice-card [advice]="advice"
                          [therapyTitle]="getTherapyTitle(advice.therapyId)"
                          (edit)="handleEdit($event)"
                          (delete)="handleDelete(advice)"
          ></pim-advice-card>
        }
      </div>
    }

    @if (adviceToDelete()) {
      <pim-confirmation-modal
        [id]="adviceToDelete()!.title"
        (confirm)="confirmDelete()"
        (modalClosed)="cancelDelete()"
        />
    }
  </div>
  `,
  styles: `
  .management {
    font-family: "Carlito", sans-serif;
    width: 100%;
  }

  .list {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 2rem;
    border-top: 4px solid #ebece9;
    padding: 2rem 4rem;
    background-color: white;
    z-index: 1;
    animation: fadeIn 0.5s ease;
    box-shadow:
        8px 0 15px -10px rgba(0,0,0,0.2),
        -8px 0 15px -10px rgba(0,0,0,0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  `
})
export class AdvicesManagerComponent {
  private readonly stateService = inject(AdvicesStateService);
  private readonly therapiesService = inject(TherapiesStateService);

  therapiesMap = computed(() => {
    const therapies = this.therapiesService.therapiesState().list;
    return new Map(therapies.map(t => [t.therapyId, t.title]));
  })

  getTherapyTitle (therapyId: string) {
    return this.therapiesMap().get(therapyId) || 'Terapia';
  }

  advicesState = this.stateService.advicesState;
  adviceToDelete = signal<Advice | null>(null);

  constructor() {
    this.stateService.listAdvices();
  }

  handleEdit(advice: Advice) {
    this.stateService.updateAdvice(advice.adviceId, advice);
  }

  handleDelete(advice: Advice) {
    this.adviceToDelete.set(advice);
  }

  cancelDelete() {
    this.adviceToDelete.set(null);
  }

  confirmDelete() {
    const advice = this.adviceToDelete();
    if (advice) {
      this.stateService.deleteAdvice(advice);
      this.adviceToDelete.set(null);
    }
  }
}
