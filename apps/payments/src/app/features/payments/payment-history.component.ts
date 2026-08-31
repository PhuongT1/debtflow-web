import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getStoredLocale, type AppLocale, type PaginatedResult, type PaymentRecord } from '@debtflow/contracts';
import { PaymentApiService } from './payment-api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'df-payment-history',
  styleUrl: './payment-history.component.scss',
  templateUrl: './payment-history.component.html',
})
export class PaymentHistoryComponent {
  private readonly api = inject(PaymentApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly locale = signal<AppLocale>(getStoredLocale());
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly result = signal<PaginatedResult<PaymentRecord>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
  });
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.result().total / this.result().pageSize)),
  );

  constructor() {
    this.loadFromUrl();
    const onHistoryChange = () => this.loadFromUrl();
    window.addEventListener('popstate', onHistoryChange);
    this.destroyRef.onDestroy(() => window.removeEventListener('popstate', onHistoryChange));
  }

  protected money(value: string | number) {
    const isEn = this.locale() === 'en';
    return new Intl.NumberFormat(isEn ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  protected date(value: string) {
    const isEn = this.locale() === 'en';
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'vi-VN').format(new Date(value));
  }

  protected method(value: string) {
    const isEn = this.locale() === 'en';
    if (isEn) {
      return (
        ({ CASH: 'Cash', BANK_TRANSFER: 'Bank Transfer', OTHER: 'Other' } as Record<string, string>)[
          value
        ] ?? value
      );
    }
    return (
      (
        { CASH: 'Tiền mặt', BANK_TRANSFER: 'Chuyển khoản', OTHER: 'Khác' } as Record<string, string>
      )[value] ?? value
    );
  }

  protected go(page: number, pageSize = this.result().pageSize) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    window.history.pushState({}, '', url);
    this.load(page, pageSize);
  }

  protected remove(payment: PaymentRecord) {
    const isEn = this.locale() === 'en';
    const confirmMsg = isEn
      ? 'Are you sure you want to delete this payment? Debt balance will be recalculated.'
      : 'Bạn chắc chắn muốn xóa thanh toán này? Số dư công nợ sẽ được tính lại.';

    if (!confirm(confirmMsg)) return;

    this.api
      .remove(payment.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.load(this.result().page, this.result().pageSize),
        error: () =>
          this.error.set(
            isEn ? 'Failed to delete payment. Please try again.' : 'Không thể xóa thanh toán. Vui lòng thử lại.',
          ),
      });
  }

  private loadFromUrl() {
    const params = new URL(window.location.href).searchParams;
    this.load(
      Math.max(1, Number(params.get('page')) || 1),
      Math.min(100, Math.max(1, Number(params.get('pageSize')) || 20)),
    );
  }

  private load(page: number, pageSize: number) {
    this.loading.set(true);
    this.error.set('');
    this.api
      .list(page, pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.result.set(value);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Không thể tải lịch sử thanh toán.');
          this.loading.set(false);
        },
      });
  }
}
