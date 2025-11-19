import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot, GuardResult } from '@angular/router';
import { authGuard, adminGuard } from './auth.guard';
import { AuthStateService } from '../services/states/auth.state.service';
import { User } from '../../models/user.model';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthState } from '../../models/state.model';

describe('Auth Guards', () => {
  let stateServiceMock: jasmine.SpyObj<AuthStateService>;
  let routerMock: jasmine.SpyObj<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/protected' } as RouterStateSnapshot;

  beforeEach(() => {
    stateServiceMock = jasmine.createSpyObj<AuthStateService>('AuthStateService', [
      'isLoggedIn',
      'authState',
      'isReady'
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    stateServiceMock.isReady.and.returnValue(true);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const executeGuard = (guard: CanActivateFn) => (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> => {
    return TestBed.runInInjectionContext(() => guard(route, state)) as Observable<GuardResult>;
  };

  describe('authGuard', () => {
    const authExecuteGuard = executeGuard(authGuard);

    it('should allow access when user is logged in', async () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: {} as User,
        token: 'mock-token',
        error: null
      } as AuthState);

      const result$ = authExecuteGuard(mockRoute, mockState);
      const result = await firstValueFrom(result$);

      expect(result).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect when user is not logged in', async () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);

      const result$ = authExecuteGuard(mockRoute, mockState);
      const result = await firstValueFrom(result$);

      expect(result).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], { queryParams: { returnUrl: mockState.url } });
    });
  });

  describe('adminGuard', () => {
    const adminExecuteGuard = executeGuard(adminGuard);

    const createUser = (role: 'ADMIN' | 'USER'): User => ({
      userId: '1',
      name: 'Test User',
      email: 'test@test.com',
      role,
      approved: true,
      createdAt: '2024-01-01T00:00:00.000Z'
    });

    it('should allow access when user is admin', async () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: createUser('ADMIN'),
        token: 'mock-token',
        error: null
      } as AuthState);

      const result$ = adminExecuteGuard(mockRoute, mockState);
      const result = await firstValueFrom(result$);

      expect(result).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect when user is not admin', async () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.authState.and.returnValue({
        status: 'success',
        currentUser: createUser('USER'),
        token: 'mock-token',
        error: null
      } as AuthState);

      const result$ = adminExecuteGuard(mockRoute, mockState);
      const result = await firstValueFrom(result$);

      expect(result).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], { queryParams: { returnUrl: mockState.url } });
    });

    it('should redirect when user is not logged in', async () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);

      const result$ = adminExecuteGuard(mockRoute, mockState);
      const result = await firstValueFrom(result$);

      expect(result).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], { queryParams: { returnUrl: mockState.url } });
    });
  });
});
