import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { IamStore } from '../application/iam.store';
import { iamGuard } from './iam.guard';
import { iamInterceptor } from './iam.interceptor';
import { roleGuard } from './role.guard';

describe('IAM guards and bearer interception', () => {
  let store: IamStore;
  let http: HttpTestingController;
  let client: HttpClient;
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([iamInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    store = TestBed.inject(IamStore);
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });
  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });
  function signIn() {
    store.signIn({ email: 'operator@molinex.test', password: 'fake' }).subscribe();
    http
      .expectOne(`${environment.apiBaseUrl}/tokens`)
      .flush(
        { id: 3, email: 'operator@molinex.test', role: 'operator', token: 'issued-token' },
        { status: 201, statusText: 'Created' },
      );
  }
  it('redirects an anonymous operational route to sign-in', () => {
    const route = {} as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      iamGuard(route, { url: '/production' } as RouterStateSnapshot),
    );
    expect(String(result)).toContain('/iam/sign-in');
  });
  it('denies an administrator route to an operator with an accessible notice key', () => {
    signIn();
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(
        { data: { roles: ['administrator'] } } as unknown as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
    expect(String(result)).toBe('/production');
    expect(store.notice()).toBe('iam.errors.forbidden');
  });
  it('adds bearer only to private API calls and leaves public or foreign requests unchanged', () => {
    signIn();
    client.get(`${environment.apiBaseUrl}/machines`).subscribe();
    const protectedRequest = http.expectOne(`${environment.apiBaseUrl}/machines`);
    expect(protectedRequest.request.headers.get('Authorization')).toBe('Bearer issued-token');
    protectedRequest.flush([]);
    client.post(`${environment.apiBaseUrl}/commercial-inquiries`, {}).subscribe();
    const publicRequest = http.expectOne(`${environment.apiBaseUrl}/commercial-inquiries`);
    expect(publicRequest.request.headers.has('Authorization')).toBe(false);
    publicRequest.flush({});
    client.get('https://example.test/api/v1/machines').subscribe();
    const foreign = http.expectOne('https://example.test/api/v1/machines');
    expect(foreign.request.headers.has('Authorization')).toBe(false);
    foreign.flush([]);
  });
  it('clears a session on protected 401 and retains it while reporting 403', () => {
    signIn();
    client.get(`${environment.apiBaseUrl}/machines`).subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiBaseUrl}/machines`)
      .flush({ detail: 'Denied' }, { status: 403, statusText: 'Forbidden' });
    expect(store.isSignedIn()).toBe(true);
    expect(store.notice()).toBe('iam.errors.forbidden');
    client.get(`${environment.apiBaseUrl}/machines`).subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiBaseUrl}/machines`)
      .flush({ detail: 'Expired' }, { status: 401, statusText: 'Unauthorized' });
    expect(store.isSignedIn()).toBe(false);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/iam/sign-in']);
  });
});
