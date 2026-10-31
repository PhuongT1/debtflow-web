import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';

import { isFormFieldPath } from '@packages/ui-react';

import { ApiClientError } from '@/lib/api/api-error';

export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  values: T,
) {
  if (!(error instanceof ApiClientError)) return;

  error.fieldErrors.forEach((fieldError) => {
    if (!isFormFieldPath(values, fieldError.field)) {
      setError('root.server', { type: 'server', message: fieldError.message });
      return;
    }
    // The current form values validate this path before it reaches React Hook Form.
    setError(fieldError.field as Path<T>, {
      type: 'server',
      message: fieldError.message,
    });
  });
}
