import { inject, Injectable, signal } from '@angular/core';
import { AdvicesRepoService } from '../repos/advices.repo.service';
import { AdviceState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { Advice } from '../../../models/advice.model';

@Injectable({
  providedIn: 'root'
})
export class AdvicesStateService {
  private readonly advicesRepo = inject(AdvicesRepoService);

  readonly #state = signal<AdviceState>({
    list: [],
    filtered: [],
    current: null,
    error: null,
  });
  advicesState = this.#state.asReadonly();

  listAdvices = () => {
    this.advicesRepo.listAdvices().subscribe({
      next: (advices) => this.#state.update(s => ({
        ...s,
        list: advices
      })),
      error: (err: ApiError)=> this.#state.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  getAdvice = (adviceId: string) => {
    this.advicesRepo.getAdvice(adviceId).subscribe({
      next: (advice) => this.#state.update(s => ({
        ...s,
        current: advice
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }

  listAdvicesByTherapy = (therapyId: string) => {
    this.advicesRepo.listAdvicesByTherapy(therapyId).subscribe({
      next: (advices) => this.#state.update(s => ({
        ...s,
        filtered: advices,
        error: null
      })),
      error: (err: ApiError) => this.#state.update(s => ({
        ...s,
        filtered: [],
        error: err.message
      }))
    });
  }

  createAdvice = (advice: Advice) => {
    return this.advicesRepo.createAdvice(advice).subscribe({
      next: (newAdvice) => this.#state.update(s => ({
        ...s,
        list: [...s.list, newAdvice]
      })),
      error: (err: ApiError) => {
        console.error('Error creating advice:', err.message);
      }
    })
  }
}
