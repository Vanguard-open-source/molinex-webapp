import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from '@angular/router';
import { iamGuard } from '../infrastructure/iam.guard';
import { roleGuard } from '../infrastructure/role.guard';
export const identityAccessManagementRoutes: Routes = [
  {
    path: 'sign-in',
    title: () => inject(TranslateService).instant('iam.sign-in'),
    loadComponent: () => import('./views/sign-in/sign-in').then((module) => module.SignIn),
  },
  {
    path: 'users',
    title: () => inject(TranslateService).instant('iam.users-title'),
    canActivate: [iamGuard, roleGuard],
    data: { roles: ['administrator'] },
    loadComponent: () => import('./views/sign-up/sign-up').then((module) => module.SignUp),
  },
];
