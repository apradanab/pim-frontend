import { User } from "./user.model";
import { Therapy } from "./therapy.model";
import { Advice } from "./advice.model";
import { Appointment } from "./appointment.model";

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AuthState {
  status: AuthStatus;
  currentUser: User | null;
  token: string | null;
  error: string | null;
}

export interface UserState {
  list: User[];
  currentUser: User | null;
  error: string | null;
}

export interface TherapyState {
  list: Therapy[];
  current: Therapy | null;
  error: string | null;
}

export interface AdviceState {
  list: Advice[];
  filtered: Advice[];
  current: Advice | null;
  error: string | null;
}

export interface AppointmentState {
  userAppointments: Appointment[];
  availableAppointments: Appointment[];
  current: Appointment | null;
  error: string | null;
}
