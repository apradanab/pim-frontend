import { Injectable, inject, signal } from '@angular/core';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../../models/service.model';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ApiError } from '../interceptors/error.interceptor';
import { ResourcesRepoService } from './resources.repo.service';
import { AuthState, ServicesState, ResourcesState } from '../../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly router = inject(Router);
  private readonly usersRepo = inject(UsersRepoService);
  private readonly servicesRepo = inject(ServicesRepoService);
  private readonly resourcesRepo = inject(ResourcesRepoService);

  #authState = signal<AuthState>({
    status: 'idle',
    currentUser: null,
    token: null,
    error: null
  });

  #servicesState = signal<ServicesState>({
    list: [],
    current: null,
    error: null
  })

  #resourcesState = signal<ResourcesState>({
    list: [],
    filtered: [],
    current: null,
    error: null
  })

  authState = this.#authState.asReadonly();
  servicesState = this.#servicesState.asReadonly();
  resourcesState = this.#resourcesState.asReadonly();

  isLoggedIn() {
    return !!this.#authState().token;
  }

  get state$() {
    return {
      auth: this.#authState(),
      services: this.#servicesState(),
      resources: this.#resourcesState()
    };
  }

  // Authentication Methods
  login = (email: string, password: string) => {
    this.#authState.update(state => ({ ...state, status: 'loading', error: null }));

    this.usersRepo.login({ email, password }).subscribe({
      next: ({ token }) => this.#handleLoginSuccess(token),
      error: (error: ApiError) => this.#authState.update(s =>({
        ...s,
        status: 'error',
        error: error.message
      }))
    });
  }

  logout = () => {
    this.#authState.set({
      status: 'idle',
      currentUser: null,
      token: null,
      error: null
    });
    this.#servicesState.set({
      list: [],
      current: null,
      error: null
    });
    this.#resourcesState.set({
      list: [],
      filtered: [],
      current: null,
      error: null
    })
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

    this.#authState.set({
      status: 'success',
      currentUser: user,
      token,
      error: null,
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

      this.#authState.set({
        status: 'success',
        currentUser: user,
        token,
        error: null,
      })
    } catch {
      this.logout();
    }
  }

  // Services Methods
  loadServices = () => {
    this.servicesRepo.getServices().subscribe({
      next: (services) => this.#servicesState.update(s => ({
        ...s,
        list: services
      })),
      error: (err: ApiError) => this.#servicesState.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  loadServiceById = (id: string) => {
    this.servicesRepo.getServiceById(id).subscribe({
      next: (service) => this.#servicesState.update(s => ({
        ...s,
        current: service
      })),
      error: (err: ApiError) => this.#servicesState.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }

  createService = (service: Service) => {
    return this.servicesRepo.createService(service).subscribe({
      next: (newService) => this.#servicesState.update(s => ({
          ...s,
          list: [...s.list, newService]
        })),
      error: (err: ApiError) => {
        console.error('Error creating service:', err.message);
      }
    });
  }

  updateService = (id: string, service: Partial<Service>) => {
    return this.servicesRepo.updateService(id, service).subscribe({
      next: (updatedService) => this.#servicesState.update(s => ({
          ...s,
          list: s.list.map(svc => svc.id === id ? updatedService : svc),
          current: updatedService
        })),
      error: (err: ApiError) => {
        console.error('Error updating service:', err.message);
      }
    });
  }

  deleteService = (id: string) => {
    return this.servicesRepo.deleteService(id).subscribe({
      next: () => this.#servicesState.update(s => ({
          ...s,
          list: s.list.filter(svc => svc.id !== id),
          current: null
        })),
      error: (err: ApiError) => {
        console.error('Error deleting service:', err.message);
      }
    });
  }

  // Resources Methods
  loadAllResources = () => {
    this.resourcesRepo.getAllResources().subscribe({
      next: (resources) => this.#resourcesState.update(s => ({
        ...s,
        list: resources
      })),
      error: (err: ApiError) => this.#resourcesState.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  loadResourcesByServiceId = (serviceId: string) => {
    this.resourcesRepo.getResourcesByServiceId(serviceId).subscribe({
      next: (resources) => this.#resourcesState.update(s => ({
        ...s,
        filtered: resources
      })),
      error: (err: ApiError) => this.#resourcesState.update(s => ({
        ...s,
        filtered: [],
        error: err.message
      }))
    });
  }

  loadResourceById = (id: string) => {
    this.resourcesRepo.getResourceById(id).subscribe({
      next: (resource) => this.#resourcesState.update(s => ({
        ...s,
        current: resource
      })),
      error: (err: ApiError) => this.#resourcesState.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }
}
