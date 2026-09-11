import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Volume2, Pause, ArrowRight, ArrowLeft as ArrowLeftIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { trainingLessons, type Language } from "../data/trainingContent";
import { Button } from "../components/ui/Button";
import {
  preloadVoices,
  playAudio,
  stopAudio,
  isHindiVoiceAvailable,
  type AudioLang
} from "../services/audioService";

// ... (rest unchanged)


export function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialLang = (searchParams.get("lang") as Language) || "en";
  const [lang, setLang] = useState<Language>(initialLang);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  // null = loading, true/false = checked
  const [hindiAvailable, setHindiAvailable] = useState<boolean | null>(null);



  const lessonIndex = trainingLessons.findIndex(l => l.id === id);
  const lesson = trainingLessons[lessonIndex];

  const prevLesson = lessonIndex > 0 ? trainingLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < trainingLessons.length - 1 ? trainingLessons[lessonIndex + 1] : null;

  // Preload voices on mount — async but we store results synchronously
  useEffect(() => {
    preloadVoices().then(() => {
      setHindiAvailable(isHindiVoiceAvailable());
    });
  }, []);

  // Stop audio when language or lesson changes
  useEffect(() => {
    setSearchParams({ lang });
    stopAudio();
    setIsPlaying(false);
    setAudioError(null);
    return () => {
      stopAudio();
    };
  }, [lang, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lesson) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50">
        <p>Lesson not found.</p>
        <Button onClick={() => navigate('/training')} className="ml-4">Go Back</Button>
      </div>
    );
  }

  const buildSpeechText = (): string => {
    const parts = [
      lesson.title[lang],
      lesson.intro[lang],
      ...lesson.body.map(b => b[lang]),
      lesson.stepsTitle ? lesson.stepsTitle[lang] : "",
      ...(lesson.steps ? lesson.steps.map(s => s[lang]) : []),
      lesson.exampleTitle[lang],
      lesson.example[lang],
      lesson.guidanceTitle[lang],
      lesson.guidance[lang],
    ].filter(Boolean);
    return parts.join("। ");
  };

  // SYNCHRONOUS click handler — no await before speak()
  const handleAudioToggle = () => {
    setAudioError(null);

    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      return;
    }

    const audioLang: AudioLang = lang === 'hi' ? 'hi' : 'en';
    let text = buildSpeechText();

    // Ensure Hindi text contains Devanagari characters; if not, rebuild from fields
    if (lang === 'hi' && !/[\u0900-\u097F]/.test(text)) {
      console.warn('[TARANG Audio] Detected missing Hindi characters in TTS text, rebuilding from lesson fields.');
      const parts = [
        lesson.title[lang],
        lesson.intro[lang],
        ...lesson.body.map(b => b[lang]),
        lesson.stepsTitle ? lesson.stepsTitle[lang] : '',
        ...(lesson.steps ? lesson.steps.map(s => s[lang]) : []),
        lesson.exampleTitle[lang],
        lesson.example[lang],
        lesson.guidanceTitle[lang],
        lesson.guidance[lang],
      ].filter(Boolean);
      text = parts.join('। ');
    }

    // playAudio is synchronous — voices are already cached from preloadVoices()
    playAudio(
      text,
      audioLang,
      () => setIsPlaying(false),
      (errorMsg) => {
        setIsPlaying(false);
        setAudioError(errorMsg);
      }
    );

    setIsPlaying(true);
  };

  const handleNext = () => {
    stopAudio();
    setIsPlaying(false);
    if (nextLesson) {
      navigate(`/training/${nextLesson.id}?lang=${lang}`);
    } else {
      navigate('/training');
    }
  };

  const handlePrev = () => {
    stopAudio();
    setIsPlaying(false);
    if (prevLesson) {
      navigate(`/training/${prevLesson.id}?lang=${lang}`);
    }
  };

  const isHindi = lang === 'hi';
  // Show warning only when we know for sure Hindi is unavailable
  const hindiUnavailable = isHindi && hindiAvailable === false;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 pb-safe">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => {
            stopAudio();
            navigate('/training');
          }}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-semibold">{isHindi ? "वापस" : "Back"}</span>
        </button>
        <div className="flex bg-slate-100 rounded-lg p-1 shrink-0">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isHindi ? 'bg-white shadow-sm text-ocean-700' : 'text-slate-500'}`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isHindi ? 'bg-white shadow-sm text-ocean-700' : 'text-slate-500'}`}
          >
            हिंदी
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="mb-6">
          <span className="text-[10px] font-bold text-ocean-600 uppercase tracking-widest mb-2 block">
            {isHindi ? `पाठ ${lesson.order} / ${trainingLessons.length}` : `Lesson ${lesson.order} of ${trainingLessons.length}`}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {lesson.title[lang]}
          </h1>
        </div>

        {/* Audio Controls */}
        <div className="mb-8">
          {hindiUnavailable ? (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Hindi audio unavailable</p>
                <p className="text-amber-700 mt-0.5">Your device does not have a Hindi voice installed. The lesson is available to read above.</p>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant={isPlaying ? "outline" : "primary"}
                className={`rounded-full shadow-sm ${isPlaying ? 'border-amber-500 text-amber-700 hover:bg-amber-50' : 'bg-ocean-600 hover:bg-ocean-700'}`}
                onClick={handleAudioToggle}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                {isPlaying
                  ? (isHindi ? "रोकें" : "Pause")
                  : (isHindi ? "सुनें" : "Listen")}
              </Button>

              {audioError && (
                <div className="mt-3 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 font-medium">{audioError}</p>
                </div>
              )}
            </>
          )}

        </div>

        <div className="space-y-6 text-slate-700">
          <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed">
            {lesson.intro[lang]}
          </p>

          {lesson.body.map((text, idx) => (
            <p key={idx} className="leading-relaxed">
              {text[lang]}
            </p>
          ))}

          {lesson.stepsTitle && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mt-8">
              <h3 className="font-bold text-slate-900 mb-3">{lesson.stepsTitle[lang]}</h3>
              <ul className="space-y-2">
                {lesson.steps?.map((step, idx) => (
                  <li key={idx} className="flex gap-2 text-sm md:text-base text-slate-700">
                    <span>{step[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 mt-8">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center">
              {lesson.exampleTitle[lang]}
            </h3>
            <p className="text-amber-800 italic leading-relaxed">
              "{lesson.example[lang]}"
            </p>
          </div>

          <div className="bg-ocean-50 p-5 rounded-2xl border border-ocean-100 mt-8">
            <h3 className="font-bold text-ocean-900 mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-ocean-600" />
              {lesson.guidanceTitle[lang]}
            </h3>
            <p className="text-ocean-800 leading-relaxed">
              {lesson.guidance[lang]}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          {prevLesson ? (
            <Button variant="outline" className="flex-1" onClick={handlePrev}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {isHindi ? "पिछला पाठ" : "Previous"}
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          <Button className="flex-1" onClick={handleNext}>
            {nextLesson ? (
              <>
                {isHindi ? "अगला पाठ" : "Next Lesson"} <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                {isHindi ? "प्रशिक्षण समाप्त करें" : "Finish Training"} <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

      </main>
    </div>
  );
}
