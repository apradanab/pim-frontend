import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { IntroSectionComponent } from './components/intro-section/intro-section.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import CompleteRegistrationComponent from './components/complete-registration/complete-registration.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { TherapiesShowcaseComponent } from "./components/therapies-showcase/therapies-showcase.component";
import { AdvicesShowcaseComponent } from "./components/advices-showcase/advices-showcase.component";
import { GridSectionComponent } from "../shared/grid-section/grid-section.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'pim-home',
  standalone: true,
  imports: [
    HeaderComponent,
    IntroSectionComponent,
    HeroSectionComponent,
    CompleteRegistrationComponent,
    AboutMeComponent,
    TherapiesShowcaseComponent,
    AdvicesShowcaseComponent,
    GridSectionComponent,
    FooterComponent
  ],
  template: `
      <pim-header></pim-header>
      <pim-intro-section></pim-intro-section>
      <pim-hero-section></pim-hero-section>
      <pim-about-me></pim-about-me>
      <pim-therapies-showcase></pim-therapies-showcase>
      <pim-grid-section
        logoColor="purple"
        sectionTitle="Descubre lo que necesitas saber">
      </pim-grid-section>
      <pim-advices-showcase></pim-advices-showcase>
      <pim-grid-section
        logoColor="green"
        sectionTitle="Únete a nuestra comunidad"
        [showDecorations]="true"
        [showButton]="true">
      </pim-grid-section>
      <pim-footer></pim-footer>
      <pim-complete-registration/>
  `,
  styles: ``
})
export default class HomeComponent {

}
