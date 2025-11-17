import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Therapy, TherapyFormValue } from '../../../../models/therapy.model';
import { faArrowUpFromBracket, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BaseEditForm } from '../../../shared/base-edit-form/base-edit-form';
import { ImageInfo } from '../../../../models/form.model';

@Component({
  selector: 'pim-therapy-edit-form',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="therapyForm" class="edit-form">
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

        <div class="footer-side">
          <div class="color-wrapper">
            <input type="color" formControlName="bgColor" class="color-picker-hidden">
            <div class="color-picker-indicator" [style.background]="therapyForm.get('bgColor')?.value"></div>
          </div>
            <input type="number" formControlName="maxParticipants" class="participants-input">

            <div class="actions">
              <button class="save-btn" (click)="submit()" [disabled]="therapyForm.invalid"><fa-icon [icon]="faSave"/>Guardar</button>
              <button class="cancel-btn" (click)="cancelClick.emit()"><fa-icon [icon]="faTimes"/>Cancelar</button>
            </div>
        </div>
      </div>
  </form>
  `,
  styles: `
  .edit-form {
    display: flex;
    gap: 1.7rem;
  }

  .card-text-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title {
    font: 400 2.6rem/1 'Caprasimo', cursive;
    width: 500px;
  }

  .description {
    width: 500px;
    font-size: 1.35rem;
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
    margin-right: 13px;
  }

  .content-wrapper {
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #ebece9a7;
    width: 680px;
    height: 322px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .content {
    height: 100%;
    width: 100%;
    background-color: white;
    padding: 8px 20px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: #d1d2d0ff white;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .image-upload-area {
    position: relative;
  }

  .card-side img {
    width: 280px;
    height: 320px;
    object-fit: cover;
    border: 2px solid #ebece940;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .overlay {
    position: absolute;
    bottom: 150px;
    right: 44%;
    padding: 10px 12px;
    background-color: #ebece9;
    border-radius: 50%;
    cursor: pointer;
  }

  .overlay:active {
    box-shadow: 0px 0px 10px 10px rgba(191, 207, 207, 0.54);
    border-color: rgba(81, 69, 69, 0.8);
    padding: 9px 11px;
  }

  .footer-side {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    min-height: 85px;
    margin-top: 5px;
  }

  .color-wrapper {
    padding: 7px;
    background-color: white;
    border-radius: 12px;
    align-self: flex-end;
    border: 2px solid #ebece9a7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .color-picker-hidden {
    opacity: 0;
    height: 39px;
    width: 40px;
    position: absolute;
  }

  .color-picker-indicator {
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    border-radius: 50%;
  }

  .participants-input::-webkit-inner-spin-button,
  .participants-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .participants-input {
    width: 50px;
    text-align: center;
    padding: 13px 0;
    background-color: white;
    border-radius: 12px;
    align-self: flex-end;
    font-size: 1.4rem;
    border: 2px solid #ebece9a7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    left: 11px;
  }

  .actions button {
    padding: 10px 15px;
    min-width: 100px;
    display: flex;
    justify-content: space-around;
    background-color: #f5f5f5;
    color: #717171ff;
    border: 1px solid #ddd;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  `
})
export class TherapyEditFormComponent extends BaseEditForm<Therapy> {
  private readonly fb = inject(FormBuilder);

  therapy = input.required<Therapy>();
  update = output<Therapy>();
  cancelClick = output<void>();

  therapyForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    content: ['', Validators.required],
    maxParticipants: [0, Validators.required],
    bgColor: ['#ccc', Validators.required]
  });

  faTimes = faTimes;
  faSave = faCheck;
  faUpload = faArrowUpFromBracket;

  constructor() {
    super()

    effect(() => {
      const currentTherapy = this.therapy();
      this.therapyForm.patchValue({
        title: currentTherapy.title,
        description: currentTherapy.description,
        content: currentTherapy.content,
        maxParticipants: currentTherapy.maxParticipants,
        bgColor: currentTherapy.bgColor
      }, { emitEvent: false });
      this.previewUrl.set(currentTherapy.image?.url);
      this.file.set(null);
    }, { allowSignalWrites: true });
  }

  override getForm() { return this.therapyForm }
  override getCurrentItem() { return this.therapy() }
  override getItemId() { return this.therapy().therapyId }
  override getUploadFolder(): 'therapy' { return 'therapy' }

  override getCurrentImageKey(): string | undefined {
    return this.therapy().image?.key;
  }

  override buildUpdatedItem(formValue: object, image: ImageInfo | undefined): Therapy {
    const currentTherapy = this.therapy();
    const values = formValue as  TherapyFormValue;

    return {
      ...currentTherapy,
      title: values.title,
      description: values.description,
      content: values.content,
      maxParticipants: values.maxParticipants,
      bgColor: values.bgColor,
      image: image
    } as Therapy;
  }

  async submit() {
    const updatedAdvice = await this.submitBase();
    if (updatedAdvice) {
      this.update.emit(updatedAdvice)
    }
  }
}
