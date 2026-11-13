import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { IamStore } from './iam.store';

describe('IAM session contract', () => {
  let store: IamStore;
  let http: HttpTestingController;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(IamStore);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it('creates a signal session from the exact token response and clears it on sign-out', () => {
    store.signIn({ email: 'operator@molinex.test', password: 'FAKE-demo-only-2026!' }).subscribe();
    const request = http.expectOne(`${environment.apiBaseUrl}/tokens`);
    expect(request.request.body).toEqual({
      email: 'operator@molinex.test',
      password: 'FAKE-demo-only-2026!',
    });
    request.flush(
      { id: 3, email: 'operator@molinex.test', role: 'operator', token: 'opaque-demo' },
      { status: 201, statusText: 'Created' },
    );
    expect(store.isSignedIn()).toBe(true);
    expect(store.hasRole('operator')).toBe(true);
    expect(store.hasRole('administrator')).toBe(false);
    expect(store.currentUser()?.displayName).toBe('operator@molinex.test');
    expect(store.loading()).toBe(false);
    store.signOut();
    expect(store.token()).toBeNull();
    expect(sessionStorage.getItem('molinex.session')).toBeNull();
  });

  it('keeps an in-memory session when sessionStorage fails', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('Storage disabled');
      },
      setItem: () => {
        throw new Error('Storage disabled');
      },
      removeItem: () => {
        throw new Error('Storage disabled');
      },
    });
    store
      .signIn({ email: 'technician@molinex.test', password: 'FAKE-demo-only-2026!' })
      .subscribe();
    http
      .expectOne(`${environment.apiBaseUrl}/tokens`)
      .flush(
        { id: 2, email: 'technician@molinex.test', role: 'technician', token: 'opaque' },
        { status: 201, statusText: 'Created' },
      );
    expect(store.isSignedIn()).toBe(true);
    expect(store.homeRoute()).toBe('/assets/machinery');
    expect(() => store.signOut()).not.toThrow();
    expect(store.isSignedIn()).toBe(false);
  });

  it('does not establish a session after a credentials failure', () => {
    store
      .signIn({ email: 'operator@molinex.test', password: 'wrong' })
      .subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiBaseUrl}/tokens`)
      .flush({ detail: 'Invalid credentials.' }, { status: 401, statusText: 'Unauthorized' });
    expect(store.isSignedIn()).toBe(false);
    expect(store.loading()).toBe(false);
  });

  it('posts one role without signing in as the newly created user', () => {
    store
      .signUp({
        email: 'new@molinex.test',
        password: 'fake-password',
        fullName: 'New User',
        roles: ['operator'],
      })
      .subscribe();
    const request = http.expectOne(`${environment.apiBaseUrl}/users`);
    expect(request.request.body).toEqual({
      email: 'new@molinex.test',
      password: 'fake-password',
      fullName: 'New User',
      roles: ['operator'],
    });
    request.flush(
      {
        id: 4,
        email: 'new@molinex.test',
        fullName: 'New User',
        roles: ['operator'],
        status: 'ACTIVE',
      },
      { status: 201, statusText: 'Created' },
    );
    expect(store.isSignedIn()).toBe(false);
  });
});
