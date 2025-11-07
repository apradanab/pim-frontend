import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

@Component({
  selector: 'pim-user-profile-view',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ProfileHeaderComponent, AppointmentsListComponent],
  template: `
  <div>
    <pim-header></pim-header>
    <pim-profile-header></pim-profile-header>
    <pim-appointments-list></pim-appointments-list>
    <pim-footer></pim-footer>
  </div>
  `,
  styles: ``
})
export default class UserProfileViewComponent {

}
