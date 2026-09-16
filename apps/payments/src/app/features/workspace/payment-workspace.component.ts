import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { type AppLocale, type AuthUser } from '@debtflow/contracts';
import { getStoredLocale, setStoredLocale, subscribePlatformEvent } from '@debtflow/platform-sdk';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { environment } from '@env/environment';
import { PlatformSessionService } from '@core/session/platform-session.service';
import { PaymentHistoryComponent } from '@features/payments/payment-history.component';
import { paymentMessage, type PaymentMessageKey } from '@core/i18n/payment-messages';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaymentHistoryComponent],
  selector: 'df-payment-workspace',
  styleUrl: './payment-workspace.component.scss',
  templateUrl: './payment-workspace.component.html',
})
export class PaymentWorkspaceComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly session = inject(PlatformSessionService);

  protected readonly embedded = this.host.nativeElement.hasAttribute('data-host-version');
  protected readonly hasPlatformOrigin = Boolean(environment.shellOrigin);
  protected readonly user = signal<AuthUser | undefined>(undefined);
  protected readonly locale = signal<AppLocale>('vi');

  constructor() {
    if (this.embedded) return;

    document.body.classList.add('df-payments-standalone');
    this.destroyRef.onDestroy(() => document.body.classList.remove('df-payments-standalone'));
    this.locale.set(this.getInitialLocale());
    this.session
      .currentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.user.set(user));
    this.destroyRef.onDestroy(
      subscribePlatformEvent('locale:changed', ({ locale }) => this.locale.set(locale)),
    );
  }

  protected t(key: PaymentMessageKey) {
    return paymentMessage(this.locale(), key);
  }

  protected selectLocale(locale: AppLocale) {
    setStoredLocale(locale);
    this.locale.set(locale);
  }

  protected platformUrl(path = '/') {
    return new URL(path, environment.shellOrigin).toString();
  }

  protected initials(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  private getInitialLocale(): AppLocale {
    return getStoredLocale();
  }
}
