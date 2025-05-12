import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ApiError {
  status: number;
  message: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessages: Record<number, string> = {
        400: 'Invalid request data',
        401: 'Authentication required',
        403: 'Operation not permitted',
        404: 'Resource not found',
        422: 'Validation failed',
        500: 'Internal server error'
      };

      const formattedError: ApiError = {
        status: error.status,
        message: errorMessages[error.status] || 'An unexpected error occurred',
      };

      return throwError(() => formattedError);
    })
  );
};
