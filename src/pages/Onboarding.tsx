import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useProfile } from "../store/profile";
import type { Language } from "../store/profile";

const LANGUAGE_MAP: Record<string, Language> = {
  "Kochi, Kerala":                    "ml",
  "Mangalore, Karnataka":             "kn",
  "Veraval, Gujarat":                 "gu",
  "Chennai, Tamil Nadu":              "ta",
  "Visakhapatnam, Andhra Pradesh":    "te",
  "Digha, West Bengal":               "bn",
};

export function Onboarding() {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [boatType, setBoatType] = useState("");

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

  const handlePhoneSubmit = () => setStep(2);
  const handleOtpSubmit = () => setStep(3);

  const handleLocationSubmit = () => {
    setStep(4);
  };

  const handleBoatSubmit = () => {
    // Derive the city name (first part before comma) for the profile
    const cityName =
      location === "Other"
        ? customLocation
        : location.split(",")[0].trim();

    // Derive best default language from location
    const defaultLang: Language = LANGUAGE_MAP[location] ?? "en";

    setProfile({
      phone: `+91 ${phone}`,
      location: cityName,
      vesselType: boatType,
      language: defaultLang,
      phoneVerified: true,
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
            <div className="flex gap-3">
              <div className="w-16 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-700 shadow-sm">+91</div>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 h-14 bg-white border border-slate-200 rounded-xl px-4 text-lg font-semibold focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all"
                placeholder="Enter mobile number"
              />
            </div>
            <Button size="lg" className="w-full h-14 text-base" onClick={handlePhoneSubmit} disabled={phone.length < 10}>Send OTP</Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Verify your number</h1>
              <p className="text-slate-500">We've sent a 6-digit verification code to +91 {phone}.</p>
            </div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value.replace(/\D/g, '');
                    setOtp(newOtp);
                    if (e.target.value && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
                  }}
                  className="w-full h-14 bg-white border border-slate-200 rounded-xl text-center text-xl font-bold focus:border-ocean-500 focus:ring-2 focus:ring-ocean-500/20 outline-none shadow-sm transition-all"
                />
              ))}
            </div>
            <Button size="lg" className="w-full h-14 text-base" onClick={handleOtpSubmit} disabled={otp.join('').length < 6}>Verify &amp; Continue</Button>
            <button className="w-full text-sm font-bold text-ocean-600 py-2">Resend OTP</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Where do you usually fish?</h1>
              <p className="text-slate-500">Select your coastal location so TARANG can provide relevant sea and fishing information.</p>
            </div>
            <div className="space-y-3">
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
            <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleLocationSubmit} disabled={!location || (location === "Other" && !customLocation)}>Continue</Button>
          </div>
        )}

        {step === 4 && (
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
            <Button size="lg" className="w-full h-14 text-base mt-4" onClick={handleBoatSubmit} disabled={!boatType}>Continue</Button>
          </div>
        )}

      </div>
    </div>
  );
}
