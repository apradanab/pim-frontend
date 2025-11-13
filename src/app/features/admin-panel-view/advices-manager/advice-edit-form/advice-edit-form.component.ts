import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MediaService } from '../../../../core/services/utils/media.service';
import { Advice } from '../../../../models/advice.model';
import { faArrowUpFromBracket, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'pim-advice-edit-form',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="adviceForm" class="edit-form">
    <div class="card-text-details">
      <div class="header">
        <input type="text" formControlName="title" class="title">
        <input type="text" formControlName="description" class="description">
      </div>
      <div class="content-wrapper">
        <textarea formControlName="content" class="content"></textarea>
      </div>
    </div>

    <div class="card-side">
      <label class="image-upload-area">
        <input type="file" accept="image/*" (change)="handleFileChange($event)" style="display:none;">
        @if (previewUrl()) {
          <img [src]="previewUrl()" alt="Vista previa de la imagen">
          <div class="overlay"><fa-icon [icon]="faUpload"/></div>
        } @else {
          <div class="placeholder-img"><fa-icon [icon]="faUpload"/> Añadir Imagen</div>
        }
      </label>

      <div class="actions">
        <button class="save-btn" (click)="submit()" [disabled]="adviceForm.invalid"><fa-icon [icon]="faSave"/>Guardar</button>
        <button class="cancel-btn" (click)="cancelClick.emit()"><fa-icon [icon]="faTimes"/>Cancelar</button>
      </div>
    </div>
  </form>
  `,
  styles: `
  .edit-form {
    display: flex;
    justify-content: space-around;
    border: 4px solid #ebece9;
    border-radius: 1.5rem;
    padding: 20px 20px 0;
    gap: 2.8rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-family: 'Carlito', sans-serif;
    background-color: #fff;
  }

  .card-text-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .title {
    font: 400 2.5rem/1 'Caprasimo', cursive;
    color: #2f2929;
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
  }

  .description {
    color: #9e9e9b;
    font-size: 1.3rem;
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
  }

  .content {
    width: 100%;
    min-height: 150px;
    border-radius: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    font-family: inherit;
    font-size: 1.1rem;
    color: #555;
    resize: vertical;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .image-upload-area {
    position: relative;
    width: 250px;
    height: 260px;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  .image-upload-area img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-img {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #f9f9f9;
    color: #999;
    font-size: 1rem;
    text-align: center;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 10px;
    width: 100%;
  }

  .actions button {
    padding: 10px 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #e8e8e8ff;
    color: #717171ff;
    gap: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  `
})
export class AdviceEditFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly mediaService = inject(MediaService);

  advice = input.required<Advice>();
  update = output<Advice>();
  cancelClick = output<void>();

  adviceForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    content: ['', Validators.required]
  });

  file = signal<File | null>(null);
  previewUrl = signal<string | undefined>(undefined);

  faTimes = faTimes;
  faSave = faCheck;
  faUpload = faArrowUpFromBracket;

  constructor () {
    effect(() => {
      const currentAdvice = this.advice();
      this.adviceForm.patchValue({
        title: currentAdvice.title,
        description: currentAdvice.description,
        content: currentAdvice.content,
      }, { emitEvent: false });
      this.previewUrl.set(currentAdvice.image?.url);
      this.file.set(null);
    }, { allowSignalWrites: true });
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.file.set(selectedFile);

      const reader = new FileReader();
      reader.onload = () => this.previewUrl.set(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }

  async submit() {
    if (this.adviceForm.invalid) return;

    const formValue = this.adviceForm.getRawValue();
    const currentAdvice = this.advice();
    let imageKey: string | undefined = currentAdvice.image?.key;

    try {
      if (this.file()) {
        const fileToUpload = this.file()!;
        const uploadResponse = await lastValueFrom(
          this.mediaService.generateUploadUrl('advice', currentAdvice.adviceId, fileToUpload.type)
        );

        await this.mediaService.uploadFile(uploadResponse.uploadUrl, fileToUpload);

        imageKey = uploadResponse.key;
      }
    } catch (error) {
      console.error('Error updating image:', error);
      return;
    }

    const updatedAdvice: Advice = {
      ...currentAdvice,
      title: formValue.title!,
      description: formValue.description!,
      content: formValue.content!,
      image: imageKey ? {
        key: imageKey,
        url: this.mediaService.getImageUrl(imageKey)
      } : currentAdvice.image
    }

    this.update.emit(updatedAdvice);
  }
}
