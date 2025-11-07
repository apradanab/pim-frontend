import { Component, computed, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pim-appointments-paginator',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (totalPages() > 1) {
      <div class="pagination-controls">
        <button (click)="previousPage.emit()" [disabled]="currentPage() === 1">
          <div class="icon-circle"><fa-icon [icon]="faLeft"/></div>
        </button>
        <h3>Citas</h3>
        <button (click)="nextPage.emit()" [disabled]="currentPage() === totalPages()">
          <div class="icon-circle"><fa-icon [icon]="faRight"/></div>
        </button>
      </div>
    }
  `,
  styles: `
  .pagination-controls {
    width: 120px;
    display: flex;
    justify-content: space-between;
  }

  button {
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
  }

  .icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #92d4d5;
  }

  .icon-circle fa-icon {
    color: white;
    font-size: small;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 100;
    color: white;
  }
  `
})
export class AppointmentsPaginatorComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input.required<number>();

  nextPage = output<void>();
  previousPage = output<void>();

  faRight = faChevronRight;
  faLeft = faChevronLeft;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
}
