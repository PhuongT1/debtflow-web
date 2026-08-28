import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { PaymentApiService } from './features/payments/payment-api.service';
import { PaymentHistoryComponent } from './features/payments/payment-history.component';

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
