import { useState, useEffect } from "react";
import { Volume2, Pause, AlertCircle } from "lucide-react";

interface AudioPlayerProps {
  audioText: string;
  locale: string;
}

export function AudioPlayer({ audioText, locale }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if speechSynthesis is available
    if ("speechSynthesis" in window) {
      setIsReady(true);
    } else {
      setHasError(true);
    }
    
    // Cleanup on unmount or when text/locale changes
    return () => {
      if ("speechSynthesis" in window) {
         window.speechSynthesis.cancel();
      }
    };
  }, [audioText, locale]);

  const handleToggle = () => {
    if (!isReady || hasError) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = locale;
    
    // For Hindi and Indian languages, slow it down slightly for natural sound
    if (locale.startsWith("hi") || locale.startsWith("bn") || locale.startsWith("ta") || locale.startsWith("te")) {
      utterance.rate = 0.9;
    } else {
      utterance.rate = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = locale.split("-")[0];
    
    // Find a voice matching the primary language code
    const specificVoice = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) || 
                          (langPrefix === "en" ? voices.find(v => v.lang.includes('IN')) : undefined);
    
    if (specificVoice) {
      utterance.voice = specificVoice;
    } else {
       if (langPrefix !== "en") {
          console.warn(`No native voice found for ${locale}.`);
          setHasError(true);
          return;
       }
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
       console.error("Speech synthesis error", e);
       setIsPlaying(false);
       setHasError(true);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (hasError || !audioText) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="font-medium">Audio is unavailable on this device. Please try again.</span>
        </div>
        <p className="text-slate-700 bg-white p-3 rounded-lg border border-red-100/50 mt-1 shadow-sm">
          {audioText}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start space-y-3">
      <div className="flex items-center gap-3">
        <button 
          onClick={handleToggle}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm ${
            isPlaying 
              ? 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200' 
              : 'bg-ocean-600 text-white hover:bg-ocean-700 focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        
        <div className="flex flex-col">
           <span className="text-xs font-bold uppercase tracking-widest text-slate-400">TARANG Audio</span>
           <span className={`text-sm font-medium ${isPlaying ? 'text-amber-700' : 'text-slate-700'}`}>
             {isPlaying ? "Playing response..." : "Listen to answer"}
           </span>
        </div>
      </div>
    </div>
  );
}
