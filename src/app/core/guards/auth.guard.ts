import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  if (!stateService.isLoggedIn()) {
    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  if (!stateService.isLoggedIn() || stateService.currentUser?.role !== 'ADMIN') {
    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
  return true;
};
