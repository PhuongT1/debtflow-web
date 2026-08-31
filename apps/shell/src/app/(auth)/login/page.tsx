import { shellEnv } from "@/lib/env";
import { LoginForm } from "./login-form";

function resolveReturnTo(value: string | undefined) {
  if (!value) return "/";

  try {
    const target = new URL(value, shellEnv.AUTH_URL);
    const isPlatformRelativePath =
      value.startsWith("/") && target.origin === shellEnv.AUTH_URL;

    if (isPlatformRelativePath) {
      return `${target.pathname}${target.search}${target.hash}`;
    }

    const allowedOrigins = shellEnv.AUTH_ALLOWED_RETURN_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    return allowedOrigins.includes(target.origin) ? target.toString() : "/";
  } catch {
    return "/";
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; returnTo?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginForm
      initialError={params.error ? "Email hoặc mật khẩu không đúng." : null}
      returnTo={resolveReturnTo(params.returnTo)}
    />
  );
}
