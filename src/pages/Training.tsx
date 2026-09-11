import { useState } from "react";
import { BookOpen, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trainingLessons, type Language } from "../data/trainingContent";

export function Training() {
  const [lang, setLang] = useState<Language>("en");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 pb-safe">
      <div className="p-4 md:p-6 max-w-3xl mx-auto w-full animate-in fade-in">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === "en" ? "Learn with TARANG" : "तरंग के साथ सीखें"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {lang === "en" ? "Simple guides for safer fishing." : "सुरक्षित मछली पकड़ने के लिए सरल मार्गदर्शिका।"}
            </p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 shrink-0 ml-2">
            <button 
              onClick={() => setLang("en")} 
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white shadow-sm text-ocean-700' : 'text-slate-500'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang("hi")} 
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'hi' ? 'bg-white shadow-sm text-ocean-700' : 'text-slate-500'}`}
            >
              हिंदी
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {trainingLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              onClick={() => navigate(`/training/${lesson.id}?lang=${lang}`)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-ocean-300 cursor-pointer transition-colors flex gap-4 items-center"
            >
              <div className="w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center shrink-0">
                 <BookOpen className="w-5 h-5 text-ocean-600" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-ocean-600 uppercase tracking-widest mb-1 block">
                  {lang === 'en' ? `Lesson ${lesson.order}` : `पाठ ${lesson.order}`}
                </span>
                <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug mb-1">
                  {lesson.title[lang]}
                </h3>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="line-clamp-1">{lesson.description[lang]}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center shrink-0">
                    <Clock className="w-3 h-3 mr-1" /> {lesson.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
