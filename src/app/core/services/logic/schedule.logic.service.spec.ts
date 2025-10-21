import { TestBed } from '@angular/core/testing';
import { ScheduleLogicService } from './schedule.logic.service';

describe('ScheduleLogicService', () => {
  let service: ScheduleLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute weekDays and month label', () => {
    expect(service.weekDays().length).toBe(5);
    expect(typeof service.currentMonthLabel()).toBe('string');
  });

  it('should allow moving weeks forward and backward within limits', () => {
    const initialWeek = service.weekDays()[0].isoDate;
    if (service.goNext()) service.moveWeek(1);
    if (service.goPrevious()) service.moveWeek(-1);
    expect(service.weekDays()[0].isoDate).not.toBe(initialWeek);
  });

  it('should prevent moving weeks beyond limits', () => {
    while (service.goNext()) service.moveWeek(1);
    const lastWeek = service.weekDays()[0].isoDate;
    service.moveWeek(1);
    expect(service.weekDays()[0].isoDate).toBe(lastWeek);

    while (service.goPrevious()) service.moveWeek(-1);
    const firstWeek = service.weekDays()[0].isoDate;
    service.moveWeek(-1);
    expect(service.weekDays()[0].isoDate).toBe(firstWeek);
  });
});
