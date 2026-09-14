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
  surau: { emoji: '🕌', bg: '#FFF8D6', border: '#C5A100', text: '#856D00' },
  klinik: { emoji: '🏥', bg: '#E3F2E7', border: '#1B7A3D', text: '#0B4B24' },
  makanan: { emoji: '🍲', bg: '#FFF0E6', border: '#E87A30', text: '#B85400' },
  runcit: { emoji: '🛒', bg: '#E8EFF6', border: '#3B7BB4', text: '#1A4C78' },
  transit: { emoji: '🚆', bg: '#F2EDF8', border: '#8A5BBF', text: '#59358A' },
  banjir: { emoji: '⚠', bg: '#FDE8EC', border: '#A11D33', text: '#A11D33' },
};

/**
 * Generate a realistic road-network style isochrone polygon
 */
function generateIsochronePolygon(center: { lat: number; lng: number }, mode: 'motor' | 'car' | 'walking', minutes: number) {
  // Approximate reach in degrees
  // walking: ~4.5 km/h -> 5 min = 375m, 10 min = 750m, 15 min = 1.1km
  // motor: ~30 km/h -> 5 min = 2.5km, 10 min = 5.0km, 15 min = 7.5km
  // car: ~24 km/h -> 5 min = 2.0km, 10 min = 4.0km, 15 min = 6.0km
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

  // Realistic road reach variance multipliers
  const variance = [
    1.05, 0.92, 1.18, 0.88, 1.25, 0.95, 1.1, 0.85,
    1.2, 0.98, 1.15, 0.9, 1.05, 1.22, 0.85, 1.12,
    0.94, 1.16, 0.89, 1.24, 0.96, 1.08, 0.86, 1.14
  ];

  for (let i = 0; i < numVertices; i++) {
    const angle = (i / numVertices) * Math.PI * 2;
    const factor = variance[i % variance.length];
    // East-west distortion for latitude
    const latOffset = Math.cos(angle) * radiusDeg * factor;
    const lngOffset = (Math.sin(angle) * radiusDeg * factor) / Math.cos((center.lat * Math.PI) / 180);
    points.push([center.lng + lngOffset, center.lat + latOffset]);
  }
  // Close polygon
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

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Direct OpenStreetMap raster style (Guaranteed 100% free, loads instantly, no API key needed)
    const osmStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-tiles-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: osmStyle,
      center: [center.lng, center.lat],
      zoom: travelMode === 'walking' ? 14.5 : 13.2,
      attributionControl: false,
    });

    // Ensure map tiles resize correctly once container dimensions are rendered
    setTimeout(() => {
      map.resize();
    }, 150);
    setTimeout(() => {
      map.resize();
    }, 500);

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      'top-right'
    );

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: '© OpenStreetMap contributors © MapLibre',
      }),
      'bottom-right'
    );

    // Click anywhere on map to set new center
    map.on('click', (e) => {
      onCenterChange({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    map.on('load', () => {
      setMapLoaded(true);

      // Add isochrone source and layers
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
          'fill-color': travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#3B7BB4' : '#1B7A3D',
          'fill-opacity': 0.24,
        },
      });

      // Polygon outline
      map.addLayer({
        id: 'isochrone-line',
        type: 'line',
        source: 'isochrone-source',
        paint: {
          'line-color': travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#3B7BB4' : '#1B7A3D',
          'line-width': 3,
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
      // Create custom center pin
      const el = document.createElement('div');
      el.className = 'center-pin-marker';
      el.innerHTML = `
        <div style="width: 32px; height: 32px; background: #1A1A1A; border: 3px solid #FFFFFF; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; cursor: grab;">
          <div style="width: 10px; height: 10px; background: #1B7A3D; border-radius: 50%; transform: rotate(45deg);"></div>
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

    // Pan smoothly
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

      const color = travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#3B7BB4' : '#1B7A3D';
      if (map.getLayer('isochrone-fill')) {
        map.setPaintProperty('isochrone-fill', 'fill-color', color);
      }
      if (map.getLayer('isochrone-line')) {
        map.setPaintProperty('isochrone-line', 'line-color', color);
      }
    }
  }, [center, travelMode, timeBudget, mapLoaded]);

  // Update Facility Markers with Hover Popups
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    facilityMarkersRef.current.forEach((m) => m.remove());
    facilityMarkersRef.current = [];

    // Initialize reusable popup if not present
    if (!hoverPopupRef.current) {
      hoverPopupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 16,
        className: 'facility-hover-popup',
      });
    }
    const popup = hoverPopupRef.current;

    // Render new markers
    facilities.forEach((poi) => {
      const style = CATEGORY_STYLES[poi.category] || {
        emoji: '📍',
        bg: '#FFFFFF',
        border: '#DCD2BE',
        text: '#1A1A1A',
      };

      const markerEl = document.createElement('div');
      markerEl.className = 'poi-marker-container';
      markerEl.style.cursor = 'pointer';
      markerEl.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: ${style.bg};
          border: 1.5px solid ${style.border};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: transform 0.15s ease;
        ">
          ${style.emoji}
        </div>
      `;

      // Hover tooltip content
      const tooltipHtml = `
        <div style="padding: 6px 8px; font-family: system-ui, sans-serif; min-width: 170px; max-width: 240px;">
          <div style="font-weight: 700; font-size: 13px; color: #1A1A1A; margin-bottom: 3px;">
            ${poi.name}
          </div>
          <div style="font-size: 11px; color: #5A564F; line-height: 1.35; margin-bottom: 5px;">
            ${poi.details}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #EAE4D5; padding-top: 4px; font-family: monospace; font-size: 10px; color: #1B7A3D; font-weight: 600;">
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
      {/* MapLibre DOM target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Instructions & Legend */}
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
        <div className="font-bold text-[#1A1A1A] mb-1.5 uppercase text-[10px] tracking-wider">
          Petunjuk Peta (Hover Ikon Fasiliti)
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#1A1A1A] inline-block" />
            <span>Titik Rujukan (Boleh Tarik / Klik Peta)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-xs border border-dashed inline-block"
              style={{
                backgroundColor: travelMode === 'motor' ? '#0E4D6433' : travelMode === 'car' ? '#3B7BB433' : '#1B7A3D33',
                borderColor: travelMode === 'motor' ? '#0E4D64' : travelMode === 'car' ? '#3B7BB4' : '#1B7A3D',
              }}
            />
            <span>Zon {timeBudget} Minit ({travelMode === 'motor' ? 'Motosikal' : travelMode === 'car' ? 'Kereta' : 'Pejalan Kaki'})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1B7A3D]">
            <span>Hover mana-mana pin untuk lihat maklumat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
