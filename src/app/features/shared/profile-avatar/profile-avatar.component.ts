import { Component, computed, inject, input } from '@angular/core';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'pim-profile-avatar',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="profile-menu">
      <button class="avatar-display"
              tabindex="0"
              (click)="navigateToProfile()"
              (keyup.enter)="navigateToProfile()">

        @if (currentUser()?.avatar?.url) {
          <img [src]="currentUser()?.avatar?.url"
              alt="Avatar de usuario"
              class="profile-avatar-img"/>
        } @else {
          <fa-icon [icon]="faUserCircle" class="profile-icon"></fa-icon>
        }
      </button>
    </div>
  `,
  styles: `
  .profile-menu {
      position: relative;
      cursor: pointer;
      font-family: 'Carlito', sans-serif;
    }

    .avatar-display {
      display: inline-flex;
      background-color: #ffffff;
      border: 4px solid rgba(81, 69, 69, 0.8);
      border-radius: 50px;
      padding: 2px;
    }

    .profile-avatar-img {
      width: 70px;
      height: 70px;
      border-radius: 50px;
      object-fit: cover;
    }

    .profile-icon {
      width: 70px;
      height: 70px;
      color: #1bbdbf;
      font-size: 70px;
      position: relative;
      bottom: 2px;
    }
  `
})
export class ProfileAvatarComponent {
  private readonly usersService = inject(UsersStateService);
  private readonly router = inject(Router);

  isMenuButton = input(false);

  faUserCircle = faUserCircle;

  currentUser = computed<User | null>(() => {
    const user = this.usersService.usersState().currentUser;
    return user;
  });

  navigateToProfile() {
    if (!this.isMenuButton()) {
      this.router.navigate(['/perfil']);
    }
  }
}
