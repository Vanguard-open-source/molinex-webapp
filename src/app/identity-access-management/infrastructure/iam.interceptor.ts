import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IamStore } from '../application/iam.store';

export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const base = environment.apiBaseUrl.replace(/\/$/, '');
  const isApi =
    request.url === base ||
    request.url.startsWith(`${base}/`) ||
    request.url.startsWith(`${base}?`);
  if (!isApi) return next(request);
  const endpoint = request.url.split('?')[0];
  const publicRequest =
    request.method === 'POST' &&
    ['users', 'tokens', 'commercial-inquiries'].some(
      (resource) => endpoint === `${base}/${resource}`,
    );
  const store = inject(IamStore);
  const router = inject(Router);
  const authorized =
    !publicRequest && store.token()
      ? request.clone({ setHeaders: { Authorization: `Bearer ${store.token()}` } })
      : request;
  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && !publicRequest && error.status === 401) {
        store.signOut();
        store.notice.set('iam.errors.expired');
        void router.navigate(['/iam/sign-in']);
      } else if (error instanceof HttpErrorResponse && error.status === 403) {
        store.notice.set('iam.errors.forbidden');
      }
      return throwError(() => error);
    }),
  );
};
