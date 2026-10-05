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
  import(
    './asset-maintenance-management/presentation/asset-maintenance-management.routes'
  ).then(
    (module) => module.assetMaintenanceManagementRoutes,
  );
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(
    (module) => module.PageNotFound,
  );

export const routes: Routes = [
  { path: 'production', loadChildren: productionManagementRoutes },
  { path: 'quality', loadChildren: qualityYieldControlRoutes },
  { path: 'assets', loadChildren: assetMaintenanceManagementRoutes },
  { path: '', redirectTo: '/production', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: applicationTitle('Page not found'),
  },
];
