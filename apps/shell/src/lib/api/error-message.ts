import type { AppLocale } from '@debtflow/contracts';

export type ApiErrorMessageKey =
  | 'authenticationExpired'
  | 'backendUnavailable'
  | 'connectionFailed'
  | 'requestFailed'
  | 'requestTimedOut';

const localizedMessages: Record<AppLocale, Record<ApiErrorMessageKey, string>> = {
  vi: {
    authenticationExpired: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    backendUnavailable: 'Không thể kết nối đến dịch vụ dữ liệu. Vui lòng thử lại sau.',
    connectionFailed: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.',
    requestFailed: 'Không thể thực hiện thao tác.',
    requestTimedOut: 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.',
  },
  en: {
    authenticationExpired: 'Your session has expired. Please sign in again.',
    backendUnavailable: 'The data service is unavailable. Please try again later.',
    connectionFailed: 'Unable to connect to the server. Check your network and try again.',
    requestFailed: 'The request could not be completed.',
    requestTimedOut: 'The server took too long to respond. Please try again.',
  },
};

export function getLocalizedApiErrorMessage(locale: AppLocale, key: ApiErrorMessageKey) {
  return localizedMessages[locale][key];
}
