import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pim-mobile-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="sidebar"
      [ngClass]= "{ 'active': active }"
      >
      <div class="menu">
        <a href="#">Servicios</a>
        <a href="#">Recursos</a>
        <a href="#">Conecta conmigo</a>
        <a href="#">Nuestro centro</a>
      </div>
    </div>
  `,
  styles: `
  .sidebar {
      position: fixed;
      top: 100px;
      width: 100%;
      height: 246px;
      background-color: #ebece9;
      border: 1px solid #b3b3b3;
      box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
      transform: translateX(100%);
      transition: transform 1s ease-in-out;
      z-index: 1;
    }

    .sidebar.active {
      transform: translateX(0);
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
      font-size: 1.2rem;
      font-weight: 700;
      color: black;
      border-bottom: 1px solid #ccc;
      padding: 15px 20px;
    }

    a:active {
      color: #d4a517;
    }
  `
})
export class MobileSidebarComponent {
  @Input() active= false;
}
