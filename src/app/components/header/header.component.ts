import { Component } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { MobileSidebarComponent } from "../mobile-sidebar/mobile-sidebar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pim-header',
  standalone: true,
  imports: [FontAwesomeModule, MobileSidebarComponent, CommonModule],
  template: `
    <header class="header">
      <div class="logo">
        <img src="assets/logo.svg" alt="Logo" class="logo-icon">
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
    margin-right: 16px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    font-family: 'Carlito', sans-serif;
    font-size: 1.3rem;
    font-weight: bold;
    color: #17475f;
  }

  .nav-options {
    display: flex;
    gap: 20px;
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
    background-color: #f2f8fa;
    color: #17475f;
    border-radius: 30px;
    transform: scale(1.02);
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
      position: relative;
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
      transition: background-color 0.2s ease,
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
  sidebarActive = false;
  faBars = faBars;
  faXmark = faXmark;

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
}
