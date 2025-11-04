import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsersRepoService } from '../repos/users.repo.service';
import { AuthState } from '../../../models/state.model';
import { User } from '../../../models/user.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { UsersStateService } from './users.state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly router = inject(Router);
  private readonly usersRepo = inject(UsersRepoService);
  private readonly usersState = inject(UsersStateService);

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
    this.usersState.setCurrentUser(null);

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
  readonly #handleLoginSuccess = (token: string, user: User) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userIdFromToken = payload.sub;
    const fullUser: User = {
      ...user,
      userId: userIdFromToken,
    }

    this.#authState.set({
      status: 'success',
      currentUser: fullUser,
      token,
      error: null,
    });
    this.usersState.setCurrentUser(fullUser);

    localStorage.setItem('token', token);
  }

  readonly #validateToken = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const user: User = {
        userId: payload.sub,
        cognitoId: payload.sub,
        name: payload.name || '',
        email: payload.email || '',
        role: payload.role || 'USER',
        approved: payload.approved ?? true,
        createdAt: payload.createdAt,
      }

      this.#authState.set({
        status: 'success',
        currentUser: user,
        token,
        error: null,
      });
    } catch (error) {
      console.error('Token validation failed:', error);
      this.logout();
    }
  }
}
