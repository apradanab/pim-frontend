import { TestBed } from '@angular/core/testing';
import { DateTimeService } from './date-time.service';
import { Appointment, AppointmentStatus } from '../../../models/appointment.model';

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
    expect(service.weekDays().length).toBe(4);
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
      const next = service.getNextHour('10:00');
      expect(next).toBe('10:20');
    });

    it('should return an empty string if there is no next hour', () => {
      const next = service.getNextHour('19:15');
      expect(next).toBe('');
    });
  });

  it('normalizeTime. Should remove leading zero from time', () => {
    expect(service.normalizeTime('09:30')).toBe('9:30');
    expect(service.normalizeTime('9:30')).toBe('9:30');
  });

  it('parseDateString. Should return Date(0) when empty or blank string is provided', () => {
    const d1 = service.parseDateString('');
    const d2 = service.parseDateString('   ');

    expect(d1.getTime()).toBe(0);
    expect(d2.getTime()).toBe(0);
  });

  it('parseDateString. Should parse date string correctly into Date object', () => {
    const dateString = '2025-10-25';
    const date = service.parseDateString(dateString);

    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(25);
  });

  it('parseDateString. Should handle ISO strings containing T', () => {
    const isoDateString = '2025-10-26T14:01:01.005Z';
    const date = service.parseDateString(isoDateString);

    expect(date.getTime()).toBeGreaterThan(0);

    expect(date.getUTCFullYear()).toBe(2025);
    expect(date.getUTCMonth()).toBe(9);
    expect(date.getUTCDate()).toBe(26);
  })

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

  it('formatShortDate. Should format a date string into a short Spanish date', () => {
    const dateString = '2025-10-25';
    const formattedDate = service.formatShortDate(dateString);

    expect(formattedDate).toContain('sáb');
    expect(formattedDate).toContain('25');
    expect(formattedDate).toContain('10');
    expect(formattedDate).toContain('25');
  })

  describe('sortItemsByDate', () => {
    const mockApts: Appointment[] = [
      { appointmentId: 'a1', therapyId: 't1', date: '2025-11-10', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
      { appointmentId: 'a2', therapyId: 't1', date: '2025-11-10', startTime: '09:00', endTime: '10:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
      { appointmentId: 'a3', therapyId: 't2', date: '2025-11-11', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
      { appointmentId: 'a4', therapyId: 't2', date: '2025-11-11', startTime: '09:00', endTime: '10:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
    ];

    it('should return an empty array if the input array is empty', () => {
      expect(service.sortItemsByDate([], (item: Appointment) => item.date)).toEqual([]);
    });

    it('should correctly sort appointments by date and time', () => {
      const sorted = service.sortItemsByDate(
        mockApts,
        (apt: Appointment) => apt.date,
        (apt: Appointment) => apt.startTime
      );

      expect(sorted.map(a => a.appointmentId)).toEqual(['a4', 'a3', 'a2', 'a1']);
    });

    it('should return 0 when items have the same date and timeSelector is not provided', () => {
      const itemsWithSameDate: Appointment[] = [
        { appointmentId: 'i1', therapyId: 't1', date: '2025-11-20', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
        { appointmentId: 'i2', therapyId: 't2', date: '2025-11-20', startTime: '10:00', endTime: '11:00', status: AppointmentStatus.AVAILABLE, createdAt: ''},
      ];

      const sorted = service.sortItemsByDate(
        itemsWithSameDate,
        (apt: Appointment) => apt.date
      );

      expect(sorted.map((a: Appointment) => a.appointmentId)).toEqual(['i1', 'i2']);
    });
  });

  describe('isBlocked', () => {
    it('should block any hour on Friday', () => {
      const fridayIso = '2025-12-19';
      expect(service.isBlocked(fridayIso, '10:00')).toBeTrue();
      expect(service.isBlocked(fridayIso, '17:00')).toBeTrue();
    });
  });
});
