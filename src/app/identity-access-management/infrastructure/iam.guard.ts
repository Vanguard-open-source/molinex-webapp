import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';

export const iamGuard: CanActivateFn = (_route, state) => {
  const store = inject(IamStore);
  return (
    store.isSignedIn() ||
    inject(Router).createUrlTree(['/iam/sign-in'], {
      queryParams: { returnUrl: state.url },
    })
  );
};
