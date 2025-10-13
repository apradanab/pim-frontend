import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { authGuard, adminGuard } from './auth.guard';
import { StateService } from '../services/state.service';
import { User } from '../../models/user.model';

describe('Auth Guards', () => {
  let stateServiceMock: jasmine.SpyObj<StateService>;
  let routerMock: jasmine.SpyObj<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/protected' } as RouterStateSnapshot;

  beforeEach(() => {
    stateServiceMock = jasmine.createSpyObj<StateService>('StateService', ['isLoggedIn', 'authState']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  describe('authGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
      TestBed.runInInjectionContext(() => authGuard(...params));

    it('should allow access when user is logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: { userId: '1', name: 'Test', email: 'test@test.com', role: 'USER', approved: true, createdAt: '2024-01-01T00:00:00.000Z' },
        token: 'mock-token',
        error: null
      });

      expect(executeGuard(mockRoute, mockState)).toBeTrue();
    });

    it('should redirect when user is not logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
    });
  });

  describe('adminGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
      TestBed.runInInjectionContext(() => adminGuard(...params));

    const createUser = (role: 'ADMIN' | 'USER'): User => ({
      userId: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: role,
      approved: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    });

    it('should allow access when user is admin', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: createUser('ADMIN'),
        token: 'mock-token',
        error: null
      });
      expect(executeGuard(mockRoute, mockState)).toBeTrue();
    });

    it('should redirect when user is not admin', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: createUser('USER'),
        token: 'mock-token',
        error: null
      });
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
    });

    it('should redirect when user is not logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
    });
  });
});
