import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { Box } from "@mui/material";
import { AppShell } from "@debtflow/react-app-shell";
import { EmbeddedNavigationBridge } from "@/components/platform/embedded-navigation-bridge";
import { getCoreIdentity } from "@/lib/core-session";
import { partnerOpsEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [identity, cookieStore, requestHeaders] = await Promise.all([
    getCoreIdentity(),
    cookies(),
    headers(),
  ]);

  if (!identity) {
    redirect(`${partnerOpsEnv.PUBLIC_APP_ORIGIN}/login?callbackUrl=/parties`);
  }

  if (requestHeaders.get("x-debtflow-embed") === "1") {
    return (
      <Box
        sx={{
          height: "100dvh",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <EmbeddedNavigationBridge />
        {children}
      </Box>
    );
  }

  return (
    <AppShell
      currentZone="partner-ops"
      identity={identity}
      initialSidebarCollapsed={
        cookieStore.get("debt-flow-sidebar-collapsed")?.value === "true"
      }
    >
      {children}
    </AppShell>
  );
}
