import { Injectable, inject, signal } from '@angular/core';
import { UsersRepoService } from '../repos/users.repo.service';
import { ApiError } from '../../interceptors/error.interceptor';
import { UserState } from '../../../models/state.model';
import { UpdateUserInput, User } from '../../../models/user.model';
import { catchError, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  private readonly usersRepo = inject(UsersRepoService);

  readonly #state = signal<UserState>({
    list: [],
    currentUser: null,
    isLoading: false,
    error: null,
  });
  usersState = this.#state.asReadonly();

  setCurrentUser(user: User | null): void {
    this.#state.update(state => ({
      ...state,
      currentUser: user,
      error: null
    }));
  }

  listUsers = (): Promise<User[]> => {
    this.#state.update(state => ({ ...state, error: null, isLoading: true }));
    return lastValueFrom(
      this.usersRepo.listUsers().pipe(
        tap((users: User[]) => {
          this.#state.update(state => ({
            ...state,
            list: users,
            isLoading: false,
            error: null,
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error listing users:', err.message);
          this.#state.update(state => ({
            ...state,
            list: [],
            error: err.message,
            isLoading: false,
          }));
          throw err;
        })
      )
    );
  }

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

  approveUser = (userId: string): Promise<void> => {
    return lastValueFrom(
      this.usersRepo.approveUser(userId).pipe(
        tap(() => {
          this.#state.update(state => ({
            ...state,
            list: state.list.map(u =>
              u.userId === userId ? { ...u, approved: true, role: 'USER' } : u
            )
          }));
        }),
        map(() => undefined),
        catchError((err: ApiError) => {
          console.error(`Error approving user ${userId}:`, err.message);
          throw err;
        })
      )
    )
  }

  updateUserProfile = (userId: string, data: UpdateUserInput): Promise<User> => {
    return lastValueFrom(
      this.usersRepo.updateUser(userId, data).pipe(
        tap((updatedUser) => {
          this.#state.update(state => ({
            ...state,
            currentUser: updatedUser
          }));
        }),
        catchError((err: ApiError) => {
          console.error('Error updating profile:', err.message);
          throw err;
        })
      )
    );
  }

  deleteUser = (userId: string): Promise<void> => {
    return lastValueFrom(
      this.usersRepo.deleteUser(userId).pipe(
        tap(() => {
          this.#state.update(state => ({
            ...state,
            list: state.list.filter(u => u.userId !== userId)
          }));
        }),
        map(() => undefined),
        catchError((err: ApiError) => {
          console.error(`Error deleting user ${userId}:`, err.message);
          throw err;
        })
      )
    )
  }
}
