import { Component, inject, signal } from '@angular/core';
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { TherapyCardComponent } from "./therapy-card/therapy-card.component";
import { Therapy } from '../../../models/therapy.model';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'pim-therapies-manager',
  standalone: true,
  imports: [TherapyCardComponent, ConfirmationModalComponent],
  template: `
  <div class="management">
    @if (therapiesState().error) {
      <div>Error en la carga de terapias: {{ therapiesState().error }}</div>
    } @else {
      <div class="list">
        @for (therapy of therapiesState().list; track therapy.therapyId) {
          <pim-therapy-card [therapy]="therapy"
                            (edit)="handleEdit($event)"
                            (delete)="handleDelete($event)"
          ></pim-therapy-card>
        }
      </div>
    }

    @if (therapyToDelete()) {
      <pim-confirmation-modal
          [id]="therapyToDelete()!"
          (confirm)="confirmDelete($event)"
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
export class TherapiesManagerComponent {
  private readonly stateService = inject(TherapiesStateService);

  therapiesState = this.stateService.therapiesState;
  therapyToDelete = signal<string | null>(null);

  constructor() {
    this.stateService.listTherapies();
  }

  handleEdit(therapy: Therapy) {
    this.stateService.updateTherapy(therapy.therapyId, therapy);
  }

  handleDelete(therapyId: string) {
    this.therapyToDelete.set(therapyId);
  }

  cancelDelete() {
    this.therapyToDelete.set(null);
  }

  confirmDelete(therapyId: string) {
    this.stateService.deleteTherapy(therapyId);
    this.therapyToDelete.set(null);
  }
}
