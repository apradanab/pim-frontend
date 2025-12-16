import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdvicesStateService } from '../../../../core/services/states/advices.state.service';
import { Therapy } from '../../../../models/therapy.model';
import { faArrowUpFromBracket, faCheck, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AdviceInput } from '../../../../models/advice.model';
import { BaseEditForm } from '../../../shared/base-edit-form/base-edit-form';
import { ImageInfo, UploadFolder } from '../../../../models/form.model';

@Component({
  selector: 'pim-advice-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
  <form [formGroup]="adviceForm" (submit)="submit()" class="create-form">

    @if (advicesState().error) {
      <div class="error-message">Error: {{ advicesState().error }}</div>
    }

    <div class="form-text-details">
      <div class="header">
        <label for="therapyId">
          <select id="therapyId" formControlName="therapyId" class="therapy-title-input-field">
            <option value="" disabled>Elige terapia</option>
            @for (therapy of availableTherapies(); track therapy.therapyId) {
              <option [value]="therapy.therapyId">{{ therapy.title }}</option>
            }
          </select>
        </label>

        <label for="title">
          <input id="title" type="text" formControlName="title" class="title-input-field" placeholder="Título" />
        </label>

        <label for="description">
          <input id="description" formControlName="description" class="description-input-field" placeholder="Descripción breve"/>
        </label>
      </div>

        <label for="content">
          <textarea id="content" formControlName="content" class="content-input-field" placeholder="Contenido completo"></textarea>
        </label>
    </div>

    <div class="form-side">
      <div class="image-section">
        <label for="image">
          <input id="image" type="file" (change)="handleFileChange($event)" style="display:none;">
          @if (previewUrl()) {
            <div class="placeholder-img">
              <img [src]="previewUrl()" alt="Vista previa de la imagen">
              <div class="overlay"><fa-icon [icon]="faUpload"/></div>
            </div>
          } @else {
            <div class="placeholder-img">
              <div class="overlay">
                <fa-icon [icon]="faUpload"/>
              </div>
            </div>
          }
        </label>
      </div>

      <div class="actions">
        <button type="submit" class="save-btn" [disabled]="adviceForm.invalid || advicesState().isLoading">
          <fa-icon [icon]="advicesState().isLoading ? faCheck : faThumbs"/>
          {{ advicesState().isLoading ? 'Guardando...' : 'Guardar' }}
        </button>

        <button type="button" class="cancel-btn" (click)="cancelClick.emit()" [disabled]="advicesState().isLoading">
          <fa-icon [icon]="faTimes"/>Cancelar
        </button>
      </div>
    </div>
  </form>
  `,
  styles: `
  .create-form {
    display: flex;
    justify-content: space-around;
    font-family: 'Carlito', sans-serif;
    width: 100%;
    border-radius: 1.5rem;
    border: 4px solid #ebece9;
    padding: 20px 20px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)
  }

  .form-text-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 700px;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }

  .therapy-title-input-field {
    position: absolute;
    top: 19px;
    right: -28px;
    padding: 10px;
    background-color: #e8e8e8ff;
    color: #717171ff;
    border: none;
    border-radius: 20px 0 0 20px;
  }

  .title-input-field {
    font: 400 2.5rem/1 'Caprasimo', cursive;
    color: #2f2929;
    width: 500px;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 12px;
  }

  .description-input-field {
    font-size: 1.3rem;
    color: #9e9e9b;
    width: 100%;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 12px;
    margin-top: 5px;
  }

  .content-input-field {
    font-size: 1rem;
    font-family: 'Carlito', sans-serif;
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

  .form-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  img {
    width: 250px;
    height: 260px;
    object-fit: cover;
    border-radius: 20px;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .placeholder-img {
    position: relative;
    width: 250px;
    height: 260px;
    object-fit: cover;
    border-radius: 20px;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

  .actions {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 0.5rem;
    margin: 15px 10px;
    cursor: pointer;
  }

  button {
    display: flex;
    padding: 10px 15px;
    background-color: #e8e8e8ff;
    border: 1px solid #ddd;
    border-radius: 30px;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  `
})
export class AdviceCreateFormComponent extends BaseEditForm<AdviceInput> implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly stateService = inject(AdvicesStateService);

  advicesState = this.stateService.advicesState;

  availableTherapies = input.required<Therapy[]>();
  adviceCreated = output<void>();
  cancelClick = output<void>();

  adviceForm!: FormGroup;

  faThumbs = faThumbsUp;
  faTimes = faTimes;
  faCheck = faCheck;
  faUpload = faArrowUpFromBracket;

  ngOnInit(): void {
    this.adviceForm = this.fb.group({
      therapyId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  override getForm(): FormGroup { return this.adviceForm }

  override getCurrentItem(): AdviceInput { return {} as AdviceInput }
  override getItemId(): string { return `new-${Date.now()}` }
  override getUploadFolder(): UploadFolder { return 'advice' as UploadFolder; }
  override getCurrentImageKey(): string | undefined { return undefined; }

  override buildUpdatedItem(formValue: object, image: ImageInfo | undefined): AdviceInput {
    const inputValues = formValue as AdviceInput;

    return {
      ...inputValues,
      imageKey: image?.key
    } as AdviceInput;
  }

  async submit() {
    const finalAdviceInput = await this.submitBase();
    if (!finalAdviceInput) return;

    await this.stateService.createAdvice(finalAdviceInput);

    if (!this.advicesState().error) {
      this.adviceCreated.emit();
      this.adviceForm.reset();
      this.adviceForm.get('therapyId')?.setValue('');
      this.file.set(null);
      this.previewUrl.set(undefined);
    }
  }
}
