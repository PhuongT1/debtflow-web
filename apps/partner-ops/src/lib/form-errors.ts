import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { ApiClientError } from '@/lib/api-client';

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof ApiClientError)) return;

  error.fieldErrors.forEach((fieldError) => {
    setError(fieldError.field as Path<T>, {
      type: 'server',
      message: fieldError.message,
    });
  });
}
