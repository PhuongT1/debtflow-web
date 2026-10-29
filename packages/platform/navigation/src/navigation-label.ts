import type { AppLocale } from '@packages/platform-contracts';
import type { NavigationItem } from './navigation.types';

export function getNavigationLabel(item: NavigationItem, locale: AppLocale = 'vi'): string {
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] ?? item.label.vi;
}
