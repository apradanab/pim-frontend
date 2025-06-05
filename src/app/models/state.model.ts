import { User } from "./user.model";
import { Service } from "./service.model";
import { Resource } from "./resource.model";

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

export interface ResourcesState {
  list: Resource[];
  filtered: Resource[];
  current: Resource | null;
  error: string | null;
}
