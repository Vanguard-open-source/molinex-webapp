import { Routes } from '@angular/router';
import { applicationTitle } from './shared/presentation/application-title';

const productionManagementRoutes = () =>
  import('./production-management/presentation/production-management.routes').then(
    (module) => module.productionManagementRoutes,
  );
const sectionOverview = () =>
  import('./shared/presentation/components/section-overview/section-overview').then(
    (module) => module.SectionOverview,
  );
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then(
    (module) => module.PageNotFound,
  );

export const routes: Routes = [
  { path: 'production', loadChildren: productionManagementRoutes },
  {
    path: 'quality',
    loadComponent: sectionOverview,
    title: applicationTitle('Quality and yield'),
    data: {
      title: 'views.quality.title',
      description: 'views.quality.description',
      icon: 'fact_check',
    },
  },
  {
    path: 'assets',
    children: [
      { path: '', redirectTo: 'machinery', pathMatch: 'full' },
      {
        path: 'machinery',
        loadComponent: sectionOverview,
        title: applicationTitle('Machinery'),
        data: {
          title: 'views.machinery.title',
          description: 'views.machinery.description',
          icon: 'precision_manufacturing',
        },
      },
      {
        path: 'maintenance',
        loadComponent: sectionOverview,
        title: applicationTitle('Maintenance'),
        data: {
          title: 'views.maintenance.title',
          description: 'views.maintenance.description',
          icon: 'build_circle',
        },
      },
    ],
  },
  { path: '', redirectTo: '/production', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: applicationTitle('Page not found'),
  },
];
