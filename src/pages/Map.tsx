import { MapComponent } from "../components/map/MapComponent";
import { demoData } from "../data/demoData";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Route, Clock, ArrowRight, Anchor, Navigation2, AlertTriangle, Lock } from "lucide-react";

type MapCoordKey = keyof typeof demoData.mapCoordinates;

export function Map() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const userLocation = profile.location;
  const [searchParams, setSearchParams] = useSearchParams();
  const locKey = userLocation.toLowerCase() as MapCoordKey;
  const centerCoord = demoData.mapCoordinates[locKey] ?? demoData.mapCoordinates.kochi;
  const mode = searchParams.get("mode") || "explore";

  const renderPanel = () => {
    switch(mode) {
      case "fishing":
        return (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-6 md:top-6 md:right-auto md:w-80 z-[1000] bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended Zone</h2>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{demoData.recommendedZone.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Distance</span>
                <span className="text-sm font-bold text-slate-900">18 km from Harbour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Risk Assessment</span>
                <span className="text-sm font-bold text-status-safeText bg-status-safeBg px-2 py-0.5 rounded">28/100 · Low</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Fishing Potential</span>
                <span className="text-sm font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded">High</span>
              </div>
            </div>
            
            <Button size="lg" className="w-full text-sm" onClick={() => setSearchParams({ mode: "route" })}>
              View Safe Route
            </Button>
          </div>
        );
      
      case "route":
        return (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-6 md:top-6 md:right-auto md:w-80 z-[1000] bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Safe Route</h2>
            
            <div className="flex items-start gap-4 mb-5 relative">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-900 bg-white z-10" />
                <div className="w-0.5 h-8 bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full border-2 border-ocean-600 bg-white z-10" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-0.5">Start</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{profile.location} Harbour</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ocean-600 uppercase leading-none mb-0.5">Destination</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{demoData.recommendedZone.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5"><Route className="w-3 h-3 inline mr-0.5" /> Dist</p>
                <p className="text-sm font-bold text-slate-900">{demoData.routeData.distance}</p>
              </div>
              <div className="text-center border-l border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5"><Clock className="w-3 h-3 inline mr-0.5" /> Time</p>
                <p className="text-sm font-bold text-slate-900">{demoData.routeData.estimatedTime}</p>
              </div>
              <div className="text-center border-l border-slate-200">
                <p className="text-[10px] font-bold text-status-safe uppercase tracking-wider mb-0.5"><ShieldCheck className="w-3 h-3 inline mr-0.5" /> Risk</p>
                <p className="text-sm font-bold text-status-safeText">{demoData.routeData.risk.split(' ')[0]}</p>
              </div>
            </div>
            
            <Button size="lg" className="w-full text-sm shadow-lg shadow-ocean-600/20" onClick={() => navigate("/active-trip")}>
              Start Trip <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case "risk":
        return (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-6 md:top-6 md:right-auto md:w-80 z-[1000] bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-status-dangerText" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Areas to Avoid</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">Higher risk areas due to deteriorating sea conditions and strong currents.</p>
            <Button variant="outline" className="w-full" onClick={() => setSearchParams({})}>Close Map</Button>
          </div>
        );

      case "restricted":
        return (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-6 md:top-6 md:right-auto md:w-80 z-[1000] bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Restricted Zone</h2>
            </div>
            <p className="text-sm text-slate-600 mb-4">Commercial fishing activity is currently not permitted in this monitored conservation zone.</p>
            <Button variant="outline" className="w-full" onClick={() => setSearchParams({})}>Close Map</Button>
          </div>
        );

      default:
        // Explore Mode
        return (
          <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-6 md:top-6 md:right-auto md:w-80 z-[1000] bg-white p-5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 flex flex-col">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Explore {profile.location}</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex-col h-20 gap-1 text-xs" onClick={() => setSearchParams({ mode: "fishing" })}>
                <Anchor className="w-5 h-5 text-ocean-600" />
                Fishing Zones
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-1 text-xs" onClick={() => setSearchParams({ mode: "route" })}>
                <Navigation2 className="w-5 h-5 text-ocean-600" />
                Safe Routes
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-1 text-xs" onClick={() => setSearchParams({ mode: "risk" })}>
                <AlertTriangle className="w-5 h-5 text-status-dangerText" />
                Risk Areas
              </Button>
              <Button variant="outline" className="flex-col h-20 gap-1 text-xs" onClick={() => setSearchParams({ mode: "restricted" })}>
                <Lock className="w-5 h-5 text-slate-600" />
                Restricted
              </Button>
            </div>
          </div>
        );
    }
  };

  const getMapData = () => {
    switch(mode) {
      case "fishing":
        return {
          markers: [
            { id: "1", position: centerCoord, label: `${profile.location} Harbour`, type: "start" as const },
            { id: "2", position: demoData.mapCoordinates.zoneAlpha, label: demoData.recommendedZone.name, type: "destination" as const }
          ],
          zones: [{ id: "z1", center: demoData.mapCoordinates.zoneAlpha, radius: 4000, type: "safe" as const, label: demoData.recommendedZone.name }],
          routes: []
        };
      case "route":
        return {
          markers: [
            { id: "1", position: centerCoord, label: `${profile.location} Harbour`, type: "start" as const },
            { id: "2", position: demoData.mapCoordinates.zoneAlpha, label: demoData.recommendedZone.name, type: "destination" as const }
          ],
          zones: [
            { id: "z2", center: demoData.mapCoordinates.hazardZone, radius: 3500, type: "caution" as const, label: "Caution Area" }
          ],
          routes: [{ id: "r1", positions: demoData.routeData.positions, color: "#0284c7" }]
        };
      case "risk":
        return {
          markers: [{ id: "1", position: centerCoord, label: `${profile.location} Harbour`, type: "start" as const }],
          zones: [
            { id: "z2", center: demoData.mapCoordinates.hazardZone, radius: 4000, type: "caution" as const, label: "Caution Area" },
            { id: "z3", center: [9.85, 76.10] as [number, number], radius: 6000, type: "danger" as const, label: "High Risk Area" }
          ],
          routes: []
        };
      case "restricted":
        return {
          markers: [{ id: "1", position: centerCoord, label: `${profile.location} Harbour`, type: "start" as const }],
          zones: [
            { id: "z4", center: [9.90, 76.12] as [number, number], radius: 3000, type: "restricted" as const, label: "Restricted Area" }
          ],
          routes: []
        };
      default:
        return {
          markers: [{ id: "1", position: centerCoord, label: `${profile.location} Harbour`, type: "start" as const }],
          zones: [],
          routes: []
        };
    }
  };

  const mapData = getMapData();

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {renderPanel()}
      <div className="flex-1 w-full h-full relative z-0">
         <MapComponent 
            center={centerCoord}
            zoom={10.5}
            mode={mode as any}
            markers={mapData.markers}
            zones={mapData.zones}
            routes={mapData.routes}
         />
      </div>
    </div>
  );
}
