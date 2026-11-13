import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { CommercialInquiry } from '../domain/model/commercial-inquiry.entity';
import { SubmitCommercialInquiryCommand } from '../domain/model/submit-commercial-inquiry.command';
import { CommercialApi } from '../infrastructure/commercial-api';
import { PUBLISHED_PLANS, PUBLISHED_VALUE } from '../infrastructure/landing-content';
@Injectable({ providedIn: 'root' })
export class CommercialStore {
  readonly #api = inject(CommercialApi);
  readonly plans = signal(PUBLISHED_PLANS).asReadonly();
  readonly value = signal(PUBLISHED_VALUE).asReadonly();
  readonly loading = signal(false);
  readonly receipt = signal<CommercialInquiry | null>(null);
  readonly error = signal<string | null>(null);
  readonly detail = signal<string | null>(null);

  submit(command: SubmitCommercialInquiryCommand) {
    this.loading.set(true);
    this.receipt.set(null);
    this.error.set(null);
    this.detail.set(null);
    return this.#api.submit(command).pipe(
      tap({
        next: (receipt) => this.receipt.set(receipt),
        error: (error: unknown) => {
          this.error.set(
            error instanceof HttpErrorResponse && error.status === 400
              ? 'commercial.errors.invalid'
              : 'commercial.errors.service',
          );
          const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
          if (
            body &&
            typeof body === 'object' &&
            'detail' in body &&
            typeof body.detail === 'string'
          ) {
            this.detail.set(body.detail);
          }
        },
      }),
      finalize(() => this.loading.set(false)),
    );
  }
}
