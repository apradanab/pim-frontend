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
  private readonly repo = inject(ServicesRepoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = signal<ServicesState>({
    services: [],
    currentService: null
  });

  public state$ = this.state.asReadonly();

  loadServices(): void {
    this.repo.getServices().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (services) => this.state.update(s => ({ ...s, services })),
      error: () => this.state.update(s => ({ ...s, services: [] }))
    });
  }

  loadServiceById(id: string): void {
    this.repo.getServiceById(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (service) => this.state.update(s => ({ ...s, currentService: service })),
      error: () => this.state.update(s => ({ ...s, currentService: null }))
    });
  }

  createService(service: Service): Observable<Service> {
    return this.repo.createService(service).pipe(
      tap((newService) => {
        this.state.update(s => ({
          ...s,
          services: [...s.services, newService]
        }));
      })
    );
  }

  updateService(id: string, service: Partial<Service>): Observable<Service> {
    return this.repo.updateService(id, service).pipe(
      tap((updatedService) => {
        this.state.update(s => ({
          ...s,
          services: s.services.map(svc =>
            svc.id === id ? updatedService : svc
          ),
          currentService: updatedService
        }));
      })
    );
  }

  deleteService(id: string): Observable<void> {
    return this.repo.deleteService(id).pipe(
      tap(() => {
        this.state.update(s => ({
          ...s,
          services: s.services.filter(svc => svc.id !== id),
          currentService: null
        }));
      })
    );
  }
}
