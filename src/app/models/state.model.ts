import { User } from "./user.model";
import { Service } from "./service.model";
import { Advice } from "./advice.model";

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AuthState {
  status: AuthStatus;
  currentUser: User | null;
  token: string | null;
  error: string | null;
}

export interface ServicesState {
  list: Service[];
  current: Service | null;
  error: string | null;
}

export interface AdviceState {
  list: Advice[];
  filtered: Advice[];
  current: Advice | null;
  error: string | null;
}
