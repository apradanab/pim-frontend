import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsersRepoService } from '../repos/users.repo.service';
import { AuthState } from '../../../models/state.model';
import { User } from '../../../models/user.model';
import { ApiError } from '../../interceptors/error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly router = inject(Router);
  private readonly usersRepo = inject(UsersRepoService);

  readonly #authState = signal<AuthState>({
    status: 'idle',
    currentUser: null,
    token: null,
    error: null
  });
  authState = this.#authState.asReadonly();

  login = (email: string, password: string) => {
    this.#authState.update(state => ({ ...state, status:'loading', error: null }));

    this.usersRepo.login({ email, password }).subscribe({
      next: ({ token, user }) => this.#handleLoginSuccess(token, user),
      error: (error: ApiError) => this.#authState.update(s => ({
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
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token && !this.isLoggedIn()) {
      this.#validateToken(token);
    }
  }

  isLoggedIn = () => {
    return !!this.#authState().token;
  }

  getCurrentUser = () => {
    return this.#authState().currentUser;
  }

  // Private Helpers
  #handleLoginSuccess = (token: string, user: User) => {
    this.#authState.set({
      status: 'success',
      currentUser: user,
      token,
      error: null,
    });

    localStorage.setItem('token', token);
    this.router.navigate(['/']);
  }

  #validateToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const user: User = {
        userId: payload.sub,
        cognitoId: payload.sub,
        name: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'USER',
        approved: payload.approved ?? true,
      }

      this.#authState.set({
        status: 'success',
        currentUser: user,
        token,
        error: null,
      });
    } catch (error) {
      this.logout();
    }
  }
}
