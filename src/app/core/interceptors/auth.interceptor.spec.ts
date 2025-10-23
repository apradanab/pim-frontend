import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpHandlerFn, HttpHeaders } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthStateService } from '../services/states/auth.state.service';
import { Observable, of } from 'rxjs';

describe('authInterceptor', () => {
  let stateServiceMock: jasmine.SpyObj<AuthStateService>;
  let nextHandler: jasmine.Spy<HttpHandlerFn>;
  const mockRequest = new HttpRequest('GET', '/api/test');

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    stateServiceMock = jasmine.createSpyObj<AuthStateService>('AuthStateService', ['isLoggedIn', 'authState']);

    stateServiceMock.authState.and.returnValue({
      status: 'idle',
      currentUser: null,
      token: null,
      error: null
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nextHandler = jasmine.createSpy('nextHandler').and.callFake((_req: HttpRequest<unknown>) => {
      return of({} as HttpEvent<unknown>);
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateService, useValue: stateServiceMock }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {
    const testToken = 'test-token-123';
    stateServiceMock.isLoggedIn.and.returnValue(true);
    stateServiceMock.authState.and.returnValue({
      status: 'success',
      currentUser: null,
      token: testToken,
      error: null
    });

    interceptor(mockRequest, nextHandler);

    const interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeTrue();
    expect(interceptedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should not modify request when no token exists', () => {
    stateServiceMock.isLoggedIn.and.returnValue(false);
    stateServiceMock.authState.and.returnValue({
      status: 'idle',
      currentUser: null,
      token: null,
      error: null
    });

    interceptor(mockRequest, nextHandler);

    const interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
  });

  it('should pass through login and create requests without modification', () => {
    const testToken = 'test-token';
    stateServiceMock.isLoggedIn.and.returnValue(true);
    stateServiceMock.authState.and.returnValue({
      status: 'success',
      currentUser: null,
      token: testToken,
      error: null
    });

    const loginRequest = new HttpRequest('POST', '/login', null, {
      headers: new HttpHeaders()
    });
    interceptor(loginRequest, nextHandler);

    let interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();

    const createRequest = new HttpRequest('POST', '/create', null, {
      headers: new HttpHeaders()
    });
    interceptor(createRequest, nextHandler);

    interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
  });

  it('should pass through the request when not logged in', () => {
    stateServiceMock.isLoggedIn.and.returnValue(false);
    stateServiceMock.authState.and.returnValue({
      status: 'idle',
      currentUser: null,
      token: null,
      error: null
    });

    const result = interceptor(mockRequest, nextHandler);

    expect(result).toBeInstanceOf(Observable);
    expect(nextHandler).toHaveBeenCalledTimes(1);
  });
});
