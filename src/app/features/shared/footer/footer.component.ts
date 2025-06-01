import { Component, inject } from '@angular/core';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { ContactModalComponent } from "../contact-modal/contact-modal.component";

@Component({
  selector: 'pim-footer',
  standalone: true,
  imports: [FontAwesomeModule, ContactModalComponent],
  template: `
    <footer>
      <div class="footer-content">
        <div class="footer-block logo-block">
          <img [src]="cloudinary.svg.logoInline" alt="Logo" class="footer-logo">
          <p class="footer-description">
            Apoyando a niños y adolescentes con estrategias terapéuticas personalizadas para un futuro emocionalmente equilibrado.
          </p>
        </div>

        <div class="footer-block links-block">
          <div class="links-column">
            <a (click)="navigateToServicesDetail()"
              (keyup.enter)="navigateToServicesDetail()"
              tabindex="0"
            >Servicios
            </a>
            <a href="#recursos">Recursos</a>
            <a href="#horarios">Horarios</a>
          </div>
          <div class="links-column">
            <a aria-label="Ver formulario de contacto"
              (click)="openContactModal()"
              (keyup.enter)="openContactModal()"
              tabindex="0"
            >Conecta conmigo</a>
            <a aria-label="Ver en Google Maps"
              (click)="openGoogleMaps()"
              (keyup.enter)="openGoogleMaps()"
              tabindex="0"
            >Conoce nuestro centro</a>
          </div>
        </div>

        <div class="footer-block social-block">
          <a [href]="socialLinks.instagram" aria-label="Instagram">
            <fa-icon [icon]="faInstagram"></fa-icon>
          </a>
          <a [href]="socialLinks.facebook" aria-label="Facebook">
            <fa-icon [icon]="faFacebook"></fa-icon>
          </a>
          <a [href]="socialLinks.linkedin" aria-label="LinkedIn">
            <fa-icon [icon]="faLinkedin"></fa-icon>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-line"></div>
        <p class="copyright">Psicología Infantojuvenil Montcada © 2025</p>
      </div>
    </footer>

    @if (showContactModal) {
      <pim-contact-modal (modalClosed)="closeContactModal()"></pim-contact-modal>
    }
  `,
  styles: `
    footer {
      background-color: #ebece9;
      padding: 1.5rem 8.4vw 0.5rem;
      font-family: 'Carlito', sans-serif;
    }

    .footer-content {
      display: flex;
      gap: 2rem;
    }

    .footer-block {
      flex: 1;
      min-width: 200px;
    }

    .logo-block {
      max-width: 300px;
    }

    .footer-logo {
      width: 100px;
    }

    .footer-description {
      color: #968484;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .links-block {
      display: flex;
      gap: 3rem;
    }

    .links-column {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      cursor: pointer;
    }

    .links-column a {
      color: #2f2929;
      text-decoration: none;
      transition: color 0.3s;
    }

    .links-column a:hover {
      color: #f3552d;
    }

    .social-block {
      display: flex;
      gap: 1.5rem;
      justify-content: flex-end;
    }

    .social-block a {
      color: #2f2929;
      font-size: 2rem;
      transition: color 0.3s;
    }

    .social-block a:hover {
      color: #f3552d;
    }

    .footer-bottom {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .footer-line {
      width: 100%;
      height: 1px;
      background-color: #2f2929;;
    }

    .copyright {
      color: #968484;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      footer {
        padding: 1rem 8.4vw 0.2rem;
      }

      .footer-content {
        flex-direction: row;
      }

      .footer-description {
        font-size: 0.65rem;
        width: 190px;
      }

      .links-block {
        display: none;
      }

      .social-block {
        justify-content: flex-end;
        align-items: flex-end;
        gap: 1.35rem;
      }

      .social-block a {
        font-size: 2.1rem;
      }

      .copyright {
        font-size: 0.65rem;
      }
    }
`
})
export class FooterComponent {
  readonly cloudinary = inject(CloudinaryService);
  readonly router = inject(Router);

  showContactModal = false;

  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faLinkedin = faLinkedin;

  navigateToServicesDetail() {
    this.router.navigate(['/servicios/terapia-individual']);
  }

  openContactModal() {
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
  }

  openGoogleMaps() {
    const address = encodeURIComponent('Calle París 1, Montcada, Barcelona, 08110');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);
  }

  socialLinks = {
    instagram: 'https://www.instagram.com/espaipim/',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com'
  };
}
