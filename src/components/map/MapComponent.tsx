import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';
import { cn } from "../../lib/utils";

const createCustomIcon = (type: "start" | "destination" | "boat" | "default") => {
  let iconHtml = '';
  let size: [number, number] = [32, 32];
  let anchor: [number, number] = [16, 32];

  if (type === 'start') {
    iconHtml = `<div style="width:16px;height:16px;border-radius:50%;border:2px solid #0f172a;background:white;box-shadow:0 1px 2px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;background:#0f172a;border-radius:50%;"></div></div>`;
    size = [16, 16];
    anchor = [8, 8];
  } else if (type === 'boat') {
    iconHtml = `<div style="width:32px;height:32px;border-radius:50%;background:#0284c7;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;color:white;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>`;
    size = [32, 32];
    anchor = [16, 16];
  } else {
    // Destination / default pin
    iconHtml = `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#0284c7;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg></div>`;
    size = [32, 32];
    anchor = [16, 28];
  }
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon bg-transparent border-none',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -size[1]]
  });
};

export interface MapMarker {
  id: string;
  position: [number, number];
  label: string;
  type?: "start" | "destination" | "boat" | "default";
}

export interface MapZone {
  id: string;
  center: [number, number];
  radius: number; // meters
  type: "safe" | "caution" | "danger" | "restricted";
  label: string;
}

export interface MapRoute {
  id: string;
  positions: [number, number][];
  color?: string;
}

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  zones?: MapZone[];
  routes?: MapRoute[];
  mode?: "fishing" | "route" | "risk" | "restricted" | "explore";
  className?: string;
}

export function MapComponent({ 
  center, 
  zoom = 10, 
  markers = [], 
  zones = [], 
  routes = [],
  className 
}: MapComponentProps) {
  
  const getZoneStyle = (type: string) => {
    switch (type) {
      case "safe": return { color: "#14b8a6", fillOpacity: 0.1, weight: 1, dashArray: "4" }; // teal-500
      case "caution": return { color: "#d97706", fillOpacity: 0.15, weight: 1 }; // amber-600
      case "danger": return { color: "#dc2626", fillOpacity: 0.15, weight: 1 }; // red-600
      case "restricted": return { color: "#475569", fillOpacity: 0.1, weight: 2, dashArray: "5, 10" }; // slate-600
      default: return { color: "#0ea5e9", fillOpacity: 0.1, weight: 1 }; // sky-500
    }
  };

  return (
    <div className={cn("w-full h-full relative z-0", className)}>
      <MapContainer center={center} zoom={zoom} className="w-full h-full bg-slate-50" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-filter"
        />
        
        {zones.map(z => {
          const style = getZoneStyle(z.type);
          return (
            <Circle 
              key={z.id}
              center={z.center} 
              radius={z.radius} 
              pathOptions={{ 
                color: style.color, 
                fillColor: style.color, 
                fillOpacity: style.fillOpacity,
                weight: style.weight,
                dashArray: style.dashArray
              }}
            >
              <Popup className="rounded-xl overflow-hidden shadow-sm">
                <div className="px-1 py-0.5">
                  <div className="text-sm font-bold text-slate-800">{z.label}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5 tracking-wider">{z.type} Area</div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {routes.map(r => (
          <Polyline 
            key={r.id}
            positions={r.positions}
            pathOptions={{ color: r.color || "#0284c7", weight: 3, opacity: 0.9, lineJoin: "round" }}
          />
        ))}
        
        {markers.map(m => (
          <Marker key={m.id} position={m.position} icon={createCustomIcon(m.type || "default")}>
            <Popup className="rounded-xl overflow-hidden shadow-sm">
              <div className="px-1 py-0.5 font-semibold text-sm text-slate-800">{m.label}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
