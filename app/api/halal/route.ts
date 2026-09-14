import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = checkRateLimit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Kadar capaian terhad. Sila cuba sebentar lagi.' }, { status: 429 });
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Halal validation endpoint ready. Supports OSM diet:halal check and Gemini Vision verification.',
  });
}
