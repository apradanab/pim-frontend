import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { ScheduleGridComponent } from "./schedule-grid/schedule-grid.component";
import { WeekNavigationComponent } from './week-navigation/week-navigation.component';

@Component({
  selector: 'pim-schedule-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ScheduleGridComponent, WeekNavigationComponent],
  template: `
  <div>
    <pim-header></pim-header>
    <pim-week-navigation></pim-week-navigation>
    <pim-schedule-grid></pim-schedule-grid>
    <pim-footer></pim-footer>
  </div>
  `,
  styles: `
  div {
    background-color: #fcfcf9;
  }
  `
})
export default class ScheduleViewComponent {
}
