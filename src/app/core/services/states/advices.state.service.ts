import { inject, Injectable, signal } from '@angular/core';
import { AdvicesRepoService } from '../repos/advices.repo.service';
import { AdviceState } from '../../../models/state.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { Advice, AdviceInput } from '../../../models/advice.model';

@Injectable({
  providedIn: 'root'
})
export class AdvicesStateService {
  private readonly advicesRepo = inject(AdvicesRepoService);

  readonly #state = signal<AdviceState>({
    list: [],
    filtered: [],
    current: null,
    isLoading: false,
    error: null,
  });
  advicesState = this.#state.asReadonly();

  listAdvices = () => {
    this.#state.update(s => ({ ...s, isLoading: true, error: null }));
    this.advicesRepo.listAdvices().subscribe({
      next: (advices) => this.#state.update(s => ({
        ...s,
        list: advices,
        isLoading: false,
      })),
      error: (err: ApiError)=> this.#state.update(s => ({
        ...s,
        list: [],
        isLoading: false,
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

  createAdvice = (data: AdviceInput) => {
    this.#state.update(s => ({ ...s, isLoading: true, error: null }));

    return this.advicesRepo.createAdvice(data).subscribe({
      next: (newAdvice) => {
      this.#state.update(s => ({
        ...s,
        list: [...s.list, newAdvice],
        isLoading: false,
      }));
      },
      error: (err: ApiError) => {
        console.error('Error creating advice:', err.message);
        this.#state.update(s => ({ ...s, isLoading: false, error: err.message }));
      }
    });
  }

  updateAdvice = (id: string, advice: Partial<Advice>) => {
    return this.advicesRepo.updateAdvice(id, advice).subscribe({
      next: (updatedAdvice) => this.#state.update(s => ({
        ...s,
        list: s.list.map(item => item.adviceId === id ? updatedAdvice : item),
        filtered: s.filtered.map(item => item.adviceId === id ? updatedAdvice : item),
        current: updatedAdvice
      })),
      error: (err: ApiError) => {
        console.error('Error updating therapy:', err.message);
      }
    })
  }

  deleteAdvice = (advice: Advice) => {
    const { adviceId, therapyId } = advice;
    return this.advicesRepo.deleteAdvice(adviceId, therapyId).subscribe({
      next: () => this.#state.update(s => ({
        ...s,
        list: s.list.filter(item => item.adviceId !== adviceId),
        filtered: s.filtered.filter(item => item.adviceId !== adviceId),
        current: null
      })),
      error: (err: ApiError) => {
        console.error('Error deleting advice:', err.message);
      }
    });
  }
}
