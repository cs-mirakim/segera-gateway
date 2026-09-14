import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/security';
import { fetchLiveFacilitiesFromOSM } from '@/lib/overpass';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const radiusStr = searchParams.get('radius') || '2500';

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: 'Sila sertakan parameter lat & lng' }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const radius = parseInt(radiusStr, 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Koordinat tidak sah' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = checkRateLimit(ip, 60); // 60 requests/min

  if (!success) {
    return NextResponse.json({ error: 'Kadar capaian terhad. Sila cuba sebentar lagi.' }, { status: 429 });
  }

  try {
    const facilities = await fetchLiveFacilitiesFromOSM(lat, lng, radius);
    return NextResponse.json({
      status: 'ok',
      total: facilities.length,
      facilities,
    });
  } catch (error: any) {
    console.error('[API facilities] Error:', error);
    return NextResponse.json({ error: 'Gagal mendapatkan data OpenStreetMap' }, { status: 500 });
  }
}
