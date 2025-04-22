import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { GridSectionComponent } from "../grid-section/grid-section.component";
import { FooterComponent } from "../footer/footer.component";
import { ServicesTabsComponent } from "../services-tabs/services-tabs.component";


@Component({
  selector: 'pim-services-detail',
  standalone: true,
  imports: [HeaderComponent, GridSectionComponent, FooterComponent, ServicesTabsComponent],
  template: `
    <pim-header></pim-header>
    <pim-services-tabs></pim-services-tabs>
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
export class ServicesDetailComponent {

}
