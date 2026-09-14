'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface FacilityPoi {
  id: number;
  name: string;
  category: 'surau' | 'makanan' | 'runcit' | 'klinik' | 'transit' | 'banjir';
  lat: number;
  lng: number;
  distanceMeters: number;
  walkMin: number;
  motorMin: number;
  carMin: number;
  details: string;
}

interface MapViewProps {
  center: { lat: number; lng: number };
  onCenterChange: (newCenter: { lat: number; lng: number }) => void;
  travelMode: 'motor' | 'car' | 'walking';
  timeBudget: 5 | 10 | 15;
  facilities: FacilityPoi[];
  selectedLocationName: string;
}

const CATEGORY_STYLES: Record<string, { emoji: string; bg: string; border: string; text: string }> = {
  surau: { emoji: '🕌', bg: '#FFF9E6', border: '#C5A100', text: '#856D00' },
  klinik: { emoji: '🏥', bg: '#EAF6EE', border: '#1B7A3D', text: '#0B4B24' },
  makanan: { emoji: '🍲', bg: '#FFF2EB', border: '#E87A30', text: '#B85400' },
  runcit: { emoji: '🛒', bg: '#EDF3F8', border: '#3B7BB4', text: '#1A4C78' },
  transit: { emoji: '🚆', bg: '#F4EFF9', border: '#8A5BBF', text: '#59358A' },
  banjir: { emoji: '⚠', bg: '#FDE8EC', border: '#A11D33', text: '#A11D33' },
};

function generateIsochronePolygon(center: { lat: number; lng: number }, mode: 'motor' | 'car' | 'walking', minutes: number) {
  let baseRadiusKm = 0.75;
  if (mode === 'walking') {
    baseRadiusKm = minutes === 5 ? 0.38 : minutes === 10 ? 0.75 : 1.15;
  } else if (mode === 'motor') {
    baseRadiusKm = minutes === 5 ? 1.8 : minutes === 10 ? 3.6 : 5.4;
  } else if (mode === 'car') {
    baseRadiusKm = minutes === 5 ? 1.4 : minutes === 10 ? 2.9 : 4.4;
  }

  const radiusDeg = baseRadiusKm / 111.0;
  const points: [number, number][] = [];
  const numVertices = 24;

  const variance = [
    1.05, 0.92, 1.18, 0.88, 1.25, 0.95, 1.1, 0.85,
    1.2, 0.98, 1.15, 0.9, 1.05, 1.22, 0.85, 1.12,
    0.94, 1.16, 0.89, 1.24, 0.96, 1.08, 0.86, 1.14
  ];

  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    const factor = variance[i % variance.length];
    const latOffset = Math.cos(angle) * radiusDeg * factor;
    const lngOffset = (Math.sin(angle) * radiusDeg * factor) / Math.cos((center.lat * Math.PI) / 180);
    points.push([center.lng + lngOffset, center.lat + latOffset]);
  }
  points.push(points[0]);

  return {
    type: 'Feature' as const,
    properties: { mode, minutes },
    geometry: {
      type: 'Polygon' as const,
      coordinates: [points],
    },
  };
}

export function MapView({
  center,
  onCenterChange,
  travelMode,
  timeBudget,
  facilities,
  selectedLocationName,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const centerMarkerRef = useRef<maplibregl.Marker | null>(null);
  const facilityMarkersRef = useRef<maplibregl.Marker[]>([]);
  const hoverPopupRef = useRef<maplibregl.Popup | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Clean, Minimalist MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // CartoDB Light Minimalist Raster Tiles (Clean, elegant, non-cluttered grey tone)
    const cleanStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'carto-light': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap &copy; CARTO',
        },
      },
      layers: [
        {
          id: 'carto-light-layer',
          type: 'raster',
          source: 'carto-light',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: cleanStyle,
      center: [center.lng, center.lat],
      zoom: travelMode === 'walking' ? 14.5 : 13.2,
      attributionControl: false,
    });

    setTimeout(() => map.resize(), 150);
    setTimeout(() => map.resize(), 500);

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'top-right'
    );

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: '© OpenStreetMap © CARTO',
      }),
      'bottom-right'
    );

    map.on('click', (e) => {
      onCenterChange({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    map.on('load', () => {
      setMapLoaded(true);

      const isochroneData = generateIsochronePolygon(center, travelMode, timeBudget);
      map.addSource('isochrone-source', {
        type: 'geojson',
        data: isochroneData,
      });

      // Polygon fill
      map.addLayer({
        id: 'isochrone-fill',
        type: 'fill',
        source: 'isochrone-source',
        paint: {
          'fill-color': travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#2563EB' : '#1B7A3D',
          'fill-opacity': 0.16,
        },
      });

      // Polygon outline
      map.addLayer({
        id: 'isochrone-line',
        type: 'line',
        source: 'isochrone-source',
        paint: {
          'line-color': travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#2563EB' : '#1B7A3D',
          'line-width': 2.5,
          'line-dasharray': [2, 1],
        },
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Center Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!centerMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'center-pin-marker';
      el.innerHTML = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <div style="position: absolute; width: 34px; height: 34px; background: rgba(27,122,61,0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 26px; height: 26px; background: #1A1A1A; border: 2.5px solid #FFFFFF; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; background: #1B7A3D; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat([center.lng, center.lat])
        .addTo(map);

      marker.on('dragend', () => {
        const lngLat = marker.getLngLat();
        onCenterChange({ lat: lngLat.lat, lng: lngLat.lng });
      });

      centerMarkerRef.current = marker;
    } else {
      centerMarkerRef.current.setLngLat([center.lng, center.lat]);
    }

    map.easeTo({
      center: [center.lng, center.lat],
      duration: 600,
      zoom: travelMode === 'walking' ? 14.5 : travelMode === 'car' ? 12.8 : 13.2,
    });
  }, [center, travelMode]);

  // Update Isochrone Layer Data & Colors
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const source = map.getSource('isochrone-source') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      const isochroneData = generateIsochronePolygon(center, travelMode, timeBudget);
      source.setData(isochroneData);

      const color = travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#2563EB' : '#1B7A3D';
      if (map.getLayer('isochrone-fill')) {
        map.setPaintProperty('isochrone-fill', 'fill-color', color);
      }
      if (map.getLayer('isochrone-line')) {
        map.setPaintProperty('isochrone-line', 'line-color', color);
      }
    }
  }, [center, travelMode, timeBudget, mapLoaded]);

  // Update Facility Markers: Clean, uncluttered, top 12-15 relevant facilities on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    facilityMarkersRef.current.forEach((m) => m.remove());
    facilityMarkersRef.current = [];

    if (!hoverPopupRef.current) {
      hoverPopupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
        className: 'facility-hover-popup',
      });
    }
    const popup = hoverPopupRef.current;

    // Show top 14 closest facilities to keep the map clean and calm (tak serabut)
    const displayList = facilities.slice(0, 14);

    displayList.forEach((poi) => {
      const style = CATEGORY_STYLES[poi.category] || {
        emoji: '📍',
        bg: '#FFFFFF',
        border: '#DCD2BE',
        text: '#1A1A1A',
      };

      const markerEl = document.createElement('div');
      markerEl.style.cursor = 'pointer';
      markerEl.innerHTML = `
        <div style="
          width: 28px;
          height: 28px;
          background: ${style.bg};
          border: 1.5px solid ${style.border};
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          transition: transform 0.15s ease;
        ">
          ${style.emoji}
        </div>
      `;

      const tooltipHtml = `
        <div style="padding: 6px 8px; font-family: system-ui, sans-serif; min-width: 170px; max-width: 230px;">
          <div style="font-weight: 700; font-size: 12px; color: #1A1A1A; margin-bottom: 2px;">
            ${poi.name}
          </div>
          <div style="font-size: 11px; color: #5A564F; line-height: 1.3; margin-bottom: 5px;">
            ${poi.details}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #EAE4D5; padding-top: 3px; font-family: monospace; font-size: 10px; color: #1B7A3D; font-weight: 600;">
            <span>${poi.distanceMeters}m</span>
            <span>~${travelMode === 'motor' ? poi.motorMin + ' min motor' : travelMode === 'car' ? poi.carMin + ' min kereta' : poi.walkMin + ' min jalan'}</span>
          </div>
        </div>
      `;

      markerEl.addEventListener('mouseenter', () => {
        const inner = markerEl.firstElementChild as HTMLElement;
        if (inner) inner.style.transform = 'scale(1.25)';

        popup.setLngLat([poi.lng, poi.lat]).setHTML(tooltipHtml).addTo(map);
      });

      markerEl.addEventListener('mouseleave', () => {
        const inner = markerEl.firstElementChild as HTMLElement;
        if (inner) inner.style.transform = 'scale(1)';

        popup.remove();
      });

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([poi.lng, poi.lat])
        .addTo(map);

      facilityMarkersRef.current.push(marker);
    });
  }, [facilities, travelMode]);

  return (
    <div className="relative w-full h-full bg-[#F4EDE2] overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Status Bar */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xs border border-[#DCD3C0] px-3 py-1.5 rounded-xs shadow-xs text-xs font-mono text-[#1A1A1A] flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1B7A3D] animate-pulse" />
          <span>
            {selectedLocationName} • ({center.lat.toFixed(4)}, {center.lng.toFixed(4)})
          </span>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-[#DCD3C0] p-2.5 rounded-xs shadow-xs text-[11px] font-mono text-[#5A564F] hidden sm:block">
        <div className="font-bold text-[#1A1A1A] mb-1 uppercase text-[10px] tracking-wider">
          Peta Bersih (Hover Ikon Fasiliti)
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] inline-block" />
            <span>Titik Rujukan (Tarik / Klik Peta)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-xs border border-dashed inline-block"
              style={{
                backgroundColor: travelMode === 'motor' ? '#0E4D6433' : travelMode === 'car' ? '#2563EB33' : '#1B7A3D33',
                borderColor: travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#2563EB' : '#1B7A3D',
              }}
            />
            <span>Zon {timeBudget} Minit ({travelMode === 'motor' ? 'Motosikal' : travelMode === 'car' ? 'Kereta' : 'Pejalan Kaki'})</span>
          </div>
          <div className="text-[10px] text-[#8C877D]">
            Paparan top {Math.min(facilities.length, 14)} titik terdekat untuk kekal kemas
          </div>
        </div>
      </div>
    </div>
  );
}
