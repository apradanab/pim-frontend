import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { IntroSectionComponent } from '../intro-section/intro-section.component';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { ServicesShowcaseComponent } from "../services-showcase/services-showcase.component";
import { ResourcesShowcaseComponent } from "../resources-showcase/resources-showcase.component";

@Component({
  selector: 'pim-home',
  standalone: true,
  imports: [HeaderComponent, IntroSectionComponent, HeroSectionComponent, AboutMeComponent, ServicesShowcaseComponent, ResourcesShowcaseComponent],
  template: `
    <pim-header></pim-header>
    <pim-intro-section></pim-intro-section>
    <pim-hero-section></pim-hero-section>
    <pim-about-me></pim-about-me>
    <pim-services-showcase></pim-services-showcase>
    <pim-resources-showcase></pim-resources-showcase>
  `,
  styles: ``
})
export default class HomeComponent {

}
