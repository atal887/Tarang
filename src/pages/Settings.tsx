import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import type { Language } from "../store/profile";
import { SUPPORTED_LANGUAGES } from "../data/languages";
import { MapPin, Search, Loader2 } from "lucide-react";

export function Settings() {
  const { profile, setProfile } = useProfile();

  const [location, setLocation] = useState(profile.location);
  const [locationMode, setLocationMode] = useState<"manual"|"gps">(profile.locationMode || "manual");
  const [gpsCoords, setGpsCoords] = useState<{latitude: number, longitude: number, accuracy: number} | null>(profile.coordinates || null);
  const [boatType, setBoatType] = useState(profile.vesselType);
  const [language, setLanguage] = useState<Language>(profile.language);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const boats = ["Motorized Boat", "Traditional / Non-Motorized Boat", "Small Fishing Vessel", "Other"];

  useEffect(() => {
    if (!showManualSearch || searchQuery.length < 3) {
      setSearchResults([]);
      setSearchError("");
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in`, {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
          }
        });
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setSearchResults(data);
        if (data.length === 0) {
          setSearchError("No locations found. Try a different search.");
        }
      } catch (err) {
        console.error(err);
        setSearchError("Location search is temporarily unavailable. Please try again or use your current location.");
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, showManualSearch]);

  const handleManualLocationSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    // Construct a sensible display name
    let placeName = result.display_name;
    const parts = result.display_name.split(",").map((p: string) => p.trim());
    if (parts.length > 3) {
      placeName = `${parts[0]}, ${parts[1]}, ${parts[parts.length - 1]}`;
    }
    
    setLocation(placeName);
    setLocationMode("manual");
    setGpsCoords({ latitude: lat, longitude: lon, accuracy: 100 });
    setShowManualSearch(false);
  };

  const handleLocationChange = async (val: string) => {
    setErrorMsg("");
    if (val === "Current location") {
      if (!("geolocation" in navigator)) {
        setErrorMsg("GPS is not supported.");
        return;
      }
      
      setIsLoading(true);
      setErrorMsg("");

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          // Watchdog timer (15 seconds max)
          const watchdog = setTimeout(() => {
            reject(new Error("WATCHDOG_TIMEOUT"));
          }, 15000);

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(watchdog);
              resolve(pos);
            },
            (err) => {
              clearTimeout(watchdog);
              reject(err);
            },
            // Just use basic options to maximize compatibility on Android
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
          );
        });

        // Success
        const { latitude, longitude, accuracy } = position.coords;
        setLocation("Current location");
        setLocationMode("gps");
        setGpsCoords({ latitude, longitude, accuracy });

      } catch (error: any) {
        console.warn("GPS Error:", error);
        let errMsg = "We couldn't detect your current location. Please select it manually.";
        
        if (error && typeof error.code === 'number') {
          if (error.code === 1) errMsg = "Location permission was denied.";
          if (error.code === 2) errMsg = "Location information is unavailable on this device.";
          if (error.code === 3) errMsg = "The location request timed out.";
        } else if (error && error.message === "WATCHDOG_TIMEOUT") {
          errMsg = "Location request timed out. Please try again or select manually.";
        }
        
        setErrorMsg(errMsg);
        setLocationMode("manual");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      location,
      locationMode,
      coordinates: gpsCoords ? gpsCoords : undefined,
      vesselType: boatType,
      language,
    });
    alert("Profile saved successfully");
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto pb-24 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
      </header>

      <div className="space-y-6">
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Profile</h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone || "Not set"}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Location {isLoading && <span className="text-ocean-600 font-medium ml-2 animate-pulse">(Detecting...)</span>}
            </label>
            
            {showManualSearch ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for a city, village, or harbour"
                    className="w-full h-14 bg-white border border-slate-200 rounded-xl pl-10 pr-4 text-base focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-600 animate-spin" />
                  )}
                </div>
                
                {searchError && (
                  <p className="text-red-500 text-sm font-semibold">{searchError}</p>
                )}

                {searchResults.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {searchResults.map((res, i) => (
                      <button
                        key={res.place_id || i}
                        onClick={() => handleManualLocationSelect(res)}
                        className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="font-semibold text-slate-900">{res.display_name.split(",")[0]}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{res.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={() => setShowManualSearch(false)}
                  className="w-full py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel search
                </button>
              </div>
            ) : locationMode === 'manual' && gpsCoords ? (
              <div className="space-y-4">
                <div className="p-4 bg-ocean-50 border border-ocean-200 rounded-xl">
                  <div className="text-xs font-semibold text-ocean-600 uppercase tracking-wider mb-1">Selected Location</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-ocean-600 shrink-0 mt-0.5" />
                    <div className="font-semibold text-slate-900">{location}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLocationChange("Current location")}
                    disabled={isLoading}
                    className="flex-1 py-3 text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition-colors bg-white border border-ocean-100 rounded-xl shadow-sm"
                  >
                    Use GPS
                  </button>
                  <button
                    onClick={() => setShowManualSearch(true)}
                    disabled={isLoading}
                    className="flex-1 py-3 text-sm font-semibold text-slate-600 hover:text-slate-700 transition-colors bg-white border border-slate-200 rounded-xl shadow-sm"
                  >
                    Search again
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleLocationChange("Current location")}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-xl border transition-all border-slate-200 bg-white text-slate-700 hover:border-slate-300 flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-ocean-600" />
                  <span className="font-semibold">{isLoading ? "Detecting location..." : (locationMode === 'gps' ? "Using Current Location" : "Use my current location")}</span>
                </button>
                <button
                  onClick={() => setShowManualSearch(true)}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-xl border transition-all border-slate-200 bg-white text-slate-700 hover:border-slate-300 flex items-center gap-2"
                >
                  <Search className="w-5 h-5 text-slate-500" />
                  <span className="font-semibold">Select manually</span>
                </button>
              </div>
            )}
            {errorMsg && <p className="text-red-500 text-xs font-semibold mt-1">{errorMsg}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Boat Type</label>
            <select
              value={boatType}
              onChange={e => setBoatType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              {boats.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Preferences</h2>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as Language)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.native} ({lang.label})</option>
              ))}
            </select>
          </div>
        </section>

        <Button className="w-full h-12" onClick={handleSave} disabled={isLoading}>Save Changes</Button>
      </div>
    </div>
  );
}
