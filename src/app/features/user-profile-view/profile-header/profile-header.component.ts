import { Component, computed, inject } from '@angular/core';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/states/auth.state.service';

@Component({
  selector: 'pim-profile-header',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
  <div class="profile-header">
    <div class="background"></div>
    <div class="profile-card">
      @if (currentUser()) {
        <div class="avatar-area">
          @if (currentUser()?.avatar?.url; as avatarUrl) {
            <img [src]="avatarUrl" alt="Avatar de usuario" class="avatar-img"/>
          } @else {
            <fa-icon [icon]="faUserCircle" class="default-icon"></fa-icon>
          }
        </div>

        <div class="info-area">
          <h2> {{ currentUser()?.name || currentUser()?.email || 'Usuario' }}</h2>
          <p> {{ currentUser()?.email }} </p>
          <p> {{ currentUser()?.createdAt }} </p>
        </div>

        <div class="button-area">
          <button class="schedule-button" (click)="navigateToSchedule()">Reservar cita</button>
          <button class="edit-button">Editar perfil</button>
          <button class="logout-button" (click)="logout()">Cerrar sesión</button>
        </div>
      }
    </div>
  </div>
  `,
  styles: `
  .profile-header {
    margin: 0 8.4vw;
    margin-top: 1.3rem;
  }

  .background {
    height: 110px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 14) calc(100% / 2);
  }

  .profile-card {
    display: flex;
    align-items: center;
    padding: 20px 15px 0 15px;
    margin-bottom: 20px;
  }

  .avatar-area {
    position: relative;
    bottom: 5vw;
    left: 10vw;
  }

  .avatar-img, .default-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;

    color: #514545;
  }

  .default-icon {
    width: 70px;
    height: 70px;
    color: #1bbdbf;
    font-size: 70px;
    position: relative;
    bottom: 2px;
  }

  .info-area {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: 'Carlito', sans-serif;
  }

  .button-area {
    display: flex;
  }

  .schedule-button {
    padding: 10px 15px;
    background-color: #eafa74ff;
    border: 1px solid #c3d060ff;
    border-radius: 0.6rem;
  }

  .schedule-button:hover {
    background-color: #c3d060ff;
  }

  .edit-button {
    padding: 10px 15px;
    background-color: #fbc3b4ff;
    border: 1px solid #ca9f93ff;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .edit-button:hover {
    background-color: #ca9f93ff;
  }

  .logout-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 10px 15px;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .logout-button:hover {
    background-color: #ddd;
  }

  `
})
export class ProfileHeaderComponent {
  private readonly usersState = inject(UsersStateService);
  private readonly authService = inject(AuthStateService);
  private readonly router = inject(Router);

  faUserCircle = faUserCircle;

  currentUser = computed(() => this.usersState.usersState().currentUser);

  navigateToSchedule() {
    this.router.navigate(['/horarios']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
