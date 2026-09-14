import React from 'react';

export function SegeraLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 rounded-sm bg-[#1B7A3D] text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider border border-[#0E4D64]/30 shadow-xs">
        SG
      </div>
      <div className="flex flex-col">
        <span className="font-serif font-black tracking-tight text-xl leading-none text-[#1A1A1A]">
          SEGERA
        </span>
        <span className="font-mono text-[10px] tracking-wider uppercase text-[#5A564F] mt-0.5">
          10-Minute City Engine • MY
        </span>
      </div>
    </div>
  );
}
