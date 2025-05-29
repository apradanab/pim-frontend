import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersRepoService } from '../../../../core/services/users.repo.service';
import { faCircleCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'pim-complete-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
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

              <div class="input-group">
                <label for="name">Nombre completo</label>
                <input type="text" formControlName="name" required>
                @if (form.controls.name.invalid && form.controls.name.touched) {
                  <div class="error">Nombre requerido</div>
                }
              </div>

              <div class="input-group">
                <label for="password">Contraseña</label>
                <input type="password" formControlName="password" required>
                @if (form.controls.password.invalid && form.controls.password.touched) {
                  <div class="error">Mínimo 8 caracteres</div>
                }
              </div>

              <div class="input-group">
                <label for="avatar">Foto de perfil (opcional)</label>
                <input
                  type="file"
                  (change)="handleFileChange($event)">
              </div>

              <button type="submit" [disabled]="form.invalid">Enviar</button>
            </form>
          } @else {
            <div class="success">
              <fa-icon [icon]="faCircleCheck" />
              <h3>¡Registro completado!</h3>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
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
      cursor: pointer;
      font-size: 1.2rem;
    }

    h2, h3 {
      margin-top: 0;
      text-align: center;
    }

    .input-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .error {
      color: #f00;
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }

    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background: #f3552d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }

    button:disabled {
      background: #ccc;
    }

    .success {
      text-align: center;
    }

    .success fa-icon {
      color: #4CAF50;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  `]
})
export default class CompleteRegistrationComponent implements OnInit {
  private repo = inject(UsersRepoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  faCircleCheck = faCircleCheck;
  faTimes = faTimes;

  showModal = signal(false);
  showLoginModal = false;
  success = signal(false);
  file: File | null = null;
  registrationToken: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit() {
    this.registrationToken = this.route.snapshot.queryParamMap.get('token');

    if (this.registrationToken) {
      this.showModal.set(true);
      this.router.navigate([], { queryParams: { token: null } });
    }
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
}
