import { Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-note-edit',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  template: `
    <div>
      <textarea [(ngModel)]="currentNote" name="notes"></textarea>

      <div class="edit-actions">
          <button class="save-note-btn" (click)="saveNote()" title="Guardar">
              <fa-icon [icon]="faSave"/>
          </button>
          <button class="cancel-note-btn" (click)="cancelClick.emit()" title="Cancelar">
              <fa-icon [icon]="faTimes"/>
          </button>
      </div>
    </div>
  `,
  styles: `
  textarea {
    font-family: 'Carlito', sans-serif;
    font-size: 0.9rem;
    position: absolute;
    top: -1px;
    right: -1px;
    height: 130px;
    width: 242px;
    padding: 6px 7px;
    border: 1px;
    color: #343a40;
    overflow-y: auto;
    scrollbar-color: lightgray #f5f5f5;
  }

  button {
    color: #717171ff;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 10px 10px 0 0;
    cursor: pointer;
    padding: 6px 12px;
    position: absolute;
    bottom: -2px;
  }

  .save-note-btn {
    left: 54px;
  }

  .cancel-note-btn {
    left: 97px;
  }
  `
})
export class NoteEditComponent implements OnInit{
  initialNote = input<string>('');
  noteSaved = output<string>();
  cancelClick = output<void>();

  currentNote = signal('');

  faTimes = faTimes;
  faSave = faCheck;

  ngOnInit(): void {
    this.currentNote.set(this.initialNote() || '');
  }

  saveNote() {
    this.noteSaved.emit(this.currentNote());
  }
}
