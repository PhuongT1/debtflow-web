import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, Subject } from 'rxjs';

import type { PaginatedResult, PaymentRecord } from '@packages/platform-contracts';

import { PaymentApiService, PaymentHistoryComponent } from './features/payments';

describe('Payments custom element content', () => {
  it('creates the payment history without a product shell', async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentHistoryComponent],
      providers: [
        {
          provide: PaymentApiService,
          useValue: {
            list: () => of({ items: [], total: 0, page: 1, pageSize: 20 }),
            remove: () => of(undefined),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PaymentHistoryComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.shell')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Lịch sử thanh toán');
  });
});

describe('PaymentApiService', () => {
  it('unwraps API pagination metadata into a framework-neutral result', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(PaymentApiService);
    const http = TestBed.inject(HttpTestingController);
    const resultPromise = firstValueFrom(service.list(1, 20));
    const request = http.expectOne(
      (candidate) =>
        candidate.url === '/api/payments' &&
        candidate.params.get('page') === '1' &&
        candidate.params.get('pageSize') === '20',
    );

    request.flush({
      success: true,
      statusCode: 200,
      code: 'SUCCESS',
      message: 'OK',
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      timestamp: '2026-08-27T00:00:00.000Z',
      path: '/api/payments',
    });

    await expect(resultPromise).resolves.toEqual({
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    http.verify();
  });
});

describe('Payment list navigation', () => {
  it('keeps the newest page when an older request completes later', async () => {
    const first = new Subject<PaginatedResult<PaymentRecord>>();
    const second = new Subject<PaginatedResult<PaymentRecord>>();
    let calls = 0;
    await TestBed.configureTestingModule({
      imports: [PaymentHistoryComponent],
      providers: [
        {
          provide: PaymentApiService,
          useValue: {
            list: () => (calls++ === 0 ? first : second),
            remove: () => of(undefined),
          },
        },
      ],
    }).compileComponents();
    const originalUrl = window.location.href;
    const fixture = TestBed.createComponent(PaymentHistoryComponent);
    try {
      fixture.detectChanges();
      window.history.replaceState(null, '', '?page=2');
      window.dispatchEvent(new PopStateEvent('popstate'));
      second.next({ items: [], total: 40, page: 2, pageSize: 20 });
      first.next({ items: [], total: 40, page: 1, pageSize: 20 });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('footer').textContent).toContain('2/2');
    } finally {
      fixture.destroy();
      window.history.replaceState(null, '', originalUrl);
    }
  });
});
