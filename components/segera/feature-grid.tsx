import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass, ShieldAlert, Bike, Sparkles, MapPin, Store, HeartPulse } from 'lucide-react';

export function FeatureGrid() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#E0D7C4] pb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#1B7A3D] font-bold">
            Audit Aksesibiliti Tempatan
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] mt-1">
            Ketahui Semua Fasiliti Sekitar Anda Dalam Radius 10-Minit
          </h2>
        </div>
        <div className="font-mono text-xs text-[#5A564F] bg-[#F2EDE1] px-3 py-1.5 rounded-xs border border-[#DFD6C2] flex items-center gap-1.5 w-fit">
          <MapPin className="w-3.5 h-3.5 text-[#0E4D64]" />
          <span>Boleh Diuji di Mana-mana Lokasi di Malaysia</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Surau & Prayer Room Card */}
        <Card className="border-[#E0D7C4] bg-white shadow-xs hover:border-[#1B7A3D]/60 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-[#8F7400] bg-[#FFF8D6] px-2 py-0.5 rounded">
                Ekosistem Ibadah
              </span>
              <span className="font-mono text-xs text-[#8F7400] font-bold">
                Masjid + Surau
              </span>
            </div>
            <CardTitle className="font-serif text-lg text-[#1A1A1A] mt-2">
              Surau Kariah & Stesen Minyak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#5A564F] space-y-2">
            <p>
              Bukan sekadar masjid utama. Sistem mengesan surau taman perumahan, musolla mall, dan stesen minyak berdekatan (Petron, Shell, Petronas) yang menyediakan kemudahan solat lengkap.
            </p>
            <div className="pt-2 border-t border-[#EFE9DC] text-[11px] font-mono text-[#1B7A3D]">
              ✓ Senarai jarak & minit perjalanan
            </div>
          </CardContent>
        </Card>

        {/* Mobiliti Motosikal Card */}
        <Card className="border-[#E0D7C4] bg-white shadow-xs hover:border-[#0E4D64]/60 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-[#0E4D64] bg-[#E0F2F9] px-2 py-0.5 rounded">
                Dwi-Mod Capaian
              </span>
              <span className="font-mono text-xs text-[#0E4D64] font-bold">
                Motor / Jalan Kaki
              </span>
            </div>
            <CardTitle className="font-serif text-lg text-[#1A1A1A] mt-2">
              Realiti Mobiliti Motosikal
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#5A564F] space-y-2">
            <p>
              Di Malaysia, cuaca tropika dan kekurangan laluan pejalan kaki menjadikan motosikal nadi harian utama. Bandingkan capaian 10-minit jalan kaki vs motosikal secara langsung di peta.
            </p>
            <div className="pt-2 border-t border-[#EFE9DC] text-[11px] font-mono text-[#0E4D64]">
              ✓ Isochrone jalan raya sebenar
            </div>
          </CardContent>
        </Card>

        {/* Kemudahan Asas Card */}
        <Card className="border-[#E0D7C4] bg-white shadow-xs hover:border-[#1A1A1A]/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-[#1A1A1A] bg-[#EFE9DC] px-2 py-0.5 rounded">
                Keperluan Harian
              </span>
              <span className="font-mono text-xs text-[#1A1A1A] font-bold">
                Klinik & Runcit
              </span>
            </div>
            <CardTitle className="font-serif text-lg text-[#1A1A1A] mt-2">
              Klinik, Mart & Premis Makanan
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#5A564F] space-y-2">
            <p>
              Ketahui serta-merta berapa klinik (termasuk waktu operasi 24 jam), farmasi, kedai runcit harian, dan pilihan kedai makan yang ada dalam jangkauan tanpa perlu memandu jauh.
            </p>
            <div className="pt-2 border-t border-[#EFE9DC] text-[11px] font-mono text-[#1A1A1A]">
              ✓ Pecahan kategori mengikut masa
            </div>
          </CardContent>
        </Card>

        {/* Banjir Kilat Card */}
        <Card className="border-[#E0D7C4] bg-white shadow-xs hover:border-[#A11D33]/60 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-[#A11D33] bg-[#FDE8EC] px-2 py-0.5 rounded">
                Amaran Risiko
              </span>
              <span className="font-mono text-xs text-[#A11D33] font-bold">
                Limpahan Air
              </span>
            </div>
            <CardTitle className="font-serif text-lg text-[#1A1A1A] mt-2">
              Alur Parit & Kawasan Banjir Kilat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-[#5A564F] space-y-2">
            <p>
              Fungsi nilai tambah penting di Malaysia: menyemak jarak lokasi titik anda dengan parit monsun induk, laluan air rendah, dan titik risiko limpahan ketika hujan lebat.
            </p>
            <div className="pt-2 border-t border-[#EFE9DC] text-[11px] font-mono text-[#A11D33]">
              ✓ Maklumat pencegahan kerugian
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
