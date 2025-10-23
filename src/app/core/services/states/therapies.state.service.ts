import { inject, Injectable, signal } from '@angular/core';
import { TherapiesRepoService } from '../repos/therapies.repo.service';
import { TherapyState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { Therapy } from '../../../models/therapy.model';

@Injectable({
  providedIn: 'root'
})
export class TherapiesStateService {
  private readonly therapiesRepo = inject(TherapiesRepoService);

  readonly #state = signal<TherapyState>({
    list: [],
    current: null,
    error: null,
  });
  therapiesState = this.#state.asReadonly();

  listTherapies = () => {
    this.therapiesRepo.listTherapies().subscribe({
      next: (therapies) => this.#state.update(s => ({
        ...s,
        list: therapies
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  getTherapy = (therapyId: string) => {
    this.therapiesRepo.getTherapy(therapyId).subscribe({
      next: (therapy) => this.#state.update(s => ({
        ...s,
        current: therapy
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }

  createTherapy = (therapy: Therapy) => {
    this.therapiesRepo.createTherapy(therapy).subscribe({
      next: (newTherapy) => this.#state.update(s => ({
        ...s,
        list: [...s.list, newTherapy]
      })),
      error: (err: ApiError) => {
        console.error('Error creating therapy:', err.message);
      }
    });
  }

  updateTherapy = (id: string, therapy: Partial<Therapy>) => {
    return this.therapiesRepo.updateTherapy(id, therapy).subscribe({
      next: (updatedTherapy) => this.#state.update(s => ({
        ...s,
        list: s.list.map(item => item.therapyId === id ? updatedTherapy : item),
        current: updatedTherapy
      })),
      error: (err: ApiError) => {
        console.error('Error updating therapy:', err.message);
      }
    });
  }

  deleteTherapy = (id: string) => {
    return this.therapiesRepo.deleteTherapy(id).subscribe({
      next: () => this.#state.update(s => ({
        ...s,
        list: s.list.filter(item => item.therapyId !== id),
        current: null
      })),
      error: (err: ApiError) => {
        console.error('Error deleting therapy:', err.message);
      }
    });
  }
}
