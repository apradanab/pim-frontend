import { Component } from '@angular/core';
import { ContactModalComponent } from "../../../shared/contact-modal/contact-modal.component";

@Component({
  selector: 'pim-intro-section',
  standalone: true,
  imports: [ContactModalComponent],
  template: `
    <div class="intro-section">
      <div class="grid-background"></div>
      <div class="content">
        <h1>Niños y familias</h1>
        <h2>creciendo juntos y unidos</h2>
        <p>
          En nuestro gabinete de psicología infantil en Montcada, Barcelona, ofrecemos un espacio de apoyo y orientación para el bienestar emocional y el crecimiento de los mas pequeños y sus familias.
        </p>
        <button (click)="openContactModal()"
                (keyup.enter)="openContactModal()"
                tabindex="0"
        >Pide información</button>
      </div>
    </div>

    @if (showContactModal) {
      <pim-contact-modal (modalClosed)="closeContactModal()"></pim-contact-modal>
    }
  `,
  styles: `
  .intro-section {
    position: relative;
    text-align: center;
    padding: 60px 40px;
    display: flex;
    justify-content: center;
    background-color: #fcfcf9;
  }

  .grid-background {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 83%;
    height: 350px;
    background-color: white;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 16) calc(100% / 5);
    border-bottom: 3px solid #f4f2ed;
    border-left: 2px solid #f4f2ed;
    border-right: 2px solid #f4f2ed;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .intro-section h1 {
    font-family: 'Caprasimo', cursive;
    font-weight: normal;
    font-size: 4.6rem;
    position: relative;
    bottom: 20px;
  }

  .intro-section h2 {
    font-family: 'Caprasimo', cursive;
    font-weight: normal;
    font-size: 3.8rem;
    position: relative;
    bottom: 25px;
  }

  .intro-section p {
    font-family: 'Carlito', sans-serif;
    font-size: 1.3rem;
    color: #9e9e9b;
    width: 570px;
    z-index: 1;
    position: relative;
    bottom: 13px;
  }

  .intro-section button {
    background: #f3552d;
    font-size: 1.15rem;
    color: white;
    margin-top: 5px;
    border: none;
    padding: 20px 50px;
    border-radius: 30px;
    box-shadow: inset 0px -6px 2px #b64022;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    top: 16px;
    z-index: 1;
  }

  .intro-section button:active {
    background: #e8512b;
    box-shadow: inset 0px 6px 2px #aa3e22;
  }

  @media(max-width: 768px) {
    .intro-section {
      padding-top: 110px;
    }

    .grid-background {
      top: 80px;
      height: 225px;
      background-size: calc(100% / 10) calc(100% / 6);
    }

    .intro-section h1 {
      font-size: 2.5rem;
      top: 5px;
    }

    .intro-section h2 {
      font-size: 1.8rem;
      top: 1px;
    }

    .intro-section p {
      margin: auto;
      font-size: 0.9rem;
      padding: 0 35px;
      width: 460px;
      position: relative;
      top: 10px;
    }

    .intro-section button {
      font-size: 1rem;
      padding: 20px 40px;
      box-shadow: inset 0px -5px 2px #b64022;
      top: 25px;
    }

    .intro-section button:active {
      box-shadow: inset 0px 4px 2px #aa3e22;
    }
  }
  `
})
export class IntroSectionComponent {
  showContactModal = false;

  openContactModal() {
    this.showContactModal = true;
  }

  closeContactModal() {
    this.showContactModal = false;
  }
}
