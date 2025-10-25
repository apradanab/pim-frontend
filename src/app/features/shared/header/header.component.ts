import { Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MobileSidebarComponent } from "../mobile-sidebar/mobile-sidebar.component";
import { Router } from '@angular/router';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { UsersStateService } from '../../../core/services/states/users.state.service';
import { LoginModalComponent } from "../login-modal/login-modal.component";
import { ImageService } from '../../../core/services/utils/image.service';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
  selector: 'pim-header',
  standalone: true,
  imports: [FontAwesomeModule, MobileSidebarComponent, ContactModalComponent, LoginModalComponent, ProfileAvatarComponent],
  template: `
    <header class="header">
      <div class="logo"
          (click)="navigateToHome()"
          (keyup.enter)="navigateToHome()"
          tabindex="0">
        <img [src]="imageService.local.favicon" width="150" height="150" alt="Logo" class="logo-icon">
        <div class="logo-text">
          <span>Psicología</span>
          <span>Infantojuvenil</span>
          <span>Montcada</span>
        </div>
      </div>

      <nav class="nav-options">
        <a class="nav-option"
          (click)="navigateToTherapiesView()"
          (keyup.enter)="navigateToTherapiesView()"
          tabindex="0"
        >Terapias
        </a>
        <a class="nav-option"
          (click)="navigateToAdvicesView()"
          (keyup.enter)="navigateToAdvicesView()"
          tabindex="0"
        >Consejos
        </a>
        <a class="nav-option"
          (click)="navigateToSchedule()"
          (keyup.enter)="navigateToSchedule()"
          tabindex="0"
        >Horarios
        </a>
        <a class="nav-option"
          (click)="openContactModal()"
          (keyup.enter)="openContactModal()"
          tabindex="0"
        >Conecta conmigo
        </a>
        <a class="nav-option"
          aria-label="Ver en Google Maps"
          (click)="openGoogleMaps()"
          (keyup.enter)="openGoogleMaps()"
          tabindex="0"
        >Nuestro centro
        </a>
      </nav>

      <div class="login-container" [class.user-logged-in]="isLoggedIn()">
        @if (isLoggedIn()) {
          <pim-profile-avatar></pim-profile-avatar>
        } @else {
          <button class="login-button"
                (click)="openLoginModal()"
                (keyup.enter)="openLoginModal()"
                tabindex="0"
        >Iniciar sesión</button>
        }
      </div>

      @if (!isLoggedIn()) {
        <button class="burger-menu"
          (click)="toggleSidebar()"
          aria-label="Toggle sidebar"
          [attr.aria-expanded]="sidebarActive">
          <svg class="burger-icon" viewBox="0 0 24 24">
            <path class="burger-line top" [class.active]="sidebarActive" d="M4 12h16c0.6 0 1 0.4 1 1s-0.4 1-1 1H4c-0.6 0-1-0.4-1-1s0.4-1 1-1z"/>
            <path class="burger-line middle" [class.active]="sidebarActive" d="M4 12h16c0.6 0 1 0.4 1 1s-0.4 1-1 1H4c-0.6 0-1-0.4-1-1s0.4-1 1-1z"/>
            <path class="burger-line bottom" [class.active]="sidebarActive" d="M4 12h16c0.6 0 1 0.4 1 1s-0.4 1-1 1H4c-0.6 0-1-0.4-1-1s0.4-1 1-1z"/>
          </svg>
        </button>
      } @else {
        <pim-profile-avatar class="avatar-menu"
        [isMenuButton]="true"
        (click)="toggleSidebar()"
        tabindex="0"
        aria-label="Ver perfil y menú">
        </pim-profile-avatar>
      }

    </header>

    <pim-mobile-sidebar [active]="sidebarActive" [isLoggedIn]="isLoggedIn()"></pim-mobile-sidebar>

    @if (showContactModal) {
      <pim-contact-modal (modalClosed)="closeContactModal()"></pim-contact-modal>
    }

    @if (showLoginModal) {
      <pim-login-modal (modalClosed)="closeLoginModal()"></pim-login-modal>
    }
  `,
  styles: `
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 120px;
    background-color: #ebece9;
    height: 90px;
    width: 100%;
    z-index: 2;
    border-bottom: 2px solid #b3b3b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo-icon {
    width: 76px;
    height: 76px;
    margin-right: 16px;
    cursor: pointer;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    font: bold 1.3rem / 1.2 'Carlito', sans-serif;
    color:rgba(81, 69, 69, 0.8);
  }

  .nav-options {
    display: flex;
    gap: 20px;
    cursor: pointer;
    margin-right: auto;
    margin-left: 65px;
  }

  .nav-option {
    font-size: 1.06rem;
    font-family: 'Carlito', sans-serif;
    color: #514545;
    text-decoration: none;
    transition: background-color 0.15s ease, transform 0.1s ease;
    border-radius: 30px;
    padding: 5px 10px;
  }

  .nav-option:hover {
    color: #f3552d;
    border-radius: 30px;
    transition: color 0.3s;
  }

  .login-container {
    background-color:rgba(81, 69, 69, 0.8);
    border-radius: 30px;
    padding: 5px 10px;
    white-space: nowrap;
  }

  .login-button {
    font-family: 'Carlito', sans-serif;
    font-size: 1.06rem;
    color: #f2f8fa;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 6px 14px;
  }

  .login-container:active {
    box-shadow:
      0px -5px 10px 5px rgba(23, 153, 155, 0.54),
      0 5px 10px 5px rgba(80, 85, 143, 0.54);
    background-color: #ebece9;
    border: 2.5px solid black;
    color: rgba(81, 69, 69, 0.8);
    padding : 3px 8px;
    border-color: rgba(81, 69, 69, 0.8);
  }

  .login-button:active {
    color: rgba(81, 69, 69, 0.8);
    font-weight: bold;
    font-size: 1rem;
  }

  .login-container.user-logged-in {
    background-color: transparent;
    border-radius: 50px;
    padding: 0px;
    border: 0.5px;
  }

  .burger-menu {
    display: none;
  }

  .avatar-menu {
    display: none;
  }

  @media(max-width: 768px) {
    .header {
      padding: 0 30px;
      position: fixed;
    }

    .logo-icon {
      width: 72px;
      height: 72px;
    }

    .logo-text {
      font-size: 1.2rem;
    }

    .nav-options {
      display: none;
    }

    .login-container {
      display: none;
    }

    .burger-menu {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 45px;
      min-height: 53px;
      background-color:rgba(81, 69, 69, 0.8);
      border: none;
      border-radius: 10px;
      box-shadow: inset 0px -2.5px 1px #514545;
      transition: all 0.5s ease;

      &:active {
        background-color:rgba(81, 69, 69, 0.92);
        box-shadow: inset 0px 4px 2px #514545;
      }
    }

    .avatar-menu {
      display: flex;
      align-items: center;
    }

    .burger-icon {
      width: 30px;
      height: 30px;

      .burger-line {
        fill: none;
        stroke: #f2f8fa;
        stroke-width: 2.6;
        transform-origin: center;
        transition: all 0.5s ease;

        &.top {
          transform: translateY(-9px);
        }

        &.bottom {
          transform: translateY(9px);
        }

        &.active.top {
          transform: translateX(0px) rotate(48deg);
        }

        &.active.middle {
          opacity: 0;
        }

        &.active.bottom {
          transform: translateX(-1px) rotate(-48deg);
        }
      }
    }
  }
  `
})
export class HeaderComponent  {
  readonly imageService = inject(ImageService);
  readonly router = inject(Router);
  readonly stateService = inject(UsersStateService);

  protected readonly currentUser = computed(() => this.stateService.usersState().currentUser);
  protected readonly isLoggedIn = computed(() => !!this.currentUser());

  sidebarActive = false;
  showContactModal = false;
  showLoginModal = false;

  faBars = faBars;
  faXmark = faXmark;

  navigateToHome() {
    this.router.navigate(['/home'])
  }

  navigateToTherapiesView() {
    this.router.navigate(['/terapias/terapia-individual']);
  }

  navigateToAdvicesView() {
    this.router.navigate(['/consejos'])
  }

  navigateToSchedule() {
    this.router.navigate(['/horarios']);
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  openContactModal() {
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openGoogleMaps() {
    const address = encodeURIComponent('Calle París 1, Montcada, Barcelona, 08110');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);
  }
}
