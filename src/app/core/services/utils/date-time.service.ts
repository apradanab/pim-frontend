import { computed, Injectable, signal } from '@angular/core';
import { WeekDay } from '../../../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {
  private readonly currentWeek = signal(new Date());
  private readonly weeksInPast = 1;
  private readonly weeksInFuture = 3;

  readonly hours = [
    '9:15', '9:35', '10:00', '10:20', '10:45', '11:05','11:30', '11:50',
    '16:15', '16:35', '17:00', '17:20', '17:45', '18:05', '18:30', '18:50', '19:15'
  ].map(time => this.normalizeTime(time));

  readonly weekDays = computed<WeekDay[]>(() => this.getWeekDays(this.currentWeek()));
  readonly currentMonthLabel = computed(() => this.getMonthLabel(this.currentWeek()));
  readonly goPrevious = computed(() => this.canNavigate(-1));
  readonly goNext = computed(() => this.canNavigate(1));

  public getNextHour(time: string): string {
    const index = this.hours.indexOf(time);
    return this.hours[index + 1] || '';
  }

  public normalizeTime(timeStr: string): string {
    return timeStr.startsWith('0') ? timeStr.substring(1) : timeStr;
  }

  public moveWeek(offset: number) {
    if ((offset === -1 && !this.goPrevious()) || (offset === 1 && !this.goNext())) {
      return;
    }
    const newDate = new Date(this.currentWeek());
    newDate.setDate(newDate.getDate() + offset * 7);
    this.currentWeek.set(newDate);
  }

  private getMonday(date: Date):Date {
    const monday = new Date(date);
    const day = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - day);
    monday.setHours(0,0,0,0);
    return monday;
  }

  private formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getWeekDays(startDate: Date): WeekDay[] {
    const start = this.getMonday(startDate);

    return Array.from({ length: 4 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      return {
        name: day.toLocaleDateString('es-ES', { weekday: 'long', timeZone: 'Europe/Madrid' }),
        date: day.getDate().toString(),
        isoDate: this.formatLocalDate(day)
      }
    })
  }

  private getMonthLabel(date: Date): string {
    const month = date.toLocaleDateString('es-ES', { month: 'long', timeZone: 'Europe/Madrid' });
    const year = date.getFullYear();
    return `${month} ${year}`
  }

  private canNavigate(direction: number): boolean {
    const today = new Date();
    const target = new Date(this.currentWeek());
    target.setDate(target.getDate() + direction * 7);

    const min = new Date(today);
    min.setDate(today.getDate() - this.weeksInPast * 7);
    const max = new Date(today);
    max.setDate(today.getDate() + this.weeksInFuture * 7);

    return direction === -1
      ? this.getMonday(target) >= this.getMonday(min)
      : this.getMonday(target) <= this.getMonday(max);
  }

  public parseDateString(dateStr: string): Date {
    if(!dateStr || dateStr.trim() === '') return new Date(0);
    if(dateStr.includes('T')) return new Date(dateStr);
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month -1, day);
  }

  public timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  public formatDisplayDate(dateStr: string): string {
    const date = this.parseDateString(dateStr);

    const formatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return formatted.replace(' de ', ' ').replace(',', ',');
  }

  public formatShortDate(dateStr: string): string {
    const date = this.parseDateString(dateStr);

    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    });
  }

  public sortItemsByDate<T>(
    items: T[],
    dateSelector: (item: T) => string,
    timeSelector?: (item: T) => string
  ): T[] {
    if (!items || items.length === 0) return [];

    return items.slice().sort((a: T, b: T) => {
      const dateA = this.parseDateString(dateSelector(a)).getTime();
      const dateB = this.parseDateString(dateSelector(b)).getTime();

      if (dateB !== dateA) return dateB - dateA;

      if (timeSelector) {
        const timeA = this.timeToMinutes(timeSelector(a));
        const timeB = this.timeToMinutes(timeSelector(b));

        return timeA - timeB;
      }

      return 0;
    })
  }

  public isBlocked(dateIso: string, hour: string): boolean {
    const date = new Date(dateIso);
    const day = date.getDay();
    const timeMin = this.timeToMinutes(hour);

    if (day === 5) return true;
    if (hour === '11:30' || hour === '11:50') return true;

    const isMorningTime = timeMin >= this.timeToMinutes('9:15') && timeMin <= this.timeToMinutes('11:30');
    if ((day === 1 || day === 4) && isMorningTime) return true;

    return false;
  }
}
