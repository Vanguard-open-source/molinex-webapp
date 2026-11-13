import { SessionCoordinator } from '../../shared/application/session-coordinator';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { AuthenticatedSession } from '../domain/model/authenticated-session';
import { Role } from '../domain/model/role';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { IamApi } from '../infrastructure/iam-api';
import { SessionStorage } from '../infrastructure/session-storage';

@Injectable({ providedIn: 'root' })
export class IamStore {
  readonly #coordinator = inject(SessionCoordinator);
  readonly #api = inject(IamApi);
  readonly #storage = inject(SessionStorage);
  readonly #session = signal<AuthenticatedSession | null>(this.#storage.read());
  readonly session = this.#session.asReadonly();
  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isSignedIn = computed(() => this.session() !== null);
  readonly loading = signal(false);
  readonly notice = signal<string | null>(null);

  constructor() {
    const user = this.currentUser();
    this.#coordinator.setPrincipal(user ? { id: user.id, displayName: user.displayName } : null);
  }

  hasRole(...roles: Role[]): boolean {
    return this.currentUser()?.roles.some((role) => roles.includes(role)) ?? false;
  }

  homeRoute(): string {
    return this.hasRole('technician') ? '/assets/machinery' : '/production';
  }

  signIn(command: SignInCommand) {
    this.loading.set(true);
    return this.#api.signIn(command).pipe(
      tap((session) => {
        this.#session.set(session);
        this.#coordinator.setPrincipal({
          id: session.user.id,
          displayName: session.user.displayName,
        });
        this.#storage.write(session);
        this.notice.set(null);
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  signUp(command: SignUpCommand) {
    this.loading.set(true);
    return this.#api.signUp(command).pipe(finalize(() => this.loading.set(false)));
  }

  signOut(): void {
    this.#session.set(null);
    this.#coordinator.setPrincipal(null);
    this.#storage.clear();
    this.notice.set(null);
  }
}
