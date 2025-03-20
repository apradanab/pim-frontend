import { Component } from '@angular/core';

@Component({
  selector: 'pim-intro-section',
  standalone: true,
  imports: [],
  template: `
    <div class="intro-section">
      <div class="grid-background"></div>
      <div class="content">
        <h1>Niños y Familias</h1>
        <h2>creciendo juntos y unidos</h2>
        <p>
          En nuestro gabinete de psicología infantil en Montcada, Barcelona, ofrecemos un espacio de apoyo y orientación para el bienestar emocional y el crecimiento de los mas pequeños y sus familias.
        </p>
        <button>Pide información</button>
      </div>
    </div>
  `,
  styles: `
  .intro-section {
    position: relative;
    text-align: center;
    padding: 0 40px 60px;
    padding-top: 150px;
    background: #fcfcf9;
    display: flex;
    justify-content: center;
  }

  .grid-background {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    width: 83%;
    height: 350px;
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
    font-size: 4.8rem;
    position: relative;
    bottom: 10px;
  }

  .intro-section h2 {
    font-family: 'Caprasimo', cursive;
    font-weight: normal;
    font-size: 3.8rem;
    position: relative;
    bottom: 15px;
  }

  .intro-section p {
    font-family: 'Carlito', sans-serif;
    font-size: 1.3rem;
    width: 570px;
    z-index: 1;
  }

  .intro-section button {
    background: #f3552d;
    font-size: 1.3rem;
    color: white;
    margin-top: 5px;
    border: none;
    padding: 20px 45px;
    border-radius: 30px;
    box-shadow: inset 0px -7px 2px #b64022;
    cursor: pointer;
    position: relative;
    top: 10px;
  }

  .intro-section button:active {
    background: #e8512b;
    box-shadow: inset 0px 6px 2px #aa3e22;
  }

  @media(max-width: 768px) {
    .intro-section {
      padding-top: 30px;
    }

    .grid-background {
      top: 0px;
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
      font-size: 0.9rem;
      padding: 15px 20px;
      box-shadow: inset 0px -5px 2px #b64022;
      top: 30px;
    }

    .intro-section button:active {
      box-shadow: inset 0px 4px 2px #aa3e22;
    }
  }
  `
})
export class IntroSectionComponent {

}
