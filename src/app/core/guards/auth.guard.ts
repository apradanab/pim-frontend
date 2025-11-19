import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/states/auth.state.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(AuthStateService);
  const router = inject(Router);

  return toObservable(stateService.isReady).pipe(
    filter(isReady => isReady),
    take(1),
    map(() => {
      if (!stateService.isLoggedIn()) {
        router.navigate(['/'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }

      return true;
    })
  )
};

export const adminGuard: CanActivateFn = (route, state) => {
  const stateService = inject(AuthStateService);
  const router = inject(Router);

  return toObservable(stateService.isReady).pipe(
    filter(isReady => isReady),
    take(1),
    map(() => {
      if (!stateService.isLoggedIn()) {
        router.navigate(['/'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }

      const userRole = stateService.authState().currentUser?.role;
      if (userRole !== 'ADMIN') {
        router.navigate(['/'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }

      return true;
    })
  )
};
