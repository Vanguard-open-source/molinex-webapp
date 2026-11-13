import { HttpErrorResponse } from '@angular/common/http';
export function iamErrorKey(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'iam.errors.service';
  return (
    (
      {
        400: 'iam.errors.invalid',
        401: 'iam.errors.credentials',
        403: 'iam.errors.forbidden',
        409: 'iam.errors.duplicate',
      } as Record<number, string>
    )[error.status] ?? 'iam.errors.service'
  );
}
