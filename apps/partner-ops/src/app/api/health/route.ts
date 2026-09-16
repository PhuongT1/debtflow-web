import { NextResponse } from 'next/server';
import { partnerOpsEnv } from '@/lib/env';

export function GET() {
  return NextResponse.json({
    application: 'partner-ops',
    status: 'ok',
    version: partnerOpsEnv.DEPLOYMENT_VERSION,
  });
}
