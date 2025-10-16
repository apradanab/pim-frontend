import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'pim-schedule-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  template: `
    <pim-header></pim-header>
    <pim-footer></pim-footer>
  `,
  styles: ``
})
export default class ScheduleViewComponent {

}
