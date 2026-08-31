"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { alpha, Alert, Box, IconButton, InputAdornment, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { AppInput } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginValues = z.infer<typeof loginSchema>;

function FeatureIcon({ icon, tone }: { icon: AppIconName; tone: "blue" | "cyan" | "green" }) {
  const paletteTones = { blue: "primary", cyan: "info", green: "success" } as const;
  const paletteTone = paletteTones[tone];

  return (
    <Box sx={(theme) => ({ backgroundColor: alpha(theme.palette[paletteTone].light, 0.16), borderRadius: "8px", color: `${paletteTone}.light`, display: "grid", flex: "0 0 auto", height: 38, placeItems: "center", width: 38 })}>
      <AppIcon fontSize="small" name={icon} />
    </Box>
  );
}

export function LoginForm({
  initialError,
  returnTo,
}: {
  initialError: string | null;
  returnTo: string;
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@debtflow.local", password: "Admin@123456" },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitError(null);
    const result = await signIn("credentials", { email: values.email, password: values.password, redirect: false });

    if (result?.error) {
      setSubmitError("Email hoặc mật khẩu không đúng.");
      return;
    }

    if (returnTo.startsWith("http://") || returnTo.startsWith("https://")) {
      window.location.assign(returnTo);
      return;
    }

    router.replace(returnTo);
    router.refresh();
  }

  return (
    <Box component="main" sx={{ bgcolor: "background.default", display: "grid", minHeight: "100vh", placeItems: "center", p: { xs: 2, sm: 3 } }}>
      <Box sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "12px", boxShadow: 12, display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(340px, 0.9fr) minmax(420px, 1.1fr)" }, maxWidth: 980, minHeight: { md: 610 }, overflow: "hidden", width: "100%" }}>
        <Box sx={{ bgcolor: "primary.dark", color: "primary.contrastText", display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", p: 5 }}>
          <Box>
            <Box sx={{ alignItems: "center", display: "flex", gap: 1.25 }}>
              <Box sx={{ bgcolor: "primary.main", borderRadius: "9px", display: "grid", fontSize: 15, fontWeight: 850, height: 42, placeItems: "center", width: 42 }}>DF</Box>
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 850 }}>Debt Flow</Typography>
                <Typography sx={(theme) => ({ color: alpha(theme.palette.primary.contrastText, 0.72), fontSize: 12 })}>Finance workspace</Typography>
              </Box>
            </Box>
            <Typography component="h1" sx={{ fontSize: 32, fontWeight: 820, lineHeight: 1.25, mt: 7, maxWidth: 360 }}>
              Kiểm soát công nợ. Chủ động dòng tiền.
            </Typography>
            <Typography sx={(theme) => ({ color: alpha(theme.palette.primary.contrastText, 0.78), fontSize: 15, lineHeight: 1.7, mt: 2, maxWidth: 360 })}>
              Một không gian làm việc rõ ràng cho sales, kế toán và quản lý cùng theo dõi.
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gap: 2.25 }}>
            {[
              ["Theo dõi phải thu, phải trả theo thời gian thực", "dashboard", "blue"],
              ["Nhận diện khoản quá hạn cần ưu tiên", "calendar", "cyan"],
              ["Lưu lịch sử thanh toán minh bạch", "payments", "green"],
            ].map(([label, icon, tone]) => (
              <Box key={label} sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
                <FeatureIcon icon={icon as AppIconName} tone={tone as "blue" | "cyan" | "green"} />
                <Typography sx={(theme) => ({ color: alpha(theme.palette.primary.contrastText, 0.9), fontSize: 13.5, fontWeight: 600 })}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ alignSelf: "center", p: { xs: 3, sm: 5, md: 6 } }}>
          <Box sx={{ alignItems: "center", display: { xs: "flex", md: "none" }, gap: 1, mb: 4 }}>
            <Box sx={{ bgcolor: "primary.main", borderRadius: "8px", color: "primary.contrastText", display: "grid", fontSize: 13, fontWeight: 850, height: 38, placeItems: "center", width: 38 }}>DF</Box>
            <Typography sx={{ fontSize: 17, fontWeight: 850 }}>Debt Flow</Typography>
          </Box>
          <Typography component="h2" sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 850 }}>Chào mừng trở lại</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Đăng nhập để tiếp tục quản lý công nợ hôm nay.</Typography>

          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2.25, mt: 4 }}>
            <AppInput autoComplete="email" autoFocus error={Boolean(errors.email)} helperText={errors.email?.message} label="Email" required type="email" {...register("email")} />
            <AppInput
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              label="Mật khẩu"
              required
              type={showPassword ? "text" : "password"}
              {...register("password")}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} edge="end" onClick={() => setShowPassword((current) => !current)} size="small">
                        <AppIcon fontSize="small" name={showPassword ? "visibilityOff" : "visibility"} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            <Button loading={isSubmitting} size="large" sx={{ mt: 0.5 }} type="submit">
              Đăng nhập
            </Button>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 11.5, mt: 4, textAlign: "center" }}>Phiên đăng nhập được bảo vệ bằng mã hóa bảo mật.</Typography>
        </Box>
      </Box>
    </Box>
  );
}
