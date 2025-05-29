import { Injectable, inject, signal } from '@angular/core';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../../models/service.model';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ApiError } from '../interceptors/error.interceptor';

type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AppState {
  authStatus: AuthStatus;
  currentUser: User | null;
  token: string | null;
  error: string | null;
  services: Service[];
  currentService: Service | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly router = inject(Router);
  private readonly usersRepo = inject(UsersRepoService);
  private readonly servicesRepo = inject(ServicesRepoService);

  #state = signal<AppState>({
    authStatus: 'idle',
    currentUser: null,
    token: null,
    error: null,
    services: [],
    currentService: null
  });

  authStatus = this.#state().authStatus;
  currentUser = this.#state().currentUser;
  currentToken = this.#state().token;
  currentServices = this.#state().services;
  currentService = this.#state().currentService;

  isLoggedIn() {
    return !!this.currentToken;
  }

  get state$() {
    return this.#state.asReadonly();
  }

  // Authentication Methods
  login = (email: string, password: string) => {
    this.#state.update(state => ({ ...state, authStatus: 'loading', error: null }));

    this.usersRepo.login({ email, password }).subscribe({
      next: ({ token }) => this.#handleLoginSuccess(token),
      error: (error: ApiError) => this.#state.update(s =>({
        ...s,
        authStatus: 'error',
        error: error.message
      }))
    });
  }

  logout = () => {
    this.#state.set({
      authStatus: 'idle',
      currentUser: null,
      token: null,
      error: null,
      services: [],
      currentService: null,
    });
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token && !this.isLoggedIn()) {
      this.#validateToken(token);
    }
  }

  // Private Helpers
  #handleLoginSuccess(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user: User = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      approved: payload.approved
    };

    this.#state.set({
      authStatus: 'success',
      currentUser: user,
      token,
      error: null,
      services: this.#state().services,
      currentService: this.#state().currentService
    })

    localStorage.setItem('token', token);
    this.router.navigate(['/']);
  }

  #validateToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        approved: payload.approved
      };

      this.#state.set({
        authStatus: 'success',
        currentUser: user,
        token,
        error: null,
        services: this.#state().services,
        currentService: this.#state().currentService
      })
    } catch {
      this.logout();
    }
  }

  // Services Methods
  loadServices = () => {
    this.servicesRepo.getServices().subscribe({
      next: (services) => this.#state.update(s => ({ ...s, services })),
      error: (err: ApiError) => {
        this.#state.update(s => ({ ...s, services: [] }));
        console.error('Error loading services:', err.message);
      }
    });
  }

  loadServiceById = (id: string) => {
    this.servicesRepo.getServiceById(id).subscribe({
      next: (service) => this.#state.update(s => ({ ...s, currentService: service })),
      error: (err: ApiError) => {
        this.#state.update(s => ({ ...s, currentService: null }));
        console.error(`Error loading service ${id}:`, err.message);
      }
    });
  }

  createService = (service: Service) => {
    return this.servicesRepo.createService(service).subscribe({
      next: (newService) => {
        this.#state.update(s => ({
          ...s,
          services: [...s.services, newService]
        }));
      },
      error: (err: ApiError) => {
        console.error('Error creating service:', err.message);
      }
    });
  }

  updateService = (id: string, service: Partial<Service>) => {
    return this.servicesRepo.updateService(id, service).subscribe({
      next: (updatedService) => {
        this.#state.update(s => ({
          ...s,
          services: s.services.map(svc =>
            svc.id === id ? updatedService : svc
          ),
          currentService: updatedService
        }));
      },
      error: (err: ApiError) => {
        console.error('Error updating service:', err.message);
      }
    });
  }

  deleteService = (id: string) => {
    return this.servicesRepo.deleteService(id).subscribe({
      next: () => {
        this.#state.update(s => ({
          ...s,
          services: s.services.filter(svc => svc.id !== id),
          currentService: null
        }));
      },
      error: (err: ApiError) => {
        console.error('Error deleting service:', err.message);
      }
    });
  }
}
