import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { auth, getUsableSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const GET = auth(async (request) => {
  const ui = await getTranslations('Workspace');

  const session = getUsableSession(request.auth);

  if (!session) {
    return NextResponse.json(
      { message: ui('yourSessionIsInvalid') },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
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
    { headers: { 'Cache-Control': 'no-store' } },
  );
});
