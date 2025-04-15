import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { IntroSectionComponent } from '../intro-section/intro-section.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { ServicesShowcaseComponent } from "../services-showcase/services-showcase.component";
import { ResourcesShowcaseComponent } from "../resources-showcase/resources-showcase.component";
import { GridSectionComponent } from "../grid-section/grid-section.component";

@Component({
  selector: 'pim-home',
  standalone: true,
  imports: [HeaderComponent, IntroSectionComponent, HeroSectionComponent, AboutMeComponent, ServicesShowcaseComponent, ResourcesShowcaseComponent, GridSectionComponent],
  template: `
    <pim-header></pim-header>
    <pim-intro-section></pim-intro-section>
    <pim-hero-section></pim-hero-section>
    <pim-about-me></pim-about-me>
    <pim-services-showcase></pim-services-showcase>
    <pim-grid-section
      logoColor="purple"
      sectionTitle="Descubre lo que necesitas saber"
    >
    </pim-grid-section>
    <pim-resources-showcase></pim-resources-showcase>
    <pim-grid-section
      logoColor="green"
      sectionTitle="Únete a nuestra comunidad"
      [showDecorations]="true"
      [showButton]="true"
    >
    </pim-grid-section>
  `,
  styles: ``
})
export default class HomeComponent {

}
