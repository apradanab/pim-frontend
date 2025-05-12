import { Injectable, inject, signal } from '@angular/core';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../../models/service.model';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ApiError } from '../interceptors/error.interceptor';

interface ServicesState {
  services: Service[];
  currentService: Service | null;
}

interface AuthState {
  currentUser: User | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private usersRepo = inject(UsersRepoService);
  private router = inject(Router);
  private servicesRepo = inject(ServicesRepoService);

  // Auth State
  private authState = signal<AuthState>({
    currentUser: null,
    status: 'idle',
    error: null,
    token: null
  });

  // Services State
  private servicesState = signal<ServicesState>({
    services: [],
    currentService: null
  });
  state$ = this.servicesState.asReadonly();

  currentUser = () => this.authState().currentUser;
  token = () => this.authState().token;
  isLoggedIn = () => !!this.authState().token;

  // Users Methods
  login = (email: string, password: string) => {
    this.authState.update(state => ({ ...state, status: 'loading', error: null }));

    this.usersRepo.login({ email, password }).subscribe({
      next: ({ token }) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          approved: payload.approved
        };

        this.authState.update(state => ({
          ...state,
          currentUser: user,
          token: token,
          status: 'success',
          error: null
        }));

        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      error: (err: ApiError) => {
        this.authState.update(state => ({
          ...state,
          status: 'error',
          error: err.message
        }));
      }
    });
  }

  logout = () => {
    this.authState.set({
      currentUser: null,
      token: null,
      status: 'idle',
      error: null
    });
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user: User = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          approved: payload.approved
        };

        this.authState.set({
          currentUser: user,
          token: token,
          status: 'success',
          error: null
        });
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }

  completeRegistration = (token: string, password: string) => {
    this.authState.update(state => ({ ...state, status: 'loading' }));

    this.usersRepo.completeRegistration(token, password).subscribe({
      next: (user) => {
        this.authState.update(state => ({
          ...state,
          currentUser: user,
          status: 'success',
        }));
        this.router.navigate(['/']);
      },
      error: (err: ApiError) => {
        this.authState.update(state => ({
          ...state,
          status: 'error',
          error: err.message
        }));
      }
    });
  }

  // Services Methods
  loadServices = () => {
    this.servicesRepo.getServices().subscribe({
      next: (services) => this.servicesState.update(s => ({ ...s, services })),
      error: (err: ApiError) => {
        this.servicesState.update(s => ({ ...s, services: [] }));
        console.error('Error loading services:', err.message);
      }
    });
  }

  loadServiceById = (id: string) => {
    this.servicesRepo.getServiceById(id).subscribe({
      next: (service) => this.servicesState.update(s => ({ ...s, currentService: service })),
      error: (err: ApiError) => {
        this.servicesState.update(s => ({ ...s, currentService: null }));
        console.error(`Error loading service ${id}:`, err.message);
      }
    });
  }

  createService = (service: Service) => {
    return this.servicesRepo.createService(service).subscribe({
      next: (newService) => {
        this.servicesState.update(s => ({
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
        this.servicesState.update(s => ({
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
        this.servicesState.update(s => ({
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
