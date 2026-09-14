import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = checkRateLimit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan. Sila tunggu sebentar.' }, { status: 429 });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Isochrone API endpoint ready. Pass ?lat=...&lng=...&mode=walking|motor',
  });
}
