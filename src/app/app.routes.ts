import { iamGuard } from './identity-access-management/infrastructure/iam.guard';
import { roleGuard } from './identity-access-management/infrastructure/role.guard';
import { Routes } from '@angular/router';
import { applicationTitle } from './shared/presentation/application-title';

const productionManagementRoutes = () =>
  import('./production-management/presentation/production-management.routes').then(
    (module) => module.productionManagementRoutes,
  );
const qualityYieldControlRoutes = () =>
  import('./quality-yield-control/presentation/quality-yield-control.routes').then(
    (module) => module.qualityYieldControlRoutes,
  );
const assetMaintenanceManagementRoutes = () =>
  import('./asset-maintenance-management/presentation/asset-maintenance-management.routes').then(
    (module) => module.assetMaintenanceManagementRoutes,
  );
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(
    (module) => module.PageNotFound,
  );

export const routes: Routes = [
  {
    path: 'commercial',
    loadChildren: () =>
      import('./commercial-engagement/presentation/commercial-engagement.routes').then(
        (module) => module.commercialEngagementRoutes,
      ),
  },
  {
    path: 'iam',
    loadChildren: () =>
      import('./identity-access-management/presentation/identity-access-management.routes').then(
        (module) => module.identityAccessManagementRoutes,
      ),
  },
  {
    path: 'production',
    canActivate: [iamGuard, roleGuard],
    canActivateChild: [iamGuard, roleGuard],
    data: { roles: ['administrator', 'operator'] },
    loadChildren: productionManagementRoutes,
  },
  {
    path: 'quality',
    canActivate: [iamGuard, roleGuard],
    canActivateChild: [iamGuard, roleGuard],
    data: { roles: ['administrator', 'operator'] },
    loadChildren: qualityYieldControlRoutes,
  },
  {
    path: 'assets',
    canActivate: [iamGuard, roleGuard],
    canActivateChild: [iamGuard, roleGuard],
    data: { roles: ['administrator', 'technician'] },
    loadChildren: assetMaintenanceManagementRoutes,
  },
  { path: '', redirectTo: '/production', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: applicationTitle('Page not found'),
  },
];
