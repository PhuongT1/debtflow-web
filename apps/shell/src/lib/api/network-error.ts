export const NETWORK_TRANSPORT_ERROR_CODES = {
  connectionRefused: 'ECONNREFUSED',
  hostNotFound: 'ENOTFOUND',
} as const;

const BACKEND_UNAVAILABLE_MESSAGE_FRAGMENTS = [
  'Backend API',
  'fetch failed',
  NETWORK_TRANSPORT_ERROR_CODES.connectionRefused,
  'kết nối',
  'connect',
] as const;

type TransportErrorLike = {
  code?: string;
  cause?: { code?: string };
  message?: string;
};

export function isBackendUnavailableError(error: unknown) {
  const transportError = error as TransportErrorLike | null;
  const errorCode = transportError?.code;
  const causeCode = transportError?.cause?.code;
  const errorMessage = transportError?.message ?? '';

  return (
    errorCode === NETWORK_TRANSPORT_ERROR_CODES.connectionRefused ||
    causeCode === NETWORK_TRANSPORT_ERROR_CODES.connectionRefused ||
    errorCode === NETWORK_TRANSPORT_ERROR_CODES.hostNotFound ||
    causeCode === NETWORK_TRANSPORT_ERROR_CODES.hostNotFound ||
    BACKEND_UNAVAILABLE_MESSAGE_FRAGMENTS.some((fragment) => errorMessage.includes(fragment))
  );
}
