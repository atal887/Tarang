import { useState, useEffect } from "react";
import { MapComponent } from "../components/map/MapComponent";
import { getLocationMapConfig } from "../data/demoData";
import { useProfile } from "../store/profile";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Wind, Waves, MapPin, Navigation } from "lucide-react";

export function ActiveTrip() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const mapCfg = getLocationMapConfig(profile.location);
  const route = mapCfg.route;

  const [gpsPos, setGpsPos] = useState<[number, number] | null>(
    profile.coordinates
      ? [profile.coordinates.latitude, profile.coordinates.longitude]
      : null
  );

  useEffect(() => {
    if (profile.locationMode === "gps") {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setGpsPos([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn("GPS watch error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [profile.locationMode]);

  // Static starting position or live GPS position
  const currentPos = gpsPos ? gpsPos : route[0];
  const mapCenter = gpsPos ? gpsPos : mapCfg.centre;
  const distanceRemaining = "18.4";
  const timeStr = "1h 12m";

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-[calc(100dvh-8rem)] bg-slate-50 relative">

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex w-10 h-10 rounded-full bg-status-safeBg items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-status-safe" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-safe opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-safe"></span>
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Started</span>
            </div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">TARANG is monitoring your trip.</h1>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => navigate("/home")} className="shadow-sm">End Trip</Button>
      </div>

      {/* Map View */}
      <div className="flex-1 w-full h-full relative z-0 pt-[72px] md:pt-[84px]">
        <MapComponent
          center={mapCenter}
          zoom={11}
          mode="route"
          markers={[
            { id: "boat",    position: currentPos,     label: "You are here",                type: "boat" as const }
          ]}
          zones={[
            { id: "z1", center: mapCfg.zone,   radius: 4000, type: "safe"    as const, label: "Recommended Zone" },
            { id: "z2", center: mapCfg.hazard, radius: 3500, type: "caution" as const, label: "Caution Area" }
          ]}
          routes={[{ id: "r1", positions: route, color: "#0284c7" }]}
        />

        {/* Bottom Status Panel */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-[1000] bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden pointer-events-auto pb-safe">
          {/* Progress Bar (Static at 0%) */}
          <div className="h-2 w-full bg-slate-100">
            <div className="h-full bg-ocean-500 transition-all duration-300 ease-linear" style={{width: `0%`}} />
          </div>

          <div className="p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-8 justify-between items-center">
            <div className="flex w-full justify-between md:justify-start md:gap-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"><MapPin className="w-3 h-3 inline mr-0.5"/>Distance</p>
                <p className="text-xl md:text-2xl font-extrabold text-slate-900">{distanceRemaining} <span className="text-sm font-semibold text-slate-500">km</span></p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"><Navigation className="w-3 h-3 inline mr-0.5"/>Est. Time</p>
                <p className="text-xl md:text-2xl font-extrabold text-slate-900">{timeStr}</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"><Waves className="w-3 h-3 inline mr-0.5"/>Sea</p>
                <p className="text-sm font-bold text-slate-900">Favourable</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1"><Wind className="w-3 h-3 inline mr-0.5"/>Wind</p>
                <p className="text-sm font-bold text-slate-900">Moderate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
