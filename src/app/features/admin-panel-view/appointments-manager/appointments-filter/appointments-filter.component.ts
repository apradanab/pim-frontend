import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterCriteria, FilterOptions } from '../../../../models/appointment.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-appointments-filter',
  standalone: true,
  imports: [FormsModule, DatePipe, FontAwesomeModule],
  template: `
    <div class="filters-container">
      <div class="icon">
        <fa-icon [icon]="faDots"/>
        <fa-icon [icon]="faDots"/>
      </div>
      <select [(ngModel)]="monthFilter" (ngModelChange)="emitCriteria()">
        <option [ngValue]="null">Mes</option>
        @for (month of filterOptions().availableMonths; track month) {
          <option [ngValue]="month">{{ month | date:'MMMM yyyy' }}</option>
        }
      </select>

      <select [(ngModel)]="therapyFilter" (ngModelChange)="emitCriteria()">
        <option [ngValue]="null">Terapia</option>
        @for (therapy of filterOptions().therapies; track therapy.id) {
          <option [ngValue]="therapy.id">{{ therapy.title }}</option>
        }
      </select>

      <select [(ngModel)]="userFilter" (ngModelChange)="emitCriteria()">
        <option [ngValue]="null">Usuario</option>
        @for (user of filterOptions().users; track user.email) {
          <option [ngValue]="user.email">{{ user.name }}</option>
        }
      </select>

      <button class="clear-btn" (click)="clearFilters()">
        <fa-icon [icon]="faClear"/>
      </button>
    </div>
  `,
  styles: `
  .filters-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .icon {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 8px 0 0 8px;
    color: #717171ff;
    background-color: #f5f5f5;
  }

  fa-icon {
    font-size: 1.2rem;
  }

  select {
    border: 1px solid #ddd;
    padding: 10px 5px;
  }

  .clear-btn {
    padding: 6px 8px;
    color: #717171ff;
    border: 1px solid #ddd;
    border-radius: 0 12px 12px 0;
  }
  `
})
export class AppointmentsFilterComponent {
  filterOptions = input.required<FilterOptions>();
  filterChange = output<FilterCriteria>();

  faDots = faEllipsisVertical;
  faClear = faArrowRotateRight;

  monthFilter: string | null = null;
  therapyFilter: string | null = null;
  userFilter: string | null = null;

  emitCriteria(): void {
    const criteria: FilterCriteria = {
      month: this.monthFilter,
      therapyId: this.therapyFilter,
      userEmail: this.userFilter,
    };

    this.filterChange.emit(criteria);
  }

  clearFilters(): void {
    this.monthFilter = null;
    this.therapyFilter = null;
    this.userFilter = null;
    this.emitCriteria();
  }
}
