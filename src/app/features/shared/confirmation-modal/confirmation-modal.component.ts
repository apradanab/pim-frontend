import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-confirmation-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="modal-overlay"
        (click)="closeModal()"
        (keyup.enter)="closeModal()"
        tabindex="0">
      <div class="modal-content"
          (click)="$event.stopPropagation()"
          (keydown.escape)="closeModal()"
          role="dialog">
        <div class="modal-header">
          <h4>Eliminar elemento</h4>
          <button class="close-btn"
                  (click)="closeModal()"
                  (keyup.enter)="closeModal()"
                  aria-label="Cerrar modal">
            <fa-icon [icon]="faTimes"/>
          </button>
        </div>
        <div class="modal-body">
          <p>¿Seguro que deseas continuar?</p>
          <p>Esta acción no se puede deshacer</p>
          <button class="confirm-btn" (click)="confirm.emit(id())">Borrar</button>
        </div>
      </div>
    </div>
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
      z-index: 2;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 400px;
      position: relative;
      font-family: 'Carlito', sans-serif;
    }

    .modal-header {
      margin-left: -2rem;
      margin-right: -2rem;
      margin-bottom: 1.5rem;
      margin-top: -2rem;
      padding-top: 2rem;
      border-radius: 1rem 1rem 0 0;
      background-color: #ebece9;
      border-bottom: 1px solid #b3b3b3;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .close-btn {
      position: absolute;
      top: 0.7rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #2f2929;
    }

    h4 {
      font-family: 'Caprasimo', cursive;
      font-size: 1.5rem;
      font-weight: 500;
      color: #2f2929;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-body p {
      font-size: 1.2rem;
    }

    .confirm-btn {
      width: 100%;
      padding: 1rem;
      background-color: #f3552d;
      color: white;
      border: none;
      border-radius: 2rem;
      font-family: 'Carlito', sans-serif;
      font-size: 1.2rem;
      margin-top: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  `
})
export class ConfirmationModalComponent {
  id = input.required<string>();
  confirm = output<string>();
  modalClosed = output<void>();

  faTimes = faTimes;

  closeModal() {
    this.modalClosed.emit();
  }
}
