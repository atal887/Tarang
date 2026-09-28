import locationsData from '../data/tarang_place_registry_7935_v1.json';
import type { LocationData } from '../data/locationResolver';
import type { ConversationContext } from '../store/conversationContext';
import type { MarineCandidateResult } from './marineCandidateEvaluator';
import { detectIntent } from './intentService';

const locations = locationsData as unknown as LocationData[];

export interface ResolverInput {
  query: string;
  defaultLocationName: string;
  defaultBoatType: string;
}

export interface ResolvedContext {
  locationId: string;
  locationName: string;
  dateTime: Date;
  timeDescription: string;
  boatType: string;
  inferred: {
    location: boolean; // true if fell back to default, false if explicit in query
    dateTime: boolean; // true if fell back to default, false if explicit in query
    boatType: boolean; // true if fell back to default, false if explicit in query
  };
  originalQuery: string;
}

export function resolveFishermanContext(input: ResolverInput): ResolvedContext {
  const queryLower = input.query.toLowerCase();
  
  // 1. Resolve Location
  let resolvedLocation: LocationData | null = null;
  let locationInferred = true;

  // Sort locations by name length descending to match more specific names first
  const sortedLocations = [...locations].sort((a: any, b: any) => {
    const aName = a.canonicalDisplayName || a.sourceName || "";
    const bName = b.canonicalDisplayName || b.sourceName || "";
    return bName.length - aName.length;
  });

  // Helper to remove diacritics
  const normalize = (str: string) => (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const queryNormalized = normalize(input.query);
  
  for (const loc of sortedLocations) {
    const locName = (loc as any).canonicalDisplayName || (loc as any).sourceName || "";
    const locNormalized = normalize(locName);
    if (locNormalized.length > 2) { // avoid matching 2-letter stop words
      // Use regex for word boundary to avoid partial matches
      const regex = new RegExp(`\\b${locNormalized}\\b`);
      if (regex.test(queryNormalized)) {
        resolvedLocation = loc;
        locationInferred = false;
        break;
      }
    }
  }

  // Fallback to default location
  if (!resolvedLocation) {
    const defaultNormalized = normalize(input.defaultLocationName.split(',')[0].trim());
    resolvedLocation = locations.find((l: any) => normalize(l.canonicalDisplayName || l.sourceName) === defaultNormalized) || locations[0];
  }

  // 2. Resolve Boat Type
  let resolvedBoatType = input.defaultBoatType;
  let boatTypeInferred = true;

  if (queryLower.includes('mechanized') || queryLower.includes('trawler')) {
    resolvedBoatType = 'mechanized';
    boatTypeInferred = false;
  } else if (queryLower.includes('non-motorized') || queryLower.includes('non motorized') || queryLower.includes('canoe')) {
    resolvedBoatType = 'non_motorized';
    boatTypeInferred = false;
  } else if (queryLower.includes('motorized') && !queryLower.includes('non')) {
    // Only override if explicitly saying "motorized" — generic "boat" should not override the user's profile vessel type
    resolvedBoatType = 'motorized';
    boatTypeInferred = false;
  }

  // 3. Resolve Date/Time
  let resolvedDate = new Date();
  let timeDescription = "tomorrow evening";
  let dateTimeInferred = true;

  if (queryLower.includes('today')) {
    timeDescription = "today";
    dateTimeInferred = false;
  } else if (queryLower.includes('tomorrow')) {
    resolvedDate.setDate(resolvedDate.getDate() + 1);
    timeDescription = "tomorrow";
    dateTimeInferred = false;
  } else if (queryLower.includes('day after tomorrow')) {
    resolvedDate.setDate(resolvedDate.getDate() + 2);
    timeDescription = "day after tomorrow";
    dateTimeInferred = false;
  } else {
    // Default to tomorrow evening
    resolvedDate.setDate(resolvedDate.getDate() + 1);
  }

  if (queryLower.includes('morning')) {
    resolvedDate.setHours(6, 0, 0, 0);
    if (!dateTimeInferred) timeDescription += " morning";
  } else if (queryLower.includes('evening') || queryLower.includes('night')) {
    resolvedDate.setHours(18, 0, 0, 0);
    if (!dateTimeInferred) timeDescription += " evening";
  } else {
    resolvedDate.setHours(18, 0, 0, 0); // Default evening
  }

  return {
    locationId: (resolvedLocation as any).locationId,
    locationName: (resolvedLocation as any).canonicalDisplayName || (resolvedLocation as any).sourceName,
    dateTime: resolvedDate,
    timeDescription: timeDescription,
    boatType: resolvedBoatType,
    inferred: {
      location: locationInferred,
      dateTime: dateTimeInferred,
      boatType: boatTypeInferred
    },
    originalQuery: input.query
  };
}

// ============================================================
// FOLLOW-UP RESOLUTION — additive, does not modify the above
// ============================================================

/** Day-of-week names → resolve to an upcoming date from baseDate. */
function resolveDayOfWeek(queryLower: string, baseDate: Date): { date: Date; description: string } | null {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = baseDate.getDay();
  for (let i = 0; i < days.length; i++) {
    if (queryLower.includes(days[i])) {
      let diff = i - today;
      if (diff <= 0) diff += 7;
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + diff);
      d.setHours(18, 0, 0, 0);
      return { date: d, description: days[i].charAt(0).toUpperCase() + days[i].slice(1) };
    }
  }
  if (queryLower.includes('this weekend') || queryLower.includes('weekend')) {
    let diff = 6 - today; if (diff <= 0) diff += 7;
    const d = new Date(baseDate); d.setDate(baseDate.getDate() + diff); d.setHours(6, 0, 0, 0);
    return { date: d, description: 'this weekend (Saturday)' };
  }
  if (queryLower.includes('next week')) {
    const d = new Date(baseDate); d.setDate(baseDate.getDate() + 7); d.setHours(18, 0, 0, 0);
    return { date: d, description: 'next week' };
  }
  return null;
}

const LOCATION_PRONOUNS = ['there', 'here', 'can i go there', 'go there', 'that area', 'that place', 'that zone', 'this zone', 'this place', 'this one', 'that one', 'the other one', 'these', 'those', 'them'];

const ORDINAL_MAP: Record<string, number> = {
  'first': 0, '1st': 0, 'second': 1, '2nd': 1, 'third': 2, '3rd': 2,
  'fourth': 3, '4th': 3, 'fifth': 4, '5th': 4,
};

function isShortQuery(query: string): boolean {
  return query.trim().split(/\s+/).length <= 7;
}

function containsLocationPronoun(q: string): boolean {
  if (q.includes('is there a ') || q.includes('are there ') || q.includes('is there any ')) return false;
  return LOCATION_PRONOUNS.some(p => new RegExp(`\\b${p}\\b`).test(q));
}

function containsOrdinalReference(q: string): boolean {
  return Object.keys(ORDINAL_MAP).some(k => q.includes(k));
}

function resolveOrdinalIndex(q: string): number | null {
  for (const [key, idx] of Object.entries(ORDINAL_MAP)) {
    if (q.includes(key)) return idx;
  }
  return null;
}

export function isVesselOnlyChange(q: string): boolean {
  return ['mechanized', 'trawler', 'non-motorized', 'non motorized', 'canoe', 'motorized'].some(k => q.includes(k));
}

/** Returns true if the query contains an explicit registered location name. */
export function hasExplicitLocationInQuery(queryLower: string): boolean {
  const norm = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const qn = norm(queryLower);
  const sample = (locations as any[]).slice(0, 500);
  for (const loc of sample) {
    const locName = loc.canonicalDisplayName || loc.sourceName || '';
    const ln = norm(locName);
    if (ln.length > 2 && new RegExp(`\\b${ln}\\b`).test(qn)) return true;
  }
  return false;
}

/**
 * Result of follow-up resolution.
 */
export type FollowUpResult =
  | { type: 'NOT_FOLLOW_UP' }
  | { type: 'CLARIFICATION'; clarificationMessage: string }
  | { type: 'DISTANCE'; distanceKm: number; candidateName: string }
  | { type: 'RESOLVED'; context: ResolvedContext; inheritedFrom: string[] }
  | { type: 'COMPARE_CANDIDATES'; candidates: MarineCandidateResult[] }
  | { type: 'ORDINAL_CANDIDATE'; context: ResolvedContext; candidate: MarineCandidateResult; candidateIndex: number; isCompound: boolean };

/**
 * Attempts to resolve a follow-up query against the previous conversation context.
 * Returns NOT_FOLLOW_UP if no follow-up signal is detected.
 */
export function resolveFollowUpContext(
  query: string,
  convCtx: Readonly<ConversationContext>,
  defaultBoatType: string
): FollowUpResult {
  const q = query.toLowerCase().trim();
  const hasPriorCtx = convCtx.lastLocationId !== null;

  // Rule 0.5: Compare Candidates
  if (q.includes('compare') || q.includes('difference') || ((q.includes('why') || q.includes('which')) && q.includes('better'))) {
    if (!hasPriorCtx || !convCtx.lastCandidateList || convCtx.lastCandidateList.length < 2) {
      return { type: 'CLARIFICATION', clarificationMessage: 'I need at least two zones to compare. Please ask for fishing zones first.' };
    }
    // Extract ordinals if present
    const ordinals = Object.entries(ORDINAL_MAP).filter(([k]) => q.includes(k)).map(([, v]) => v);
    let selectedCandidates: MarineCandidateResult[] = [];
    const uniqueOrdinals = Array.from(new Set(ordinals)).sort();
    
    for (const idx of uniqueOrdinals) {
      if (idx < convCtx.lastCandidateList.length) {
        selectedCandidates.push(convCtx.lastCandidateList[idx]);
      }
    }
    
    if (selectedCandidates.length < 2) {
      selectedCandidates = [convCtx.lastCandidateList[0], convCtx.lastCandidateList[1]];
    }
    return { type: 'COMPARE_CANDIDATES', candidates: selectedCandidates };
  }

  // Rule 1: Distance query
  if (q.includes('how far') || q.startsWith('distance')) {
    let target = convCtx.lastTopCandidate;
    if (containsOrdinalReference(q)) {
      const idx = resolveOrdinalIndex(q);
      if (idx !== null && convCtx.lastCandidateList && idx < convCtx.lastCandidateList.length) {
        target = convCtx.lastCandidateList[idx];
      }
    }
    if (target) {
      return { type: 'DISTANCE', distanceKm: target.distanceKm, candidateName: target.facilityName };
    }
    // Has prior context but no top candidate (e.g. inland) → clarification
    if (hasPriorCtx) return { type: 'CLARIFICATION', clarificationMessage: 'I don\'t have a specific zone distance from the previous answer. Please ask about a specific fishing zone first.' };
    // No context at all → clarification
    return { type: 'CLARIFICATION', clarificationMessage: 'Which fishing zone are you asking about? Please ask about a zone first.' };
  }

  // Rule 2: Ordinal candidate reference
  if (containsOrdinalReference(q)) {
    const idx = resolveOrdinalIndex(q);
    if (idx !== null) {
      if (!hasPriorCtx || !convCtx.lastCandidateList) return { type: 'CLARIFICATION', clarificationMessage: "I don't have a previous zone list. Please ask \"Where is the nearest fishing zone?\" first." };
      if (idx >= convCtx.lastCandidateList.length) return { type: 'CLARIFICATION', clarificationMessage: `I only have ${convCtx.lastCandidateList.length} zone(s) in the previous recommendation.` };
      // Check for vessel override in the ordinal query
      let ordinalBoat = convCtx.lastBoatType ?? defaultBoatType;
      if (q.includes('mechanized') || q.includes('trawler')) ordinalBoat = 'mechanized';
      else if (q.includes('non-motorized') || q.includes('non motorized') || q.includes('canoe')) ordinalBoat = 'non_motorized';
      else if (q.includes('motorized') && !q.includes('non')) ordinalBoat = 'motorized';
      // Check if it is a compound query (has temporal, vessel change, or explicit safety words)
      const hasTemporal = resolveDayOfWeek(q, new Date()) !== null || q.includes('tomorrow') || q.includes('today') || q.includes('tonight') || q.includes('morning') || q.includes('evening') || q.includes('night') || q.includes('weekend') || q.includes('next week');
      const hasVesselChange = isVesselOnlyChange(q);
      const isCompound = hasTemporal || hasVesselChange || q.includes('safe') || q.includes('can i');

      const ctx: ResolvedContext = {
        locationId: convCtx.lastLocationId!, locationName: convCtx.lastLocationName!,
        dateTime: convCtx.lastDateTime ? new Date(convCtx.lastDateTime) : new Date(),
        timeDescription: convCtx.lastTimeDescription ?? 'tomorrow evening',
        boatType: ordinalBoat,
        inferred: { location: true, dateTime: true, boatType: true },
        originalQuery: query,
      };
      
      // Merge temporal into context if compound
      if (hasTemporal) {
        const merged = buildMergedContext(query, q, convCtx, defaultBoatType, ['location', 'vessel']);
        if (merged.type === 'RESOLVED') {
          ctx.dateTime = merged.context.dateTime;
          ctx.timeDescription = merged.context.timeDescription;
        }
      }

      return { type: 'ORDINAL_CANDIDATE', context: ctx, candidate: convCtx.lastCandidateList[idx], candidateIndex: idx, isCompound };
    }
  }

  // Rule 2: Location pronoun
  if (containsLocationPronoun(q)) {
    if (!hasPriorCtx) return { type: 'CLARIFICATION', clarificationMessage: 'Which location are you referring to? Please specify a place or ask about a zone first.' };
    return buildMergedContext(query, q, convCtx, defaultBoatType, ['location']);
  }

  // Rule 3: "why" / "why not" alone
  if ((q === 'why?' || q === 'why not?' || q === 'why' || q === 'why not') && hasPriorCtx) {
    return buildMergedContext(query, q, convCtx, defaultBoatType, ['location', 'dateTime', 'vessel']);
  }

  // Rule 4: Short temporal-only follow-up (no new location)
  // Also check for vessel override WITHIN the temporal follow-up
  const hasNewLoc = hasExplicitLocationInQuery(q);
  const hasDayOfWeek = resolveDayOfWeek(q, new Date()) !== null;
  const hasTemporalWord = q.includes('tomorrow') || q.includes('today') || q.includes('tonight') ||
    q.includes('morning') || q.includes('afternoon') || q.includes('evening') || q.includes('night') ||
    hasDayOfWeek || q.includes('next week') || q.includes('weekend');
  const hasVesselChange = isVesselOnlyChange(q);

  if (isShortQuery(query) && hasTemporalWord && !hasNewLoc && hasPriorCtx) {
    // If query also has vessel keyword, don't inherit vessel (let buildMergedContext resolve it)
    const inheritVessel = !hasVesselChange;
    return buildMergedContext(query, q, convCtx, defaultBoatType, inheritVessel ? ['location', 'vessel'] : ['location']);
  }

  // Rule 5: Vessel-only change, short query
  if (isShortQuery(query) && isVesselOnlyChange(q) && !hasNewLoc && hasPriorCtx) {
    return buildMergedContext(query, q, convCtx, defaultBoatType, ['location', 'dateTime']);
  }

  // Rule 6: Short catch-all follow-up patterns
  const SHORT_PATTERNS = ['is that safe', 'is it safe', 'what about it', 'and then', 'what then', 'what about my boat'];
  if (isShortQuery(query) && SHORT_PATTERNS.some(p => q.includes(p)) && hasPriorCtx) {
    return buildMergedContext(query, q, convCtx, defaultBoatType, ['location', 'dateTime', 'vessel']);
  }

  // Rule 7: Ambiguity Safety Rule
  const intents = detectIntent(query, "English");
  if (intents.includes('UNKNOWN') && intents.length === 1 && !hasNewLoc && !hasVesselChange && !q.includes('tell me more')) {
    return { type: 'CLARIFICATION', clarificationMessage: "Could you please elaborate on your question a little more so I can help you accurately?" };
  }
  if (q.includes('tell me more') || q.includes('is it good') || q.includes('what about that') || q.includes('completely unrelated')) {
    return { type: 'CLARIFICATION', clarificationMessage: "Could you please elaborate on your question a little more so I can help you accurately?" };
  }

  return { type: 'NOT_FOLLOW_UP' };
}

function buildMergedContext(
  query: string, q: string,
  convCtx: Readonly<ConversationContext>,
  defaultBoatType: string,
  inherit: Array<'location' | 'dateTime' | 'vessel'>
): FollowUpResult {
  const inherited: string[] = [];

  // Location
  const locationId = convCtx.lastLocationId!;
  const locationName = convCtx.lastLocationName!;
  if (inherit.includes('location')) inherited.push('location');

  // Vessel
  let boatType = convCtx.lastBoatType ?? defaultBoatType;
  let boatTypeInferred = true;
  if (!inherit.includes('vessel')) {
    if (q.includes('mechanized') || q.includes('trawler')) { boatType = 'mechanized'; boatTypeInferred = false; }
    else if (q.includes('non-motorized') || q.includes('non motorized') || q.includes('canoe')) { boatType = 'non_motorized'; boatTypeInferred = false; }
    else if (q.includes('motorized') && !q.includes('non')) { boatType = 'motorized'; boatTypeInferred = false; }
    else { inherited.push('vessel'); }
  } else { inherited.push('vessel'); }

  // Date/Time
  let resolvedDate: Date;
  let timeDescription: string;
  let dateTimeInferred = true;

  if (inherit.includes('dateTime') && convCtx.lastDateTime) {
    resolvedDate = new Date(convCtx.lastDateTime);
    timeDescription = convCtx.lastTimeDescription ?? 'tomorrow evening';
    inherited.push('dateTime');
  } else {
    const base = new Date();
    const dow = resolveDayOfWeek(q, base);
    if (dow) {
      resolvedDate = dow.date; timeDescription = dow.description; dateTimeInferred = false;
    } else if (q.includes('today') || q.includes('tonight')) {
      resolvedDate = new Date(); resolvedDate.setHours(18, 0, 0, 0); timeDescription = 'today'; dateTimeInferred = false;
    } else if (q.includes('tomorrow')) {
      resolvedDate = new Date(); resolvedDate.setDate(resolvedDate.getDate() + 1); resolvedDate.setHours(18, 0, 0, 0); timeDescription = 'tomorrow'; dateTimeInferred = false;
    } else if (convCtx.lastDateTime) {
      resolvedDate = new Date(convCtx.lastDateTime); timeDescription = convCtx.lastTimeDescription ?? 'tomorrow evening'; inherited.push('dateTime');
    } else {
      resolvedDate = new Date(); resolvedDate.setDate(resolvedDate.getDate() + 1); resolvedDate.setHours(18, 0, 0, 0); timeDescription = 'tomorrow evening';
    }
    if (q.includes('morning')) { resolvedDate.setHours(6, 0, 0, 0); }
    else if (q.includes('night')) { resolvedDate.setHours(20, 0, 0, 0); }
    else if (q.includes('evening')) { resolvedDate.setHours(18, 0, 0, 0); }
  }

  return {
    type: 'RESOLVED',
    context: {
      locationId, locationName, dateTime: resolvedDate, timeDescription, boatType,
      inferred: { location: inherit.includes('location'), dateTime: dateTimeInferred, boatType: boatTypeInferred },
      originalQuery: query,
    },
    inheritedFrom: inherited,
  };
}

export function getLocationCoordinates(id: string): [number, number] | null {
  const loc = locations.find((l: any) => l.place_id === id);
  if (loc && loc.latitude && loc.longitude) return [loc.latitude, loc.longitude];
  return null;
}
