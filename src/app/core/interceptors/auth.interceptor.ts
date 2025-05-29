import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);

  if  (req.url.includes('/login') || req.url.includes('/create')) {
    return next(req);
  }

  if (stateService.isLoggedIn()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${stateService.currentToken}`
      }
    });
    return next(authReq);
  }

  return next(req)
};
