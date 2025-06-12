import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { GridSectionComponent } from "../shared/grid-section/grid-section.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { TherapiesTabsComponent } from "./therapies-tabs/therapies-tabs.component";


@Component({
  selector: 'pim-therapies-view',
  standalone: true,
  imports: [
    HeaderComponent,
    TherapiesTabsComponent,
    GridSectionComponent,
    FooterComponent
  ],
  template: `
    <pim-header></pim-header>
    <pim-therapies-tabs></pim-therapies-tabs>
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
export default class TherapiesViewComponent {

}
