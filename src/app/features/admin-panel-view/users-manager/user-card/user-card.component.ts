import { Component, input, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp, faTrash, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'pim-user-card',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="user-card" [class.approved]="user().approved" [class.pending]="!user().approved">
      <div class="user-info">
        @if (user().approved) {
          <img [src]="user().avatar?.url" alt="Avatar" class="avatar">
        }
        <div class="details">
          <h3>{{ user().name }}</h3>
          <p class="email">{{ user().email }}</p>

          @if (!user().approved && user().message; as message) {
            <div class="message-area" [class.expanded]="isExpanded()">
              <p>{{ user().message }}</p>
            </div>

              <button (click)="toggleExpanded()" class="toggle-notes-button" [class.toggle-expanded-button]="isExpanded()">
                @if (isExpanded()) {
                  <fa-icon [icon]="faDown"/>
                } @else {
                  <fa-icon [icon]="faUp"/>
                }
              </button>

          }
        </div>
      </div>

      <div class="actions">
        <button class="approve-btn"
                (click)="approve.emit(user().userId)"
                [disabled]="user().approved"
                [class.disabled]="user().approved"
        >
          <fa-icon [icon]="faUserCheck"/>
          {{ user().approved ? 'Aprobado' : 'Aprobar' }}
        </button>

        <button class="delete-btn" (click)="delete.emit(user().userId)">
          <fa-icon [icon]="faTrash"/>
          Borrar
        </button>
      </div>
    </div>
  `,
  styles: `
    .user-card {
      width: 350px;
      height: 198px;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      margin-bottom: 0.7rem;
      background-color: white;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      font-family: 'Carlito', sans-serif;
      position: relative;
    }

    .user-card.approved {
      border-left: 5px solid #e0f15e;
    }

    .user-card.pending {
      border-left: 5px solid #d1d1d1ff;
    }

    .user-info {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: fill;
      border: 2px solid #ddd;
    }

    .details h3 {
      font-size: 1.4rem;
    }

    .email {
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
    }

    .message-area {
      height: 40px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 0.3rem;
      color: #717171ff;
      overflow: hidden;
    }

    .message-area.expanded {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 1rem 0.7rem;
      overflow-y: auto;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .toggle-notes-button {
      align-self: flex-end;
      color: #717171ff;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 10px 10px 0 0;
      cursor: pointer;
      padding: 4px 7px 2px;
      position: absolute;
      bottom: 121px;
      right: 32px
    }

    .toggle-notes-button.toggle-expanded-button {
      bottom: 195px;
      right: 15px;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 2.2rem;
    }

    .actions button {
      padding: 0.7rem 1.2rem;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .approve-btn {
      background-color: #e0f15e;
      color: #686d35ff;
      border: 1px solid #ddd;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .approve-btn:hover:not(.disabled) {
      background-color: #cbd868ff;
      color: white;
    }
    .approve-btn.disabled {
      background-color: transparent;
      color: #6c757d;
      border-style: dashed;
      border-width: 2px;
      box-shadow: none;
    }

    .delete-btn {
      background-color: #f5f5f5;
      color: #717171ff;
      border: 1px solid #ddd;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .delete-btn:hover {
      background-color: #969595ff;
      color: #e8e8e8ff;
    }
  `
})
export class UserCardComponent {
  user = input.required<User>();

  approve = output<string>();
  delete = output<string>();

  faUserCheck = faUserCheck;
  faTrash = faTrash;
  faDown = faChevronDown;
  faUp = faChevronUp;

  isExpanded = signal(false);

  toggleExpanded() {
    this.isExpanded.update(value => !value)
  }
}
