import { Component, inject } from '@angular/core';
import { DateTimeService } from '../../../core/services/utils/date-time.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'pim-week-navigation',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
  <div class="navigation">

    <div class="month-header">
    <span class="week">{{ dateTimeService.currentMonthLabel() }}</span>
    </div>

    <div class="calendar-navigation">
      <button
        (click)="dateTimeService.moveWeek(-1)"
        [disabled]="!dateTimeService.goPrevious()"
        [class.disabled]="!dateTimeService.goPrevious()">
        <fa-icon [icon]="faChevronLeft"></fa-icon>
      </button>
      <div class="calendar-icon">
      <fa-icon [icon]="faCalendar" [size]="'2x'"></fa-icon>
      </div>
      <button
        (click)="dateTimeService.moveWeek(1)"
        [disabled]="!dateTimeService.goNext()"
        [class.disabled]="!dateTimeService.goNext()">
        <fa-icon [icon]="faChevronRight"></fa-icon>
      </button>
    </div>

  </div>
  `,
  styles: `
  .navigation {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1rem;
    margin-top: 1rem;
    font-family: "Caprasimo", cursive;
  }

  .month-header {
    position: relative;
    left: 30px;
  }

  .calendar-navigation {
    display: flex;
    justify-content: space-between;
    min-width: 180px;
    position: relative;
    right: 33px;
  }

  .navigation button {
    background: #f5f5f5;
    color: white;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .navigation button:active:not(.disabled) {
    background: #ddd;
  }

  .navigation button.disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .calendar-icon {
    padding: 0.3rem 1.5rem;
    border-radius: 0.6rem;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  }

  fa-icon {
    color: #676762ff;
  }

  .week {
    font-size: 2.5rem;
    font-weight: normal;
    color: #676762ff;
  }
  `
})
export class WeekNavigationComponent {
  protected readonly dateTimeService = inject(DateTimeService);
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faCalendar = faCalendarDays;
}
