import { Component, inject } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'pim-footer',
  standalone: true,
  imports: [FontAwesomeModule],
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
            <a href="#servicios">Servicios</a>
            <a href="#recursos">Recursos</a>
            <a href="#horarios">Horarios</a>
          </div>
          <div class="links-column">
            <a href="#contacto">Contacta conmigo</a>
            <a href="#centro">Conoce nuestro centro</a>
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
  `,
  styles: `
    footer {
      background-color: #ebece9;
      padding: 1.5rem 8.4vw 0.5rem;
      font-family: 'Carlito', sans-serif;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
      margin-bottom: 2rem;
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
      margin-bottom: 1rem;
    }

    .footer-description {
      color: #968484;
      line-height: 1.6;
    }

    .links-block {
      display: flex;
      gap: 3rem;
    }

    .links-column {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
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
      gap: 1.85rem;
      justify-content: flex-end;
    }

    .social-block a {
      color: #2f2929;
      font-size: 2.5rem;
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
      margin-bottom: 1rem;
    }

    .copyright {
      color: #968484;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
      }

      .links-block {
        justify-content: space-between;
      }

      .social-block {
        justify-content: flex-start;
      }

      .footer-bottom {
        align-items: flex-start;
      }
    }
`
})
export class FooterComponent {
  cloudinary = inject(CloudinaryService);
  faInstagram = faInstagram;
  faFacebook = faFacebook;
  faLinkedin = faLinkedin;

  socialLinks = {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com'
  };
}
