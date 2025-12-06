import { Component } from '@angular/core';
import { TherapiesManagerComponent } from "../therapies-manager/therapies-manager.component";
import { AdvicesManagerComponent } from "../advices-manager/advices-manager.component";
import { UsersManagerComponent } from "../users-manager/users-manager.component";
import { AppointmentsManagerComponent } from "../appointments-manager/appointments-manager.component";

@Component({
  selector: 'pim-admin-tabs-controller',
  standalone: true,
  imports: [TherapiesManagerComponent, AdvicesManagerComponent, UsersManagerComponent, AppointmentsManagerComponent],
  template: `
    <div class="admin-tabs">
      <div class="grid-background"></div>

      <div class="tabs-header">
        @for (tab of tabs; track tab.key) {
          <button class="tab-button"
                  (click)="setActiveTab(tab.key)"
                  [class.active]="activeTab === tab.key"
          >
          {{ tab.label }}
          </button>
        }
      </div>

      <div class="tabs-content">
        @if (activeTab === 'therapies') {
          <pim-therapies-manager/>
        } @else if (activeTab === 'advices') {
          <pim-advices-manager/>
        } @else if (activeTab === 'users') {
          <pim-users-manager/>
        } @else if (activeTab === 'appointments') {
          <pim-appointments-manager></pim-appointments-manager>
        }
      </div>
    </div>
  `,
  styles: `
  .admin-tabs {
    position: relative;
    font-family: 'Carlito', sans-serif;
    width: 100%;
    padding: 2rem 8.4vw;
    padding-top: 65px;
    background-color: #fcfcf9;
  }

  .grid-background {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    width: 83%;
    height: 165px;
    background-image:
      repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
      repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
    background-size: calc(100% / 16) calc(100% / 3);
    border: 2px solid #f4f2ed;
    border-top: none;
    z-index: 0;
    opacity: 0.8;
    background-color: white;
  }

  .tabs-header {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 20px;
    width: 100%;
  }

  .tab-button {
    border: 1px solid #dddddd4d;
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1rem 1.8rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    transition: all 0.3s ease;
    font-family: 'Carlito', sans-serif;
    font-size: 1.25rem;
    cursor: pointer;
    position: relative;
    top: 4px;
    background: #ebece9;

    &.active {
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 1;
      transform: translateY(-4px);
    }
  }
  `
})
export class AdminTabsControllerComponent {
  activeTab: string = 'therapies';

  tabs = [
    { key: 'therapies', label: 'Terapias'},
    { key: 'advices', label: 'Consejos'},
    { key: 'users', label: 'Usuarios'},
    { key: 'appointments', label: 'Citas'},
  ];

  setActiveTab(tabKey: string) {
    this.activeTab = tabKey;
  }
}
