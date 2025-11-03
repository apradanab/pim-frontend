import { Injectable, inject, signal } from '@angular/core';
import { UsersRepoService } from '../repos/users.repo.service';
import { ApiError } from '../../interceptors/error.interceptor';
import { UserState } from '../../../models/state.model';
import { UpdateUserInput, User } from '../../../models/user.model';
import { catchError, lastValueFrom, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  private readonly usersRepo = inject(UsersRepoService);

  readonly #state = signal<UserState>({
    list: [],
    currentUser: null,
    error: null
  });
  usersState = this.#state.asReadonly();

  setCurrentUser(user: User | null): void {
    this.#state.update(state => ({
      ...state,
      currentUser: user,
      error: null
    }));
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
}
