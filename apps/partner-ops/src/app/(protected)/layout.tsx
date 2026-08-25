import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppShell } from "@debtflow/react-app-shell";
import { getCoreIdentity } from "@/lib/core-session";
import { partnerOpsEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [identity, cookieStore] = await Promise.all([getCoreIdentity(), cookies()]);

  if (!identity) {
    redirect(`${partnerOpsEnv.PUBLIC_APP_ORIGIN}/login?callbackUrl=/parties`);
  }

  return (
    <AppShell
      currentZone="partner-ops"
      identity={identity}
      initialSidebarCollapsed={cookieStore.get("debt-flow-sidebar-collapsed")?.value === "true"}
    >
      {children}
    </AppShell>
  );
}
