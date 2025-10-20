import { Appointment } from "./appointment.model";

export interface WeekDay {
  name: string;
  date: string;
  isoDate: string;
}

export interface ScheduleCellEvent {
  dateIso: string;
  time: string;
  appointment?: Appointment;
  statusClass: string;
}
