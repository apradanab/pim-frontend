import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { errorInterceptor, ApiError } from './error.interceptor';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through successful requests', (done) => {
    const mockReq = new HttpRequest('GET', '/test');
    const mockResponse = new HttpResponse({ status: 200, body: 'success' });
    const mockHandler: HttpHandlerFn = () => of(mockResponse);

    interceptor(mockReq, mockHandler).subscribe(response => {
      expect(response).toBe(mockResponse);
      done();
    });
  });

  it('should intercept 400 error and format it', (done) => {
    const mockReq = new HttpRequest('GET', '/test');
    const mockError = new HttpErrorResponse({ status: 400 });
    const mockHandler: HttpHandlerFn = () => throwError(() => mockError);

    interceptor(mockReq, mockHandler).subscribe({
      error: (error: ApiError) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Invalid request data');
        done();
      }
    });
  });

  it('should intercept 404 error and format it', (done) => {
    const mockReq = new HttpRequest('GET', '/test');
    const mockError = new HttpErrorResponse({ status: 404 });
    const mockHandler: HttpHandlerFn = () => throwError(() => mockError);

    interceptor(mockReq, mockHandler).subscribe({
      error: (error: ApiError) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Resource not found');
        done();
      }
    });
  });

  it('should use default message for unknown status codes', (done) => {
    const mockReq = new HttpRequest('GET', '/test');
    const mockError = new HttpErrorResponse({ status: 418 });
    const mockHandler: HttpHandlerFn = () => throwError(() => mockError);

    interceptor(mockReq, mockHandler).subscribe({
      error: (error: ApiError) => {
        expect(error.status).toBe(418);
        expect(error.message).toBe('An unexpected error occurred');
        done();
      }
    });
  });
});
