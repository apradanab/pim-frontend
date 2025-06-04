import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'pim-mobile-sidebar',
  standalone: true,
  imports: [LoginModalComponent],
  template: `
    <div
      class="sidebar"
      [class.active]="active()"
      >
      <div class="menu">
        <a (click)="openLoginModal()"
          (keyup.enter)="openLoginModal()"
          tabindex="0"
        >Iniciar sesión</a>
        <a (click)="navigateToServicesDetail()"
          (keyup.enter)="navigateToServicesDetail()"
          tabindex="0"
          >Servicios
        </a>
        <a href="#">Recursos</a>
        <a aria-label="Ver en Google Maps"
          (click)="openGoogleMaps()"
          (keyup.enter)="openGoogleMaps()"
          tabindex="0"
        >Nuestro centro</a>
      </div>
    </div>

    @if (showLoginModal) {
      <pim-login-modal (modalClosed)="closeLoginModal()"></pim-login-modal>
    }
  `,
  styles: `
  .sidebar {
      position: fixed;
      top: 90px;
      width: 50%;
      height: 232px;
      background-color: #ebece9;
      border: 1px solid #b3b3b3;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
      transform: translateX(225%);
      transition: transform 1s ease-in-out;
      z-index: 2;
    }

    .sidebar.active {
      transform: translateX(100%);
      pointer-events: auto;
    }

    .menu {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    a {
      font-family: "Carlito", sans-serif;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 700;
      color: #17475f;
      border-bottom: 1px solid #ccc;
      padding: 15px 20px;
    }
  `
})
export class MobileSidebarComponent {
  active = input(false);
  showLoginModal = false;
  readonly router = inject(Router);

  navigateToServicesDetail() {
    this.router.navigate(['/servicios/terapia-individual']);
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
