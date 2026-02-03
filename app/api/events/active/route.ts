/**
 * API: Active Event
 * GET /api/events/active
 */

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getActiveEvent } from '@/lib/events/events-service';

export async function GET() {
  const event = getActiveEvent();
  return NextResponse.json({ event });
}
