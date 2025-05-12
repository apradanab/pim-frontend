import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersRepoService } from '../../../core/services/users.repo.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserCreateDto } from '../../../models/user.model';
import { ApiError } from '../../../core/interceptors/error.interceptor';

@Component({
  selector: 'pim-contact-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule],
  template: `
    <div class="modal-overlay"
        (click)="closeModal()"
        (keyup.enter)="closeModal()"
        tabindex="0"
    >
      <div class="modal-content"
          (click)="$event.stopPropagation()"
          (keydown.escape)="closeModal()"
          role="dialog"
          aria-labelledby="contact-modal-title"
          aria-modal="true"
      >

        <button class="close-button"
                (click)="closeModal()"
                (keyup.enter)="closeModal()"
                aria-label="Cerrar modal"
                tabindex="0">
          <fa-icon [icon]="faTimes"></fa-icon>
        </button>

        <h2 id="contact-modal-title" class="modal-title">Solicita información</h2>

        <form class="contact-form"
              [formGroup]="contactForm"
              (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input type="text"
                  id="name"
                  formControlName="name"
                  placeholder="Tu nombre"
                  aria-required="true">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email"
                  id="email"
                  formControlName="email"
                  placeholder="tu@email.com"
                  aria-required="true">
          </div>

          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea id="message"
                      formControlName="message"
                      rows="4"
                      placeholder="¿En qué podemos ayudarte?"
                      aria-required="true"></textarea>
          </div>

          <div class="privacy-policy">
            <input type="checkbox"
                  id="privacyPolicy"
                  formControlName="privacyPolicy"
                  aria-required="true">
            <label for="privacyPolicy">
              He leído y acepto la <a href="#" (click)="showPrivacyPolicy($event)">Política de Privacidad</a>
            </label>
          </div>

          <button type="submit"
                  [disabled]="contactForm.invalid"
                  class="submit-button">
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>

    @if (showPrivacy) {
      <div class="privacy-policy-modal">
        <div class="privacy-content">
          <h3>Política de Privacidad</h3>
          <div class="privacy-text">
            <p>De acuerdo con el Reglamento (UE) 2016/679 (RGPD), te informamos de que los datos personales que proporciones en este formulario serán tratados con la finalidad de gestionar tu solicitud de información. No se cederán a terceros y se conservarán únicamente el tiempo necesario para dicha gestión.
Tienes derecho a acceder, rectificar y suprimir tus datos, así como otros derechos, escribiendo a:</p>
          </div>
          <button (click)="hidePrivacyPolicy()" class="close-privacy">Cerrar</button>
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
      z-index: 1000;
    }

    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
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

    .modal-title {
      font-family: 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-family: 'Carlito', sans-serif;
      color: #2f2929;
      font-size: 1rem;
    }

    input, textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      font-family: 'Carlito', sans-serif;
    }

    textarea {
      resize: vertical;
    }

    .privacy-policy {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .privacy-policy a {
      color: #f3552d;
      text-decoration: underline;
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

    .privacy-policy-modal {
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

    .privacy-content {
      background-color: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .privacy-content h3 {
      font-family: 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 1rem;
    }

    .privacy-text {
      font-family: 'Carlito', sans-serif;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .close-privacy {
      background-color: #2f2929;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 2rem;
      font-family: 'Carlito', sans-serif;
      cursor: pointer;
    }
  `
})
export class ContactModalComponent {
  modalClosed = output<void>();
  private fb = inject(FormBuilder);
  private usersRepo = inject(UsersRepoService);

  error: ApiError | null = null;
  faTimes = faTimes;
  showPrivacy = false;

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    privacyPolicy: [false, [Validators.requiredTrue]]
  });

  closeModal() {
    this.modalClosed.emit();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value as UserCreateDto;
      this.usersRepo.preregister(formData).subscribe({
        next: () => this.closeModal(),
        error: (err: unknown) => {
          this.error = err as ApiError;
        }
      });
    }
  }

  showPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.showPrivacy = true;
  }

  hidePrivacyPolicy() {
    this.showPrivacy = false;
  }
}
