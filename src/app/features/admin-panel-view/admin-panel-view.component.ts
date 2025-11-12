import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { AdminTabsControllerComponent } from "./admin-tabs-controller/admin-tabs-controller.component";

@Component({
  selector: 'pim-admin-panel-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AdminTabsControllerComponent],
  template: `
  <pim-header></pim-header>
  <pim-admin-tabs-controller></pim-admin-tabs-controller>
  <pim-footer></pim-footer>
  `,
  styles: ``
})
export default class AdminPanelViewComponent {

}
