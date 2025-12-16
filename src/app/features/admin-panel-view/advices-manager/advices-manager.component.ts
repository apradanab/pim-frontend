import { Component, computed, inject, signal } from '@angular/core';
import { AdvicesStateService } from '../../../core/services/states/advices.state.service';
import { AdviceCardComponent } from "./advice-card/advice-card.component";
import { TherapiesStateService } from '../../../core/services/states/therapies.state.service';
import { Advice } from '../../../models/advice.model';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCirclePlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AdviceCreateFormComponent } from "./advice-create-form/advice-create-form.component";

@Component({
  selector: 'pim-advices-manager',
  standalone: true,
  imports: [AdviceCardComponent, ConfirmationModalComponent, FontAwesomeModule, AdviceCreateFormComponent],
  template: `
  <div class="management">
    @if (advicesState().isLoading) {
      <div class="loading-overlay">
        <fa-icon [icon]="faSpinner" class="fas fa-spinner fa-spin"/>
      </div>
    }

    @if (advicesState().error) {
      <div>Error en la carga de terapias: {{ advicesState().error }}</div>
    } @else {
      <div class="list">
        @if (isCreateForm()) {
          <div class="form-wrapper">
            <pim-advice-create-form
              [availableTherapies]="availableTherapies()"
              (adviceCreated)="toggleCreateForm(false)"
              (cancelClick)="toggleCreateForm(false)"
            />
          </div>
        } @else {
          <button class="create-card" (click)="toggleCreateForm(true)" title="Crear consejo">
            <fa-icon [icon]="faPlus" size="2x" class="create-icon"/>
          </button>
        }

        @for (advice of advicesState().list; track advice.adviceId) {
          <pim-advice-card
            [advice]="advice"
            [availableTherapies]="therapiesService.therapiesState().list"
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
  <div class="footer"></div>
  `,
  styles: `
  .management {
    font-family: "Carlito", sans-serif;
    min-height: 500px;
    position: relative;
    border-top: 4px solid #ebece9;
    background-color: white;
    animation: fadeIn 0.5s ease;
    box-shadow:
        8px 0 15px -10px rgba(0,0,0,0.2),
        -8px 0 15px -10px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 600px;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    z-index: 2;
  }

  .loading-overlay fa-icon {
    color: #1bbdbf;
    font-size: 45px;
    position: relative;
    top: -35px;
  }

  .list {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 2rem;
    padding: 2rem 4rem;
    background-color: white;
  }

  .create-card {
    font-size: 1.3rem;
    width: 100%;
    height: 100px;
    background-color: #e8e8e8ff;
    border: 1px solid #7171713b;
    border-radius: 1.5rem;
    color: #717171ff;
  }

  fa-icon:active {
    font-size: 1.1rem;
  }

  .footer {
    height: 30px;
    background-color: #ebece9;
    border-radius: 0 0 12px 12px;
    box-shadow: 8px 0 15px -10px rgba(0, 0, 0, 0.2),
                -8px 0 15px -10px rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  `
})
export class AdvicesManagerComponent {
  private readonly stateService = inject(AdvicesStateService);
  readonly therapiesService = inject(TherapiesStateService);

  advicesState = this.stateService.advicesState;
  adviceToDelete = signal<Advice | null>(null);
  isCreateForm = signal(false);

  faSpinner = faSpinner;
  faPlus = faCirclePlus;

  constructor() {
    this.stateService.listAdvices();
  }

  availableTherapies = computed(() => this.therapiesService.therapiesState().list);

  toggleCreateForm(show: boolean) {
    this.isCreateForm.set(show);
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
