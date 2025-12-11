import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Advice, AdviceFormValue } from '../../../../models/advice.model';
import { faArrowUpFromBracket, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BaseEditForm } from '../../../shared/base-edit-form/base-edit-form';
import { ImageInfo } from '../../../../models/form.model';

@Component({
  selector: 'pim-advice-edit-form',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
  <form [formGroup]="adviceForm" class="edit-form">
    <div class="card-text-details">
      <div class="header">
        <div>
          <input id="title" type="text" formControlName="title">
          <input id="description" type="text" formControlName="description">
        </div>
        <div class="therapy-display">
          <p>{{ therapyTitle() }}</p>
        </div>
      </div>
      <div class="content-wrapper">
        <textarea id="content" formControlName="content"></textarea>
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
    position: relative;
  }

  #title {
    width: 500px;
    padding: 0 20px;
    font: 400 2.5rem/1 'Caprasimo', cursive;
    color: #2f2929;
    border: 2px solid #ddd;
    border-radius: 12px;
    background: transparent;
  }

  #description {
    width: 100%;
    padding: 0 20px;
    margin-top: 5px;
    font-size: 1.3rem;
    color: #9e9e9b;
    border: 2px solid #ddd;
    border-radius: 12px;
    background: transparent;
  }

  .therapy-display {
    position: absolute;
    top: 17px;
    right: -48px;
    font: 400 1rem 'Carlito', sans-serif;
    padding: 10px;
    background-color: #e8e8e8ff;
    color: #717171ff;
    border: none;
    border-radius: 20px 0 0 20px;
  }

  #content {
    font: 400 1rem 'Carlito', sans-serif;
    width: 100%;
    height: 210px;
    min-height: 150px;
    border-radius: 10px;
    border: 2px solid #ddd;
    padding: 10px;
    color: #555;
    overflow-y: auto;
    scrollbar-color: #d1d2d0ff white;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .card-side img {
    width: 250px;
    height: 260px;
    object-fit: cover;
    border: 2px solid #ebece940;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .image-upload-area {
    position: relative;
  }

  .overlay {
    position: absolute;
    bottom: 44%;
    right: 43%;
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
export class AdviceEditFormComponent extends BaseEditForm<Advice>{
  private readonly fb = inject(FormBuilder);

  advice = input.required<Advice>();
  update = output<Advice>();
  cancelClick = output<void>();

  therapyTitle = input.required<string>();

  adviceForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    content: ['', Validators.required],
    therapyId: ['', Validators.required]
  });

  faTimes = faTimes;
  faSave = faCheck;
  faUpload = faArrowUpFromBracket;

  constructor () {
    super()

    effect(() => {
      const currentAdvice = this.advice();
      this.adviceForm.patchValue({
        title: currentAdvice.title,
        description: currentAdvice.description,
        content: currentAdvice.content,
        therapyId: currentAdvice.therapyId
      }, { emitEvent: false });

      this.previewUrl.set(currentAdvice.image?.url);
      this.file.set(null);
    }, { allowSignalWrites: true });
  }

  override getForm() { return this.adviceForm }
  override getCurrentItem() { return this.advice() }
  override getItemId() { return this.advice().adviceId }
  override getUploadFolder(): 'advice' { return 'advice' }

  override getCurrentImageKey(): string | undefined {
    return this.advice().image?.key;
  }

  override  buildUpdatedItem(formValue: object, image: ImageInfo | undefined): Advice {
    const currentAdvice = this.advice();
    const values = formValue as AdviceFormValue;
    const newImage = image !== undefined ? image : currentAdvice.image;

    return {
      ...currentAdvice,
      title: values.title,
      description: values.description,
      content: values.content,
      therapyId: values.therapyId,
      image: newImage
    } as Advice;
  }

  async submit() {
    const updatedAdvice = await this.submitBase();
    if (updatedAdvice) {
      this.update.emit(updatedAdvice);
    }
  }
}
