import { useState, useEffect, useRef } from "react";
import { Mic, Send, Edit2, Info, Map as MapIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ChatBubble } from "../components/ui/ChatBubble";
import { AnalysisLoader, type AnalysisType } from "../components/ui/AnalysisLoader";
import { detectIntent } from "../services/intentService";
import { generateResponse } from "../services/demoResponseService";
import { detectLanguage } from "../services/languageService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfile } from "../store/profile";

type Message = {
  id: number;
  text: string | React.ReactNode;
  isBot: boolean;
  action: string | null;
  component?: React.ReactNode;
};

export function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Namaskaram! I am TARANG. How can I help you with your fishing trip today?", 
      isBot: true, 
      action: null 
    }
  ]);
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<{ active: boolean; type: AnalysisType | null; duration: number }>({ active: false, type: null, duration: 0 });
  const initProcessed = useRef(false);

  useEffect(() => {
    const flow = searchParams.get("flow");
    const q = searchParams.get("q");

    if (!initProcessed.current) {
      if (flow === "demo") {
        initProcessed.current = true;
        setTimeout(() => {
          handleUserMessage("I want to plan a 3-day fishing trip starting tomorrow.");
        }, 600);
      } else if (q) {
        initProcessed.current = true;
        setTimeout(() => {
          handleUserMessage(q);
        }, 600);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, analysis.active]);

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, isBot: false, action: null }]);
    setInput("");
    
    if (text === "I want to plan a 3-day fishing trip starting tomorrow.") {
      triggerDemoConfirmation();
      return;
    }

    const qLower = text.toLowerCase();
    let type: AnalysisType = "general";
    let duration = 4500;

    if (qLower.includes("3-day") || qLower.includes("trip")) {
       type = "trip"; duration = 7000;
    } else if (qLower.includes("route")) {
       type = "route"; duration = 9000;
    } else if (qLower.includes("safe")) {
       type = "safety"; duration = 5000;
    } else if (qLower.includes("pfz") || qLower.includes("zone")) {
       type = "pfz"; duration = 6000;
    } else if (qLower.includes("weather") || qLower.includes("wind") || qLower.includes("wave") || qLower.includes("cyclone")) {
       type = "weather"; duration = 5000;
    } else {
       duration = 4000 + Math.random() * 1000;
    }

    setAnalysis({ active: true, type, duration });

    setTimeout(() => {
      const lang = detectLanguage(text);
      const intent = detectIntent(text);
      const response = generateResponse(intent, profile.location, lang);
      
      let component = undefined;
      if (response.action?.startsWith("VIEW_MAP")) {
        let mode = "explore";
        if (response.action === "VIEW_MAP_FISHING") mode = "fishing";
        else if (response.action === "VIEW_MAP_RISK") mode = "risk";
        else if (response.action === "VIEW_MAP_RESTRICTED") mode = "restricted";
        
        component = (
          <div className="mt-3">
             <Button className="w-full shadow-md" onClick={() => navigate(`/map?mode=${mode}`)}>
               View on Map <MapIcon className="w-4 h-4 ml-2" />
             </Button>
          </div>
        );
      } else if (response.action === "VIEW_ROUTE") {
        component = (
          <div className="mt-3">
             <Button className="w-full shadow-md" onClick={() => navigate("/map?mode=route")}>
               View Safe Route <MapIcon className="w-4 h-4 ml-2" />
             </Button>
          </div>
        );
      } else if (response.action === "DEMO_CONFIRM") {
        setAnalysis({ active: false, type: null, duration: 0 });
        triggerDemoConfirmation();
        return;
      }

      // Text-only bot message — no audioText, no AudioPlayer
      setMessages(prev => [...prev, { 
        id: Date.now() + Math.random(), 
        text: response.answerComponent,
        isBot: true,
        action: response.action || null,
        component
      }]);
      setAnalysis({ active: false, type: null, duration: 0 });
    }, duration);
  };

  const triggerDemoConfirmation = () => {
    setAnalysis({ active: true, type: "general", duration: 3000 });
    setTimeout(() => {
      setAnalysis({ active: false, type: null, duration: 0 });
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        isBot: true,
        action: "demo_confirm",
        text: "Sure. Before I analyse the trip, please confirm your details:",
        component: (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
              <div><span className="text-slate-400 block text-xs uppercase mb-1">Location</span><span className="font-semibold text-slate-900">{profile.location}</span></div>
              <div><span className="text-slate-400 block text-xs uppercase mb-1">Boat Type</span><span className="font-semibold text-slate-900">{profile.vesselType}</span></div>
              <div><span className="text-slate-400 block text-xs uppercase mb-1">Duration</span><span className="font-semibold text-slate-900">3 days</span></div>
              <div><span className="text-slate-400 block text-xs uppercase mb-1">Start Time</span><span className="font-semibold text-slate-900">Tomorrow, 6:00 AM</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <Button className="flex-1" onClick={startDemoAnalysis}>
                Yes, Analyse Trip
              </Button>
              <Button variant="outline" className="flex-1">
                <Edit2 className="w-3 h-3 mr-2" /> Edit Details
              </Button>
            </div>
          </div>
        )
      }]);
    }, 3000);
  };

  const startDemoAnalysis = () => {
    setMessages(prev => {
      const newMessages = [...prev];
      const last = newMessages[newMessages.length - 1];
      if (last.action === "demo_confirm") {
        last.component = (
           <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-3 space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-slate-400"/> Confirmed {profile.location}, 3 days</div>
           </div>
        );
      }
      return newMessages;
    });

    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text: "Yes, Analyse Trip", isBot: false, action: null }]);
    setAnalysis({ active: true, type: "trip", duration: 8000 });
    
    setTimeout(() => {
       setAnalysis({ active: false, type: null, duration: 0 });
       navigate("/trip-results");
    }, 8000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className="w-full max-w-3xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChatBubble 
              text={
                <div className="flex flex-col gap-3">
                  {msg.text}
                  {msg.component}
                </div>
              } 
              isBot={msg.isBot} 
            />
          </div>
        ))}
        {analysis.active && analysis.type && (
           <AnalysisLoader type={analysis.type} duration={analysis.duration} />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0 pb-safe shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <button aria-label="Voice input" className="shrink-0 flex items-center justify-center rounded-full h-12 w-12 border border-slate-200 bg-slate-50 text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500">
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUserMessage(input)}
              placeholder="Ask TARANG about your trip..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500/20 transition-all"
            />
            <button aria-label="Send message" onClick={() => handleUserMessage(input)} className="shrink-0 flex items-center justify-center rounded-full h-12 w-12 bg-ocean-600 text-white hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
