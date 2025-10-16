import { ComponentFixture, TestBed } from '@angular/core/testing';
import  ScheduleViewComponent  from './schedule-view.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ScheduleViewComponent', () => {
  let component: ScheduleViewComponent;
  let fixture: ComponentFixture<ScheduleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleViewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
