import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';
import { isRole } from '../domain/model/role';

export const roleGuard: CanActivateFn = (route) => {
  const store = inject(IamStore);
  const roles: unknown = route.data['roles'];
  if (Array.isArray(roles) && roles.every(isRole) && store.hasRole(...roles)) return true;
  store.notice.set('iam.errors.forbidden');
  return inject(Router).createUrlTree([store.homeRoute()]);
};
