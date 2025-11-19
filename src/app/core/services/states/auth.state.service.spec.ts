import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthStateService } from './auth.state.service';
import { UsersRepoService } from '../repos/users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';
import { UsersStateService } from './users.state.service';

const mockUsersState = jasmine.createSpyObj('UsersStateService', ['setCurrentUser']);

describe('AuthStateService', () => {
  let service: AuthStateService;
  let mockRepo: jasmine.SpyObj<UsersRepoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockToken = 'header.payload.signature';
  const mockUser: User = {
    userId: '123',
    cognitoId: 'cognito-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    approved: true
  };

  const mockUserFromLogin: User = {
    ...mockUser,
    userId: '123',
  };

  const mockAdminUser: User = {
    ...mockUser,
    role: 'ADMIN',
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('UsersRepoService', ['login', 'getById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: UsersRepoService, useValue: mockRepo },
        { provide: Router, useValue: mockRouter },
        { provide: UsersStateService, useValue: mockUsersState }
      ]
    });

    service = TestBed.inject(AuthStateService);
    mockUsersState.setCurrentUser.calls.reset();

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key === 'token' ? mockToken : null
    );
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(window, 'atob').and.callFake(() => JSON.stringify({
      sub: '123'
    }));

    spyOn(console, 'error');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('Initial State', () => {
    it('should initialize with idle state and not ready', () => {
      const state = service.authState();

      expect(state.status).toBe('idle');
      expect(state.currentUser).toBeNull();
      expect(service.isReady()).toBeFalse();
    });
  });

  describe('login', () => {
    it('should handle successful login and set state', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));

      service.login('test@example.com', 'password');
      tick();

      const state = service.authState();
      expect(state.currentUser).toEqual(mockUserFromLogin);
      expect(state.token).toBe(mockToken);
      expect(state.status).toBe('success');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockUsersState.setCurrentUser).toHaveBeenCalledWith(mockUserFromLogin);
    }));

    it('should navigate to /admin for ADMIN users', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockAdminUser }));

      service.login('admin@example.com', 'password');
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/']);
    }));

    it('should handle login error', fakeAsync(() => {
      const error: ApiError = { status: 401, message: 'Authentication required' };
      mockRepo.login.and.returnValue(throwError(() => error));

      service.login('fail@example.com', 'wrongpassword');
      tick();

      const state = service.authState();
      expect(state.status).toBe('error');
      expect(state.error).toBe('Authentication required');
    }));
  });

  describe('logout', () => {
    it('should clear state and remove token', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));
      service.login('test@example.com', 'password');
      tick();

      service.logout();

      const state = service.authState();

      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(state.status).toBe('idle');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(mockUsersState.setCurrentUser).toHaveBeenCalledWith(null);
    }));
  });

  describe('checkAuth and restoreSession', () => {

    it('should complete checkAuth and set isReady=true when no token is found', fakeAsync(async () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      await service.checkAuth();
      tick();

      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(service.isReady()).toBeTrue();
      expect(service.authState().status).toBe('idle');
    }));

    it('should successfully restore session with valid token and API response', fakeAsync(async () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);
      mockRepo.getById.and.returnValue(of(mockUser));

      await service.checkAuth();
      tick();

      const state = service.authState();
      expect(mockRepo.getById).toHaveBeenCalledWith('123');
      expect(state.status).toBe('success');
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(service.isReady()).toBeTrue();
      expect(mockUsersState.setCurrentUser).toHaveBeenCalledWith(mockUser);
    }));

    it('should logout and set isReady=true when token decoding fails', fakeAsync(async () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');
      (window.atob as jasmine.Spy).and.throwError('Invalid token format');
      spyOn(service, 'logout');

      await service.checkAuth();
      tick();

      expect(service.logout).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(service.isReady()).toBeTrue();
      expect(service.authState().currentUser).toBeNull();
    }));

    it('should logout and set isReady=true when getById fails', fakeAsync(async () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);
      const apiError: ApiError = { status: 404, message: 'User not found' };
      mockRepo.getById.and.returnValue(throwError(() => apiError));
      spyOn(service, 'logout');

      await service.checkAuth();
      tick();

      expect(mockRepo.getById).toHaveBeenCalledWith('123');
      expect(service.logout).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        'Session restoration failed. Logging out',
        jasmine.anything()
      );
      expect(service.isReady()).toBeTrue();
    }));
  });

  describe('Utility Methods', () => {
    it('should return true for isLoggedIn if token exists', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));
      service.login('test@example.com', 'password');
      tick();

      expect(service.isLoggedIn()).toBeTrue();
    }));

    it('should return false for isLoggedIn if token is null', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return the current user when logged in', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));
      service.login('test@example.com', 'password');
      tick();

      const currentUser = service.getCurrentUser();
      expect(currentUser).toEqual(mockUserFromLogin);
    }));
  });
});
