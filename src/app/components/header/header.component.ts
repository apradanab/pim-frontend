import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MobileSidebarComponent } from "../mobile-sidebar/mobile-sidebar.component";
import { CommonModule } from '@angular/common';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'pim-header',
  standalone: true,
  imports: [FontAwesomeModule, MobileSidebarComponent, CommonModule],
  template: `
    <header class="header">
      <div class="logo">
        <img [src]="logo" alt="Logo" class="logo-icon">
        <div class="logo-text">
          <span>Psicología</span>
          <span>Infantojuvenil</span>
          <span>Montcada</span>
        </div>
      </div>

      <nav class="nav-options">
        <a class="nav-option" href="#servicios">Servicios</a>
        <a class="nav-option" href="#recursos">Recursos</a>
        <a class="nav-option" href="#conecta">Conecta conmigo</a>
        <a class="nav-option" href="#centro">Nuestro centro</a>
      </nav>

      <div class="login-container">
        <button class="login-button">Iniciar sesión</button>
      </div>

      <button
        class="burger-menu"
        (click)="toggleSidebar()"
        aria-label="Toggle sidebar"
        >
        <fa-icon [icon]="sidebarActive ? faXmark : faBars"></fa-icon>
      </button>

    </header>
    <pim-mobile-sidebar [active]="sidebarActive"></pim-mobile-sidebar>
  `,
  styles: `
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 120px;
    background-color: #ebece9;
    height: 90px;
    position: fixed;
    top: 0;
    left: 0;
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
    width: 75px;
    height: auto;
    margin-right: 16px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    font-family: 'Carlito', sans-serif;
    font-size: 20px;
    font-weight: bold;
    color: #17475f;
  }

  .nav-options {
    display: flex;
    gap: 20px;
    margin-right: 200px;
  }

  .nav-option {
    padding: 10px 1px;
    font-size: 17px;
    font-family: 'Carlito', sans-serif;
    font-weight: normal;
    color: #000000;
    text-decoration: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    border-radius: 30px;
    padding: 5px 10px;
  }

  .nav-option:hover {
    background-color: #f2f8fa;
    border-radius: 30px;
    transform: scale(1.05);
  }

  .login-container {
    background-color: #2f2929;
    border-radius: 30px;
    padding: 5px 10px;
  }

  .login-button {
    font-family: 'Carlito', sans-serif;
    font-size: 17px;
    color: #FFFFFF;
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
  }

  .login-button:active {
    color: black;
    transform: scale(1);
    transition: all 0.2s ease;
  }

  .burger-menu {
  display: none;
  }

  @media(max-width: 768px) {
    .header {
      padding: 0 30px;
      justify-content: space-between;
      position: relative;
    }

    .logo-text {
      font-size: 1rem;
    }

    .nav-options {
      display: none;
    }

    .login-container {
      display: none;
    }

    .burger-menu {
      display: block;
      font-size: 1.5rem;
      color: #f2f8fa;
      background-color: #2f2929;
      border-radius: 10px;
      padding: 10px;
      transition: background-color 0.3s ease,
      transform 0.2s ease;
    }

    .burger-menu:active {
      background-color: transparent;
      border: 2px solid black;
      background-color: #f2f8fa;
    }
  }
  `
})
export class HeaderComponent  {
  private cloudinary = inject(CloudinaryService);
  logo = this.cloudinary.getSvg('v1742987785/pim-images/pim-logo-inline_fitso1.svg');
  sidebarActive = false;
  faBars = faBars;
  faXmark = faXmark;

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
}
