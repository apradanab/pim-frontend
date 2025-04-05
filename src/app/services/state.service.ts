import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../models/service.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';

interface ServicesState {
  services: Service[];
  currentService: Service | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private repo = inject(ServicesRepoService);
  private destroyRef = inject(DestroyRef);
  private state = signal<ServicesState>({
    services: [],
    currentService: null
  });

  public state$ = this.state.asReadonly();

  loadServices(): void {
    this.repo.getServices().pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        next: (services) => this.state.update(s => ({ ...s, services })),
        error: () => this.state.update(s => ({ ...s, services: [] }))
      })
    ).subscribe();
  }

  loadServiceById(id: string): void {
    this.repo.getServiceById(id).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        next: (service) => this.state.update(s => ({ ...s, currentService: service })),
        error: (err) => console.error('Error loading service:', err)
      })
    ).subscribe();
  }

  createService(service: Service): Observable<Service> {
    return this.repo.createService(service).pipe(
      tap({
        next: (newService) => {
          this.state.update(s => ({
            ...s,
            services: [...s.services, newService]
          }));
        },
        error: (err) => console.error('Error creating service:', err)
      })
    );
  }

  updateService(id: string, service: Partial<Service>): Observable<Service> {
    return this.repo.updateService(id, service).pipe(
      tap({
        next: (updatedService) => {
          this.state.update(s => ({
            ...s,
            services: s.services.map(svc =>
              svc.id === id ? updatedService : svc
            ),
            currentService: updatedService
          }));
        },
        error: (err) => console.error('Error updating service:', err)
      })
    );
  }

  deleteService(id: string): Observable<void> {
    return this.repo.deleteService(id).pipe(
      tap({
        next: () => {
          this.state.update(s => ({
            ...s,
            services: s.services.filter(svc => svc.id !== id),
            currentService: null
          }));
        },
        error: (err) => console.error('Error deleting service:', err)
      })
    );
  }
}
