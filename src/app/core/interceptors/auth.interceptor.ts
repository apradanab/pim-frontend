import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);
  const token = stateService.token();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
