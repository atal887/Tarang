# TARANG Question Coverage Matrix

This document audits the current capabilities of TARANG's intent detection and conversation tracking. It maps exactly what questions are handled well today, which fall through the cracks, and which represent new capabilities needed for a fully production-ready marine intelligence system.

## 1. Safety & Feasibility

**Intent Names:** `SAFETY_TOMORROW`, `BOAT_SAFETY`, `WAVE_HEIGHT`, `WIND_FORECAST`, `CYCLONE_ALERT`

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "Is it safe to fish tomorrow?" | ✅ | Passes | `SAFETY_TOMORROW` | Yes (Location) |
| "Can my motorized boat go out today?" | ✅ | Passes | `BOAT_SAFETY` | Yes (Location) |
| "What is the wave height?" | ✅ | Passes | `WAVE_HEIGHT` | Yes (Location) |
| "Is there a cyclone alert?" | ✅ | Passes | `CYCLONE_ALERT` | Yes (Location) |
| "How strong is the wind right now?" | ✅ | Passes | `WIND_FORECAST` | Yes (Location) |
| "Is the water rough?" | ❌ | Fails | `WAVE_HEIGHT` / `BOAT_SAFETY` | Yes (Location) |
| "Can I take my small boat out if it's raining?" | ❌ | Fails | `BOAT_SAFETY` | Yes (Location) |
| "Will the weather turn bad tonight?" | ❌ | Fails | `SAFETY_TOMORROW` / Time-specific | Yes (Time, Loc) |
| "Is it too dangerous to go to the second zone?" | ❌ | Fails | `BOAT_SAFETY` (Candidate #2) | Yes (Ctx: Candidate) |
| "Is the current too strong for my non-motorized boat?" | ❌ | Fails | `BOAT_SAFETY` / `CURRENT_COASTAL_CONDITIONS` | Yes (Location) |

*Natural Language Gap:* Queries about "rough water," "dangerous," "bad weather," or specific constraints ("too strong") currently lack robust fuzzy-matching unless they contain exact keywords like "safe," "wave," or "wind."

---

## 2. Fishing Productivity & PFZ

**Intent Names:** `NEAREST_PFZ`, `BEST_FISHING_ZONE`, `CHLOROPHYLL_ZONE`, `PRODUCTIVITY_ANALYSIS`

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "Where is the nearest PFZ?" | ✅ | Passes | `NEAREST_PFZ` | Yes (Location) |
| "Where is the best fishing zone?" | ✅ | Passes | `BEST_FISHING_ZONE` | Yes (Location) |
| "What is the chlorophyll concentration?" | ✅ | Passes | `CHLOROPHYLL_ZONE` | Yes (Location) |
| "Why is this zone productive?" | ✅ | Passes | `PRODUCTIVITY_ANALYSIS` | Yes (Ctx: Candidate) |
| "Where are the fish today?" | ❌ | Fails | `BEST_FISHING_ZONE` | Yes (Location) |
| "Will I catch a lot if I go to the second one?" | ❌ | Fails | `PRODUCTIVITY_ANALYSIS` (Candidate #2)| Yes (Ctx: Candidate) |
| "Is the fishing good there?" | ✅ | Passes via context | `BEST_FISHING_ZONE` | Yes (Ctx: Candidate) |
| "Show me areas with high chlorophyll." | ❌ | Fails | `CHLOROPHYLL_ZONE` | Yes (Location) |
| "Is the water temperature good for fishing?" | ❌ | Fails | `PRODUCTIVITY_ANALYSIS` / SST | Yes (Location) |

*Natural Language Gap:* The intent engine struggles with colloquialisms for good fishing (e.g., "Where are the fish?", "Will I catch a lot?", "good catch"). 

---

## 3. Environmental Parameters (Detailed)

**Intent Names:** `WAVE_HEIGHT`, `WIND_FORECAST`, `CHLOROPHYLL_ZONE`, `CURRENT_COASTAL_CONDITIONS` (Missing specific intents for SST, MLD, D20)

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "What is the surface current?" | ✅ | Passes | `CURRENT_COASTAL_CONDITIONS` | Yes (Location) |
| "What is the SST?" | ❌ | Fails (No Intent) | `SST_CONDITIONS` | Yes (Location) |
| "What is the mixed layer depth?" | ❌ | Fails (No Intent) | `MLD_CONDITIONS` | Yes (Location) |
| "What is the D20 depth?" | ❌ | Fails (No Intent) | `D20_CONDITIONS` | Yes (Location) |
| "Tell me the environmental profile of the second zone." | ❌ | Fails | `ENVIRONMENTAL_PROFILE` | Yes (Ctx: Candidate) |
| "Is the current moving north?" | ❌ | Fails | `CURRENT_COASTAL_CONDITIONS` | Yes (Location) |

*Natural Language Gap:* Specific scientific parameters (SST, MLD, D20) lack explicit intent mapping, causing them to fall back to UNKNOWN or general safety queries.

---

## 4. Multi-Day & Time Planning

**Intent Names:** `MULTI_DAY_TRIP`, `SAFEST_TIME`, `WEEKEND_FISHING`, `NIGHT_VISIBILITY`

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "Is it safe for a 3-day trip?" | ✅ | Passes | `MULTI_DAY_TRIP` | Yes (Location) |
| "When is the safest time to go?" | ✅ | Passes | `SAFEST_TIME` | Yes (Location) |
| "Can I fish there at night?" | ✅ | Passes | `NIGHT_VISIBILITY` | Yes (Ctx: Candidate) |
| "How about this weekend?" | ✅ | Passes | `WEEKEND_FISHING` | Yes (Location) |
| "What about tomorrow morning?" | ✅ | Passes (Time Ctx) | `SAFETY_TOMORROW` | Yes (Ctx: Date change) |
| "Is Monday better than Tuesday?" | ❌ | Fails | `COMPARE_TIME` | Yes (Location) |
| "Can I stay out for a week?" | ❌ | Fails | `MULTI_DAY_TRIP` | Yes (Location) |
| "What time should I return before the wind picks up?" | ❌ | Fails | `SAFEST_TIME` (Constraint) | Yes (Location) |

*Natural Language Gap:* Time-comparisons ("Monday vs Tuesday") and variable durations ("a week", "two days") are not robustly parsed. `MULTI_DAY_TRIP` is highly anchored to the specific phrase "3-day".

---

## 5. Candidate Comparisons & Follow-ups

**Intent Names:** `COMPARE_ZONES`, `DISTANCE_ANALYSIS`, `WHY_RECOMMENDED`, `WHY_NOT_RECOMMENDED`

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "Compare them." | ✅ | Passes | `COMPARE_ZONES` | Yes (Ctx: Multiple) |
| "How far is the second one?" | ✅ | Passes | `DISTANCE_ANALYSIS` | Yes (Ctx: Candidate #2) |
| "Why recommend this one?" | ✅ | Passes | `WHY_RECOMMENDED` | Yes (Ctx: Candidate #1) |
| "Why isn't it recommended?" | ✅ | Passes | `WHY_NOT_RECOMMENDED` | Yes (Ctx: Candidate) |
| "Which is safer, the first or second?" | ✅ | Passes | `COMPARE_ZONES` | Yes (Ctx: Multiple) |
| "Does the third one have better fishing?" | ❌ | Fails | `COMPARE_ZONES` (Specific metric) | Yes (Ctx: Multiple) |
| "What is the difference between these two?" | ❌ | Fails | `COMPARE_ZONES` | Yes (Ctx: Multiple) |
| "Is the second one closer than the first?" | ❌ | Fails | `COMPARE_ZONES` (Distance) | Yes (Ctx: Multiple) |
| "What about the other zone?" | ✅ | Passes (Resolves alt) | (Previous intent repeated) | Yes (Ctx: Candidate) |

*Natural Language Gap:* Nuanced comparisons ("Which is closer?", "What is the difference?") are not cleanly mapped to `COMPARE_ZONES`, often dropping into generic intents.

---

## 6. Methodology & Research Quality

**Intent Names:** `FACTOR_EXPLANATION`, `SCORE_BREAKDOWN`, `SAFETY_METHODOLOGY`, `PRODUCTIVITY_METHODOLOGY`, `DATA_SOURCE`, `DATA_AVAILABILITY`

| Example Question | Supported? | Status | Expected Intent | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "How is productivity calculated?" | ✅ | Passes | `SCORE_BREAKDOWN` | No |
| "How is safety calculated?" | ✅ | Passes | `SAFETY_METHODOLOGY` | No |
| "What data is this based on?" | ✅ | Passes | `DATA_SOURCE` | No |
| "How does chlorophyll affect fishing?" | ✅ | Passes | `FACTOR_EXPLANATION` | No |
| "Is this live satellite data?" | ✅ | Passes | `DATA_SOURCE` | No |
| "Why is PFZ weighted at 40%?" | ❌ | Fails | `SCORE_BREAKDOWN` | No |
| "Who provides the wave data?" | ❌ | Fails | `DATA_SOURCE` | No |
| "Can I trust this prediction?" | ❌ | Fails | `DATA_SOURCE` / Accuracy | No |

*Natural Language Gap:* Detailed methodological probing requires exact string matches (e.g. "how is safety calculated") rather than broader semantic understanding of "How do you know this?" or "Can I trust this?".

---

## 7. Ambiguous & Compound Queries

| Example Question | Supported? | Status | Expected Handling | Needs Context? |
| :--- | :---: | :--- | :--- | :---: |
| "Is it good?" | ✅ | Passes (Handled via clarification prompt) | `UNKNOWN` -> Clarify | Yes (Ctx missing) |
| "Tell me more." | ✅ | Passes (Handled via clarification prompt) | `UNKNOWN` -> Clarify | Yes (Ctx missing) |
| "Is the second zone safe tomorrow morning for my motorized boat?" | ✅ | Passes (Resolves Date + Vessel + Candidate) | `SAFETY_TOMORROW` | Yes (Ctx: Candidate #2) |
| "Which is safer and has better fishing potential?" | ❌ | Fails | `COMPARE_ZONES` | Yes (Ctx: Multiple) |
| "Show me the nearest zone and tell me if it's safe." | ❌ | Fails (Picks one intent) | Compound (Prod + Safety) | Yes (Location) |
| "I want to go fishing but my boat is small, where should I go?" | ❌ | Fails | `BEST_FISHING_ZONE` + `BOAT_SAFETY` | Yes (Location) |

*Natural Language Gap:* Compound sentences ("and", "but") generally force the deterministic intent engine to arbitrarily pick the first matched keyword. TARANG cannot currently execute two separate analytical intents simultaneously.

---

## Conclusion & Next Steps

TARANG's conversation continuity (`contextResolver.ts`) is **highly advanced** and correctly handles complex state management involving candidates (ordinal references like "the second one"), pronouns ("there", "it"), and implicit intent repetition.

However, the **entry point** (`intentService.ts`) is currently a fragile, deterministic keyword matcher. 

To achieve production-quality natural language understanding without breaking the frozen mathematical decision engine, TARANG needs:
1. An expanded fuzzy-matching dictionary or a lightweight NLP classifier in `intentService.ts`.
2. Dedicated intents for missing environmental factors (SST, MLD, D20).
3. Logic to handle comparison constraints ("Which is *closer*", "Which is *safer*") rather than treating all comparisons identically.
4. Better compound sentence splitting before intent detection.
