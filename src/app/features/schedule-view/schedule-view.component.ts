import { Component } from '@angular/core';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { ScheduleGridComponent } from "./schedule-grid/schedule-grid.component";
import { WeekNavigationComponent } from './week-navigation/week-navigation.component';
import { GridSectionComponent } from "../shared/grid-section/grid-section.component";

@Component({
  selector: 'pim-schedule-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ScheduleGridComponent, WeekNavigationComponent, GridSectionComponent],
  template: `
  <div>
    <pim-header></pim-header>
    <pim-week-navigation></pim-week-navigation>
    <pim-schedule-grid></pim-schedule-grid>
    <pim-grid-section
      logoColor="green"
      sectionTitle="Únete a nuestra comunidad"
      [showDecorations]="true"
      [showButton]="true"
    />
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
