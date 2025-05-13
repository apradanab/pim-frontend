import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'pim-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  template: `
    <div class="modal-overlay"
        (click)="closeModal()"
        (keyup.enter)="closeModal()"
        tabindex="0">
      <div class="modal-content"
          (click)="$event.stopPropagation()"
          (keydown.escape)="closeModal()"
          role="dialog"
          aria-labelledby="login-modal-title"
          aria-modal="true">
        <button class="close-button"
                (click)="closeModal()"
                (keyup.enter)="closeModal()"
                aria-label="Cerrar modal"
                tabindex="0">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>

        <h2 id="login-modal-title">Iniciar sesión</h2>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              placeholder="tu@email.com"
              aria-required="true">
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Tu contraseña"
              aria-required="true">
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid"
            class="submit-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
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
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 400px;
      position: relative;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #2f2929;
    }

    h2 {
      font-family: 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      font-family: 'Carlito', sans-serif;
      margin-bottom: 0.5rem;
      color: #2f2929;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-family: 'Carlito', sans-serif;
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

    @media (max-width: 768px) {
      .modal-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginModalComponent {
  modalClosed = output<void>();
  private readonly stateService = inject(StateService);
  private readonly fb = inject(FormBuilder);

  faTimes = faTimes;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  closeModal() {
    this.modalClosed.emit();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.stateService.login(email!, password!);
      this.closeModal();
    }
  }
}
