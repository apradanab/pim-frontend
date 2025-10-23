import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersStateService } from './users.state.service';
import { UsersRepoService } from '../repos/users.repo.service';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';
import { User } from '../../../models/user.model';

describe('UsersStateService', () => {
  let service: UsersStateService;
  let mockRepo: jasmine.SpyObj<UsersRepoService>;

  const mockUser: User = {
    userId: '123',
    cognitoId: 'cognito-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    approved: true
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('UsersRepoService', [
      'completeRegistration', 'updateUser', 'getById'
    ]);

    TestBed.configureTestingModule({
      providers: [
        UsersStateService,
        { provide: UsersRepoService, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(UsersStateService);

    spyOn(console, 'error');
  });

  describe('completeRegistration', () => {
    it('should complete registration successfully', fakeAsync(() => {
      const response = { message: 'Registration done' };
      mockRepo.completeRegistration.and.returnValue(of(response));

      service.completeRegistration({
        registrationToken: 'token',
        password: 'password',
        email: 'test@example.com'
      });
      tick();

      expect(mockRepo.completeRegistration).toHaveBeenCalledWith(jasmine.objectContaining({
        registrationToken: 'token',
        password: 'password',
        email: 'test@example.com'
      }));
    }))

    it('should handle error on complete registration', fakeAsync(() => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockRepo.completeRegistration.and.returnValue(throwError(() => error));

      service.completeRegistration({ registrationToken: 'token', password: 'pass', email: 'test@example.com' });
      tick();

      expect(console.error).toHaveBeenCalledWith('Error completing registration:', 'Bad Request');
    }));
  })

    it('should update user profile successfully', fakeAsync(() => {
      const updatedUser: User = { ...mockUser, name: 'Updated User' };
      mockRepo.updateUser.and.returnValue(of(updatedUser));

      service.updateUserProfile('123', new FormData());
      tick();

      const state = service.usersState();
      expect(state.currentUser).toEqual(updatedUser);
      expect(state.error).toBeNull();
    }));

    it('should handle error on update user profile', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockRepo.updateUser.and.returnValue(throwError(() => error));

      service.updateUserProfile('123', new FormData());
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating profile:', 'Server Error');

      const state = service.usersState();
      expect(state.error).toBe(null);
    }));

});
