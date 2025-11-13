import { Component, input, output } from '@angular/core';
import { Advice } from '../../../../models/advice.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AdviceEditFormComponent } from "../advice-edit-form/advice-edit-form.component";

@Component({
  selector: 'pim-advice-card',
  standalone: true,
  imports: [FontAwesomeModule, AdviceEditFormComponent],
  template: `
  @if (isEdit) {
    <pim-advice-edit-form
      [advice]="advice()"
      (update)="handleUpdate($event)"
      (cancelClick)="toggleEditMode()"/>
  } @else {
    <div class="card">
      <div class="card-text-details">
        <div class="header">
          <div class="header-left">
            <h3>{{ advice().title }}</h3>
            <p class="description">{{ advice().description }}</p>
          </div>
          @if (therapyTitle()) {
            <p class="therapy-title">{{ therapyTitle() }}</p>
          }
        </div>
        <p class="content">{{ advice().content }}</p>
      </div>

      <div class="card-side">
        <div class="card-side">
          <img [src]="advice().image.url" alt="">
        </div>

        <div class="actions">
          <button class="edit-btn" (click)="toggleEditMode()"><fa-icon [icon]="faPencil"/>Editar</button>
          <button class="delete-btn" (click)="delete.emit(advice().adviceId)"><fa-icon [icon]="faTrash"/>Borrar</button>
        </div>
      </div>
    </div>
  }

  `,
  styles: `
  .card {
    display: flex;
    justify-content: space-around;
    border: 4px solid #ebece9;
    border-radius: 1.5rem;
    padding: 20px 20px 0;
    gap: 2.8rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-family: 'Carlito', sans-serif;
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

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 10px;
  }

  .header-left h3 {
    font: 400 2.5rem/1 'Caprasimo', cursive;
    color: #2f2929;
  }

  .description {
    color: #9e9e9b;
    font-size: 1.3rem;
  }

  .therapy-title {
    padding: 10px;
    background-color: #e8e8e8ff;
    position: relative;
    color: #717171ff;
    border-radius: 20px 0 0 20px;
    position: absolute;
    top: 17px;
    right: -48px;
  }

  .content {
    line-height: 1.4;
    color: #555;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .card-side img {
    width: 250px;
    height: 260px;
    object-fit: cover;
    border-radius: 20px;
    border: 2px solid #ebece940;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 15px 10px;
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
export class AdviceCardComponent {
  advice = input.required<Advice>();
  therapyTitle = input<string>();
  edit = output<Advice>();
  delete = output<string>();

  isEdit: boolean = false;

  faPencil = faPencil;
  faTrash = faTrash;

  toggleEditMode() {
    this.isEdit = !this.isEdit;
  }

  handleUpdate(updatedAdvice: Advice) {
    this.edit.emit(updatedAdvice);
    this.isEdit = false;
  }
}
