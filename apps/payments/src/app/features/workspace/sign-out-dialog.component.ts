import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type { AppLocale } from '@packages/platform-contracts';
import { signOutFromPlatform } from '@packages/platform-sdk';
import { paymentMessage, type PaymentMessageKey } from '@core/i18n/payment-messages';

@Component({
  selector: 'df-sign-out-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-out-dialog.component.html',
  styleUrl: './sign-out-dialog.component.scss',
})
export class SignOutDialogComponent {
  readonly locale = input.required<AppLocale>();
  readonly platformOrigin = input.required<string>();
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private returnFocus?: HTMLElement;
  protected readonly isPending = signal(false);
  protected readonly hasError = signal(false);

  open(returnFocus: HTMLElement) {
    this.returnFocus = returnFocus;
    this.hasError.set(false);
    this.dialog().nativeElement.showModal();
  }

  protected t(key: PaymentMessageKey) {
    return paymentMessage(this.locale(), key);
  }

  protected cancel(event?: Event) {
    if (this.isPending()) {
      event?.preventDefault();
      return;
    }
    this.dialog().nativeElement.close();
  }

  protected restoreFocus() {
    this.returnFocus?.focus();
  }

  protected async confirm() {
    if (this.isPending()) return;
    this.isPending.set(true);
    this.hasError.set(false);
    try {
      await signOutFromPlatform(this.platformOrigin());
    } catch {
      this.hasError.set(true);
      this.isPending.set(false);
    }
  }
}
