import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppShell } from "@debtflow/react-ui";
import { type AppLocale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "@debtflow/contracts";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  if (!session?.user || session.error === "RefreshTokenError") {
    redirect("/login");
  }

  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale: AppLocale = rawLocale === "en" || rawLocale === "vi" ? rawLocale : DEFAULT_LOCALE;

  return (
    <AppShell
      currentZone="shell"
      initialLocale={initialLocale}
      initialSidebarCollapsed={cookieStore.get("debt-flow-sidebar-collapsed")?.value === "true"}
      identity={{
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      }}
    >
      {children}
    </AppShell>
  );
}
