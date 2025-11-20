import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationModalComponent } from "../../shared/confirmation-modal/confirmation-modal.component";
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { UserCardComponent } from "./user-card/user-card.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DateTimeService } from '../../../core/services/utils/date-time.service';

@Component({
  selector: 'pim-users-manager',
  standalone: true,
  imports: [UserCardComponent, FontAwesomeModule, ConfirmationModalComponent],
  template: `
    <div class="management">

      @if (isLoading()) {
        <div class="loading-overlay">
          <fa-icon [icon]="faSpinner" size="2x"></fa-icon>
          <span>Cargando...</span>
        </div>
      }

      @if (usersState().error && !isLoading()) {
        <div class="error">Error en la carga de usuarios: {{ usersState().error }}</div>
      } @else if (usersState().list.length > 0) {
        <div class="list">
          @for (user of orderedUsers(); track user.userId) {
            <pim-user-card
              [user]="user"
              (approve)="handleApprove($event)"
              (delete)="handleDelete($event)"
            />
          }
        </div>
      } @else if (!isLoading()) {
        <div class="empty-state">No hay usuarios para mostrar.</div>
      }

      @if (userToDelete()) {
        <pim-confirmation-modal
          [id]="userToDelete()!"
          (confirm)="confirmDelete($event)"
          (modalClosed)="cancelDelete()"
        />
      }
    </div>
  `,
  styles: `
    .management {
      font-family: "Carlito", sans-serif;
      min-height: 500px;
      border-top: 4px solid #ebece9;
      padding: 2rem 3rem;
      background-color: white;
      animation: fadeIn 0.5s ease;
      box-shadow:
          8px 0 15px -10px rgba(0,0,0,0.2),
          -8px 0 15px -10px rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
    }

    .list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .error, .empty-state {
      text-align: center;
      padding: 20px;
      font-weight: bold;
      color: #dc3545;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;
      color: #1bbdbf;
      z-index: 10;
    }
  `
})
export class UsersManagerComponent {
  private readonly stateService = inject(UsersStateService);
  private readonly dateTimeService = inject(DateTimeService);

  usersState = this.stateService.usersState;
  userToDelete = signal<string | null>(null);
  isLoading = signal(false);

  faSpinner = faSpinner;

  orderedUsers = computed(() => {
    const users = this.usersState().list;
    const validUsers = users.filter((user) => user.createdAt);
    return this.dateTimeService.sortItemsByDate(validUsers, (user) => user.createdAt!);
  });

  constructor() {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);

    try {
      await this.stateService.listUsers();
    } finally {
      this.isLoading.set(false);
    }
  }

  async handleApprove(userId: string) {
    try {
      await this.stateService.approveUser(userId);
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  }

  handleDelete(userId: string) {
    this.userToDelete.set(userId);
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }

  async confirmDelete(userId: string) {
    this.userToDelete.set(null);
    try {
      await this.stateService.deleteUser(userId);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  }
}
