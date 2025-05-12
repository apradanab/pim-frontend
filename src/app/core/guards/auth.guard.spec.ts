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
    stateServiceMock = jasmine.createSpyObj('StateService', ['isLoggedIn', 'currentUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  describe('authGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
      TestBed.runInInjectionContext(() => authGuard(...params));

    it('should allow access when user is logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      expect(executeGuard(mockRoute, mockState)).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect when user is not logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        queryParams: { returnUrl: mockState.url }
      });
    });
  });

  describe('adminGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
      TestBed.runInInjectionContext(() => adminGuard(...params));

    const adminUser: User = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'ADMIN',
      approved: true
    };

    const regularUser: User = {
      id: '2',
      name: 'User',
      email: 'user@test.com',
      role: 'USER',
      approved: true
    };

    it('should allow access when user is admin', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.currentUser.and.returnValue(adminUser);
      expect(executeGuard(mockRoute, mockState)).toBeTrue();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should redirect when user is not admin', () => {
      stateServiceMock.isLoggedIn.and.returnValue(true);
      stateServiceMock.currentUser.and.returnValue(regularUser);
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        queryParams: { returnUrl: mockState.url }
      });
    });

    it('should redirect when user is not logged in', () => {
      stateServiceMock.isLoggedIn.and.returnValue(false);
      stateServiceMock.currentUser.and.returnValue(null);
      expect(executeGuard(mockRoute, mockState)).toBeFalse();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/'], {
        queryParams: { returnUrl: mockState.url }
      });
    });
  });
});
