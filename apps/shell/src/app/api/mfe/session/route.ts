import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.error === "RefreshTokenError") {
    return NextResponse.json(
      { message: "Phiên đăng nhập không hợp lệ." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
