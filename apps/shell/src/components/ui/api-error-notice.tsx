'use client';

import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

import type { ApiErrorNoticeProps } from './api-error-notice.types';

export function ApiErrorNotice({ error }: ApiErrorNoticeProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  if (!error) return null;

  return (
    <>
      <Alert severity="error">{error.message}</Alert>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={5000}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Alert severity="error" variant="filled" onClose={() => setOpen(false)}>
          {error.message}
        </Alert>
      </Snackbar>
    </>
  );
}
