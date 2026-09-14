import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComparisonTable } from '@/components/segera/comparison-table';
import { FeatureGrid } from '@/components/segera/feature-grid';
import {
  ArrowRight,
  Compass,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Building,
  HeartPulse,
  Bike
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="w-full pb-20">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 border-b border-[#E0D7C4] bg-[#FAF5EC]/75">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#EFE7D8] border border-[#DCD1BF] text-xs font-mono text-[#5A554C]">
            <span className="w-2 h-2 rounded-full bg-[#1B7A3D]"></span>
            <span>ENJIN AKSESIBILITI & FASILITI 10-MINIT TEMPATAN • MALAYSIA-FIRST</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.15]">
            Dari Lokasi Anda, Apa <span className="text-[#1B7A3D] italic">Fasiliti</span> yang Boleh Dicapai Dalam 10 Minit?
          </h1>

          <p className="text-base sm:text-lg text-[#5A554C] max-w-2xl mx-auto font-sans leading-relaxed">
            Ketahui serta-merta capaian surau kariah, stesen minyak bersurau, klinik, kedai harian, dan laluan bebas banjir dari mana-mana titik yang anda pilih di Malaysia — menggunakan mod motosikal mahupun berjalan kaki.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/explore">
              <Button
                size="lg"
                className="bg-[#1B7A3D] hover:bg-[#145E2E] text-white font-mono text-sm px-6 py-6 rounded-xs shadow-sm gap-2 cursor-pointer"
              >
                <span>Buka Enjin Peta / Teroka Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="#perbandingan">
              <Button
                variant="outline"
                size="lg"
                className="border-[#D0C5B0] bg-[#FFFDF9] hover:bg-[#F2ECE1] text-[#1A1A1A] font-mono text-sm px-6 py-6 rounded-xs cursor-pointer"
              >
                <span>Lihat Perbandingan Sistem</span>
                <ChevronRight className="w-4 h-4 text-[#7A7469]" />
              </Button>
            </Link>
          </div>

          {/* Quick Pillars Strip */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="bg-white border border-[#E0D7C4] rounded-md p-3 px-4 shadow-2xs flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-[#5A554C]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1B7A3D]" />
                <span>Surau & Stesen Minyak</span>
              </div>
              <div className="hidden sm:block text-[#D0C5B0]">|</div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#C5A100]" />
                <span>Klinik & Mart Harian</span>
              </div>
              <div className="hidden sm:block text-[#D0C5B0]">|</div>
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#0E4D64]" />
                <span>Motosikal & Jalan Kaki</span>
              </div>
              <div className="hidden sm:block text-[#D0C5B0]">|</div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#A11D33]" />
                <span>Amaran Limpahan Banjir</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT THE SYSTEM */}
      <section id="tentang" className="max-w-5xl mx-auto px-4 pt-16 space-y-8">
        <div className="space-y-3">
          <Badge variant="outline" className="font-mono text-xs text-[#0E4D64] border-[#0E4D64]/30 bg-[#0E4D64]/5">
            Konsep & Pendekatan Sistem
          </Badge>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Mentakrifkan Aksesibiliti Berpandukan Realiti Tempatan
          </h2>
          <p className="text-sm text-[#5A554C] leading-relaxed max-w-3xl">
            Sistem analitik konvensional dari luar negara (seperti Walk Score) hanya mengira jarak garis lurus pejalan kaki mengikut tabiat bandar barat. SEGERA dibina untuk memahami cara hidup dan geografi sebenar di Malaysia:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#E0D7C4] bg-white p-5 rounded-xs space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#1B7A3D] uppercase">
              01 • Fasiliti Ibadah & Komuniti
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Surau Kariah, Musolla & Stesen Minyak
            </h3>
            <p className="text-xs text-[#5A554C] leading-relaxed">
              Mengecam ruang solat yang sebenarnya kerap digunakan orang ramai: surau taman perumahan, musolla kedai/mall, dan stesen minyak yang mempunyai surau lengkap dengan tempat wuduk.
            </p>
          </div>

          <div className="border border-[#E0D7C4] bg-white p-5 rounded-xs space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#0E4D64] uppercase">
              02 • Mobiliti Motosikal 10-Minit
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Keluasan Akses Sebenar
            </h3>
            <p className="text-xs text-[#5A564F] leading-relaxed">
              Motosikal membolehkan rakyat biasa mencapai klinik, sekolah, kedai makan dan pasar dalam 5 hingga 10 minit tanpa terperangkap dalam kesesakan kereta mahupun berpanas jalan kaki.
            </p>
          </div>

          <div className="border border-[#E0D7C4] bg-white p-5 rounded-xs space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-bold text-[#A11D33] uppercase">
              03 • Kesedaran Titik Banjir Kilat
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Pencegahan & Keselamatan
            </h3>
            <p className="text-xs text-[#5A564F] leading-relaxed">
              Mengintegrasikan data alur parit monsun dan kawasan kerap bertakung air hujan lebat supaya pengguna mengetahui kebolehcapaian laluan semasa musim tengkujuh.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: GENERAL CAPABILITIES / FEATURE GRID */}
      <section id="fasiliti" className="max-w-5xl mx-auto px-4 pt-16">
        <FeatureGrid />
      </section>

      {/* SECTION 4: COMPARISON TABLE (SEGERA PALING KIRI, TIADA SLIDER DESKTOP) */}
      <section id="perbandingan" className="max-w-5xl mx-auto px-4 pt-16 space-y-4">
        <ComparisonTable />
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 pt-16">
        <div className="border border-[#D0C4AC] bg-[#F5ECE0] p-8 sm:p-12 rounded-md text-center space-y-5 shadow-xs">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1B7A3D] font-bold">
            100% Percuma • Tanpa Log Masuk • Open Access
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] max-w-2xl mx-auto">
            Semak Apa Fasiliti yang Ada Sekitar Anda Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-[#5A554C] max-w-xl mx-auto leading-relaxed">
            Pilih titik mana-mana di seluruh Malaysia — tempat tinggal, pejabat, atau bakal lokasi baharu — untuk menyemak capaian surau, kedai harian, klinik, dan profil mobiliti 10 minit.
          </p>
          <div className="pt-2">
            <Link href="/explore">
              <Button
                size="lg"
                className="bg-[#1B7A3D] hover:bg-[#145E2E] text-white font-mono text-sm px-8 py-6 rounded-xs shadow-xs gap-2 cursor-pointer"
              >
                <span>Buka Peta & Kira Capaian Fasiliti</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
