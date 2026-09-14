import React from 'react';
import Link from 'next/link';
import { SegeraLogo } from '@/components/segera/segera-logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top utility banner */}
      <div className="bg-[#1A1A1A] text-[#F3ECE1] text-[11px] font-mono py-1.5 px-4 text-center border-b border-[#333333]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1B7A3D]" />
            100% Bebas Tanpa Kad Kredit • OpenStreetMap Malaysia • PostGIS Engine
          </span>
          <span className="hidden sm:inline text-[#A8A297]">
            Hackathon Edition 2026
          </span>
        </div>
      </div>

      {/* Main navigation header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E0D7C4] bg-[#FFFBF5]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <SegeraLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-[#5A564F]">
            <Link href="#tentang" className="hover:text-[#1B7A3D] transition-colors">
              Tentang Sistem
            </Link>
            <Link href="#fasiliti" className="hover:text-[#1B7A3D] transition-colors">
              Fasiliti & Ciri
            </Link>
            <Link href="#perbandingan" className="hover:text-[#1B7A3D] transition-colors">
              Perbandingan Sistem
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/explore">
              <Button
                size="sm"
                className="bg-[#1B7A3D] hover:bg-[#145E2E] text-white font-mono text-xs px-4 py-2 rounded-xs shadow-xs gap-1.5 cursor-pointer"
              >
                <span>Buka Enjin Peta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Official local institutional footer */}
      <footer className="border-t border-[#E0D7C4] bg-[#F7F2E7] text-[#5A564F] text-xs py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <SegeraLogo />
            <p className="mt-2 text-xs text-[#6B655B] max-w-md font-sans">
              Sistem Evaluasi Geografi & Aksesibiliti Rumah 10-Minit Malaysia. Direka khas untuk mengenali realiti perbandaran Malaysia: surau, stesen minyak bersurau, alur limpahan banjir, dan keupayaan mobiliti motosikal.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end font-mono text-xs text-[#6B655B] space-y-1">
            <div>Dibangunkan oleh: Amir Hakim, Moi (Azib), Eqhlas, Paan (Daniel)</div>
            <div>Enjin Geografi Bebas & Telus • Tiada Simpanan Data Peribadi</div>
            <div className="text-[11px] text-[#8C877D]">
              © 2026 SEGERA. Hak Cipta Terpelihara.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
