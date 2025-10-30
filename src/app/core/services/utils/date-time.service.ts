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
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  readonly weekDays = computed<WeekDay[]>(() => this.getWeekDays(this.currentWeek()));
  readonly currentMonthLabel = computed(() => this.getMonthLabel(this.currentWeek()));
  readonly goPrevious = computed(() => this.canNavigate(-1));
  readonly goNext = computed(() => this.canNavigate(1));

  public getNextHour(time: string): string {
    const index = this.hours.indexOf(time);
    return this.hours[index + 1] || '';
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

    return Array.from({ length: 5 }, (_, i) => {
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
}
