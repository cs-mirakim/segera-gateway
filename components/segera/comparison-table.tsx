'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MatrixRow {
  feature: string;
  description: string;
  segera: boolean;
  walkScore: boolean;
  travelTime: boolean;
  esriUrban: boolean;
  ors: boolean;
  fifteenMinCity: boolean;
}

const comparisonData: MatrixRow[] = [
  {
    feature: 'Walk Isochrone (Pejalan Kaki)',
    description: 'Poligon capaian berjalan kaki 5, 10 & 15 minit mengikut jalan sebenar.',
    segera: true,
    walkScore: true,
    travelTime: true,
    esriUrban: true,
    ors: true,
    fifteenMinCity: true,
  },
  {
    feature: 'Motor 10-Min Isochrone',
    description: 'Profil mod motosikal tempatan untuk capaian pantas perbandaran Malaysia.',
    segera: true,
    walkScore: false,
    travelTime: true,
    esriUrban: true,
    ors: true,
    fifteenMinCity: false,
  },
  {
    feature: 'Pengecaman Surau & Musolla',
    description: 'Mengesan surau kariah, musolla kedai, & surau stesen minyak (Petron/Shell/Petronas).',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: false,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: 'Penapis Halal & Fasiliti',
    description: 'Pengesanan premis makanan halal dan kemudahan harian sekitar.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: false,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: 'Lapisan Banjir Kilat (JPS/OSM)',
    description: 'Amaran alur parit, longkang utama, dan titik limpahan air hujan tropika.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: true,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: 'Katalog Premis Mall (Indoor)',
    description: 'Pengelompokan kedai dalaman tanpa pin peta bertindih tidak kemas.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: true,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: 'Perancang Senario Akses',
    description: 'Uji simulasi laluan pintas atau penambahan fasiliti baharu.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: true,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: 'Fokus Geografi Malaysia',
    description: 'Dioptimumkan untuk struktur taman perumahan, kampung & bandar tempatan.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: false,
    ors: false,
    fifteenMinCity: false,
  },
  {
    feature: '100% Percuma & Akses Terbuka',
    description: 'Bebas guna untuk orang awam tanpa bayaran langganan korporat.',
    segera: true,
    walkScore: false,
    travelTime: false,
    esriUrban: false,
    ors: true,
    fifteenMinCity: false,
  },
];

function StatusIcon({ val, isSegera = false }: { val: boolean; isSegera?: boolean }) {
  if (val) {
    return (
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-xs font-bold ${
          isSegera
            ? 'bg-[#1B7A3D] text-white shadow-2xs'
            : 'bg-[#E3DDCF] text-[#2C2A26]'
        }`}
      >
        <Check className="w-3 h-3 stroke-[3]" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 text-[#A39E93]">
      <X className="w-3.5 h-3.5 stroke-[2]" />
    </span>
  );
}

export function ComparisonTable() {
  return (
    <div className="w-full border border-[#DCD3C0] bg-white rounded-md shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E8E0CE] bg-[#FAF6EE] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-[#1B7A3D]/10 text-[#1B7A3D] font-bold">
              Penanda Aras Ekosistem
            </span>
            <span className="text-xs text-[#6B655B] font-mono">
              Audit Sistem Analitik Geografi 2026
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1 tracking-tight">
            Perbandingan SEGERA Berbanding Sistem Analitik Global
          </h3>
        </div>
        <Badge variant="outline" className="border-[#1B7A3D] text-[#1B7A3D] bg-[#1B7A3D]/5 font-mono text-xs w-fit">
          SEGERA: Malaysia-First
        </Badge>
      </div>

      {/* Table: Fit desktop cleanly without horizontal scroll; on mobile allows smooth horizontal slide */}
      <div className="w-full overflow-x-auto md:overflow-x-visible">
        <Table className="w-full text-left border-collapse table-auto md:table-fixed">
          <TableHeader>
            <TableRow className="border-b border-[#E8E0CE] bg-[#F4EDE0]/70 hover:bg-[#F4EDE0]/70">
              <TableHead className="py-3 px-3 sm:px-4 font-serif text-sm font-bold text-[#1A1A1A] w-[220px] md:w-[35%]">
                Ciri & Keupayaan Sistem
              </TableHead>

              {/* SEGERA PALING KIRI ANTARA SISTEM */}
              <TableHead className="text-center px-2 py-3 font-mono text-xs font-bold text-[#0B4B24] bg-[#E3F2E7] border-l border-r border-[#B8DEC3] w-[95px] md:w-[13%]">
                <div className="flex flex-col items-center">
                  <span className="text-[#0B4B24] font-black text-[13px] tracking-wide">SEGERA</span>
                  <span className="text-[9px] text-[#1B7A3D] font-semibold uppercase">Malaysia</span>
                </div>
              </TableHead>

              <TableHead className="text-center px-1.5 py-3 font-mono text-[11px] text-[#5A554C] w-[80px] md:w-[10%]">
                Walk Score
                <span className="block text-[9px] text-[#8C877D] font-normal">US</span>
              </TableHead>

              <TableHead className="text-center px-1.5 py-3 font-mono text-[11px] text-[#5A554C] w-[80px] md:w-[10%]">
                TravelTime
                <span className="block text-[9px] text-[#8C877D] font-normal">UK</span>
              </TableHead>

              <TableHead className="text-center px-1.5 py-3 font-mono text-[11px] text-[#5A554C] w-[80px] md:w-[10%]">
                Esri Urban
                <span className="block text-[9px] text-[#8C877D] font-normal">ArcGIS</span>
              </TableHead>

              <TableHead className="text-center px-1.5 py-3 font-mono text-[11px] text-[#5A554C] w-[80px] md:w-[10%]">
                ORS
                <span className="block text-[9px] text-[#8C877D] font-normal">Heidelberg</span>
              </TableHead>

              <TableHead className="text-center px-1.5 py-3 font-mono text-[11px] text-[#5A554C] w-[80px] md:w-[10%]">
                15MinCity
                <span className="block text-[9px] text-[#8C877D] font-normal">EU</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {comparisonData.map((row, idx) => (
              <TableRow
                key={idx}
                className={`border-b border-[#EFE8DA] hover:bg-[#FAF7F0] transition-colors ${
                  idx % 2 === 1 ? 'bg-[#FCF9F3]/50' : 'bg-white'
                }`}
              >
                <TableCell className="py-2.5 px-3 sm:px-4 align-middle">
                  <div className="font-semibold text-xs sm:text-sm text-[#1A1A1A]">
                    {row.feature}
                  </div>
                  <div className="text-[11px] text-[#6B655B] leading-tight mt-0.5">
                    {row.description}
                  </div>
                </TableCell>

                {/* SEGERA COLUMN (PALING KIRI) */}
                <TableCell className="text-center py-2.5 px-2 bg-[#EEF8F1] border-l border-r border-[#C7E7D1] align-middle">
                  <StatusIcon val={row.segera} isSegera />
                </TableCell>

                <TableCell className="text-center py-2.5 px-1.5 align-middle">
                  <StatusIcon val={row.walkScore} />
                </TableCell>

                <TableCell className="text-center py-2.5 px-1.5 align-middle">
                  <StatusIcon val={row.travelTime} />
                </TableCell>

                <TableCell className="text-center py-2.5 px-1.5 align-middle">
                  <StatusIcon val={row.esriUrban} />
                </TableCell>

                <TableCell className="text-center py-2.5 px-1.5 align-middle">
                  <StatusIcon val={row.ors} />
                </TableCell>

                <TableCell className="text-center py-2.5 px-1.5 align-middle">
                  <StatusIcon val={row.fifteenMinCity} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="p-3 sm:p-4 bg-[#F7F2E7] border-t border-[#E8E0CE] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5A554C] font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1B7A3D]"></span>
          <span>SEGERA menyokong 9/9 keperluan capaian harian rakyat Malaysia.</span>
        </div>
        <div>
          Berasaskan Data Terbuka: OpenStreetMap (OSM) Malaysia
        </div>
      </div>
    </div>
  );
}
