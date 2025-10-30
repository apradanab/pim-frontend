import { TestBed } from '@angular/core/testing';
import { DateTimeService } from './date-time.service';

describe('DateTimeService', () => {
  let service: DateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute weekDays and month label', () => {
    expect(service.weekDays().length).toBe(5);
    expect(typeof service.currentMonthLabel()).toBe('string');
  });

  describe('moveWeek', () => {
    it('should move week forward when allowed', () => {
      const initialWeek = service.weekDays()[0].isoDate;
      if (service.goNext()) service.moveWeek(1);
      expect(service.weekDays()[0].isoDate).not.toBe(initialWeek);
    });

    it('should move week backward when allowed', () => {
      while (service.goNext()) service.moveWeek(1);
      const currentWeek = service.weekDays()[0].isoDate;
      if (service.goPrevious()) service.moveWeek(-1);
      expect(service.weekDays()[0].isoDate).not.toBe(currentWeek);
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
  })

  describe('getNextHour', () => {
    it('should return the next half-hour slot', () => {
      const next = service.getNextHour('13:00');
      expect(next).toBe('13:30');
    });

    it('should return an empty string if there is no next hour', () => {
      const next = service.getNextHour('20:00');
      expect(next).toBe('');
    });
  });

  it('parseDateString. Should parse date string correctly into Date object', () => {
    const dateString = '2025-10-25';
    const date = service.parseDateString(dateString);

    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(25);
  });

  it('timeToMinutes. Should correctly convert a time string to minutes', () => {
    expect(service.timeToMinutes('9:00')).toBe(540);
    expect(service.timeToMinutes('10:30')).toBe(630);
    expect(service.timeToMinutes('20:00')).toBe(1200);
  });

  it('formatDisplayDate. Should format a date string into a readable Spanish date', () => {
    const dateString = '2025-10-25';
    const formattedDate = service.formatDisplayDate(dateString);

    expect(formattedDate).toBe('sábado, 25 octubre de 2025');
    expect(formattedDate).toContain('sábado');
    expect(formattedDate).toContain('25 octubre de 2025');
  });
});
