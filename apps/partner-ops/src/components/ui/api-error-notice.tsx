"use client";

import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export function ApiErrorNotice({ error }: { error: Error | null }) {
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
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
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
