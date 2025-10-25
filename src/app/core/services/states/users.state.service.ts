import { Injectable, inject, signal } from '@angular/core';
import { UsersRepoService } from '../repos/users.repo.service';
import { ApiError } from '../../interceptors/error.interceptor';
import { UserState } from '../../../models/state.model';
import { User } from '../../../models/user.model';

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

  updateUserProfile = (userId: string, formData: FormData) => {
    return this.usersRepo.updateUser(userId, formData).subscribe({
      next: (updatedUser) => {
        console.log('Profile updated successfully');
        this.#state.update(state => ({
          ...state,
          currentUser: updatedUser
        }));
      },
      error: (err: ApiError) => {
        console.error('Error updating profile:', err.message);
      }
    });
  }
}
