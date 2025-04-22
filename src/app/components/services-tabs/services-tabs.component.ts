import { Component, inject, signal, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'pim-services-tabs',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="services-tabs">
      <div class="grid-background"></div>

      <div class="tabs-header">
        @for (service of services; track service.id; let i = $index) {
          <button class="tab-button" [class.active]="activeTab() === i" (click)="setActiveTab(i)"
                  [style.background]="getServiceStyle(i).bgColor">
            {{ service.title }}
            <span class="icon-circle">
              <fa-icon [icon]="faArrowDown" [class.rotated]="activeTab() === i" />
            </span>
          </button>
        }
      </div>

      <div class="tab-content">
        @if (services[activeTab()]) {
          <div class="service-detail">
            <h3>{{ services[activeTab()].title }}</h3>
            <p class="description">{{ services[activeTab()].description }}</p>
            <div class="content" [innerHTML]="cleanContent(services[activeTab()].content)"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .services-tabs {
      position: relative;
      font-family: 'Carlito', sans-serif;
      width: 100%;
      padding: 2rem 8.4vw;
      padding-top: 150px;
      background-color: #fcfcf9;
    }

    .grid-background {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      width: 85%;
      height: 180px;
      background-image:
        repeating-linear-gradient(90deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%),
        repeating-linear-gradient(0deg, #f4f2ed 0, #f4f2ed 1px, transparent 1px, transparent 100%);
      background-size: calc(100% / 14) calc(100% / 5);
      border: 2px solid #f4f2ed;
      border-top: none;
      z-index: 0;
      opacity: 0.8;
    }

    .tabs-header {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .tab-button {
      border: none;
      border-radius: 30px;
      padding: 1rem 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      transition: all 0.3s ease;
      font-family: 'Carlito', sans-serif;
      font-size: 1rem;
      color: #2f2929;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }

      &.active {
        color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
    }

    .icon-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;

      fa-icon {
        color: black;
        font-size: 12px;
        transition: all 0.3s ease;
      }
    }

    .tab-button.active .icon-circle {
      background: rgba(255,255,255,0.3);

      fa-icon {
        color: white;
        transform: rotate(180deg);
      }
    }

    .tab-content {
      padding: 1rem 0;
      animation: fadeIn 0.5s ease;
      position: relative;
      z-index: 1;
    }

    .service-detail h3 {
      font-size: 1.8rem;
      color: #2f2929;
      margin-bottom: 1.2rem;
      font-family: 'Caprasimo', cursive;
    }

    .description {
      font-size: 1.2rem;
      color: #555;
      margin-bottom: 1.8rem;
      line-height: 1.5;
    }

    .content {
      line-height: 1.6;
      color: #555;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .services-tabs {
        padding: 1.5rem;
        padding-top: 120px;
      }

      .grid-background {
        width: 90%;
        height: 150px;
        top: 20px;
        background-size: calc(100% / 10) calc(100% / 4);
      }

      .tab-button {
        padding: 0.8rem 1.2rem;
        font-size: 0.9rem;
      }

      .icon-circle {
        width: 20px;
        height: 20px;

        fa-icon {
          font-size: 10px;
        }
      }
    }
  `
})
export class ServicesTabsComponent implements OnInit {
  private stateService = inject(StateService);
  private sanitizer = inject(DomSanitizer);
  activeTab = signal(0);
  faArrowDown = faArrowDown;

  serviceStyles = [
    { bgColor: '#fea087' },
    { bgColor: '#e0f15e' },
    { bgColor: '#b7a8ed' }
  ];

  get services() {
    return this.stateService.state$().services;
  }

  ngOnInit() {
    this.stateService.loadServices();
  }

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }


  cleanContent(content: string): string {
    if (!content) return '';

    let cleaned = content.replace(/<(?!\/?b\b|\/?br\b)[^>]+>/g, '');

    cleaned = cleaned.replace(/<(b|br)(?:\s+[^>]*)?>/g, '<$1>');

    return cleaned;
  }


  getServiceStyle(index: number) {
    return this.serviceStyles[index % this.serviceStyles.length];
  }
}
