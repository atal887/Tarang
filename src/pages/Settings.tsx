import { useState } from "react";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import type { Language } from "../store/profile";
import { demoData } from "../data/demoData";
import { SUPPORTED_LANGUAGES } from "../data/languages";

export function Settings() {
  const { profile, setProfile } = useProfile();

  const [location, setLocation] = useState(profile.location);
  const [locationMode, setLocationMode] = useState<"manual"|"gps">(profile.locationMode || "manual");
  const [gpsCoords, setGpsCoords] = useState<{latitude: number, longitude: number, accuracy: number} | null>(profile.coordinates || null);
  const [boatType, setBoatType] = useState(profile.vesselType);
  const [language, setLanguage] = useState<Language>(profile.language);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const boats = ["Motorized Boat", "Traditional / Non-Motorized Boat", "Small Fishing Vessel", "Other"];

  const handleLocationChange = (val: string) => {
    setErrorMsg("");
    if (val === "Current location") {
      if (!("geolocation" in navigator)) {
        setErrorMsg("GPS is not supported.");
        return;
      }
      
      setIsLoading(true);
      if (import.meta.env.DEV) console.log("[GPS] Settings Request started (High Accuracy)");

      let isFinished = false;
      let watchdogTimer: any = null;

      const clearWatchdog = () => {
        if (watchdogTimer) clearTimeout(watchdogTimer);
      };

      const finalize = () => {
        setIsLoading(false);
      };

      watchdogTimer = setTimeout(() => {
        if (isFinished) return;
        isFinished = true;
        try {
          if (import.meta.env.DEV) console.log("[GPS] Watchdog fired");
          setErrorMsg("We couldn't detect your current location. Please try again or select your location manually.");
          setLocation(profile.location !== "Current location" ? profile.location : demoData.availableLocations[0]);
          setLocationMode("manual");
        } finally {
          finalize();
        }
      }, 35000);

      const handleSuccess = (pos: GeolocationPosition) => {
        if (isFinished) return;
        isFinished = true;
        clearWatchdog();
        try {
          if (import.meta.env.DEV) console.log(`[GPS] Success: ${pos.coords.latitude}, ${pos.coords.longitude} (Accuracy: ${pos.coords.accuracy}m)`);
          setLocation("Current location");
          setLocationMode("gps");
          setGpsCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
          setErrorMsg("");
        } catch (err) {
          if (import.meta.env.DEV) console.log("[GPS] Success callback error:", err);
          setErrorMsg("An unexpected error occurred while saving your location.");
          setLocation(profile.location !== "Current location" ? profile.location : demoData.availableLocations[0]);
          setLocationMode("manual");
        } finally {
          finalize();
        }
      };

      const handleFinalError = (err: GeolocationPositionError | any, attempt: string) => {
        if (isFinished) return;
        isFinished = true;
        clearWatchdog();
        try {
          if (import.meta.env.DEV) console.log(`[GPS] Final Error (${attempt})`, err?.code, err?.message);
          let errName = "UNKNOWN_ERROR";
          if (err?.code) {
            switch (err.code) {
              case 1: errName = "PERMISSION_DENIED"; break;
              case 2: errName = "POSITION_UNAVAILABLE"; break;
              case 3: errName = "TIMEOUT"; break;
            }
          }
          setErrorMsg(`Location Error [${err?.code || 'X'}: ${errName}]: ${err?.message || 'Unknown'}. Falling back to manual location.`);
          setLocation(profile.location !== "Current location" ? profile.location : demoData.availableLocations[0]);
          setLocationMode("manual");
        } finally {
          finalize();
        }
      };

      try {
        if (import.meta.env.DEV) console.log("[GPS] Primary getCurrentPosition called");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (import.meta.env.DEV) console.log("[GPS] Primary success callback received");
            handleSuccess(pos);
          },
          (err) => {
            if (import.meta.env.DEV) console.log("[GPS] Primary error callback received", err?.code, err?.message);
            if (err?.code === 2 || err?.code === 3) {
              if (isFinished) return;
              if (import.meta.env.DEV) console.log("[GPS] Fallback getCurrentPosition called");
            try {
              navigator.geolocation.getCurrentPosition(
                (fallbackPos) => {
                  if (import.meta.env.DEV) console.log("[GPS] Fallback success callback received");
                  handleSuccess(fallbackPos);
                },
                (fallbackErr) => {
                  if (import.meta.env.DEV) console.log("[GPS] Fallback error callback received");
                  handleFinalError(fallbackErr, "Fallback");
                },
                { enableHighAccuracy: false, timeout: 30000, maximumAge: 120000 }
              );
            } catch (e) {
              if (import.meta.env.DEV) console.log("[GPS] Fallback throw", e);
              handleFinalError(e, "High Accuracy (Fallback throw)");
            }
          } else {
            handleFinalError(err, "High Accuracy");
          }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
      );
    } catch (e) {
      if (import.meta.env.DEV) console.log("[GPS] Primary throw", e);
      if (!isFinished) {
        isFinished = true;
        clearWatchdog();
        setErrorMsg(`Location Error [Exception]: ${e}`);
        setLocation(profile.location !== "Current location" ? profile.location : demoData.availableLocations[0]);
        setLocationMode("manual");
        finalize();
      }
    }
    } else {
      setLocation(val);
      setLocationMode("manual");
    }
  };

  const handleSave = () => {
    setProfile({
      ...profile,
      location,
      locationMode,
      coordinates: locationMode === "gps" && gpsCoords ? gpsCoords : undefined,
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
            <select
              value={location}
              disabled={isLoading}
              onChange={e => handleLocationChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-ocean-500 outline-none"
            >
              <option value="Current location">Use my current location</option>
              {demoData.availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
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
