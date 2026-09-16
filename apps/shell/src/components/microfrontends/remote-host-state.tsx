import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';

export type RemoteHostState =
  { status: 'loading' } | { status: 'ready' } | { status: 'error'; message: string };

export function RemoteLoadingState({ label }: { label: string }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        justifyContent: 'center',
        minHeight: 320,
      }}
    >
      <CircularProgress size={28} />
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
    </Box>
  );
}

export function RemoteErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <Alert
      action={
        <Button color="inherit" onClick={retry} size="small">
          Thử lại
        </Button>
      }
      severity="error"
    >
      {message}
    </Alert>
  );
}
