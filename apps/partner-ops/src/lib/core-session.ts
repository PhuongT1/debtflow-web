import { headers } from "next/headers";
import type { CoreIdentity } from "@debtflow/contracts";
import { partnerOpsEnv } from "@/lib/env";

export async function getCoreIdentity(): Promise<CoreIdentity | null> {
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const coreOrigin = partnerOpsEnv.PLATFORM_INTERNAL_ORIGIN;

  if (!cookie) return null;

  try {
    const response = await fetch(`${coreOrigin}/api/mfe/session`, {
      cache: "no-store",
      headers: {
        cookie,
        "x-frontend-zone": "partner-ops",
      },
    });

    if (!response.ok) return null;

    const body = (await response.json()) as { user?: CoreIdentity };
    return body.user ?? null;
  } catch {
    return null;
  }
}
