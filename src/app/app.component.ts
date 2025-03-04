import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { IntroSectionComponent } from './components/intro-section/intro-section.component';

@Component({
  selector: 'pim-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IntroSectionComponent],
  template: `
    <pim-header></pim-header>
    <pim-intro-section></pim-intro-section>
    <router-outlet />
  `,
  styles: [``],
})
export class AppComponent {

}
