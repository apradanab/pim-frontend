import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MobileSidebarComponent } from "../mobile-sidebar/mobile-sidebar.component";
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { Router } from '@angular/router';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';
import { StateService } from '../../../core/services/state.service';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from "../login-modal/login-modal.component";

@Component({
  selector: 'pim-header',
  standalone: true,
  imports: [FontAwesomeModule, MobileSidebarComponent, ContactModalComponent, CommonModule, LoginModalComponent],
  template: `
    <header class="header">
      <div class="logo"
          (click)="navigateToHome()"
          (keyup.enter)="navigateToHome()"
          tabindex="0">
        <img [src]="cloudinary.local.favicon" width="150" height="150" alt="Logo" class="logo-icon">
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
        <a class="nav-option" href="#recursos">Consejos</a>
        <a class="nav-option"
          (click)="openContactModal()"
          (keyup.enter)="openContactModal()"
          tabindex="0"
        >Conecta conmigo</a>
        <a class="nav-option"
          aria-label="Ver en Google Maps"
          (click)="openGoogleMaps()"
          (keyup.enter)="openGoogleMaps()"
          tabindex="0"
        >Nuestro centro</a>
      </nav>

      <div class="login-container">
        <button class="login-button"
                (click)="openLoginModal()"
                (keyup.enter)="openLoginModal()"
                tabindex="0"
        >Iniciar sesión</button>
      </div>

      <button class="burger-menu"
              (click)="toggleSidebar()"
              aria-label="Toggle sidebar"
      >
        <fa-icon [icon]="sidebarActive ? faXmark : faBars"></fa-icon>
      </button>

    </header>

    <pim-mobile-sidebar [active]="sidebarActive"></pim-mobile-sidebar>

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
    width: 80px;
    height: 80px;
    margin-right: 16px;
    cursor: pointer;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    font: bold 1.3rem / 1.2 'Carlito', sans-serif;
    color: #17475f;
  }

  .nav-options {
    display: flex;
    gap: 20px;
    cursor: pointer;
    margin-right: 280px;
  }

  .nav-option {
    font-size: 1.06rem;
    font-family: 'Carlito', sans-serif;
    color: #2f2929;
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
    background-color: #2f2929;
    border-radius: 30px;
    padding: 5px 10px;
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
    background-color: transparent;
    border: 2px solid black;
    background-color: #f2f8fa;
    padding : 3px 8px;
    border-color: #17475f;
  }

  .login-button:active {
    color: #17475f;
    transition: all 0.15s ease;
  }

  .burger-menu {
  display: none;
  }

  @media(max-width: 768px) {
    .header {
      padding: 0 30px;
      position: fixed;
    }

    .logo-icon {
      width: 78px;
      height: 78px;
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
      display: block;
      min-width: 45px;
      min-height: 53px;
      font-size: 1.85rem;
      color: #f2f8fa;
      background-color: #2f2929;
      border-radius: 10px;
      border: 2px solid transparent;
      transition:
        background-color 0.2s ease,
        transform 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
    }

    .burger-menu:active {
      background-color: #f2f8fa;
      border-color: #2f2929;
      color: #2f2929;
    }
  }
  `
})
export class HeaderComponent  {
  readonly cloudinary = inject(CloudinaryService);
  readonly router = inject(Router);
  readonly stateService = inject(StateService);

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
