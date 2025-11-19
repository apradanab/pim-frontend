import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpHandlerFn, HttpHeaders } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { Observable, of } from 'rxjs';

describe('authInterceptor', () => {
  let nextHandler: jasmine.Spy<HttpHandlerFn>;
  const mockRequest = new HttpRequest('GET', '/api/test');

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nextHandler = jasmine.createSpy('nextHandler').and.callFake((_req: HttpRequest<unknown>) => {
      return of({} as HttpEvent<unknown>);
    });

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
  });

  it('should add Authorization header when token exists', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('test-token');

    interceptor(mockRequest, nextHandler);

    const interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeTrue();
    expect(interceptedRequest.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not modify request when no token exists', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    interceptor(mockRequest, nextHandler);

    const interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
  });

  it('should pass through login and create requests without modification', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('some-token');

    const loginRequest = new HttpRequest('POST', '/login', null, { headers: new HttpHeaders() });
    interceptor(loginRequest, nextHandler);
    let interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();

    const createRequest = new HttpRequest('POST', '/create', null, { headers: new HttpHeaders() });
    interceptor(createRequest, nextHandler);
    interceptedRequest = nextHandler.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
  });

  it('should pass through the request when no token', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const result = interceptor(mockRequest, nextHandler);

    expect(result).toBeInstanceOf(Observable);
    expect(nextHandler).toHaveBeenCalledTimes(1);
  });
});
