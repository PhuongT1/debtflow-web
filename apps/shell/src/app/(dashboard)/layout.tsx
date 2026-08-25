import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppShell } from "@debtflow/react-app-shell";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  if (!session?.user || session.error === "RefreshTokenError") {
    redirect("/login");
  }

  return (
    <AppShell
      currentZone="shell"
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
