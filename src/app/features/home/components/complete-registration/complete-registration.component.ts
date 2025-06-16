import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersRepoService } from '../../../../core/services/users.repo.service';
import { faCircleCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { lastValueFrom } from 'rxjs';
import { LoginModalComponent } from "../../../shared/login-modal/login-modal.component";

@Component({
  selector: 'pim-complete-registration',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule, LoginModalComponent],
  template: `
    @if (showModal()) {
      <div class="modal">
        <div class="modal-box">
          <button class="close-btn" (click)="closeModal()">
            <fa-icon [icon]="faTimes" />
          </button>

          @if (!success()) {
            <form [formGroup]="form" (ngSubmit)="submit()">
              <h2>Completa tu registro</h2>

              <div class="form-group">
                <label for="name">Nombre completo</label>
                <input type="text" formControlName="name" required>
                @if (form.controls.name.invalid && form.controls.name.touched) {
                  <div class="error">Nombre requerido</div>
                }
              </div>

              <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" formControlName="password" required>
                @if (form.controls.password.invalid && form.controls.password.touched) {
                  <div class="error">Mínimo 8 caracteres</div>
                }
              </div>

              <div class="form-group">
                <label for="avatar">Foto de perfil (opcional)</label>
                <input type="file" (change)="handleFileChange($event)">
              </div>

              <button type="submit" [disabled]="form.invalid" class="submit-btn">Enviar</button>
            </form>
          } @else {
            <div class="success">
              <fa-icon [icon]="faCircleCheck" />
              <h3>¡Registro completado!</h3>

                <div class="login-container">
                <button class="login-button"
                        (click)="openLoginModal()"
                        (keyup.enter)="openLoginModal()"
                        tabindex="0"
                >Iniciar sesión</button>
              </div>
            </div>
          }
        </div>
      </div>

      @if (showLoginModal) {
        <pim-login-modal (modalClosed)="closeLoginModal()"></pim-login-modal>
      }
    }
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
    }

    .modal-box {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      width: 90%;
      max-width: 400px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #2f2929;
    }

    h2, h3 {
      font-family: 'Caprasimo', cursive;
      color: #2f2929;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 500;
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

    input[type="file"] {
      padding: 0.5rem;
    }

    .error {
      color: #f00;
      font-size: 0.8rem;
      margin-top: 0.3rem;
      font-family: 'Carlito', sans-serif;
    }

    .submit-btn {
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

    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #e04a24;
    }

    .success {
      text-align: center;
      padding: 2rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .success fa-icon {
      color: #4CAF50;
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .login-container {
      background-color: #2f2929;
      border-radius: 30px;
      padding: 5px 10px;
      width: 170px;
    }

    .login-button {
      font-family: 'Carlito', sans-serif;
      font-size: 1.06rem;
      color: #f2f8fa;
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 6px 14px;
    }

    .login-container:active {
      background-color: transparent;
      border: 2px solid black;
      background-color: #f2f8fa;
      padding : 3px 8px;
      border-color: #17475f;
    }

    .login-button:active {
      color: #17475f;
      transition: all 0.15s ease;
    }

    @media (max-width: 768px) {
      .modal-box {
        max-width: 350px;
      }
    }
  `]
})
export default class CompleteRegistrationComponent {
  private readonly repo = inject(UsersRepoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  faCircleCheck = faCircleCheck;
  faTimes = faTimes;

  showModal = signal(false);
  success = signal(false);
  showLoginModal = false;
  file: File | null = null;
  registrationToken: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {
    effect(() => {
      this.registrationToken = this.route.snapshot.queryParamMap.get('token');

      if (this.registrationToken) {
        this.showModal.set(true);
        this.router.navigate([], { queryParams: { token: null } });
      }
    }, { allowSignalWrites: true });
  }

  async submit() {
    if (this.form.invalid || !this.registrationToken) return;

    try {
      const formData = new FormData();
      formData.append('name', this.form.value.name!);
      formData.append('password', this.form.value.password!);
      if (this.file) formData.append('avatar', this.file);

      const payload = JSON.parse(atob(this.registrationToken.split('.')[1]));
      await lastValueFrom(this.repo.updateUser(payload.id, formData, this.registrationToken));

      this.success.set(true);
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  closeModal() {
    this.showModal.set(false);
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }
}
