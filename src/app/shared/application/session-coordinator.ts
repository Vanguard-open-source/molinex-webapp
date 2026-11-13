import { Injectable, signal } from '@angular/core';

export interface SessionPrincipal {
  readonly id: number;
  readonly displayName: string;
}

/** Technical session coordination; no IAM domain entity is shared with another context. */
@Injectable({ providedIn: 'root' })
export class SessionCoordinator {
  readonly #principal = signal<SessionPrincipal | null>(null);
  readonly principal = this.#principal.asReadonly();
  setPrincipal(principal: SessionPrincipal | null): void {
    this.#principal.set(principal);
  }
}
