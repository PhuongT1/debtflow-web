'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';

export type ToastOptions = {
  message: string;
  severity?: AlertColor;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null);
  const showToast = useCallback((options: ToastOptions) => {
    setToast({ ...options, severity: options.severity ?? 'success', id: Date.now() });
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={4000}
        key={toast?.id}
        onClose={() => setToast(null)}
        open={Boolean(toast)}
        sx={{ mt: 7 }}
      >
        <Alert
          elevation={4}
          onClose={() => setToast(null)}
          severity={toast?.severity ?? 'success'}
          variant="filled"
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
