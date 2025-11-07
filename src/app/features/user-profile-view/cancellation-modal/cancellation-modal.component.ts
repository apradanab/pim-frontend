import { Component, inject, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CancellationDetails } from '../../../models/appointment.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImageService } from '../../../core/services/utils/image.service';

@Component({
  selector: 'pim-cancellation-modal',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ReactiveFormsModule],
  template: `
  <div class="modal-overlay"
      (click)="closeModal()"
      role="presentation">
    <div class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        (click)="$event.stopPropagation()"
        (keydown.enter)="$event.stopPropagation()"
        tabindex="0">

      <div class="modal-header">
        <h2>Solicitar cancelación</h2>
        <button (click)="closeModal()"
                class="close-btn"
                aria-label="Cerrar modal">
          <fa-icon [icon]="faTimes"/>
        </button>
      </div>


      <form class="cancellation-form"
            [formGroup]="cancellationForm">
        <p>Motivo:</p>
        <div class="form-group">
          <textarea formControlName="notes"
                    placeholder="Por favor, escribe aquí el motivo de cancelación"
                    class="notes-textarea"
                    rows="4"
                    maxlength="150"
                    aria-required="true"
          ></textarea>
          @if (cancellationForm.controls.notes.value) {
            <p class="notes-count"> {{ cancellationForm.controls.notes.value.length }} </p>
          }
        </div>

        <div class="cancellation-policy">
          <input type="checkbox"
                id="cancellationPolicy"
                formControlName="cancellationPolicy"
                aria-required="true">
          <label for="cancellationPolicy">
            He leido y acepto la <a href="#" (click)="showCancellationPolicy($event)">política de cancelación</a>
          </label>
        </div>

        <button type="button"
                [disabled]="cancellationForm.invalid"
                (click)="confirmCancellation()"
                class="submit-button"
                >Confirmar cancelación
        </button>
      </form>

    </div>
  </div>

  @if (showPolicy) {
    <div class="cancellation-policy-modal">
      <div class="policy-content">
        <div class="modal-header">
          <button class="close-btn"
                  (click)="closePolicyModal()"
                  (keyup.enter)="closePolicyModal()"
                  aria-label="Cerrar modal"
                  tabindex="0">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
          <h3>Política de cancelación</h3>
        </div>


        <div class="cancellation-text">
          <p>esto es la politica de cancelacion, esto es la politica de cancelacion,esto es la politica de cancelacion, esto es la politica de cancelacion,esto es la politica de cancelacion, esto es la politica de cancelacion,esto es la politica de cancelacion, esto es la politica de cancelacion,</p>
        </div>
          <img [src]="imageService.icons.logoInline" alt="Logo">
      </div>
    </div>
  }
  `,
  styles: `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: modal-open 0.3s forwards ease-out;
    outline: none;
    position: relative;
  }

  .modal-header {
    margin: -2rem -2rem 1.2rem -2rem;
    padding: 1rem 2.5rem 0.5rem 2.5rem;
    border-radius: 1rem 1rem 0 0;
    background-color: #ebece9;
    border-bottom: 1px solid #b3b3b3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .modal-header h2 {
    font-family: 'Caprasimo', cursive;
    font-weight: 500;
    color: #2f2929;
    margin-bottom: 1rem;
    text-align: center;
    padding-top: 1rem;
  }

  .close-btn {
    position: absolute;
    top: 0.7rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #2f2929;
  }

  .cancellation-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-family: 'Carlito', sans-serif;
    color: #2f2929;
    font-size: 1rem;
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-family: 'Carlito', sans-serif;
    resize: vertical;
  }

  .notes-count {
    font-size: 0.8rem;
    color: #666;
    text-align: right;
  }

  .cancellation-policy {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .cancellation-policy a {
    color: #f3552d;
    cursor: pointer;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    background-color: #f3552d;
    color: white;
    border: none;
    border-radius: 2rem;
    font-family: 'Carlito', sans-serif;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #e04a24;
  }

  .cancellation-policy-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }

  .cancellation-policy-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
  }

  .policy-content {
    background-color: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .policy-content button {
    top: 1.2rem;
    right: 1.5rem;
  }

  .policy-content h3 {
    font-family: 'Caprasimo', cursive;
    color: #2f2929;
    margin-bottom: 1rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
  }

  .cancellation-text {
    font-family: 'Carlito', sans-serif;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .policy-content img {
    width: 70px;
    position: relative;
    left: 29rem;
    top: 1rem;
  }

  @media(max-width: 768px) {
    .modal-overlay {
      position: fixed;
    }

    .modal-content {
      width: 100%;
    }
  }
  `
})
export class CancellationModalComponent {
  private readonly fb = inject(FormBuilder);
  readonly imageService = inject(ImageService);

  confirm = output<CancellationDetails>();
  close = output<void>();

  faTimes = faTimes;
  showPolicy = false;

  cancellationForm = this.fb.group({
    notes: ['', [Validators.required, Validators.minLength(20)]],
    cancellationPolicy: [false, [Validators.requiredTrue]]
  });

  showCancellationPolicy(event: Event) {
    event.preventDefault();
    this.showPolicy = true;
  }

  closePolicyModal() {
    this.showPolicy = false;
  }

  confirmCancellation() {
    if (this.cancellationForm.valid) {
      const notes = this.cancellationForm.controls.notes.value!;

      this.confirm.emit({ notes });

      this.cancellationForm.reset({
        notes: '',
        cancellationPolicy: false
      });
    }
  }

  closeModal () {
    this.close.emit();
    this.cancellationForm.reset({
      notes: '',
      cancellationPolicy: false
    });
    this.showPolicy = false;
  }
}
