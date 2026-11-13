import { Injectable } from '@angular/core';
import { AuthenticatedSession } from '../domain/model/authenticated-session';
import { isRole } from '../domain/model/role';
import { User } from '../domain/model/user.entity';

const SESSION_KEY = 'molinex.session';

@Injectable({ providedIn: 'root' })
export class SessionStorage {
  read(): AuthenticatedSession | null {
    try {
      const text = globalThis.sessionStorage.getItem(SESSION_KEY);
      const value: unknown = text ? JSON.parse(text) : null;
      if (!value || typeof value !== 'object' || !('token' in value) || !('user' in value))
        return null;
      const user = value.user;
      if (typeof value.token !== 'string' || !value.token || !user || typeof user !== 'object')
        return null;
      if (
        !('id' in user) ||
        typeof user.id !== 'number' ||
        !Number.isInteger(user.id) ||
        user.id <= 0 ||
        !('email' in user) ||
        typeof user.email !== 'string' ||
        !('roles' in user) ||
        !Array.isArray(user.roles) ||
        user.roles.length !== 1 ||
        !user.roles.every(isRole)
      )
        return null;
      return { token: value.token, user: new User(user.id, user.email, '', user.roles) };
    } catch {
      return null;
    }
  }

  write(session: AuthenticatedSession): void {
    try {
      globalThis.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          token: session.token,
          user: { id: session.user.id, email: session.user.email, roles: session.user.roles },
        }),
      );
    } catch {
      /* The signal session remains usable when browser storage is unavailable. */
    }
  }

  clear(): void {
    try {
      globalThis.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* Signing out in memory does not depend on browser storage. */
    }
  }
}
