import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersStateService } from './users.state.service';
import { UsersRepoService } from '../repos/users.repo.service';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';
import { UpdateUserInput, User } from '../../../models/user.model';

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

  const mockUpdateInput: UpdateUserInput = {
    name: 'Updated name',
    email: 'updated@example.com'
  }

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('UsersRepoService', [
      'completeRegistration', 'updateUser', 'getById', 'listUsers', 'approveUser', 'deleteUser'
    ]);

    TestBed.configureTestingModule({
      providers: [
        UsersStateService,
        { provide: UsersRepoService, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(UsersStateService);
    service.setCurrentUser(mockUser);

    spyOn(console, 'error');
  });

  describe('listUsers', () => {
    it('should list users and update state', fakeAsync(async () => {
      const users: User[] = [
        { ...mockUser, userId: 'u1' },
        { ...mockUser, userId: 'u2' }
      ];
      mockRepo.listUsers.and.returnValue(of(users));

      const result = await service.listUsers();

      expect(mockRepo.listUsers).toHaveBeenCalled();
      expect(result).toEqual(users);

      const state = service.usersState();
      expect(state.list).toEqual(users);
      expect(state.error).toBeNull();
    }));

    it('should handle error and update state', fakeAsync(async () => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockRepo.listUsers.and.returnValue(throwError(() => error));

      try {
        await service.listUsers();
      } catch (e) {
        void e;
      }

      const state = service.usersState();
      expect(state.list).toEqual([]);
      expect(state.error).toBe('Server Error');
      expect(console.error).toHaveBeenCalledWith('Error listing users:', 'Server Error');
    }));
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

  describe('approveUser', () => {
    it('should approve user', fakeAsync(async () => {
      const otherUser = { ...mockUser, userId: '456', name: 'Other User', approved: false, role: 'GUEST' } as User;

      const users = [
        { ...mockUser, approved: false, role: 'GUEST' } as User,
        otherUser
      ];

      mockRepo.listUsers.and.returnValue(of(users));
      mockRepo.approveUser.and.returnValue(of({ message: 'ok' }));

      await service.listUsers();

      let state = service.usersState();
      expect(state.list.length).toBe(2);
      expect(state.list[0].approved).toBeFalse();
      expect(state.list[1].approved).toBeFalse();

      await service.approveUser(mockUser.userId);

      state = service.usersState();
      expect(state.list.length).toBe(2);

      const approvedUser = state.list.find(u => u.userId === mockUser.userId)!;
      expect(approvedUser.approved).toBeTrue();
      expect(approvedUser.role).toBe('USER');

      const unchangedUser = state.list.find(u => u.userId === otherUser.userId)!;
      expect(unchangedUser.approved).toBeFalse();
      expect(unchangedUser.role).toBe('GUEST');
    }));

    it('should handle error on approveUser', fakeAsync(async () => {
      const error: ApiError = { status: 400, message: 'Bad Request' };
      mockRepo.approveUser.and.returnValue(throwError(() => error));

      mockRepo.listUsers.and.returnValue(of([{ ...mockUser, approved: false }]));
      await service.listUsers();

      try {
        await service.approveUser(mockUser.userId);
      } catch (e) {
        void e;
      }

      expect(console.error).toHaveBeenCalledWith(
        `Error approving user ${mockUser.userId}:`,
        'Bad Request'
      );
    }));
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', fakeAsync(() => {
      const updatedUser: User = { ...mockUser, name: 'Updated User' };
      mockRepo.updateUser.and.returnValue(of(updatedUser));

      service.updateUserProfile('123', mockUpdateInput);
      tick();

      expect(mockRepo.updateUser).toHaveBeenCalledWith('123', mockUpdateInput);
      const state = service.usersState();
      expect(state.currentUser).toEqual(updatedUser);
      expect(state.error).toBeNull();
    }));

    it('should handle error on update user profile', fakeAsync(() => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockRepo.updateUser.and.returnValue(throwError(() => error));

      service.updateUserProfile('123', mockUpdateInput).catch(() => {});
      tick();

      expect(console.error).toHaveBeenCalledWith('Error updating profile:', 'Server Error');

      const state = service.usersState();
      expect(state.currentUser).toEqual(mockUser);
      expect(state.error).toBe(null);
    }));
  })

  describe('deleteUser', () => {
    it('should delete user and update state', fakeAsync(async () => {
      const users = [mockUser];
      mockRepo.listUsers.and.returnValue(of(users));
      mockRepo.deleteUser.and.returnValue(of({ message: 'Deleted' }));

      await service.listUsers();

      await service.deleteUser(mockUser.userId);

      const state = service.usersState();
      expect(state.list.length).toBe(0);
    }));

    it('should handle error on deleteUser', fakeAsync(async () => {
      const error: ApiError = { status: 500, message: 'Server Error' };
      mockRepo.deleteUser.and.returnValue(throwError(() => error));

      mockRepo.listUsers.and.returnValue(of([mockUser]));
      await service.listUsers();

      try {
        await service.deleteUser(mockUser.userId);
      } catch (e) {
        void e;
      }

      expect(console.error).toHaveBeenCalledWith(
        `Error deleting user ${mockUser.userId}:`,
        'Server Error'
      );
    }));
  });
});
