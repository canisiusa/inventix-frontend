import { geolocation } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const geo = geolocation(req);
  return NextResponse.json(geo);
}
