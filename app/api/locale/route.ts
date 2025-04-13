import { changeLocale } from '@/lib/cookieHelper';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  await changeLocale(data.locale);
  return NextResponse.json({ message: "Locale changed" });
}
