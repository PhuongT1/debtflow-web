// Auth domain
export { type UserRole, type AuthUser, type CoreIdentity } from './auth/user.types';

// i18n domain
export {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  LOCALE_COOKIE_NAME,
} from './i18n/locale.types';

// API Response & Pagination domain
export {
  unwrapApiResponse,
  type PaginationMeta,
  type PaginatedResult,
  type PaginatedResponse,
  type ApiResponseEnvelope,
  type ApiEnvelope,
} from './api/api-response.types';

// Payments domain
export {
  type PaymentMethod,
  type PaymentDebtSummary,
  type PaymentAllocationRecord,
  type PaymentRecord,
} from './payments/payment.types';

// Micro Frontend messaging contracts
export {
  isMfeRoutePath,
  isMfeRouteChangedMessage,
  isMfeLocaleChangedMessage,
  isMfeOverlayStateMessage,
  isMfePlatformMessage,
  MFE_HOST_MESSAGE_VERSION,
  MFE_ROUTE_SYNC_CAPABILITY,
  type MfeRouteChangedMessage,
  type MfeLocaleChangedMessage,
  type MfeOverlayStateMessage,
  type MfeNavigationMessage,
  type MfeReadyMessage,
  type MfePlatformMessage,
} from './mfe/mfe-message.types';
export {
  isOverlayMessage,
  OVERLAY_PROTOCOL,
  type OverlaySize,
  type OverlayResult,
  type OverlayRequest,
  type OverlayMessage,
} from './mfe/overlay.types';
