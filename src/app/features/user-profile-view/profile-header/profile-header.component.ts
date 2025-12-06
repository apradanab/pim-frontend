import { Component, computed, inject, signal } from '@angular/core';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../core/services/states/auth.state.service';
import { EditProfileModalComponent } from "../edit-profile-modal/edit-profile-modal.component";
import { faCalendar, faEnvelope, faPencil, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { ImageService } from '../../../core/services/utils/image.service';

@Component({
  selector: 'pim-profile-header',
  standalone: true,
  imports: [FontAwesomeModule, EditProfileModalComponent],
  template: `
  <div class="profile-header">
    <div class="background">
      <img [src]="walkingChatIcon" alt="Icono de chat caminando" class="deco-icon walking-chat">
      <img [src]="jumpingTriangleIcon" alt="Icono de triángulo corriendo" class="deco-icon running-triangle">
    </div>
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
          <h2> <fa-icon [icon]="faUser"/> {{ currentUser()?.name || currentUser()?.email || 'Usuario' }}</h2>
          <p> <fa-icon [icon]="faEnvelope"/> {{ currentUser()?.email }} </p>
          <p> <fa-icon [icon]="faCalendar"/> Desde: {{ formattedCreationDate() }} </p>
        </div>

        <svg class="profile-separator-svg" width="85%" height="2">
          <line x1="0%" y1="1" x2="80%" y2="1" stroke="#ddd" stroke-width="1"/>
        </svg>

        <div class="button-area">
          <button class="schedule-button" (click)="navigateToSchedule()"><fa-icon [icon]="faCalendar"/>Reservar cita</button>
          <button class="edit-button" (click)="openEditModal()"><fa-icon [icon]="faPencil"/>Editar perfil</button>
          <button class="logout-button" (click)="logout()"><fa-icon [icon]="faBracket"/>Cerrar sesión</button>
        </div>
      }
    </div>
  </div>

  @if (isModalOpen()) {
    <pim-edit-profile-modal (modalClosed)="isModalOpen.set(false)"></pim-edit-profile-modal>
  }
  `,
  styles: `
  .profile-header {
    margin: 0 8.4vw;
    margin-top: 1.3rem;
    font-family: 'Carlito', sans-serif;
  }

  .background {
    height: 110px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 14) calc(100% / 2);
  }

  .deco-icon {
    position: absolute;
  }

  .walking-chat {
    width: 150px;
    top: 12vh;
    right: 12vw;
  }

  .running-triangle {
    width: 90px;
    top: 15.5vh;
    right: 34vw;
  }

  .profile-card {
    display: flex;
    align-items: center;
    padding: 20px 10px 0 15px;
    margin-bottom: 10px;
    max-height: 70px;
  }

  .avatar-area {
    position: relative;
    bottom: 5.8vw;
    left: 10.5vw;
    display: inline-flex;
    background-color: #ffffff;
    border: 4px solid rgba(81, 69, 69, 0.8);
    border-radius: 50%;
    padding: 2px;
  }

  .avatar-img, .default-icon {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: fill;
    color: #514545;
  }

  .default-icon {
    width: 70px;
    height: 70px;
    color: #1bbdbf;
    font-size: 70px;
    position: relative;
    bottom: 6px;
  }

  .info-area {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    right: 100px;
    color: #514545ea;
  }

  .info-area h2 {
    font-size: 1.3rem;
  }

  .info-area fa-icon {
    color: #514545ea;
    margin-right: 3px;
    font-size: 1.2rem;
  }

  .profile-separator-svg {
    position: absolute;
    top: 287px;
  }

  .button-area {
    display: flex;
    min-width: 410px;
    justify-content: space-between;
    position: relative;
    top: 23px;
  }

  .schedule-button {
    padding: 10px 15px;
    background-color: #eafa74ff;
    color: #686d35ff;
    border: 1px solid #c3d060ff;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .schedule-button fa-icon {
    padding: 0 10px 0 0;
  }

  .schedule-button:active {
    background-color: #cddb66ff;
    color: white;
  }

  .edit-button {
    padding: 10px 15px;
    background-color: #f5f5f5;
    color: #717171ff;
    border: 1px solid #ddd;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .edit-button fa-icon {
    padding: 0 10px 0 0;
    color: #717171ff;
  }

  .edit-button:active {
    background-color: #ddd;
  }

  .logout-button {
    background-color: #f5f5f5;
    color: #717171ff;
    border: 1px solid #ddd;
    padding: 10px 15px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .logout-button fa-icon {
    padding: 0 10px 0 0;
    color: #717171ff;
  }

  .logout-button:active {
    background-color: #ddd;
  }

  `
})
export class ProfileHeaderComponent {
  private readonly usersState = inject(UsersStateService);
  private readonly authService = inject(AuthStateService);
  private readonly dateTimeService = inject(DateTimeService);
  private readonly imageService = inject(ImageService);
  private readonly router = inject(Router);

  isModalOpen = signal(false);
  faUserCircle = faUserCircle;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faCalendar = faCalendar;
  faPencil = faPencil;
  faBracket = faRightFromBracket;

  walkingChatIcon = this.imageService.icons.walkingChat;
  jumpingTriangleIcon = this.imageService.icons.jumpingTriangle;

  currentUser = computed(() => this.usersState.usersState().currentUser);

  formattedCreationDate = computed(() => {
    const user = this.currentUser();

    if (user?.createdAt) {
      const fullDateString = this.dateTimeService.formatDisplayDate(user.createdAt.split('T')[0]);
      const parts = fullDateString.split(' ');

      let cleanedDate = parts.slice(1).join(' ');
      cleanedDate = cleanedDate.replace(',', '');
      return cleanedDate;
    }
    return 'Fecha no disponible';
  });

  navigateToSchedule() {
    this.router.navigate(['/horarios']);
  }

  openEditModal() {
    this.isModalOpen.set(true);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
