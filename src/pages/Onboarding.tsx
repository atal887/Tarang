import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import type { Language } from "../store/profile";
import { SUPPORTED_LANGUAGES } from "../data/languages";
import { MapPin, Search, Loader2 } from "lucide-react";

export function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [boatType, setBoatType] = useState("");
  const [isGuestFlow, setIsGuestFlow] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [gpsCoords, setGpsCoords] = useState<{latitude: number, longitude: number, accuracy: number} | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Search state
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

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
    setGpsCoords({ latitude: lat, longitude: lon, accuracy: 100 });
    setShowManualSearch(false);
  };


  const boats = [
    "Motorized Boat",
    "Traditional / Non-Motorized Boat",
    "Small Fishing Vessel",
    "Other",
  ];

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const formatPhoneE164 = (p: string) => {
    const digits = p.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length > 10 && digits.startsWith("91")) return `+${digits}`;
    return `+${digits}`;
  };

  const DEMO_TEST_PHONE = "7982559126";

  const sendOtpRequest = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (phone === DEMO_TEST_PHONE) {
        setIsDemoMode(true);
        setStep(2);
        setResendCountdown(25);
        setTimeout(() => {
          if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
        }, 100);
        setIsLoading(false);
        return;
      }

      setIsDemoMode(false);
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formatPhoneE164(phone) }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send code");
      }
      setStep(2);
      setResendCountdown(25);
      // Focus first OTP field shortly after transitioning
      setTimeout(() => {
        if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = () => {
    sendOtpRequest();
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length < 6) return;
    
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (isDemoMode) {
        if (/^\d{6}$/.test(code)) {
          setStep(3);
        } else {
          throw new Error("The code you entered is incorrect. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formatPhoneE164(phone), code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify code");
      }
      if (data.success && data.status === "approved") {
        setStep(3);
      } else {
        throw new Error("Invalid verification status");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasteData.length, 5);
      if (otpInputsRef.current[nextFocus]) {
        otpInputsRef.current[nextFocus]?.focus();
      }
    }
  };

  const handleLocationSubmit = () => {
    setStep(4);
  };

  const handleGpsLocation = async () => {
    if (!("geolocation" in navigator)) {
      setErrorMsg("GPS is not supported by your browser.");
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
      setGpsCoords({ latitude, longitude, accuracy });
      setStep(4);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageSubmit = () => {
    setStep(5);
  };

  const handleBoatSubmit = () => {
    // Derive the city name (first part before comma) for the profile
    const cityName = location.split(",")[0].trim();

    setProfile({
      phone: isGuestFlow ? "" : `+91 ${phone}`,
      location: location === "Current location" ? "Current location" : cityName,
      locationMode: location === "Current location" ? "gps" : "manual",
      coordinates: gpsCoords || undefined,
      vesselType: boatType,
      language: language as Language,
      phoneVerified: !isGuestFlow,
      isGuest: isGuestFlow,
    });

    navigate("/home");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-slate-50">
      <div className="flex-1 flex flex-col p-6 w-full max-w-md mx-auto pt-12 md:pt-24">

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Let's get you started</h1>
              <p className="text-slate-500">Enter your mobile number to continue with TARANG.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-[76px] shrink-0 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-700 shadow-sm">+91</div>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 min-w-0 h-14 bg-white border border-slate-200 rounded-xl px-5 text-lg font-semibold focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all"
                placeholder="Enter mobile number"
              />
            </div>
            {errorMsg && <p className="text-red-500 text-sm font-semibold text-center">{errorMsg}</p>}
            <Button size="lg" className="w-full h-14 text-base" onClick={handlePhoneSubmit} disabled={phone.length < 10 || isLoading}>{isLoading ? "Sending..." : "Send OTP"}</Button>
            <div className="pt-2 text-center">
              <button 
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => { setIsGuestFlow(true); setStep(3); }}
                disabled={isLoading}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{isDemoMode ? "Demo verification" : "Verify your number"}</h1>
              <p className="text-slate-500">We've sent a 6-digit verification code to +91 {phone}.</p>
            </div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { otpInputsRef.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onPaste={handleOtpPaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && idx > 0) {
                      otpInputsRef.current[idx - 1]?.focus();
                    } else if (e.key === 'Enter') {
                      handleOtpSubmit();
                    }
                  }}
                  onChange={e => {
                    const newOtp = [...otp];
                    const val = e.target.value.replace(/\D/g, '');
                    newOtp[idx] = val;
                    setOtp(newOtp);
                    if (val && idx < 5) {
                      otpInputsRef.current[idx + 1]?.focus();
                    }
                  }}
                  className="w-full h-14 bg-white border border-slate-200 rounded-xl text-center text-xl font-bold focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all"
                />
              ))}
            </div>
            {errorMsg && <p className="text-red-500 text-sm font-semibold text-center">{errorMsg}</p>}
            <Button size="lg" className="w-full h-14 text-base" onClick={handleOtpSubmit} disabled={otp.join('').length < 6 || isLoading}>
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>
            <div className="flex flex-col items-center gap-2 pt-2">
              <button 
                className="text-sm font-bold text-ocean-600 disabled:text-slate-400 transition-colors" 
                onClick={sendOtpRequest} 
                disabled={resendCountdown > 0 || isLoading}
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
              </button>
              <button 
                className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors" 
                onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); setErrorMsg(""); }}
                disabled={isLoading}
              >
                Change phone number
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Where do you usually fish?</h1>
              <p className="text-slate-500">Select your coastal location so TARANG can provide relevant sea and fishing information.</p>
            </div>
            
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
            ) : location && location !== "Current location" && gpsCoords ? (
              <div className="space-y-4">
                <div className="p-4 bg-ocean-50 border border-ocean-200 rounded-xl">
                  <div className="text-xs font-semibold text-ocean-600 uppercase tracking-wider mb-1">Selected Location</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-ocean-600 shrink-0 mt-0.5" />
                    <div className="font-semibold text-slate-900">{location}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLocation("");
                    setGpsCoords(null);
                    setShowManualSearch(true);
                  }}
                  className="w-full py-3 text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition-colors bg-white border border-ocean-100 rounded-xl shadow-sm"
                >
                  Change location
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleGpsLocation}
                  disabled={isLoading}
                  className="w-full text-left p-4 rounded-xl border transition-all border-slate-200 bg-white text-slate-700 hover:border-slate-300 flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-ocean-600" />
                  <span className="font-semibold">{isLoading ? "Detecting location..." : "Use my current location"}</span>
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
            
            {errorMsg && <p className="text-red-500 text-sm font-semibold text-center">{errorMsg}</p>}
            
            {!showManualSearch && (
              <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleLocationSubmit} disabled={!location}>Continue</Button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Choose your language</h1>
              <p className="text-slate-500">Select the language you want TARANG to use.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${language === lang.id ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                >
                  <div className="font-bold">{lang.native}</div>
                  <div className="text-xs text-slate-500">{lang.label}</div>
                </button>
              ))}
            </div>
            <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleLanguageSubmit} disabled={!language}>Continue</Button>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">What type of boat do you use?</h1>
              <p className="text-slate-500">Your boat type helps TARANG provide more relevant safety recommendations.</p>
            </div>
            <div className="space-y-3">
              {boats.map(bt => (
                <button
                  key={bt}
                  onClick={() => setBoatType(bt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${boatType === bt ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                >
                  {bt}
                </button>
              ))}
            </div>
            <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleBoatSubmit} disabled={!boatType}>Complete Setup</Button>
          </div>
        )}

      </div>
    </div>
  );
}
