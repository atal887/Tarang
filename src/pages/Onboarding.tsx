import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import type { Language } from "../store/profile";
import { SUPPORTED_LANGUAGES } from "../data/languages";
import { MapPin } from "lucide-react";

export function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [language, setLanguage] = useState<Language | "">("");
  const [boatType, setBoatType] = useState("");
  const [isGuestFlow, setIsGuestFlow] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [gpsCoords, setGpsCoords] = useState<{latitude: number, longitude: number, accuracy: number} | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const locations = [
    "Kochi, Kerala",
    "Mangalore, Karnataka",
    "Veraval, Gujarat",
    "Chennai, Tamil Nadu",
    "Visakhapatnam, Andhra Pradesh",
    "Digha, West Bengal",
  ];
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

  const handleGpsLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("GPS is not supported by your browser.");
      return;
    }
    
    setIsLoading(true);
    if (import.meta.env.DEV) console.log("[GPS] Request started (High Accuracy)");
    
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
      } finally {
        finalize();
      }
    }, 35000);

    const handleSuccess = (pos: GeolocationPosition) => {
      if (isFinished) return;
      isFinished = true;
      clearWatchdog();
      try {
        const { latitude, longitude, accuracy } = pos.coords;
        if (import.meta.env.DEV) console.log(`[GPS] Success: ${latitude}, ${longitude} (Accuracy: ${accuracy}m)`);
        setLocation("Current location");
        setCustomLocation("");
        setGpsCoords({ latitude, longitude, accuracy });
        setErrorMsg("");
        setStep(4);
      } catch (err) {
        if (import.meta.env.DEV) console.log("[GPS] Success callback error:", err);
        setErrorMsg("An unexpected error occurred while saving your location.");
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
        setErrorMsg(`Location Error [${err?.code || 'X'}: ${errName}]: ${err?.message || 'Unknown'}. Please select location manually.`);
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
        finalize();
      }
    }
  };

  const handleLanguageSubmit = () => {
    setStep(5);
  };

  const handleBoatSubmit = () => {
    // Derive the city name (first part before comma) for the profile
    const cityName =
      location === "Other"
        ? customLocation
        : location.split(",")[0].trim();

    setProfile({
      phone: isGuestFlow ? "" : `+91 ${phone}`,
      location: gpsCoords ? "Current location" : cityName,
      locationMode: gpsCoords ? "gps" : "manual",
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
            <div className="space-y-3">
              <button
                onClick={handleGpsLocation}
                disabled={isLoading}
                className="w-full text-left p-4 rounded-xl border transition-all border-slate-200 bg-white text-slate-700 hover:border-slate-300 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5 text-ocean-600" />
                <span className="font-semibold">{isLoading ? "Detecting location..." : "Use my current location"}</span>
              </button>
              {locations.map(loc => (
                <button
                  key={loc}
                  onClick={() => { setLocation(loc); setCustomLocation(""); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${location === loc ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                >
                  {loc}
                </button>
              ))}
              <button
                onClick={() => setLocation("Other")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${location === "Other" ? 'border-ocean-500 bg-ocean-50 text-ocean-700 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
              >
                Other location
              </button>
              {location === "Other" && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  className="w-full h-14 bg-white border border-ocean-500 rounded-xl px-4 text-base focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all mt-2"
                  placeholder="Enter your location"
                />
              )}
            </div>
            {errorMsg && <p className="text-red-500 text-sm font-semibold text-center">{errorMsg}</p>}
            <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleLocationSubmit} disabled={!location || (location === "Other" && !customLocation)}>Continue</Button>
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
