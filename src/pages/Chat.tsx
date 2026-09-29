import { useState, useEffect, useRef } from "react";
import { type IntentCategory } from "../data/questionBank";
import { Send, Edit2, Info, Map as MapIcon, RefreshCw, MapPin, Plus, Microscope, Cpu, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ChatBubble } from "../components/ui/ChatBubble";
import { AnalysisLoader, type AnalysisType } from "../components/ui/AnalysisLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfile } from "../store/profile";
import { useChatStore, type Message } from "../store/chatStore";
import { resolveFishermanContext, resolveFollowUpContext, hasExplicitLocationInQuery, isVesselOnlyChange, extractLocationsFromQuery, type ResolvedContext } from "../services/contextResolver";
import { evaluateFishermanContext, type DecisionResult } from "../services/decisionEngine";
import { detectIntent } from "../services/intentService";
import { formatNormalResponse } from "../services/normalResponseFormatter";
import { formatResearchResponse } from "../services/researchResponseFormatter";
import { formatAlertResponse } from "../services/alertResponseFormatter";
import { formatComparisonResponse } from "../services/comparisonFormatter";
import { useAppStore } from "../store/appStore";
import { ResearchCard } from "../components/ui/ResearchCard";
import { DigitalTwinUI } from "../components/ui/DigitalTwinUI";
import { AlertUI } from "../components/ui/AlertUI";
import { getConversationContext, commitConversationContext, resetConversationContext, setPendingLocationCheck } from "../store/conversationContext";
import { useTwinStore } from "../store/scenarioStore";
import { getLocationEnvironment } from "../data/environmentResolver";
import { locationData as oldLocationData } from "../data/demoData";
import { MapComponent } from "../components/map/MapComponent";
import { getLocationCoordinates } from "../services/contextResolver";
import { findDemoScenario, DEMO_SCENARIOS } from "../data/demoFishermanDataset";
import { findDemoResearcherScenario } from "../data/demoResearcherDataset";
import { findDemoAlertScenario } from "../data/demoAlertDataset";
import { findDemoDigitalTwinScenario } from "../data/demoDigitalTwinDataset";
import { FormattedMessage } from "../components/ui/FormattedMessage";
import { ResearcherVisualizations } from "../components/ui/ResearcherVisualizations";
import { AlertVisualizations } from "../components/ui/AlertVisualizations";
import { DigitalTwinVisualizations } from "../components/ui/DigitalTwinVisualizations";

export function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  
  const { messages, addMessage, updateLastMessageAction, clearChat } = useChatStore();
  const { activeMode, setActiveMode } = useAppStore();
  const { twinState, setTwinState } = useTwinStore();
  
  const [latestDecision, setLatestDecision] = useState<{decision: DecisionResult | null, context: ResolvedContext | null}>({ decision: null, context: null });

  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<{ active: boolean; type: AnalysisType | null; duration: number }>({ active: false, type: null, duration: 0 });
  const [editContext, setEditContext] = useState<{ active: boolean; context: ResolvedContext | null }>({ active: false, context: null });
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [activeMapLocation, setActiveMapLocation] = useState<{ coords: [number, number], name: string } | null>(null);
  
  // Use a ref to track if we are currently processing a flow/query to prevent strict mode double firing
  const isProcessingUrlParams = useRef(false);
  const isProcessingMessageRef = useRef(false);

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

  useEffect(() => {
    // Reset transient state when mode switches so responses/states do not leak across modes
    setAnalysis({ active: false, type: null, duration: 0 });
    setActiveMapLocation(null);
    isProcessingMessageRef.current = false;
  }, [activeMode]);

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;
    if (analysis.active || isProcessingMessageRef.current) return; // Prevent duplicate submissions
    
    isProcessingMessageRef.current = true;
    
    // Add user message
    addMessage({ text, isBot: false, action: null, intent: null });
    setInput("");
    
    if (text === "I want to plan a 3-day fishing trip starting tomorrow.") {
      triggerDemoConfirmation();
      isProcessingMessageRef.current = false;
      return;
    }

    const qLower = text.toLowerCase();

    // ── STRICT MODE ROUTING ─────────────────────────────────────────────
    if (activeMode === "Research") {
      const demoResearcherScenario = findDemoResearcherScenario(text);
      if (demoResearcherScenario) {
        setAnalysis({ active: true, type: "research", duration: 2400 });
        setTimeout(() => {
          setAnalysis({ active: false, type: null, duration: 0 });
          isProcessingMessageRef.current = false;
          
          addMessage({
            text: demoResearcherScenario.summaryMarkdown,
            isBot: true,
            action: "DEMO_RESEARCHER_RESULT",
            intent: null,
            payload: demoResearcherScenario
          });
        }, 2400);
        return;
      }

      // Dynamic Location Extraction for Comparison Queries in Research Mode
      const isComparisonQuery = qLower.includes("compare") || qLower.includes(" vs ") || qLower.includes("versus") || qLower.includes("difference");
      if (isComparisonQuery) {
        const detectedLocs = extractLocationsFromQuery(text);
        setAnalysis({ active: true, type: "research", duration: 2400 });
        setTimeout(() => {
          setAnalysis({ active: false, type: null, duration: 0 });
          isProcessingMessageRef.current = false;

          if (detectedLocs.length >= 2) {
            const loc1 = detectedLocs[0];
            const loc2 = detectedLocs[1];
            const title = `${loc1.name.split(' ')[0]} vs ${loc2.name.split(' ')[0]} — Marine Condition Comparison`;
            
            const dynamicScenario = {
              id: 99,
              matches: () => true,
              title,
              queryPattern: text,
              tableData: [
                { factor: "Wave Height", val1: loc1.waveHeight || "1.4 m", val2: loc2.waveHeight || "1.2 m" },
                { factor: "Wind Speed", val1: loc1.windSpeed || "15 km/h", val2: loc2.windSpeed || "14 km/h" },
                { factor: "SST", val1: loc1.sst || "28.5°C", val2: loc2.sst || "29.0°C" },
                { factor: "Risk Score", val1: `${loc1.riskScore || 30}/100`, val2: `${loc2.riskScore || 25}/100` }
              ],
              interpretation: `${loc1.name} and ${loc2.name} show distinct marine profiles. ${loc1.name} has ${loc1.waveHeight || "1.4m"} wave height and ${loc1.riskBand || "SAFE"} risk level (${loc1.riskScore || 30}/100), while ${loc2.name} exhibits ${loc2.waveHeight || "1.2m"} wave height and ${loc2.riskBand || "SAFE"} risk level (${loc2.riskScore || 25}/100). Both locations offer valuable insights for research and decision making.`,
              summaryMarkdown: `**${title}**\n\nSide-by-side marine condition analysis for **${loc1.name}** and **${loc2.name}**.`,
              visualizationType: 'SIDE_BY_SIDE' as const,
              customPayload: {
                locations: [loc1, loc2]
              }
            };

            addMessage({
              text: dynamicScenario.summaryMarkdown,
              isBot: true,
              action: "DEMO_RESEARCHER_RESULT",
              intent: null,
              payload: dynamicScenario
            });
          } else if (detectedLocs.length === 1) {
            addMessage({
              text: `I detected **${detectedLocs[0].name}**. Please specify the second port or location you would like to compare for marine conditions.`,
              isBot: true,
              action: null,
              intent: null
            });
          } else {
            addMessage({
              text: "Which two ports or locations would you like to compare for marine conditions?",
              isBot: true,
              action: null,
              intent: null
            });
          }
        }, 2400);
        return;
      }
    } else if (activeMode === "Alert") {
      const demoAlertScenario = findDemoAlertScenario(text);
      if (demoAlertScenario) {
        setAnalysis({ active: true, type: "alert", duration: 2400 });
        setTimeout(() => {
          setAnalysis({ active: false, type: null, duration: 0 });
          isProcessingMessageRef.current = false;
          
          addMessage({
            text: `${demoAlertScenario.warningHeader}\n\n**Primary Hazard:** ${demoAlertScenario.primaryHazard}`,
            isBot: true,
            action: "DEMO_ALERT_RESULT",
            intent: null,
            payload: demoAlertScenario
          });
        }, 2400);
        return;
      }
    } else if (activeMode === "Digital_Twin") {
      const demoDigitalTwinScenario = findDemoDigitalTwinScenario(text);
      if (demoDigitalTwinScenario) {
        setAnalysis({ active: true, type: "digital_twin", duration: 2400 });
        setTimeout(() => {
          setAnalysis({ active: false, type: null, duration: 0 });
          isProcessingMessageRef.current = false;
          
          addMessage({
            text: `**Digital Twin Simulation:** ${demoDigitalTwinScenario.title}`,
            isBot: true,
            action: "DEMO_DIGITAL_TWIN_RESULT",
            intent: null,
            payload: demoDigitalTwinScenario
          });
        }, 2400);
        return;
      }
    } else if (activeMode === "Normal") {
      // Fisherman / Default Mode
      const demoScenario = findDemoScenario(text);
      if (demoScenario) {
        let scType: AnalysisType = "safety";
        if (demoScenario.id === 5 || demoScenario.id === 6 || demoScenario.id === 12) scType = "pfz";
        else if (demoScenario.id === 9 || demoScenario.id === 10 || demoScenario.id === 13) scType = "route";

        setAnalysis({ active: true, type: scType, duration: 2400 });
        setTimeout(() => {
          setAnalysis({ active: false, type: null, duration: 0 });
          isProcessingMessageRef.current = false;

          if (demoScenario.requiresPortSelection && demoScenario.ports) {
            const isHindiQuery = /[\u0900-\u097F]/.test(demoScenario.title || text);
            addMessage({
              text: isHindiQuery
                ? `आप किस बंदरगाह से जाना चाहते हैं? कृपया नीचे दिए गए बंदरगाहों में से चुनें:`
                : `Please select the port or harbour you are departing from:`,
              isBot: true,
              action: "DEMO_PORT_SELECT",
              intent: null,
              payload: { scenarioId: demoScenario.id, ports: demoScenario.ports }
            });
          } else if (demoScenario.requiresConfirmation) {
            const isHindiQuery = /[\u0900-\u097F]/.test(demoScenario.title || text);
            addMessage({
              text: demoScenario.confirmPrompt || (isHindiQuery ? "कृपया विवरण की पुष्टि करें:" : "Please confirm details:"),
              isBot: true,
              action: demoScenario.id === 12 ? "DEMO_CONFIRM_LOCATION_HI" : "DEMO_CONFIRM_TRIP_HI",
              intent: null,
              payload: { scenarioId: demoScenario.id }
            });
          } else {
            const resp = demoScenario.getResponse();
            addMessage({
              text: resp.summary,
              isBot: true,
              action: "DEMO_RESULT",
              intent: null,
              payload: resp
            });
            const dummyCtx: ResolvedContext = {
              locationId: "demo-loc",
              locationName: resp.mapName || "Selected Harbour",
              dateTime: new Date(),
              timeDescription: "tomorrow evening",
              boatType: profile.vesselType || "motorized",
              inferred: { location: false, dateTime: true, boatType: true },
              originalQuery: text
            };
            commitConversationContext({
              query: text,
              intent: demoScenario.id === 3 ? "WAVE_HEIGHT" : demoScenario.id === 4 ? "WIND_FORECAST" : demoScenario.id === 5 || demoScenario.id === 6 || demoScenario.id === 12 ? "NEAREST_PFZ" : demoScenario.id === 7 ? "SST_CONDITIONS" : demoScenario.id === 9 ? "SAFE_ROUTE" : demoScenario.id === 10 || demoScenario.id === 13 ? "TRIP_PLANNING" : "SAFETY_TOMORROW",
              resolvedContext: dummyCtx,
              decision: {} as any
            });
          }
        }, 2400);
        return;
      }
    }

    let type: AnalysisType = "general";
    
    if (activeMode === "Research") {
      type = "research";
    } else if (activeMode === "Alert") {
      type = "alert";
    } else if (activeMode === "Digital_Twin") {
      type = "digital_twin";
    } else if (qLower.includes("3-day") || qLower.includes("trip")) {
       type = "route";
    } else if (qLower.includes("route")) {
       type = "route";
    } else if (qLower.includes("safe")) {
       type = "safety";
    } else if (qLower.includes("pfz") || qLower.includes("zone")) {
       type = "pfz";
    } else if (qLower.includes("weather") || qLower.includes("wind") || qLower.includes("wave") || qLower.includes("cyclone")) {
       type = "safety";
    }

    const duration = 2400; // 2.4s rolling animation duration

    setAnalysis({ active: true, type, duration });

    setTimeout(() => {
      try {
        // 1. Check for follow-up context before standard resolution
        let currentText = text;
        const convCtx = getConversationContext();
        
        if (convCtx.pendingLocationCheck && convCtx.lastQuery) {
          currentText = `${convCtx.lastQuery} at ${text}`;
          setPendingLocationCheck(false);
        }
        
        const followUp = resolveFollowUpContext(currentText, convCtx, profile.vesselType);

        if (followUp.type === 'CLARIFICATION') {
          addMessage({ text: followUp.clarificationMessage, isBot: true, action: null, intent: null });
          return;
        }

        if (followUp.type === 'DISTANCE') {
          addMessage({
            text: `**${followUp.candidateName}** is approximately **${followUp.distanceKm.toFixed(1)} km** from your location.`,
            isBot: true, action: null, intent: null
          });
          return;
        }

        // 2. Standard resolution (fresh query or merged follow-up)
        let resolvedContext: ResolvedContext;
        let isCompoundOrdinal = false;
        let ordinalTargetName = "";
        let finalIntents: IntentCategory[] = [];
        let inheritedIntent: IntentCategory[] | null = null;

        if (followUp.type === 'RESOLVED') {
          resolvedContext = followUp.context;
        } else if (followUp.type === 'COMPARE_CANDIDATES') {
          const responseText = formatComparisonResponse(followUp.candidates, activeMode);
          addMessage({ text: responseText, isBot: true, action: null, intent: null });
          return;
        } else if (followUp.type === 'ORDINAL_CANDIDATE') {
          if (!followUp.isCompound) {
            // For ordinal references without context change: show the candidate details directly
            const c = followUp.candidate;
            const score = c.productivityEvaluation?.productivityScore;
            const band = c.productivityEvaluation?.productivityBand;
            addMessage({
              text: `**Option ${followUp.candidateIndex + 1}: ${c.facilityName}** — ${c.distanceKm.toFixed(1)} km away. Risk: **${c.riskBand}**${score != null ? `. Productivity: **${score}/100** (${band})` : ''}. ${c.suitability ?? ''}`,
              isBot: true, action: null, intent: null
            });
            // Skip commit because we did not evaluate
            return;
          }
          resolvedContext = followUp.context;
          isCompoundOrdinal = true;
          ordinalTargetName = followUp.candidate.facilityName;
        } else {
          // NOT_FOLLOW_UP: standard fresh resolution
          let intents = detectIntent(currentText, "English");
          if (intents.includes('UNKNOWN') && intents.length === 1) {
            const lastBotMsgWithIntent = [...messages].reverse().find(m => m.isBot && m.intent && m.intent !== 'UNKNOWN');
            if (lastBotMsgWithIntent && lastBotMsgWithIntent.intent) {
               intents = [lastBotMsgWithIntent.intent as IntentCategory];
               inheritedIntent = intents;
            } else if (!hasExplicitLocationInQuery(currentText) && !isVesselOnlyChange(currentText)) {
              addMessage({ text: "Could you please elaborate on your question a little more so I can help you accurately?", isBot: true, action: null, intent: null });
              return;
            }
          }
          finalIntents = intents;

          if (intents.includes('LOCATION_CHECK') && !hasExplicitLocationInQuery(currentText)) {
            setPendingLocationCheck(true, currentText, "LOCATION_CHECK");
            addMessage({ text: "Which location or port are you referring to?", isBot: true, action: null, intent: null });
            return;
          }

          resolvedContext = resolveFishermanContext({
            query: currentText,
            defaultLocationName: profile.location,
            defaultBoatType: profile.vesselType
          });
        }
        
        if (followUp.type !== 'NOT_FOLLOW_UP') {
          finalIntents = detectIntent(currentText, "English");
        }

        const isLocationCheck = finalIntents.includes("LOCATION_CHECK");
        
        addMessage({
          text: isLocationCheck ? "Please confirm the location you are asking about:" : "Sure! Let's confirm your details for this trip:",
          isBot: true,
          action: "context_confirm",
          intent: isLocationCheck ? "LOCATION_CHECK" : null,
          payload: { ...resolvedContext, __isCompoundOrdinal: isCompoundOrdinal, __ordinalTargetName: ordinalTargetName, __inheritedIntent: inheritedIntent }
        });
      } catch (error) {
        console.error("[CHAT] Context resolving error", error);
      } finally {
        setAnalysis({ active: false, type: null, duration: 0 });
        isProcessingMessageRef.current = false;
      }
    }, duration);
  };

  const handleConfirmContext = (rawCtx: ResolvedContext & { __isCompoundOrdinal?: boolean; __ordinalTargetName?: string, __inheritedIntent?: IntentCategory[] | null }, fallbackConsent = false, silent = false) => {
    const isCompoundOrdinal = rawCtx.__isCompoundOrdinal;
    const ordinalTargetName = rawCtx.__ordinalTargetName;
    const inheritedIntent = rawCtx.__inheritedIntent;
    const _ctx = { ...rawCtx };
    
    if (typeof _ctx.dateTime === 'string') {
      _ctx.dateTime = new Date(_ctx.dateTime);
    }
    
    delete (_ctx as any).__isCompoundOrdinal;
    delete (_ctx as any).__ordinalTargetName;
    delete (_ctx as any).__inheritedIntent;

    console.log("[CHAT] handleConfirmContext called", _ctx, fallbackConsent, silent);
    if (!silent) {
      if (!fallbackConsent) {
        updateLastMessageAction("context_confirm_done");
      } else {
        updateLastMessageAction("fallback_consent_done");
        addMessage({ text: "Yes, show me the options.", isBot: false, action: null, intent: null });
      }
    }
    
    // Evaluate risk using the new decision engine
    try {
      console.log("[CHAT] evaluating context");
      const decision = evaluateFishermanContext(
        _ctx.locationId, 
        _ctx.dateTime, 
        _ctx.boatType, 
        _ctx.originalQuery, 
        activeMode === "Digital_Twin" ? (twinState.modified || undefined) : undefined
      );
      
      // Update Digital Twin baseline if not in active simulation
      if (activeMode !== "Digital_Twin" || !twinState.baseline) {
        const currentMonth = _ctx.dateTime.getMonth();
        const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
        const baseline = getLocationEnvironment(_ctx.locationId, evalMonth);
        if (baseline) {
          setTwinState({ 
            baseline: baseline as any, 
            context: _ctx,
            active: activeMode === "Digital_Twin"
          });
        }
      }
      
      console.log("[CHAT] decision", decision);
      setLatestDecision({ decision, context: _ctx });
      
      let intents = detectIntent(_ctx.originalQuery, "English");
      if (inheritedIntent) {
        intents = inheritedIntent;
      }
      console.log("[CHAT] intents", intents);
      console.log("[CHAT] activeMode", activeMode);

      if (activeMode === "Research") {
        console.log("[CHAT] formatting research response");
        const researchResponse = formatResearchResponse(intents, _ctx, decision);
        addMessage({
          text: researchResponse.summary,
          isBot: true,
          action: "RESEARCH_RESULT",
          intent: intents[0],
          payload: researchResponse
        });
      } else if (activeMode === "Alert") {
        console.log("[CHAT] formatting alert response");
        const alertResponse = formatAlertResponse(intents, _ctx, decision, twinState.active && !!twinState.modified);
        addMessage({
          text: alertResponse,
          isBot: true,
          action: "DECISION_RESULT",
          intent: intents[0],
          payload: { decision, context: _ctx }
        });
      } else {
        if (isCompoundOrdinal) {
          const target = decision.marineRecommendations?.find(c => c.facilityName === ordinalTargetName);
          if (target) {
            const score = target.productivityEvaluation?.productivityScore;
            const band = target.productivityEvaluation?.productivityBand;
            addMessage({
              text: `For **${target.facilityName}** on ${resolvedContextToDateString(_ctx.dateTime)}, the risk is **${target.riskBand}**${score != null ? `. Productivity is **${score}/100** (${band})` : ''}.`,
              isBot: true, action: decision.requiresFallbackConsent ? "FALLBACK_CONSENT" : "DECISION_RESULT", intent: null,
              payload: decision.requiresFallbackConsent ? _ctx : decision
            });
          } else {
            addMessage({
              text: `I couldn't find updated information for **${ordinalTargetName}** under these new conditions. It might be outside safe operating limits or unavailable.`,
              isBot: true, action: "DECISION_RESULT", intent: null, payload: decision
            });
          }
        } else {
          console.log("[CHAT] formatting normal response");
          const responseText = formatNormalResponse(intents, _ctx, decision);
          
          let actionToSet: string | null = null;
          const ctxState = getConversationContext();
          const lastContext = ctxState.lastResolvedContext;
          const shouldConfirm = _ctx.inferred.location && (!lastContext || lastContext.locationName !== _ctx.locationName);
          
          if (shouldConfirm) {
            actionToSet = "context_confirm";
          } else {
            const isExplicitRec = intents.some(i => ['BEST_FISHING_ZONE', 'NEAREST_PFZ', 'CHLOROPHYLL_ZONE', 'TRIP_PLANNING'].includes(i));
            if (isExplicitRec) {
              actionToSet = "DECISION_RESULT"; // Triggers recommendations UI
            }
          }

          addMessage({ 
            text: responseText, 
            isBot: true, 
            action: actionToSet, 
            intent: null,
            payload: shouldConfirm ? _ctx : decision
          });
        }
      }

      // Commit successful context for conversation continuity
      commitConversationContext({ query: _ctx.originalQuery, intent: intents[0] || 'UNKNOWN', resolvedContext: _ctx, decision, preserveCandidateList: isCompoundOrdinal });

    } catch (error) {
      console.error("[CHAT] RESPONSE PIPELINE ERROR", error);
    } finally {
      console.log("[CHAT] loading false");
      setAnalysis({ active: false, type: null, duration: 0 });
    }
  };

  const handleSelectDemoPort = (scenarioId: number, portName: string) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      const isHindi = scenario.id === 11 || /[\u0900-\u097F]/.test(scenario.title);
      updateLastMessageAction("DEMO_PORT_SELECT_DONE");
      addMessage({ text: isHindi ? `चयनित बंदरगाह: ${portName}` : `Selected Port: ${portName}`, isBot: false, action: null, intent: null });
      
      const resp = scenario.getResponse(portName, profile.vesselType);
      addMessage({
        text: resp.summary,
        isBot: true,
        action: "DEMO_RESULT",
        intent: null,
        payload: resp
      });

      const dummyCtx: ResolvedContext = {
        locationId: "demo-loc",
        locationName: portName,
        dateTime: new Date(),
        timeDescription: "tomorrow evening",
        boatType: profile.vesselType || "motorized",
        inferred: { location: false, dateTime: true, boatType: true },
        originalQuery: scenario.title
      };
      commitConversationContext({
        query: scenario.title,
        intent: scenario.id === 3 ? "WAVE_HEIGHT" : scenario.id === 4 ? "WIND_FORECAST" : scenario.id === 7 ? "SST_CONDITIONS" : "SAFETY_TOMORROW",
        resolvedContext: dummyCtx,
        decision: {} as any
      });
    }
  };

  const handleConfirmDemoScenario = (scenarioId: number) => {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      if (scenarioId === 12) {
        updateLastMessageAction("DEMO_CONFIRM_LOCATION_HI_DONE");
        addMessage({ text: "स्थान की पुष्टि की गई: थोपमपडी / कोच्चि क्षेत्र", isBot: false, action: null, intent: null });
      } else if (scenarioId === 13) {
        updateLastMessageAction("DEMO_CONFIRM_TRIP_HI_DONE");
        addMessage({ text: "यात्रा विवरण की पुष्टि की गई: कोच्चि से 3-दिवसीय यात्रा", isBot: false, action: null, intent: null });
      }
      
      const resp = scenario.getResponse();
      addMessage({
        text: resp.summary,
        isBot: true,
        action: "DEMO_RESULT",
        intent: null,
        payload: resp
      });

      const dummyCtx: ResolvedContext = {
        locationId: "demo-loc-hi",
        locationName: resp.mapName || "Kochi",
        dateTime: new Date(),
        timeDescription: "tomorrow",
        boatType: profile.vesselType || "motorized",
        inferred: { location: false, dateTime: true, boatType: true },
        originalQuery: scenario.title
      };
      commitConversationContext({
        query: scenario.title,
        intent: scenarioId === 12 ? "NEAREST_PFZ" : "TRIP_PLANNING",
        resolvedContext: dummyCtx,
        decision: {} as any
      });
    }
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
      resetConversationContext(); // also clear conversation memory
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
      } else if (msg.action === "context_confirm") {
        const ctx: ResolvedContext = msg.payload;
        const isLocCheck = msg.intent === "LOCATION_CHECK";
        
        elements.push(
          <div key="context-confirm" className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-4 text-left">
            {isLocCheck ? (
              <div className="text-sm text-slate-700">
                You are asking about: <span className="font-semibold text-slate-900">{ctx.locationName}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
                <div><span className="text-slate-400 block text-xs uppercase mb-1">Location</span><span className="font-semibold text-slate-900">{ctx.locationName}</span></div>
                <div><span className="text-slate-400 block text-xs uppercase mb-1">Boat Type</span><span className="font-semibold text-slate-900 capitalize">{ctx.boatType.replace('_', ' ')}</span></div>
                <div><span className="text-slate-400 block text-xs uppercase mb-1">Time</span><span className="font-semibold text-slate-900 capitalize">{ctx.timeDescription}</span></div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <Button className="flex-1" onClick={() => handleConfirmContext(ctx)}>
                Apply & Proceed
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setEditContext({ active: true, context: ctx })}>
                <Edit2 className="w-3 h-3 mr-2" /> Edit Details
              </Button>
            </div>
          </div>
        );
      } else if (msg.action === "context_confirm_done") {
        elements.push(
           <div key="context-done" className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-3 space-y-2 text-sm text-slate-500 text-left">
            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-slate-400"/> Context Confirmed</div>
           </div>
        );
      } else if (msg.action === "FALLBACK_CONSENT") {
        const ctx: ResolvedContext = msg.payload;
        elements.push(
          <div key="fallback-consent" className="mt-3 flex gap-2">
            <Button className="flex-1 shadow-sm" onClick={() => handleConfirmContext(ctx, true)}>
              Yes, show me the options
            </Button>
          </div>
        );
      } else if (msg.action === "fallback_consent_done") {
        elements.push(
           <div key="fallback-done" className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-3 space-y-2 text-sm text-slate-500 text-left">
            <div className="flex items-center gap-2"><Info className="w-4 h-4 text-slate-400"/> Searching nearby locations...</div>
           </div>
        );
      }
      
      let ctx: ResolvedContext | undefined;
      if (msg.payload && (msg.payload as any).context) {
        ctx = (msg.payload as any).context;
      }
      
      if (msg.intent === "TRIP_PLANNING" && ctx) {
        const coords = getLocationCoordinates(ctx.locationId);
        if (coords) {
          const zones: any[] = [
            { id: "inland-1", center: [coords[0] + 0.05, coords[1] - 0.05], radius: 3000, type: "inland", label: "Inland Area" },
            { id: "restricted-1", center: [coords[0] - 0.02, coords[1] - 0.02], radius: 1500, type: "restricted", label: "Restricted Area" },
            { id: "pfz-1", center: [coords[0] - 0.06, coords[1] + 0.06], radius: 4000, type: "fishing", label: "Recommended PFZ" },
          ];
          elements.push(
            <div key="trip-map" className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm h-64 bg-white relative">
              <MapComponent center={coords} zoom={11} zones={zones} />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold flex flex-col gap-1 z-10">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Inland</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Restricted</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Fishing Zone</div>
              </div>
            </div>
          );
        }
      }
      
      if (msg.action === "DECISION_RESULT" && msg.payload) {
        const decision = (msg.payload as any).decision || msg.payload as DecisionResult;
        const isMarine = !!decision.marineRecommendations;
        const recs = isMarine ? decision.marineRecommendations : decision.inlandRecommendations;
        
        if (recs && recs.length > 0) {
          elements.push(
            <div key="decision-recommendations" className="space-y-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2">
                {isMarine ? "Marine Destinations" : "Inland Destinations"}
              </h4>
              <div className="flex flex-col gap-3">
                {recs.map((rec: any, idx: number) => {
                  const name = isMarine ? rec.facilityName : rec.spotName;
                  const dist = rec.distanceKm.toFixed(1);
                  const isSafe = rec.riskBand === 'SAFE';
                  const isCaution = rec.riskBand === 'CAUTION';
                  
                  const riskScoreRound = rec.riskScore != null ? Math.round(rec.riskScore) : 'N/A';
                  const prodScoreRound = isMarine && rec.productivityEvaluation ? Math.round(rec.productivityEvaluation.productivityScore) : null;
                  
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-4 w-full"
                      data-productivity-score={isMarine ? rec.productivityEvaluation?.productivityScore : undefined}
                      data-productivity-band={isMarine ? rec.productivityEvaluation?.productivityBand : undefined}
                      data-productivity-factors={isMarine ? JSON.stringify(rec.productivityEvaluation?.factors) : undefined}
                    >
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="w-10 h-10 rounded-full bg-ocean-50 border border-ocean-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-ocean-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 text-base leading-tight truncate">
                            {idx + 1}. {name}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5 truncate">
                            Distance: {dist} km
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">Risk</span>
                          <div className="flex items-center text-sm truncate ml-2">
                            <span className="font-bold text-slate-800">{riskScoreRound}/100</span>
                            <span className={`ml-1.5 font-bold ${isSafe ? 'text-status-safeText' : isCaution ? 'text-status-cautionText' : 'text-status-dangerText'}`}>
                              &bull; {rec.riskBand}
                            </span>
                          </div>
                        </div>
                        {isMarine && rec.productivityEvaluation && (
                          <div className="flex justify-between items-center bg-ocean-50/30 p-3 rounded-lg border border-ocean-100">
                            <span className="text-xs font-bold text-ocean-700 uppercase tracking-wider shrink-0">Fishing Potential</span>
                            <div className="flex items-center text-sm truncate ml-2">
                              <span className="font-bold text-ocean-800">{prodScoreRound}/100</span>
                              <span className="ml-1.5 font-bold text-ocean-800">
                                &bull; {rec.productivityEvaluation.productivityBand}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-slate-700 leading-relaxed italic border-l-[3px] border-slate-200 pl-3">
                        "{rec.suitability}"
                      </div>

                      {(() => {
                        const mapCoords = (activeMapLocation && activeMapLocation.name === name) ? activeMapLocation.coords : null;
                        return mapCoords ? (
                          <div className="w-full h-48 border border-slate-200 rounded-lg overflow-hidden relative">
                            <MapComponent 
                              center={mapCoords} 
                              zoom={12} 
                              zones={[
                                { id: "rec", center: mapCoords, radius: 2000, type: "fishing", label: name }
                              ]} 
                            />
                          </div>
                        ) : null;
                      })()}

                      <Button 
                        size="default" 
                        variant="outline" 
                        className="w-full font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 mt-1 h-11"
                        onClick={() => setActiveMapLocation({ coords: [rec.latitude, rec.longitude], name })}
                      >
                        <MapIcon className="w-4 h-4 mr-2 text-slate-500" /> View on Map
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
      } else if (msg.action === "RESEARCH_RESULT" && msg.payload) {
        elements.push(<ResearchCard key="research-result" payload={msg.payload} />);
      } else if (msg.action === "DEMO_CONFIRM_LOCATION_HI" && msg.payload) {
        elements.push(
          <div key="demo-loc-hi" className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-3 text-left">
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">प्रस्थान स्थान</span><span className="font-semibold text-slate-900">थोपमपडी बंदरगाह, कोच्चि</span></div>
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">खोज दायरा</span><span className="font-semibold text-slate-900">3 नजदीकी क्षेत्र</span></div>
            </div>
            <Button className="w-full font-bold h-10 text-sm" onClick={() => handleConfirmDemoScenario(msg.payload.scenarioId)}>
              स्थान की पुष्टि करें और क्षेत्र दिखाएं
            </Button>
          </div>
        );
      } else if (msg.action === "DEMO_CONFIRM_LOCATION_HI_DONE") {
        elements.push(
          <div key="demo-loc-hi-done" className="bg-slate-50 rounded-xl border border-slate-200 p-3 mt-3 text-xs text-slate-500 text-left flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" /> स्थान की पुष्टि की गई: थोपमपडी बंदरगाह, कोच्चि
          </div>
        );
      } else if (msg.action === "DEMO_CONFIRM_TRIP_HI" && msg.payload) {
        elements.push(
          <div key="demo-trip-hi" className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-3 text-left">
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">प्रस्थान स्थान</span><span className="font-semibold text-slate-900">कोच्चि (थोपमपडी)</span></div>
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">गंतव्य</span><span className="font-semibold text-slate-900">लक्षद्वीप समुद्री क्षेत्र</span></div>
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">नाव का प्रकार</span><span className="font-semibold text-slate-900">मोटर चालित नाव</span></div>
              <div><span className="text-slate-400 block uppercase font-bold text-[10px]">जाने का समय</span><span className="font-semibold text-slate-900">कल सुबह 06:00 बजे</span></div>
              <div className="col-span-2 border-t border-slate-200 pt-2"><span className="text-slate-400 block uppercase font-bold text-[10px]">यात्रा की अवधि</span><span className="font-semibold text-slate-900">3 दिन (दिन-वार योजना)</span></div>
            </div>
            <Button className="w-full font-bold h-10 text-sm" onClick={() => handleConfirmDemoScenario(msg.payload.scenarioId)}>
              हाँ, 3-दिवसीय सुरक्षित यात्रा योजना बनाएं
            </Button>
          </div>
        );
      } else if (msg.action === "DEMO_CONFIRM_TRIP_HI_DONE") {
        elements.push(
          <div key="demo-trip-hi-done" className="bg-slate-50 rounded-xl border border-slate-200 p-3 mt-3 text-xs text-slate-500 text-left flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" /> 3-दिवसीय यात्रा विवरण की पुष्टि की गई
          </div>
        );
      } else if (msg.action === "DEMO_PORT_SELECT" && msg.payload) {
        const { scenarioId, ports } = msg.payload;
        const isHindiPorts = ports && ports.length > 0 && /[\u0900-\u097F]/.test(ports[0].name);
        elements.push(
          <div key="demo-port-select" className="bg-white rounded-xl border border-slate-200 p-4 mt-3 shadow-sm space-y-3 text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHindiPorts ? "पूर्वानुमान के लिए बंदरगाह चुनें:" : "Select Port for Forecast:"}
            </div>
            <div className="flex flex-col gap-2">
              {ports.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectDemoPort(scenarioId, p.name)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-ocean-50 hover:border-ocean-300 text-left transition-all group"
                >
                  <div>
                    <div className="font-semibold text-sm text-slate-900 group-hover:text-ocean-700">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.district}, {p.state} &bull; {p.distanceKm} {isHindiPorts ? "किमी" : "km"}</div>
                  </div>
                  <span className="text-xs font-bold text-ocean-600 bg-white px-2.5 py-1 rounded-md border border-ocean-100 shadow-sm shrink-0">
                    {isHindiPorts ? "चयन करें" : "Select & Proceed"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      } else if (msg.action === "DEMO_PORT_SELECT_DONE") {
        elements.push(
          <div key="demo-port-done" className="bg-slate-50 rounded-xl border border-slate-200 p-3 mt-3 space-y-1 text-xs text-slate-500 text-left">
            <div className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-slate-400"/> बंदरगाह का चयन पुष्टि किया गया।</div>
          </div>
        );
      } else if (msg.action === "DEMO_RESULT" && msg.payload) {
        const { ports, zones, mapCoords, mapName } = msg.payload;
        const items = ports || zones;
        const isHindiUI = (items && items.length > 0 && /[\u0900-\u097F]/.test(items[0].name || items[0].suitability || '')) || (mapName && /[\u0900-\u097F]/.test(mapName));
        
        if (items && items.length > 0) {
          elements.push(
            <div key="demo-items" className="space-y-3 mt-4 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2">
                {isHindiUI
                  ? (ports ? "बंदरगाह विवरण" : "मछली पकड़ने के क्षेत्र")
                  : (ports ? "Location & Harbour Details" : "Fishing Zones & Areas")}
              </h4>
              <div className="flex flex-col gap-3">
                {items.map((item: any, idx: number) => {
                  const isSafe = item.riskBand === 'SAFE';
                  const isCaution = item.riskBand === 'CAUTION';
                  const lat = item.lat;
                  const lng = item.lng;
                  const name = item.name;
                  const isMapActive = activeMapLocation && activeMapLocation.name === name;

                  const riskLabel = isHindiUI
                    ? (isSafe ? 'सुरक्षित' : isCaution ? 'सावधानी' : 'खतरा')
                    : item.riskBand;

                  const prodLabel = isHindiUI
                    ? (item.productivityBand === 'High' ? 'उच्च' : item.productivityBand === 'Moderate' ? 'मध्यम' : 'कम')
                    : item.productivityBand;

                  return (
                    <div key={idx} className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-ocean-50 border border-ocean-100 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-ocean-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {items.length > 1 ? `${idx + 1}. ` : ''}{name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.district || item.nearPort ? `${item.district || item.nearPort} ${isHindiUI ? 'क्षेत्र' : 'area'}` : ''}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 my-2">
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-bold">
                                {isHindiUI ? "दूरी" : "Distance"}
                              </span>
                              <span className="font-semibold text-slate-800">{item.distanceKm} {isHindiUI ? "किमी" : "km"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 block uppercase font-bold">
                                {isHindiUI ? "जोखिम स्तर" : "Risk Level"}
                              </span>
                              <span className={`inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${isSafe ? 'bg-status-safeBg text-status-safeText' : isCaution ? 'bg-status-cautionBg text-status-cautionText' : 'bg-status-dangerBg text-status-dangerText'}`}>
                                {riskLabel} ({item.riskScore}/100)
                              </span>
                            </div>
                            {item.waveHeight && (
                              <div>
                                <span className="text-[9px] text-slate-400 block uppercase font-bold">
                                  {isHindiUI ? "लहर की ऊंचाई" : "Wave Height"}
                                </span>
                                <span className="font-semibold text-slate-800">{item.waveHeight}</span>
                              </div>
                            )}
                            {item.windSpeed && (
                              <div>
                                <span className="text-[9px] text-slate-400 block uppercase font-bold">
                                  {isHindiUI ? "हवा की गति" : "Wind Speed"}
                                </span>
                                <span className="font-semibold text-slate-800">{item.windSpeed} {item.windDir || ''}</span>
                              </div>
                            )}
                            {item.productivityScore && (
                              <div className="col-span-2 border-t border-slate-200 pt-1 mt-0.5">
                                <span className="text-[9px] text-slate-400 block uppercase font-bold">
                                  {isHindiUI ? "मछली पकड़ने की संभावना" : "Fishing Potential"}
                                </span>
                                <span className="font-semibold text-ocean-700">{item.productivityScore}/100 &bull; {prodLabel}</span>
                              </div>
                            )}
                          </div>

                          {item.suitability && (
                            <p className="text-xs text-slate-600 leading-relaxed mb-2 bg-slate-50/50 p-2 rounded border border-slate-100">{item.suitability}</p>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs flex-1 py-1 h-8 bg-slate-50 hover:bg-slate-100 transition-colors font-semibold"
                              onClick={() => setActiveMapLocation(isMapActive ? null : { coords: [lat, lng], name })}
                            >
                              <MapIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                              {isHindiUI
                                ? (isMapActive ? "मानचित्र छिपाएं" : "मानचित्र पर देखें")
                                : (isMapActive ? "Hide Map" : "View on Map")}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs px-2 py-1 h-8 text-ocean-600 hover:bg-ocean-50"
                              onClick={() => navigate(`/map?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&mode=fishing`)}
                            >
                              {isHindiUI ? "पूरा मानचित्र →" : "Full Map →"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {isMapActive && (
                        <div className="h-48 border border-slate-200 rounded-lg overflow-hidden relative mt-2">
                          <MapComponent 
                            center={[lat, lng]} 
                            zoom={12} 
                            zones={[
                              { id: "demo-z", center: [lat, lng], radius: 2500, type: "fishing", label: name }
                            ]} 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else if (mapCoords && mapName) {
          const isHindiMap = /[\u0900-\u097F]/.test(mapName);
          const isMapActive = activeMapLocation && activeMapLocation.name === mapName;
          elements.push(
            <div key="demo-single-map" className="mt-3 text-left">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 font-semibold"
                  onClick={() => setActiveMapLocation(isMapActive ? null : { coords: mapCoords, name: mapName })}
                >
                  <MapIcon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  {isHindiMap
                    ? (isMapActive ? "मानचित्र छिपाएं" : `मानचित्र पर देखें`)
                    : (isMapActive ? "Hide Map" : `View ${mapName} on Map`)}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs px-3 py-1.5 text-ocean-600 hover:bg-ocean-50"
                  onClick={() => navigate(`/map?lat=${mapCoords[0]}&lng=${mapCoords[1]}&name=${encodeURIComponent(mapName)}&mode=fishing`)}
                >
                  {isHindiMap ? "पूरा मानचित्र →" : "Full Map →"}
                </Button>
              </div>
              {isMapActive && (
                <div className="h-48 border border-slate-200 rounded-lg overflow-hidden relative mt-2">
                  <MapComponent 
                    center={mapCoords} 
                    zoom={11} 
                    zones={[
                      { id: "demo-zone-single", center: mapCoords, radius: 3000, type: "fishing", label: mapName }
                    ]} 
                  />
                </div>
              )}
            </div>
          );
        }
      } else if (msg.action === "DEMO_RESEARCHER_RESULT" && msg.payload) {
        elements.push(<ResearcherVisualizations key="demo-researcher-vis" scenario={msg.payload} />);
      } else if (msg.action === "DEMO_ALERT_RESULT" && msg.payload) {
        elements.push(<AlertVisualizations key="demo-alert-vis" scenario={msg.payload} />);
      } else if (msg.action === "DEMO_DIGITAL_TWIN_RESULT" && msg.payload) {
        elements.push(<DigitalTwinVisualizations key="demo-digital-twin-vis" scenario={msg.payload} />);
      }
    }
    
    return elements.length > 0 ? <>{elements}</> : null;
  };

  const renderModeIndicator = () => {
    switch(activeMode) {
      case "Normal":
        return null;
      case "Research":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-ocean-50 text-ocean-700 rounded-lg text-sm font-bold border border-ocean-200">
            <Microscope className="w-4 h-4" /> Researcher
          </div>
        );
      case "Digital_Twin":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-200">
            <Cpu className="w-4 h-4" /> Digital Twin
          </div>
        );
      case "Alert":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-bold border border-rose-200">
            <AlertTriangle className="w-4 h-4" /> Alert
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-slate-50 relative">
      {/* Header for Fresh Chat and Mode Indicator */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        {renderModeIndicator()}
        <Button variant="outline" size="sm" onClick={handleFreshChat} className="bg-white text-xs font-semibold shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Fresh Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 pt-14">
        {activeMode === "Digital_Twin" && <DigitalTwinUI />}
        {activeMode === "Alert" && <AlertUI decision={latestDecision.decision} context={latestDecision.context} isSimulated={twinState.active && !!twinState.modified} />}
        {messages.map((msg) => (
          <div key={msg.id} className="w-full max-w-3xl mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ChatBubble 
              text={
                <div className="flex flex-col gap-3">
                  {typeof msg.text === "string" ? <FormattedMessage content={msg.text} /> : msg.text}
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
        {messages.length === 1 && messages[0].id === 'init-1' && (
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-2 pt-4 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            {(oldLocationData[profile.location.split(',')[0].trim().toLowerCase()] || oldLocationData.other).suggestedQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleUserMessage(q)}
                className="bg-white border border-slate-200 p-4 rounded-xl text-left text-[15px] font-medium text-slate-700 hover:bg-ocean-50 hover:border-ocean-200 hover:text-ocean-800 transition-all shadow-sm flex items-center justify-between group"
              >
                {q}
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-ocean-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02)] z-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button 
                onClick={() => setShowModeMenu(!showModeMenu)}
                aria-label="Select mode" 
                disabled={analysis.active} 
                className="shrink-0 flex items-center justify-center rounded-full h-12 w-12 border border-slate-200 bg-slate-50 text-slate-500 hover:text-ocean-600 hover:bg-ocean-50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
              {showModeMenu && (
                <div className="absolute bottom-full mb-3 left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-2 z-50">
                  <button 
                    onClick={() => { setActiveMode("Normal"); setShowModeMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left ${activeMode === 'Normal' ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Info className="w-4 h-4" /> Default
                  </button>
                  <button 
                    onClick={() => { setActiveMode("Research"); setShowModeMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left ${activeMode === 'Research' ? 'bg-ocean-50 text-ocean-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Microscope className="w-4 h-4" /> Researcher
                  </button>
                  <button 
                    onClick={() => { setActiveMode("Digital_Twin"); setShowModeMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left ${activeMode === 'Digital_Twin' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Cpu className="w-4 h-4" /> Digital Twin
                  </button>
                  <button 
                    onClick={() => { setActiveMode("Alert"); setShowModeMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left ${activeMode === 'Alert' ? 'bg-rose-50 text-rose-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <AlertTriangle className="w-4 h-4" /> Alert
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !analysis.active && handleUserMessage(input)}
              placeholder={analysis.active ? "Please wait..." : "Ask TARANG about your trip..."}
              disabled={analysis.active}
              className="flex-1 min-w-0 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button aria-label="Send message" disabled={analysis.active} onClick={() => handleUserMessage(input)} className="shrink-0 flex items-center justify-center rounded-full h-12 w-12 bg-ocean-600 text-white hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {editContext.active && editContext.context && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">Edit Context</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={editContext.context.locationName}
                  onChange={e => setEditContext(prev => ({ ...prev, context: { ...prev.context!, locationName: e.target.value } }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Time Description</label>
                <input 
                  type="text" 
                  value={editContext.context.timeDescription}
                  onChange={e => setEditContext(prev => ({ ...prev, context: { ...prev.context!, timeDescription: e.target.value } }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Boat Type</label>
                <select 
                  value={editContext.context.boatType}
                  onChange={e => setEditContext(prev => ({ ...prev, context: { ...prev.context!, boatType: e.target.value } }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="non_motorized">Non Motorized</option>
                  <option value="motorized">Motorized</option>
                  <option value="mechanized">Mechanized</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setEditContext({ active: false, context: null })}>Cancel</Button>
              <Button className="flex-1" onClick={() => {
                const ctx = editContext.context!;
                setEditContext({ active: false, context: null });
                updateLastMessageAction("context_confirm_done");
                
                // Rerun with the edited context
                setTimeout(() => {
                  addMessage({ 
                    text: "Sure! Let's confirm your updated details:",
                    isBot: true,
                    action: "context_confirm",
                    intent: null,
                    payload: ctx
                  });
                }, 400);
              }}>Apply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;

// Helper to format date in Chat.tsx directly (since normal formatter isn't called for compound ordinals)
function resolvedContextToDateString(d: Date): string {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.getDate() === tomorrow.getDate()) return "tomorrow";
  if (d.getDate() === new Date().getDate()) return "today";
  return d.toLocaleDateString('en-IN', { weekday: 'long' });
}
