import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  if (!stateService.isLoggedIn()) {
    console.log('AuthGuard: User not logged in, redirecting to home');
    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('AuthGuard: User authenticated', stateService.authState().currentUser);
  return true;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  if (!stateService.isLoggedIn()) {
    console.log('AdminGuard: User not logged in, redirecting to home');
    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const userRole = stateService.authState().currentUser?.role;
  if (userRole !== 'ADMIN') {
    console.log('AdminGuard: User is not ADMIN, current role:', userRole);
    router.navigate(['/'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('AdminGuard: User is ADMIN, access granted');
  return true;
};
