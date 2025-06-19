import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faHeart, faHouse, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-mobile-sidebar',
  standalone: true,
  imports: [LoginModalComponent, FontAwesomeModule],
  template: `
    <div
      class="sidebar"
      [class.active]="active()"
      >
      <div class="menu">
        <a (click)="openLoginModal()"
          (keyup.enter)="openLoginModal()"
          tabindex="0"
          >
          <fa-icon [icon]="faUser"></fa-icon>
          <span>Iniciar sesión</span>
          <fa-icon [icon]="faChevron"></fa-icon>
        </a>
        <a (click)="navigateToTherapies()"
          (keyup.enter)="navigateToTherapies()"
          tabindex="0"
          >
          <fa-icon [icon]="faHeart"></fa-icon>
          <span>Terapias</span>
          <fa-icon [icon]="faChevron"></fa-icon>
        </a>
        <a (click)="navigateToAdvices()"
          (keyup.enter)="navigateToAdvices()"
          tabindex="0"
          >
          <fa-icon [icon]="faMessage"></fa-icon>
          <span>Consejos</span>
          <fa-icon [icon]="faChevron"></fa-icon>
        </a>
        <a aria-label="Ver en Google Maps"
          (click)="openGoogleMaps()"
          (keyup.enter)="openGoogleMaps()"
          tabindex="0"
          >
          <fa-icon [icon]="faHouse"></fa-icon>
          <span>Nuestro centro</span>
          <fa-icon [icon]="faChevron"></fa-icon>
        </a>
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
      height: 200px;
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
    }

    a {
      font-family: "Carlito", sans-serif;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 700;
      color:rgba(81, 69, 69, 0.8);
      gap: 1rem;
      border-bottom: 1px solid #ccc;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      position: relative;

      span {
        flex-grow: 1;
        text-align: initial;
      }

      fa-icon {
        color:rgba(81, 69, 69, 0.8);
      }

      &:active {
        color: #17999b;
        box-shadow: inset 0 0 5px 2px rgba(23, 153, 155, 0.3);
        background-color: rgba(27, 188, 191, 0.08);

        fa-icon {
          color: #17999b;
        }
      }
    }
  `
})
export class MobileSidebarComponent {
  readonly router = inject(Router);

  active = input(false);
  showLoginModal = false;

  faUser = faUser;
  faHeart = faHeart;
  faMessage = faMessage;
  faHouse = faHouse;
  faChevron = faChevronRight;

  navigateToTherapies() {
    this.router.navigate(['/terapias/terapia-individual']);
  }

  navigateToAdvices() {
    this.router.navigate(['/consejos']);
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
