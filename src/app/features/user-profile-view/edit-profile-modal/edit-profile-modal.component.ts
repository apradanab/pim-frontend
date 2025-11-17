import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ProfileFormValue, UpdateUserInput, User } from '../../../models/user.model';
import { BaseEditForm } from '../../shared/base-edit-form/base-edit-form';
import { ImageInfo, UploadFolder } from '../../../models/form.model';

@Component({
  selector: 'pim-edit-profile-modal',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    @if (showModal()) {
      <div class="modal-overlay"
          (click)="closeModal()"
          (keyup.enter)="closeModal()"
          tabindex="0">
        <div class="modal-content"
            (click)="$event.stopPropagation()"
            (keydown.escape)="closeModal()"
            role="dialog"
            aria-labelledby="edit-profile-modal-title"
            aria-modal="true">

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="modal-header">
              <h2>Editar perfil</h2>
              <button class="close-button" (click)="closeModal()" (keyup.enter)="closeModal()" tabindex="0">
                <fa-icon [icon]="faTimes"/>
              </button>
            </div>

            <div class="avatar-upload">
              <label class="avatar-circle">
                <input type="file" accept="image/*" (change)="handleFileChange($event)">
                @if (previewUrl()) {
                  <img [src]="previewUrl()" alt="Vista previa avatar">
                } @else {
                  <div class="placeholder">Haz click o arrastra una imagen</div>
                }
              </label>
            </div>

            <div class="form-group">
              <label>Nombre completo
              <input type="text" formControlName="name" placeholder="Tu nombre">
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <small class="error">El nombre es obligatorio</small>
              }
              </label>
            </div>

            <div class="form-group">
              <label>Email
              <input type="email" formControlName="email" placeholder="email">
              </label>
              @if (form.get('email')?.invalid && form.get('email')?.touched) {
                <small class="error">
                  {{ form.get('email')?.errors?.['required'] ? 'El email es obligatorio' : 'Email inválido' }}
                </small>
              }
            </div>

            @if (showPasswordFields()) {
              <div class="form-group">
                <label>Contraseña actual
                <input type="password" formControlName="currentPassword" placeholder="Contraseña actual">
                </label>
              </div>

              <div class="form-group">
                <label>Nueva contraseña
                <input type="password" formControlName="newPassword" placeholder="Nueva contraseña">
                @if (form.get('newPassword')?.invalid && form.get('newPassword')?.touched) {
                  <small class="error">La contraseña debe tener al menos 6 caracteres</small>
                }
                </label>
              </div>
            }

            <button type="button" class="toogle-pass-button" (click)="togglePasswordFields()">
              {{ showPasswordFields() ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña' }}
            </button>

            <button type="submit" [disabled]="form.invalid" class="submit-button">
              Guardar cambios
            </button>
          </form>
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
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    width: 90%;
    max-width: 450px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    font-family: 'Carlito', sans-serif;
  }

  .modal-header {
    margin: 0 -2.5rem 0 -2.5rem;
    padding: 2rem 2.5rem 0rem 2.5rem;
    border-radius: 1rem 1rem 0 0;
    background-color: #ebece9;
    border-bottom: 1px solid #b3b3b3;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
  }

  .modal-content form {
    padding: 0 2.5rem 2.5rem 2.5rem;
  }

  .modal-header h2 {
    font-family: 'Caprasimo', cursive;
    font-weight: 500;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #2f2929;
    text-align: center;
  }

  .close-button {
    position: absolute;
    top: 0.7rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #2f2929;
  }

  .avatar-upload {
    display: flex;
    justify-content: center;
    margin: 1.5rem 0;
    padding: 2px;
    border: 4px solid rgba(81, 69, 69, 0.8);
    border-radius: 50%;
    width: fit-content;
    position: relative;
    left: 120px;
    transition: border-color 0.2s ease;
  }

  .avatar-upload:active {
    border-color: transparent;
  }

  .avatar-circle {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #eee;
    cursor: pointer;
    transition: 0.3s ease;
  }

  .avatar-circle:active {
    box-shadow:
      0px -5px 10px 5px rgba(23, 153, 155, 0.54),
      0 5px 10px 5px rgba(80, 85, 143, 0.54);
    background-color: #ebece9;
    border: 2.5px solid black;
    color: rgba(81, 69, 69, 0.8);
    padding : 3px 8px;
    border-color: rgba(81, 69, 69, 0.8);
  }

  .avatar-circle input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .avatar-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.3s;
    margin-top: 0.5rem;
  }

  small.error {
    color: #d9534f;
    margin-top: 0.3rem;
    display: block;
    font-size: 0.85rem;
  }

  .avatar-section {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-bottom: 10px;
    border: 3px solid #eee;
  }

  .avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: #999;
    font-size: 0.8rem;
    text-align: center;
  }

  input[type="file"] {
    padding: 0;
    border: none;
    font-size: 0.9rem;
  }

  .toogle-pass-button {
    background: none;
    border: none;
    color: #f3552d;
    text-decoration: underline;
    cursor: pointer;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    display: block;
    width: 100%;
    text-align: left;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    background-color: #f3552d;
    color: white;
    border: none;
    border-radius: 2rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s;
  }

  .submit-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .submit-button:hover:not(:disabled) {
    background-color: #e04a24;
  }
  `
})
export class EditProfileModalComponent extends BaseEditForm<User> {
  private readonly usersState = inject(UsersStateService);
  private readonly fb = inject(FormBuilder);

  modalClosed = output<void>();

  faTimes = faTimes;

  showModal = signal(true);
  showPasswordFields = signal(false);

  readonly currentUser = computed(() => this.usersState.usersState().currentUser);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    currentPassword: [''],
    newPassword: ['', [Validators.minLength(6)]],
  })

  constructor () {
    super();

    effect(() => {
      const user = this.currentUser();
      if (user && !this.form.dirty) {
        this.form.patchValue({
          name: user.name,
          email: user.email
        });
        this.previewUrl.set(user.avatar?.url);
        this.file.set(null);
      }
    }, { allowSignalWrites: true });
  }

  override getForm(): FormGroup { return this.form }
  override getCurrentItem(): User { return this.currentUser()! }
  override getItemId(): string { return this.currentUser()!.userId }
  override getUploadFolder(): UploadFolder { return 'avatar' }

  override getCurrentImageKey(): string | undefined {
    return this.currentUser()?.avatar?.key;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override buildUpdatedItem(_formValue: object, _imageInfo: ImageInfo | undefined): User {
    return this.currentUser()!;
  }

  togglePasswordFields() {
    this.showPasswordFields.update(v => !v);
  }

  async submit() {
    const currentUser = this.currentUser();

    if (!currentUser || this.form.invalid) return;

    try {
      const imageInfo = await this.handleImageUpload();
      const formValue = this.form.getRawValue() as ProfileFormValue;

      const payload: UpdateUserInput = {
        name: formValue.name,
        email: formValue.email
      }

      if (imageInfo) payload.avatarKey = imageInfo.key;

      if (this.showPasswordFields()) {
        payload.currentPassword = formValue.currentPassword!;
        payload.password = formValue.newPassword!;
      }

      await this.usersState.updateUserProfile(currentUser.userId, payload);

      this.closeModal();
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  closeModal() {
    this.showModal.set(false);
    this.modalClosed.emit();
  }
}
