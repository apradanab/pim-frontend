import { Injectable, signal } from '@angular/core';
import { ServicesRepoService } from './services.repo.service';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  private servicesSignal = signal<Service[]>([]);
  public services = this.servicesSignal.asReadonly();

  constructor(private servicesRepo: ServicesRepoService) {}

  loadServices() {
    this.servicesRepo.getServices().subscribe({
      next: (services) => this.servicesSignal.set(services),
      error: (err) => console.error('Error loading services:', err)
    });
  }
}
