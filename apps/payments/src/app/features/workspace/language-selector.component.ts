import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { AppLocale } from '@debtflow/contracts';
import { paymentMessage } from '@core/i18n/payment-messages';

@Component({
  selector: 'df-language-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  readonly locale = input.required<AppLocale>();
  readonly localeChange = output<AppLocale>();
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly injector = inject(Injector);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  protected readonly isOpen = signal(false);

  protected label(key: 'workspace.language' | 'workspace.languageVi' | 'workspace.languageEn') {
    return paymentMessage(this.locale(), key);
  }

  protected toggle() {
    if (this.isOpen()) this.close();
    else this.openMenu(this.locale() === 'vi' ? 0 : 1);
  }

  protected openMenu(index: number) {
    this.isOpen.set(true);
    afterNextRender(() => this.items()[index]?.focus(), { injector: this.injector });
  }

  protected select(locale: AppLocale) {
    this.localeChange.emit(locale);
    this.close();
  }

  protected menuKeydown(event: KeyboardEvent) {
    const items = this.items();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (event.key === 'ArrowDown') next = (current + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (current + items.length - 1) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else if (event.key === 'Tab') {
      this.isOpen.set(false);
      return;
    } else return;
    event.preventDefault();
    items[next]?.focus();
  }

  @HostListener('document:click', ['$event'])
  protected outsideClick(event: MouseEvent) {
    if (event.target instanceof Node && !this.host.nativeElement.contains(event.target))
      this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected escape(event: Event) {
    if (this.isOpen()) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
    }
  }

  private close() {
    this.isOpen.set(false);
    this.trigger().nativeElement.focus();
  }

  private items() {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'),
    );
  }
}
