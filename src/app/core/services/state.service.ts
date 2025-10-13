import { Injectable, inject, signal } from '@angular/core';
import { TherapiesRepoService } from './therapies.repo.service';
import { Therapy } from '../../models/therapy.model';
import { UsersRepoService } from './users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { ApiError } from '../interceptors/error.interceptor';
import { AdvicesRepoService } from './advices.repo.service';
import { AuthState, TherapyState, AdviceState } from '../../models/state.model';
import { Advice } from '../../models/advice.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly router = inject(Router);
  private readonly usersRepo = inject(UsersRepoService);
  private readonly therapiesRepo = inject(TherapiesRepoService);
  private readonly advicesRepo = inject(AdvicesRepoService);

  readonly #authState = signal<AuthState>({
    status: 'idle',
    currentUser: null,
    token: null,
    error: null
  });

  readonly #therapyState = signal<TherapyState>({
    list: [],
    current: null,
    error: null
  })

  readonly #adviceState = signal<AdviceState>({
    list: [],
    filtered: [],
    current: null,
    error: null
  })

  authState = this.#authState.asReadonly();
  therapiesState = this.#therapyState.asReadonly();
  advicesState = this.#adviceState.asReadonly();

  isLoggedIn() {
    return !!this.#authState().token;
  }

  get state$() {
    return {
      auth: this.#authState(),
      therapies: this.#therapyState(),
      advices: this.#adviceState()
    };
  }

  // Authentication Methods
  login = (email: string, password: string) => {
    this.#authState.update(state => ({ ...state, status: 'loading', error: null }));

    this.usersRepo.login({ email, password }).subscribe({
      next: ({ token, user }) => { this.#handleLoginSuccess(token, user) },
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
    this.#therapyState.set({
      list: [],
      current: null,
      error: null
    });
    this.#adviceState.set({
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
  #handleLoginSuccess(token: string, user: User) {
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
        userId: payload.sub,
        cognitoId: payload.sub,
        name: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'USER',
        approved: payload.approved ?? true,
      };

      this.#authState.set({
        status: 'success',
        currentUser: user,
        token,
        error: null,
      });
    } catch {
      this.logout();
    }
  }

  // Users Methods

  completeRegistration = (data: {
    registrationToken: string;
    password: string;
    email: string;
    name?: string;
    avatarKey?: string;
  }) => {
    return this.usersRepo.completeRegistration(data).subscribe({
      next: (response) => {
        console.log('Registration completed:', response.message);
      },
      error: (err: ApiError) => {
        console.error('Error completing registration:', err.message);
      }
    });
  }

  updateUserProfile = (userId: string, formData: FormData) => {
    return this.usersRepo.updateUser(userId, formData).subscribe({
      next: (updatedUser) => {
        console.log('Profile updated successfully');
        this.#authState.update(state => ({
          ...state,
          currentUser: updatedUser
        }));
      },
      error: (err: ApiError) => {
        console.error('Error updating profile:', err.message);
      }
    });
  }

  // Therapies Methods
  loadTherapies = () => {
    this.therapiesRepo.getTherapies().subscribe({
      next: (therapies) => this.#therapyState.update(s => ({
        ...s,
        list: therapies
      })),
      error: (err: ApiError) => this.#therapyState.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  loadTherapyById = (id: string) => {
    this.therapiesRepo.getTherapyById(id).subscribe({
      next: (therapy) => this.#therapyState.update(s => ({
        ...s,
        current: therapy
      })),
      error: (err: ApiError) => this.#therapyState.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }

  createTherapy = (therapy: Therapy) => {
    return this.therapiesRepo.createTherapy(therapy).subscribe({
      next: (newTherapy) => this.#therapyState.update(s => ({
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
      next: (updatedTherapy) => this.#therapyState.update(s => ({
          ...s,
          list: s.list.map(svc => svc.therapyId === id ? updatedTherapy : svc),
          current: updatedTherapy
        })),
      error: (err: ApiError) => {
        console.error('Error updating therapy:', err.message);
      }
    });
  }

  deleteTherapy = (id: string) => {
    return this.therapiesRepo.deleteTherapy(id).subscribe({
      next: () => this.#therapyState.update(s => ({
          ...s,
          list: s.list.filter(svc => svc.therapyId !== id),
          current: null
        })),
      error: (err: ApiError) => {
        console.error('Error deleting therapy:', err.message);
      }
    });
  }

  // Advices Methods
  loadAllAdvices = () => {
    this.advicesRepo.getAllAdvices().subscribe({
      next: (advices) => this.#adviceState.update(s => ({
        ...s,
        list: advices
      })),
      error: (err: ApiError) => this.#adviceState.update(s => ({
        ...s,
        list: [],
        error: err.message
      }))
    });
  }

  loadAdvicesByTherapyId(therapyId: string) {
  this.advicesRepo.getAdvicesByTherapyId(therapyId).subscribe({
    next: (advices) => this.#adviceState.update(s => ({
      ...s,
      filtered: advices,
      error: null
    })),
    error: (err: ApiError) => this.#adviceState.update(s => ({
      ...s,
      filtered: [],
      error: err.message
    }))
  });
}

  loadAdviceById = (adviceId: string) => {
    this.advicesRepo.getAdviceById(adviceId).subscribe({
      next: (advice) => this.#adviceState.update(s => ({
        ...s,
        current: advice
      })),
      error: (err: ApiError) => this.#adviceState.update(s => ({
        ...s,
        current: null,
        error: err.message
      }))
    });
  }

  createAdvice = (advice: Advice) => {
    return this.advicesRepo.createAdvice(advice).subscribe({
      next: (newAdvice) => this.#adviceState.update(r => ({
        ...r,
        list: [...r.list, newAdvice]
      })),
      error: (err: ApiError) => {
        console.error('Error creating advice:', err.message);
      }
    });
  }
}
