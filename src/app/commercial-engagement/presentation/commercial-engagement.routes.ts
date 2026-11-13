import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Routes } from '@angular/router';
export const commercialEngagementRoutes: Routes = [
  {
    path: 'plans',
    title: () => inject(TranslateService).instant('commercial.plans-title'),
    loadComponent: () =>
      import('./views/plan-catalog/plan-catalog').then((module) => module.PlanCatalog),
  },
  {
    path: 'value-proposition',
    title: () => inject(TranslateService).instant('commercial.value-title'),
    loadComponent: () =>
      import('./views/value-proposition/value-proposition').then(
        (module) => module.ValuePropositionView,
      ),
  },
  {
    path: 'inquiries/new',
    title: () => inject(TranslateService).instant('commercial.request'),
    loadComponent: () =>
      import('./views/commercial-inquiry-form/commercial-inquiry-form').then(
        (module) => module.CommercialInquiryForm,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'plans' },
];
