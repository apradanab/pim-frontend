import { Component, input, output } from '@angular/core';
import { Therapy } from '../../../../models/therapy.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TherapyEditFormComponent } from "../therapy-edit-form/therapy-edit-form.component";

@Component({
  selector: 'pim-therapy-card',
  standalone: true,
  imports: [FontAwesomeModule, TherapyEditFormComponent],
  template: `
    <div class="card" [style.background]="therapy().bgColor">
      @if (isEdit) {
        <pim-therapy-edit-form
          [therapy]="therapy()"
          (update)="handleUpdate($event)"
          (cancelClick)="toggleEditMode()"
        />
      } @else {
        <div class="card-text-details">
          <div class="header">
              <h3>{{ therapy().title }}</h3>
              <p>{{ therapy().description }}</p>
          </div>
          <div class="content-wrapper">
              <p class="content">{{ therapy().content }}</p>
          </div>
        </div>

        <div class="card-side">
          <div class="image-wrapper">
              <img [src]="therapy().image?.url" alt="">
          </div>

          <div class="footer-side">
            <div class="color-wrapper">
              <div class="color-indicator" [style.background]="therapy().bgColor"></div>
            </div>
              <p> {{ therapy().maxParticipants }}</p>
            <div class="actions">
                <button class="edit-btn" (click)="toggleEditMode()"><fa-icon [icon]="faPencil"/>Editar</button>
                <button class="delete-btn" (click)="delete.emit(therapy().therapyId)"><fa-icon [icon]="faTrash"/>Borrar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
  .card {
    display: flex;
    justify-content: space-around;
    border: 1px solid #ebece940;
    border-radius: 1.5rem;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    font-family: 'Carlito', sans-serif;
  }

  .card-text-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .header h3 {
    font: 400 3rem/1 'Caprasimo', cursive;
    margin-bottom: 10px;
  }

  .header p {
    font-size: 1.35rem;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
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
    padding: 8px 25px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: #d1d2d0ff white;
  }

  .card-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .image-wrapper {

  }

  .card-side img {
    width: 280px;
    height: 320px;
    object-fit: cover;
    border: 2px solid #ebece940;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .footer-side {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    min-height: 85px;
    margin-top: 6px;
  }

  .color-wrapper {
    padding: 7px;
    background-color: white;
    border-radius: 12px;
    align-self: flex-end;
    border: 2px solid #ebece9a7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .color-indicator {
    padding: 20px;
    border-radius: 50%;
  }

  .footer-side p {
    padding: 13px 18px;
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
export class TherapyCardComponent {
  therapy = input.required<Therapy>();

  edit = output<Therapy>();
  delete = output<string>();

  isEdit: boolean = false;

  faPencil = faPencil;
  faTrash = faTrash;

  toggleEditMode() {
    this.isEdit = !this.isEdit;
  }

  handleUpdate(updatedTherapy: Therapy) {
    this.edit.emit(updatedTherapy);
    this.isEdit = false;
  }
}
