"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";

const FormDialogContext = createContext<{ closeDialog: () => void }>({
  closeDialog: () => undefined,
});

export function useFormDialog() {
  return useContext(FormDialogContext);
}

export function FormDialog({
  buttonLabel,
  buttonIcon,
  buttonSize = "medium",
  buttonVariant = "primary",
  iconOnly = false,
  title,
  description,
  children,
}: {
  buttonLabel: string;
  buttonIcon?: AppIconName;
  buttonSize?: "small" | "medium";
  buttonVariant?: "primary" | "secondary" | "danger";
  iconOnly?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogContext = useMemo(
    () => ({ closeDialog: () => setOpen(false) }),
    [],
  );
  const triggerIcon =
    buttonIcon ?? (buttonLabel.toLowerCase().includes("sửa") ? "edit" : "add");
  const trigger = iconOnly ? (
    <Tooltip title={buttonLabel}>
      <IconButton
        aria-label={buttonLabel}
        color={buttonVariant === "danger" ? "error" : "primary"}
        onClick={() => setOpen(true)}
        size={buttonSize}
      >
        <AppIcon fontSize="small" name={triggerIcon} />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      size={buttonSize}
      startIcon={<AppIcon fontSize="small" name={triggerIcon} />}
      type="button"
      variant={buttonVariant}
      onClick={() => setOpen(true)}
    >
      {buttonLabel}
    </Button>
  );

  return (
    <>
      {trigger}
      <AppDialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
            {title}
          </Typography>
          {description ? (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          ) : null}
          <IconButton
            aria-label="Đóng"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <AppIcon fontSize="small" name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{ bgcolor: "background.default", borderColor: "divider" }}
          dividers
        >
          <FormDialogContext.Provider value={dialogContext}>
            {children}
          </FormDialogContext.Provider>
        </DialogContent>
      </AppDialog>
    </>
  );
}
