import { Component } from '@angular/core';
import { FooterComponent } from "../shared/footer/footer.component";
import { GridSectionComponent } from "../shared/grid-section/grid-section.component";
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'pim-advices-view',
  standalone: true,
  imports: [
    HeaderComponent,
    GridSectionComponent,
    FooterComponent
  ],
  template: `
    <pim-header></pim-header>
    <pim-grid-section
      logoColor="green"
      sectionTitle="Únete a nuestra comunidad"
      [showDecorations]="true"
      [showButton]="true"
    >
    </pim-grid-section>
    <pim-footer></pim-footer>
  `,
  styles: ``
})
export default class AdvicesViewComponent {

}
