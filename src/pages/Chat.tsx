import { useState, useEffect, useRef } from "react";
import { Mic, Send, Edit2, Info, Map as MapIcon, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ChatBubble } from "../components/ui/ChatBubble";
import { AnalysisLoader, type AnalysisType } from "../components/ui/AnalysisLoader";
import { detectIntent } from "../services/intentService";
import { generateResponse } from "../services/demoResponseService";
import { detectLanguage } from "../services/languageService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfile } from "../store/profile";
import { useChatStore, type Message } from "../store/chatStore";

export function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  
  const { messages, addMessage, updateLastMessageAction, clearChat } = useChatStore();

  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<{ active: boolean; type: AnalysisType | null; duration: number }>({ active: false, type: null, duration: 0 });
  
  // Use a ref to track if we are currently processing a flow/query to prevent strict mode double firing
  const isProcessingUrlParams = useRef(false);

  useEffect(() => {
    const flow = searchParams.get("flow");
    const q = searchParams.get("q");

    if (!isProcessingUrlParams.current && (flow || q)) {
      isProcessingUrlParams.current = true;
      
      // Clear search params immediately to prevent re-triggering on navigation
      setSearchParams({}, { replace: true });
      
      if (flow === "demo") {
        setTimeout(() => {
          handleUserMessage("I want to plan a 3-day fishing trip starting tomorrow.");
          isProcessingUrlParams.current = false;
        }, 600);
      } else if (q) {
        setTimeout(() => {
          handleUserMessage(q);
          isProcessingUrlParams.current = false;
        }, 600);
      }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, analysis.active]);

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage({ text, isBot: false, action: null, intent: null });
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
      
      if (response.action === "DEMO_CONFIRM") {
        setAnalysis({ active: false, type: null, duration: 0 });
        triggerDemoConfirmation();
        return;
      }

      // Add text-only bot message
      addMessage({ 
        text: response.text,
        isBot: true,
        action: response.action || null,
        intent: response.intent || null
      });
      setAnalysis({ active: false, type: null, duration: 0 });
    }, duration);
  };

  const triggerDemoConfirmation = () => {
    setAnalysis({ active: true, type: "general", duration: 3000 });
    setTimeout(() => {
      setAnalysis({ active: false, type: null, duration: 0 });
      addMessage({
        isBot: true,
        action: "demo_confirm",
        text: "Sure. Before I analyse the trip, please confirm your details:",
        intent: null
      });
    }, 3000);
  };

  const startDemoAnalysis = () => {
    // Change the last message's action so it renders the "confirmed" state instead of the buttons
    updateLastMessageAction("demo_confirm_done");
    
    addMessage({ text: "Yes, Analyse Trip", isBot: false, action: null, intent: null });
    setAnalysis({ active: true, type: "trip", duration: 8000 });
    
    setTimeout(() => {
       setAnalysis({ active: false, type: null, duration: 0 });
       navigate("/trip-results");
    }, 8000);
  };
  
  const handleFreshChat = () => {
    if (window.confirm("Start a new chat? This will clear the current conversation.")) {
      clearChat();
      setAnalysis({ active: false, type: null, duration: 0 });
    }
  };

  // Dynamically render components based on the stored action and intent
  const renderDynamicComponent = (msg: Message) => {
    let elements = [];
    
    // Render English-only intent cards
    if (profile.language === "en") {
      if (msg.intent === "SAFE_ROUTE") {
        elements.push(
          <div key="safe-route" className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Safe Route Recommendation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">From</span><span className="font-semibold text-slate-800">{profile.location} Harbour</span></div>
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">To</span><span className="font-semibold text-slate-800">Recommended Fishing Zone</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Distance</span><span className="font-semibold text-slate-800">18.4 km</span></div>
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Est. Travel Time</span><span className="font-semibold text-slate-800">1h 12m</span></div>
            </div>
            <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Route Risk</span><span className="inline-flex items-center text-sm font-bold text-status-safe">Low</span></div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="block text-xs font-bold text-slate-400 uppercase mb-1">Recommendation</span><span className="text-sm text-slate-700">This route avoids the higher-risk areas identified along the surrounding sea grid and provides the lowest-risk path to the recommended fishing zone.</span></div>
          </div>
        );
      } else if (msg.intent === "NEAREST_PFZ" || msg.intent === "BEST_FISHING_ZONE") {
        elements.push(
          <div key="pfz" className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Nearest Recommended Fishing Zone</h4>
            <div><span className="font-semibold text-slate-800 text-lg">Zone A</span><span className="block text-sm text-slate-500">Approximately 18 km from {profile.location} Harbour</span></div>
            <div><span className="block text-xs font-bold text-slate-400 uppercase mb-1">Risk Assessment</span><span className="font-bold text-status-safe">28/100 · Low Risk</span></div>
            <div><span className="block text-xs font-bold text-slate-400 uppercase mb-1">Current Conditions</span><span className="text-sm text-slate-700">Sea conditions are relatively calm and wind is moderate. No major weather warning is affecting the recommended area.</span></div>
            <div><span className="block text-xs font-bold text-slate-400 uppercase mb-1">Fishing Potential</span><span className="text-sm font-bold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded">High</span></div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2"><span className="block text-xs font-bold text-slate-400 uppercase mb-1">Why this zone?</span><span className="text-sm text-slate-700">It provides a good balance between current safety conditions and fishing potential for your selected boat type.</span></div>
          </div>
        );
      } else if (msg.intent === "SAFETY_TOMORROW") {
        elements.push(
          <div key="safety" className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 border-b border-ocean-100 pb-2">Safety Analysis</h4>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Location</span><span className="font-semibold text-slate-800">{profile.location} Coast</span></div>
              <div><span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">Risk Score</span><span className="font-bold text-status-safe">Low Risk</span></div>
            </div>
            <div className="bg-status-safeBg border border-status-safe/20 p-3 rounded-lg"><span className="block text-xs font-bold text-status-safeText uppercase mb-1">Recommendation</span><span className="text-sm text-slate-700">Current conditions are favourable for your boat type, with relatively calm sea conditions and moderate wind. It is safe to proceed.</span></div>
          </div>
        );
      }
    }
    
    // Render action buttons
    if (msg.action) {
      if (msg.action.startsWith("VIEW_MAP")) {
        let mode = "explore";
        if (msg.action === "VIEW_MAP_FISHING") mode = "fishing";
        else if (msg.action === "VIEW_MAP_RISK") mode = "risk";
        else if (msg.action === "VIEW_MAP_RESTRICTED") mode = "restricted";
        
        elements.push(
          <div key="map-btn" className="mt-3">
             <Button className="w-full shadow-md" onClick={() => navigate(`/map?mode=${mode}`)}>
               View on Map <MapIcon className="w-4 h-4 ml-2" />
             </Button>
          </div>
        );
      } else if (msg.action === "VIEW_ROUTE") {
        elements.push(
          <div key="route-btn" className="mt-3">
             <Button className="w-full shadow-md" onClick={() => navigate("/map?mode=route")}>
               View Safe Route <MapIcon className="w-4 h-4 ml-2" />
             </Button>
          </div>
        );
      } else if (msg.action === "demo_confirm") {
        elements.push(
          <div key="demo-confirm" className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-4 text-left">
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
        );
      } else if (msg.action === "demo_confirm_done") {
        elements.push(
           <div key="demo-done" className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-3 space-y-2 text-sm text-slate-500 text-left">
            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-slate-400"/> Confirmed {profile.location}, 3 days</div>
           </div>
        );
      }
    }
    
    return elements.length > 0 ? <>{elements}</> : null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-slate-50 relative">
      {/* Header for Fresh Chat */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 px-4 py-2 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleFreshChat} className="bg-white text-xs font-semibold shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Fresh Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 pt-14">
        {messages.map((msg) => (
          <div key={msg.id} className="w-full max-w-3xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChatBubble 
              text={
                <div className="flex flex-col gap-3">
                  {msg.text}
                  {renderDynamicComponent(msg)}
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

      <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02)] z-20">
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
