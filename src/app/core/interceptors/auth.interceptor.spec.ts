import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { StateService } from '../services/state.service';
import { Observable } from 'rxjs';

describe('authInterceptor', () => {
  let stateServiceMock: jasmine.SpyObj<StateService>;
  let nextHandler: jasmine.SpyObj<HttpHandler>;
  const mockRequest = new HttpRequest('GET', '/api/test');

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    stateServiceMock = jasmine.createSpyObj('StateService', ['token']);
    nextHandler = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StateService, useValue: stateServiceMock }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {
    const testToken = 'test-token-123';
    stateServiceMock.token.and.returnValue(testToken);
    nextHandler.handle.and.returnValue(new Observable<HttpEvent<unknown>>());

    interceptor(mockRequest, nextHandler.handle);

    const interceptedRequest = nextHandler.handle.calls.mostRecent().args[0] as HttpRequest<unknown>;
    expect(interceptedRequest.headers.has('Authorization')).toBeTrue();
    expect(interceptedRequest.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
  });

  it('should not modify request when no token exists', () => {
    stateServiceMock.token.and.returnValue(null);
    nextHandler.handle.and.returnValue(new Observable<HttpEvent<unknown>>());

    interceptor(mockRequest, nextHandler.handle);

    expect(nextHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should pass through the request when no token', () => {
    stateServiceMock.token.and.returnValue(null);
    nextHandler.handle.and.returnValue(new Observable<HttpEvent<unknown>>());

    const result = interceptor(mockRequest, nextHandler.handle);

    expect(result).toBeInstanceOf(Observable);
    expect(nextHandler.handle).toHaveBeenCalledTimes(1);
  });
});
