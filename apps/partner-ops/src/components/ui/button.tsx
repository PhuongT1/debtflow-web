import { alpha, Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";
import { AppSkeleton } from "@/components/ui/skeleton";

type ButtonProps = Omit<MuiButtonProps, "variant" | "color" | "loading" | "loadingIndicator"> & {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  tone?: "primary" | "error" | "warning";
};

export function Button({ disabled, loading = false, size = "medium", tone, variant = "primary", ...props }: ButtonProps) {
  const color = tone ?? (variant === "danger" ? "error" : "primary");

  return (
    <MuiButton
      color={color}
      disabled={disabled || loading}
      loading={loading}
      loadingIndicator={(
        <AppSkeleton
          height={12}
          sx={(theme) => ({
            bgcolor: variant === "secondary" ? theme.palette.action.selected : alpha(theme.palette[color].contrastText, 0.5),
          })}
          width={54}
        />
      )}
      size={size}
      variant={variant === "secondary" ? "outlined" : "contained"}
      sx={{ fontWeight: 700, textTransform: "none" }}
      {...props}
    />
  );
}
