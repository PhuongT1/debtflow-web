'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getApiErrorMessage } from '@/lib/api/api-error';
import { Alert, Snackbar } from '@mui/material';

export function ApiErrorNotice({ error }: { error: Error | null }) {
  const t = useTranslations('Api');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  if (!error) return null;

  return (
    <>
      <Alert severity="error">{getApiErrorMessage(error, t)}</Alert>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={5000}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Alert severity="error" variant="filled" onClose={() => setOpen(false)}>
          {getApiErrorMessage(error, t)}
        </Alert>
      </Snackbar>
    </>
  );
}
