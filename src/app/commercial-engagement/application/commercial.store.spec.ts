import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CommercialStore } from './commercial.store';

describe('US-36 confirmed commercial inquiry', () => {
  let store: CommercialStore;
  let http: HttpTestingController;
  const command = {
    fullName: 'Commercial Test',
    email: 'commercial@molinex.test',
    phoneNumber: null,
    companyName: 'Test Mill',
    message: 'Please provide plan information.',
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(CommercialStore);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('posts the exact frontend contract and confirms only after 201', () => {
    store.submit(command).subscribe();
    expect(store.receipt()).toBeNull();
    const request = http.expectOne(`${environment.apiBaseUrl}/commercial-inquiries`);
    expect(request.request.body).toEqual(command);
    request.flush(
      { ...command, id: 1, submittedAt: '2026-11-13T12:00:00Z' },
      { status: 201, statusText: 'Created' },
    );
    expect(store.receipt()?.id).toBe(1);
    expect(store.loading()).toBe(false);
  });
  it('does not show confirmation after a service failure and keeps the submitted command intact', () => {
    store.submit(command).subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiBaseUrl}/commercial-inquiries`)
      .flush({ detail: 'Temporarily unavailable' }, { status: 503, statusText: 'Unavailable' });
    expect(store.receipt()).toBeNull();
    expect(store.error()).toBe('commercial.errors.service');
    expect(store.detail()).toBe('Temporarily unavailable');
    expect(command.message).toBe('Please provide plan information.');
  });
  it('rejects a success-shaped body that does not confirm creation with 201', () => {
    store.submit(command).subscribe({ error: () => undefined });
    http
      .expectOne(`${environment.apiBaseUrl}/commercial-inquiries`)
      .flush({ ...command, id: 1, submittedAt: '2026-11-13T12:00:00Z' });
    expect(store.receipt()).toBeNull();
    expect(store.error()).toBe('commercial.errors.service');
  });
});
