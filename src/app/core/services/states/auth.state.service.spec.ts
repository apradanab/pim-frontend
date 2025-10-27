import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthStateService } from './auth.state.service';
import { UsersRepoService } from '../repos/users.repo.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { of, throwError } from 'rxjs';
import { ApiError } from '../../interceptors/error.interceptor';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let mockRepo: jasmine.SpyObj<UsersRepoService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockToken = 'mock-token';
  const mockUser: User = {
    userId: '123',
    cognitoId: 'cognito-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    approved: true
  };

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj('UsersRepoService', ['login']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthStateService,
        { provide: UsersRepoService, useValue: mockRepo },
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthStateService);

    spyOn(localStorage, 'getItem').and.callFake((key) =>
      key === 'token' ? mockToken : null
    );
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(window, 'atob').and.callFake(() => JSON.stringify({
      sub: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
      approved: true
    }));

    spyOn(console, 'error');
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('Initial State', () => {
    it('should initialize with idle state', () => {
      const state = service.authState();

      expect(state.status).toBe('idle');
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBeNull();
    });

    it('should not be logged in initially', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('Login', () => {
    it('should handle successful login', fakeAsync(() => {
      mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));

      service.login('test@example.com', 'password');
      tick();

      const state = service.authState();
      expect(state.currentUser).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.status).toBe('success');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }))

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

  it('should clear state on logout', fakeAsync(() => {
    service.logout();

    const state = service.authState();

    expect(state.currentUser).toBeNull();
    expect(state.token).toBeNull();
    expect(state.status).toBe('idle');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));

  describe('checkAuth', () => {
    it('should validate token on checkAuth', fakeAsync(() => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);

      service.checkAuth();
      tick();

      const state = service.authState();
      expect(state.currentUser).toEqual(jasmine.objectContaining({
        userId: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN'
      }));
      expect(state.token).toBe(mockToken);
    }));

    it('should logout when token is invalid', fakeAsync(() => {
      (window.atob as jasmine.Spy).and.throwError('Invalid token');
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-token');

      service.checkAuth();
      tick();

      const state = service.authState();
      expect(state.currentUser).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    }));

    it('should set default values when token payload is missing or nulish fields', fakeAsync(() => {
      (window.atob as jasmine.Spy).and.callFake(() => JSON.stringify({
        sub: '2',
        name: null,
        email: undefined
      }));
      (localStorage.getItem as jasmine.Spy).and.returnValue('mock-token');

      service.checkAuth();
      tick();

      const state = service.authState();
      expect(state.currentUser).toEqual({
        userId: '2',
        cognitoId: '2',
        name: '',
        email: '',
        role: 'USER',
        approved: true
      });
      expect(state.token).toBe('mock-token');
    }));
  });

  it('should return the current user when logged in', fakeAsync(() => {
    mockRepo.login.and.returnValue(of({ token: mockToken, user: mockUser }));
    service.login('test@example.com', 'password');
    tick();

    const currentUser = service.getCurrentUser();
    expect(currentUser).toEqual(mockUser);
  }))
});
