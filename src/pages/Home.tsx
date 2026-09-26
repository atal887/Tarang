import { Wind, Waves, CloudSun, MapPin, ShieldCheck, GraduationCap, ArrowRight, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { locationData as oldLocationData } from "../data/demoData";
import { useProfile } from "../store/profile";
import { useState, useEffect } from "react";
import { getEnvironmentalConditions } from "../data/environmentResolver";
import indiaFishingLocations from "../data/indiaFishingLocations.json";

export function Home() {
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState("Good morning");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good evening");
    else setGreeting("Good night");
  }, []);

  const getSubtitle = () => {
    if (greeting === "Good morning") return "Here's what's happening at sea today.";
    if (greeting === "Good afternoon") return "Here's your latest sea conditions update.";
    if (greeting === "Good evening") return "Planning your next trip? Check the latest conditions.";
    return "Planning an early departure? Check tomorrow's conditions.";
  };

  const { profile } = useProfile();
  const userLocation = profile.location;
  const locKey = userLocation.toLowerCase();
  
  // Fallback for image and suggested questions
  const fallbackLocData = oldLocationData[locKey] || {
    ...oldLocationData.other,
    name: userLocation,
    state: "Region"
  };

  // 1. Resolve lat/lon
  let lat = profile.coordinates?.latitude;
  let lon = profile.coordinates?.longitude;
  let stateName = fallbackLocData.state;
  let locName = userLocation.split(',')[0].trim();
  
  if (!lat || !lon) {
    const matchedLoc = indiaFishingLocations.find(l => 
      locKey.includes(l.name.toLowerCase()) || l.name.toLowerCase() === locKey.split(',')[0].trim()
    );
    if (matchedLoc) {
      lat = matchedLoc.latitude;
      lon = matchedLoc.longitude;
      stateName = matchedLoc.state;
      locName = matchedLoc.name;
    }
  }

  // 2. Fetch dynamic environmental conditions
  const env = (lat && lon) ? getEnvironmentalConditions(locName, lat, lon) : null;

  if (env && env.name) {
    if (locName === "Current location" || locName === "Live Location") {
      locName = env.name;
    }
  }

  // 3. Prepare display values
  const displayWind = env ? env.wind : fallbackLocData.wind;
  const displayWindDesc = env ? env.windDesc : fallbackLocData.windDesc;
  const displayWeather = env ? env.weather : fallbackLocData.weather;
  const displayWeatherDesc = env ? env.weatherDesc : fallbackLocData.weatherDesc;
  
  const isMarine = env ? env.isMarine : true;
  
  const displayWaves = env ? (isMarine && env.waves ? env.waves : "Not applicable") : fallbackLocData.waves;
  const displayWavesDesc = env ? (isMarine && env.wavesDesc ? env.wavesDesc : "") : fallbackLocData.wavesDesc;
  
  const displayRainfall = env && !isMarine ? env.rainfall : null;

  const safetyStatus = env ? env.safetyStatus : fallbackLocData.safetyStatus;
  const safetyExplanation = env ? env.safetyExplanation : fallbackLocData.safetyExplanation;

  const handleQuestionClick = (question: string) => {
    navigate(`/chat?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-20 md:pb-0">
      
      {/* Visual Header */}
      <div className="relative w-full h-48 md:h-64">
        <img 
          src={fallbackLocData.image} 
          alt={locName} 
          className="w-full h-full object-cover rounded-b-[2rem]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent rounded-b-[2rem]" />
        
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
          <p className="text-sm font-medium text-white/80 mb-1">{greeting}</p>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-5 h-5 text-ocean-300" />
            <h1 className="text-2xl font-bold">{locName}, {stateName}</h1>
          </div>
          <p className="text-sm text-white/90 font-medium">{getSubtitle()}</p>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full -mt-2">
        
        {/* Current Conditions Grid */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Current Conditions</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <Wind className="w-5 h-5 text-ocean-500 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Wind</span>
              <span className="font-bold text-slate-800">{displayWind}</span>
              <span className="text-xs text-slate-500 mt-0.5">{displayWindDesc}</span>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <CloudSun className="w-5 h-5 text-amber-500 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Weather</span>
              <span className="font-bold text-slate-800">{displayWeather}</span>
              <span className="text-xs text-slate-500 mt-0.5">{displayWeatherDesc}</span>
            </div>
            
            {isMarine ? (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <Waves className="w-5 h-5 text-teal-500 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Waves</span>
                <span className="font-bold text-slate-800">{displayWaves}</span>
                <span className="text-xs text-slate-500 mt-0.5">{displayWavesDesc}</span>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Rainfall</span>
                <span className="font-bold text-slate-800">{displayRainfall || "0 mm"}</span>
                <span className="text-xs text-slate-500 mt-0.5">Inland</span>
              </div>
            )}
          </div>
        </section>

        {/* Sea Condition Summary */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">{isMarine ? "Today's Sea Conditions" : "Today's Inland Conditions"}</h2>
          <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-sm ${
            safetyStatus.toLowerCase().includes('favourable') ? 'bg-status-safeBg border-status-safe/20' : 
            safetyStatus.toLowerCase().includes('not') ? 'bg-status-dangerBg border-status-danger/20' : 
            'bg-status-cautionBg border-status-caution/20'
          }`}>
            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${
               safetyStatus.toLowerCase().includes('favourable') ? 'text-status-safeText' : 
               safetyStatus.toLowerCase().includes('not') ? 'text-status-dangerText' : 
               'text-status-cautionText'
            }`} />
            <div>
              <h3 className={`font-bold mb-1 ${
                safetyStatus.toLowerCase().includes('favourable') ? 'text-status-safeText' : 
                safetyStatus.toLowerCase().includes('not') ? 'text-status-dangerText' : 
                'text-status-cautionText'
              }`}>{safetyStatus}</h3>
              <p className="text-sm text-slate-700">{safetyExplanation}</p>
            </div>
          </div>
        </section>

        {/* Most Asked Questions */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Most Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {fallbackLocData.suggestedQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleQuestionClick(q)}
                className={`w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${idx !== fallbackLocData.suggestedQuestions.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <span className="text-sm font-medium text-slate-700">{q}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            ))}
          </div>
        </section>

        {/* Learn with TARANG */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Learn with TARANG</h2>
          <div 
            onClick={() => navigate('/training')}
            className="bg-ocean-600 rounded-2xl p-5 text-white flex items-center justify-between cursor-pointer hover:bg-ocean-700 transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-ocean-200" />
                <h3 className="font-bold text-lg">Start Training</h3>
              </div>
              <p className="text-ocean-100 text-sm max-w-[200px]">Learn how to use TARANG to make safer and more productive decisions.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
