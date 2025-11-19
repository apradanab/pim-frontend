import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsersRepoService } from '../repos/users.repo.service';
import { AuthState } from '../../../models/state.model';
import { User } from '../../../models/user.model';
import { ApiError } from '../../interceptors/error.interceptor';
import { UsersStateService } from './users.state.service';
import { catchError, lastValueFrom } from 'rxjs';

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

  readonly #isReady = signal(false);
  isReady = this.#isReady.asReadonly();

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

  checkAuth = (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (token) {
      return this.restoreSession(token);
    }

    this.#isReady.set(true);
    return Promise.resolve();
  }

  isLoggedIn = () => {
    return !!this.#authState().token;
  }

  getCurrentUser = () => {
    return this.#authState().currentUser;
  }

  restoreSession = async (token: string): Promise<void> => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userIdFromToken = payload.sub;

      const fullUser = await lastValueFrom(
        this.usersRepo.getById(userIdFromToken).pipe(
          catchError(err => {
            console.error('Error fetching full user profile', err);
            throw err;
          })
        )
      );

      this.#authState.set({
        status: 'success',
        currentUser: fullUser,
        token,
        error: null,
      });

      this.usersState.setCurrentUser(fullUser);
    } catch (error) {
      console.error('Session restoration failed. Logging out', error);
      this.logout();
    } finally {
      this.#isReady.set(true);
    }
  }

  // Private Helper
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

    if (fullUser.role === 'ADMIN') {
      this.router.navigate(['/admin'])
    }
  }
}
