'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SegeraLogo } from '@/components/segera/segera-logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import type { FacilityPoi } from '@/components/segera/map-view';

const MapView = dynamic(
  () => import('@/components/segera/map-view').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F4EDE2] font-mono text-xs text-[#6B655B]">
        Memuatkan Enjin Peta MapLibre GL...
      </div>
    ),
  }
);
import {
  ArrowLeft,
  Bike,
  Car,
  Footprints,
  Search,
  Crosshair,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

// Template fasiliti yang akan diselaraskan mengikut koordinat semasa
const facilityTemplates = [
  {
    id: 1,
    name: 'Masjid Kariah & Dewan Solat',
    category: 'surau' as const,
    offsetLat: 0.0035,
    offsetLng: 0.0028,
    distanceMeters: 480,
    walkMin: 6,
    motorMin: 2,
    carMin: 3,
    details: 'Pusat ibadah kariah utama, solat berjemaah 5 waktu & parkir motosikal luas',
  },
  {
    id: 2,
    name: 'Surau An-Nur Taman Kejiranan',
    category: 'surau' as const,
    offsetLat: -0.0025,
    offsetLng: 0.0032,
    distanceMeters: 360,
    walkMin: 5,
    motorMin: 1,
    carMin: 2,
    details: 'Surau komuniti aktif aktiviti taklim & solat subuh berjemaah',
  },
  {
    id: 3,
    name: 'Petron (Surau Lengkap Berhawa Dingin)',
    category: 'surau' as const,
    offsetLat: 0.0052,
    offsetLng: -0.0041,
    distanceMeters: 650,
    walkMin: 8,
    motorMin: 2,
    carMin: 3,
    details: 'Stesen minyak dengan surau bersih berhawa dingin & tempat wuduk selesa',
  },
  {
    id: 4,
    name: 'Klinik Komuniti & Farmasi Sihat',
    category: 'klinik' as const,
    offsetLat: -0.0048,
    offsetLng: -0.0035,
    distanceMeters: 720,
    walkMin: 9,
    motorMin: 3,
    carMin: 3,
    details: 'Rawatan pesakit luar, pemeriksaan kesihatan am & bekalan ubat',
  },
  {
    id: 5,
    name: 'Pasar Mini 99 & Kedai Runcit',
    category: 'runcit' as const,
    offsetLat: 0.0022,
    offsetLng: -0.0031,
    distanceMeters: 390,
    walkMin: 5,
    motorMin: 2,
    carMin: 2,
    details: 'Keperluan dapur harian, barangan basah dan runcit keluarga',
  },
  {
    id: 6,
    name: 'Restoran & Medan Selera Halal',
    category: 'makanan' as const,
    offsetLat: 0.0042,
    offsetLng: 0.0058,
    distanceMeters: 620,
    walkMin: 8,
    motorMin: 2,
    carMin: 3,
    details: 'Pelbagai gerai makanan sarapan pagi, nasi campur & masakan panas',
  },
  {
    id: 7,
    name: 'Hentian Bas & Hab Transit Rel',
    category: 'transit' as const,
    offsetLat: -0.0062,
    offsetLng: 0.0022,
    distanceMeters: 800,
    walkMin: 10,
    motorMin: 3,
    carMin: 4,
    details: 'Hentian bas perantara dan akses jaringan pengangkutan awam',
  },
  {
    id: 8,
    name: 'Alur Saliran Parit Monsun (Titik Limpahan)',
    category: 'banjir' as const,
    offsetLat: -0.0038,
    offsetLng: -0.0065,
    distanceMeters: 880,
    walkMin: 11,
    motorMin: 3,
    carMin: 4,
    details: 'Zon alur limpahan air hujan: Pantau paras air semasa hujan lebat berterusan',
  },
];

export default function ExplorePage() {
  const [selectedLocation, setSelectedLocation] = useState('Pusat Komuniti / Titik Pilihan Anda');
  const [coordinates, setCoordinates] = useState({ lat: 3.139, lng: 101.6869 });
  const [timeBudget, setTimeBudget] = useState<5 | 10 | 15>(10);
  const [travelMode, setTravelMode] = useState<'motor' | 'car' | 'walking'>('motor');

  // Filter states
  const [filters, setFilters] = useState({
    surau: true,
    makanan: true,
    runcit: true,
    klinik: true,
    transit: true,
    banjir: true,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCenterChange = (newCenter: { lat: number; lng: number }) => {
    setCoordinates(newCenter);
    setSelectedLocation(`Titik Terpilih (${newCenter.lat.toFixed(4)}, ${newCenter.lng.toFixed(4)})`);
    showToast('Peta dikira semula pada koordinat baharu.');
  };

  const handlePresetSelect = (name: string, lat: number, lng: number) => {
    setSelectedLocation(name);
    setCoordinates({ lat, lng });
    showToast(`Lokasi dikemaskini: ${name}`);
  };

  const handleCurrentLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoordinates(newCenter);
          setSelectedLocation('Lokasi Semasa Anda (GPS)');
          showToast('Menggunakan koordinat GPS lokasi anda.');
        },
        () => {
          showToast('GPS tidak aktif, menggunakan titik rujukan.');
        }
      );
    } else {
      showToast('Pelayar tidak menyokong GPS.');
    }
  };

  // Generate facilities mapped to the current center
  const allFacilities: FacilityPoi[] = useMemo(() => {
    return facilityTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category,
      lat: coordinates.lat + t.offsetLat,
      lng: coordinates.lng + t.offsetLng,
      distanceMeters: t.distanceMeters,
      walkMin: t.walkMin,
      motorMin: t.motorMin,
      carMin: t.carMin,
      details: t.details,
    }));
  }, [coordinates]);

  // Filtered facilities based on active time budget & active toggles
  const activePois = useMemo(() => {
    return allFacilities.filter((poi) => {
      if (!filters[poi.category]) return false;
      const travelTime =
        travelMode === 'motor' ? poi.motorMin : travelMode === 'car' ? poi.carMin : poi.walkMin;
      return travelTime <= timeBudget;
    });
  }, [allFacilities, filters, travelMode, timeBudget]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#FFFBF5] text-[#1A1A1A]">
      {/* Top Header */}
      <header className="h-14 border-b border-[#E0D7C4] bg-[#FFFBF5] px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-mono text-[#5A564F] hover:text-[#1B7A3D] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Laman Utama</span>
          </Link>
          <div className="h-4 w-px bg-[#E0D7C4]" />
          <SegeraLogo />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            className="font-mono text-xs border-[#D0C5B0] bg-white hover:bg-[#F3ECE1] text-[#1A1A1A] gap-1.5 cursor-pointer rounded-xs"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#1B7A3D]" />
            <span className="hidden sm:inline">Lokasi Semasa</span>
          </Button>

          <div className="font-mono text-xs text-[#5A564F] bg-[#F3ECE1] px-2.5 py-1 rounded-xs border border-[#DFD6C2] hidden md:block">
            {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side Control Panel */}
        <aside className="w-full md:w-[380px] lg:w-[410px] border-r border-[#E0D7C4] bg-[#FAF6EE] flex flex-col overflow-y-auto shrink-0 z-10">
          {/* Location & Search Header */}
          <div className="p-4 border-b border-[#E0D7C4] space-y-2.5 bg-white">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#5A564F] font-bold block">
              Titik Rujukan Analisis
            </label>

            <div className="relative">
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Cari kawasan atau masukkan nama tempat..."
                className="w-full h-9 pl-8 pr-3 text-xs bg-[#FAF7F0] border border-[#DCD3C0] rounded-xs font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1B7A3D]"
              />
              <Search className="w-4 h-4 text-[#8C877D] absolute left-2.5 top-2.5" />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="font-mono text-[10px] text-[#7A756B]">Pilihan Contoh:</span>
              <button
                onClick={() => handlePresetSelect('KL Sentral / Brickfields', 3.134, 101.6869)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#EFE9DC] text-[#4A453C] hover:bg-[#E2DDD0] cursor-pointer"
              >
                KL Sentral
              </button>
              <button
                onClick={() => handlePresetSelect('Shah Alam Seksyen 7', 3.0738, 101.498)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#EFE9DC] text-[#4A453C] hover:bg-[#E2DDD0] cursor-pointer"
              >
                Shah Alam
              </button>
              <button
                onClick={() => handlePresetSelect('Bandar Baru Bangi', 2.9288, 101.7801)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#EFE9DC] text-[#4A453C] hover:bg-[#E2DDD0] cursor-pointer"
              >
                Bangi
              </button>
            </div>
          </div>

          {/* Mode & Time Controls */}
          <div className="p-4 border-b border-[#E0D7C4] space-y-3.5">
            {/* 3 Travel Modes: Motosikal, Kereta, Jalan Kaki */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A564F] font-bold block mb-2">
                Mod Mobiliti (3 Pilihan)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  variant={travelMode === 'motor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTravelMode('motor');
                    showToast('Mod Motosikal (Capaian pantas jalan raya).');
                  }}
                  className={`font-mono text-xs rounded-xs flex items-center justify-center gap-1 cursor-pointer py-1.5 ${
                    travelMode === 'motor'
                      ? 'bg-[#0E4D64] hover:bg-[#083545] text-white shadow-2xs'
                      : 'bg-white border-[#DCD2BE] text-[#1A1A1A]'
                  }`}
                >
                  <Bike className="w-3.5 h-3.5 shrink-0" />
                  <span>Motor</span>
                </Button>

                <Button
                  variant={travelMode === 'car' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTravelMode('car');
                    showToast('Mod Kereta (Mengikut laluan jalan raya kereta).');
                  }}
                  className={`font-mono text-xs rounded-xs flex items-center justify-center gap-1 cursor-pointer py-1.5 ${
                    travelMode === 'car'
                      ? 'bg-[#3B7BB4] hover:bg-[#2C6294] text-white shadow-2xs'
                      : 'bg-white border-[#DCD2BE] text-[#1A1A1A]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 shrink-0" />
                  <span>Kereta</span>
                </Button>

                <Button
                  variant={travelMode === 'walking' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setTravelMode('walking');
                    showToast('Mod Pejalan Kaki (Radius pejalan kaki).');
                  }}
                  className={`font-mono text-xs rounded-xs flex items-center justify-center gap-1 cursor-pointer py-1.5 ${
                    travelMode === 'walking'
                      ? 'bg-[#1B7A3D] hover:bg-[#145E2E] text-white shadow-2xs'
                      : 'bg-white border-[#DCD2BE] text-[#1A1A1A]'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5 shrink-0" />
                  <span>Jalan</span>
                </Button>
              </div>
            </div>

            {/* Time Budget Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A564F] font-bold">
                  Bajet Masa Poligon
                </span>
                <span className="font-mono text-xs font-bold text-[#1B7A3D]">
                  {timeBudget} Minit
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EFE9DC] rounded-xs">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimeBudget(mins as 5 | 10 | 15);
                      showToast(`Zon masa dikemaskini: ${mins} minit.`);
                    }}
                    className={`h-7 rounded-xs font-mono text-xs font-bold transition-all cursor-pointer ${
                      timeBudget === mins
                        ? 'bg-white text-[#1A1A1A] shadow-xs'
                        : 'text-[#6B655B] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#5A564F] font-bold block mb-2">
                Penapis Fasiliti
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => toggleFilter('surau')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.surau
                      ? 'bg-[#FFF8D6] text-[#856D00] border-[#C5A100]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  🕌 Surau & Petrol
                </button>
                <button
                  onClick={() => toggleFilter('klinik')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.klinik
                      ? 'bg-[#E3F2E7] text-[#1B7A3D] border-[#1B7A3D]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  🏥 Klinik
                </button>
                <button
                  onClick={() => toggleFilter('makanan')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.makanan
                      ? 'bg-[#FFF0E6] text-[#B85400] border-[#E87A30]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  🍲 Makanan
                </button>
                <button
                  onClick={() => toggleFilter('runcit')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.runcit
                      ? 'bg-[#E8EFF6] text-[#1A4C78] border-[#3B7BB4]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  🛒 Runcit
                </button>
                <button
                  onClick={() => toggleFilter('transit')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.transit
                      ? 'bg-[#F2EDF8] text-[#59358A] border-[#8A5BBF]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  🚆 Transit
                </button>
                <button
                  onClick={() => toggleFilter('banjir')}
                  className={`text-[11px] font-mono px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                    filters.banjir
                      ? 'bg-[#FDE8EC] text-[#A11D33] border-[#A11D33]'
                      : 'bg-white text-[#8C877D] border-[#DCD2BE]'
                  }`}
                >
                  ⚠ Banjir
                </button>
              </div>
            </div>
          </div>

          {/* Fasiliti List */}
          <div className="p-4 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                Fasiliti Dalam Radius ({timeBudget} Min)
              </h4>
              <Badge variant="outline" className="font-mono text-xs border-[#1B7A3D] text-[#1B7A3D] bg-white">
                {activePois.length} Fasiliti
              </Badge>
            </div>

            {/* Micro info note */}
            <div className="bg-[#FAF4E6] border border-[#E5DAC0] p-2.5 rounded-xs text-[11px] text-[#5A564F] space-y-1">
              <div className="flex items-center gap-1.5 font-mono font-bold text-[#8F7400]">
                <Sparkles className="w-3 h-3 text-[#C5A100]" />
                <span>Panduan Peta Interaktif</span>
              </div>
              <p>
                Arahkan kursor tetikus (<em>hover</em>) pada mana-mana ikon di peta untuk melihat maklumat terperinci fasiliti.
              </p>
            </div>

            {/* Facility list */}
            <div className="space-y-2 text-xs">
              {activePois.length === 0 ? (
                <div className="p-5 text-center text-[#8C877D] font-mono text-xs bg-white border border-[#E5DFC9] rounded-xs">
                  Tiada fasiliti dalam {timeBudget} minit. Cuba pilih masa lebih besar atau mod motosikal/kereta.
                </div>
              ) : (
                activePois.map((poi) => (
                  <div
                    key={poi.id}
                    className="bg-white border border-[#E5DFC9] p-2.5 rounded-xs space-y-1 hover:border-[#1B7A3D]/50 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">{poi.name}</span>
                      <span className="font-mono text-[10px] text-[#5A564F]">{poi.distanceMeters}m</span>
                    </div>
                    <div className="text-[11px] text-[#6B655B]">{poi.details}</div>
                    <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE1] font-mono text-[10px]">
                      <span className="text-[#1B7A3D] font-semibold">
                        {travelMode === 'motor'
                          ? `~${poi.motorMin} min motosikal`
                          : travelMode === 'car'
                          ? `~${poi.carMin} min kereta`
                          : `~${poi.walkMin} min jalan kaki`}
                      </span>
                      <span className="uppercase text-[#8C877D]">{poi.category}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Map Canvas Area with Real MapLibre GL */}
        <main className="flex-1 bg-[#F4EDE2] relative flex flex-col h-full overflow-hidden">
          {/* Real MapLibre Component */}
          <MapView
            center={coordinates}
            onCenterChange={handleCenterChange}
            travelMode={travelMode}
            timeBudget={timeBudget}
            facilities={activePois}
            selectedLocationName={selectedLocation}
          />

          {/* Floating toast */}
          {notification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1A1A1A] text-white font-mono text-xs px-4 py-2 rounded-xs shadow-md border border-[#333333] transition-all pointer-events-none">
              {notification}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
