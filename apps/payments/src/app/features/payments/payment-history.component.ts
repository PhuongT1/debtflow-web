import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  getStoredLocale,
  type AppLocale,
  type PaginatedResult,
  type PaymentRecord,
} from '@debtflow/contracts';
import { subscribePlatformEvent } from '@debtflow/platform-sdk';
import { PaymentApiService } from './payment-api.service';
import { paymentMessage, type PaymentMessageKey } from '@core/i18n/payment-messages';

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
  protected readonly partyId = signal<string | undefined>(undefined);
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
    this.destroyRef.onDestroy(
      subscribePlatformEvent('locale:changed', ({ locale }) => this.locale.set(locale)),
    );
  }

  protected t(key: PaymentMessageKey, values: Record<string, string | number> = {}) {
    return paymentMessage(this.locale(), key, values);
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

  protected allocationCodes(payment: PaymentRecord) {
    return payment.allocations.map((allocation) => allocation.debt.code).join(', ') || '-';
  }

  protected method(value: string) {
    const keys: Record<string, PaymentMessageKey> = {
      CASH: 'method.cash',
      BANK_TRANSFER: 'method.bankTransfer',
      OTHER: 'method.other',
    };
    return keys[value] ? this.t(keys[value]) : value;
  }

  protected go(page: number, pageSize = this.result().pageSize) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(pageSize));
    window.history.pushState({}, '', url);
    this.load(page, pageSize);
  }

  protected remove(payment: PaymentRecord) {
    if (!confirm(this.t('history.deleteConfirm'))) return;

    this.api
      .remove(payment.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.load(this.result().page, this.result().pageSize),
        error: () =>
          this.error.set(this.t('history.deleteError')),
      });
  }

  private loadFromUrl() {
    const params = new URL(window.location.href).searchParams;
    const partyId = params.get('partyId')?.trim() || undefined;
    this.partyId.set(partyId);
    this.load(
      Math.max(1, Number(params.get('page')) || 1),
      Math.min(100, Math.max(1, Number(params.get('pageSize')) || 20)),
      partyId,
    );
  }

  private load(page: number, pageSize: number, partyId = this.partyId()) {
    this.loading.set(true);
    this.error.set('');
    this.api
      .list(page, pageSize, partyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.result.set(value);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(this.t('history.loadError'));
          this.loading.set(false);
        },
      });
  }
}
