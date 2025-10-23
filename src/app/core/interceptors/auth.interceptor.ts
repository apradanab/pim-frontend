import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/states/auth.state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(AuthStateService);

  if  (req.url.includes('/login') || req.url.includes('/create')) {
    return next(req);
  }

  if (stateService.isLoggedIn()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${stateService.authState().token}`
      }
    });
    return next(authReq);
  }

  return next(req)
};
