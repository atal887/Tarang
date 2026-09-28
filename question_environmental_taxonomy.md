# TARANG Environmental Question Taxonomy

This document audits the environmental variables available in TARANG's existing marine and inland data structures, maps their current intent coverage, and proposes the next phase of natural-language expansion and response formatting.

## 1. Wind Speed & Conditions

*   **Data Field:** `windSpeedKmph` (Marine & Inland safety evaluation)
*   **Current Intent:** `WIND_FORECAST`
*   **Normal Mode Support:** Yes (Currently returns generic string)
*   **Research Mode Support:** Yes (Shows on dashboard, but chat answer is generic)
*   **Context Requirements:** Needs Location. Time/Date is currently supported via `SAFETY_TOMORROW`.
*   **Follow-Up Capable:** Yes (e.g. "What about the wind there?")
*   **Missing Intent Coverage:** Differentiating a request for raw data ("What is the wind speed?") vs. safety evaluation ("Is the wind too strong?").
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the wind speed?"
    *   *Natural:* "Is it blowing hard?" / "How windy is it?"
    *   *Conversational:* "And the wind?" / "What about the wind?"
    *   *Compound:* "Is it windy and rough?"

### Proposed Response Structure (Normal Mode)
> Wind Speed: **25 km/h**
> Your Vessel Limit: **40 km/h** (Motorized)
> Status: **Safe**
> 
> The wind conditions at [Location] are well within the safe operating limits for your motorized boat.

---

## 2. Wave Height & Sea State

*   **Data Field:** `significantWaveHeightM` (Marine safety evaluation)
*   **Current Intent:** `WAVE_HEIGHT`
*   **Normal Mode Support:** Yes
*   **Research Mode Support:** Yes
*   **Context Requirements:** Needs Location.
*   **Follow-Up Capable:** Yes.
*   **Missing Intent Coverage:** Differentiating safety ("Are the waves too high for my boat?") from data ("What's the wave height?").
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the wave height?"
    *   *Natural:* "How rough is the sea?" / "Are the waves big today?"
    *   *Conversational:* "How are the waves there?" / "Is the water choppy?"
    *   *Compound:* "What's the wave height and is it safe?"

### Proposed Response Structure (Normal Mode)
> Wave Height: **1.2 m**
> Your Vessel Limit: **1.4 m** (Motorized)
> Status: **Caution**
>
> The waves at [Location] are nearing your vessel's upper limit. Please exercise caution if heading out.

---

## 3. Sea Surface Temperature (SST)

*   **Data Field:** `seaSurfaceTemperatureC` (Marine productivity evaluation)
*   **Current Intent:** None explicitly mapped (falls to UNKNOWN or PRODUCTIVITY_ANALYSIS if combined).
*   **Normal Mode Support:** No (Currently not answered directly).
*   **Research Mode Support:** No direct chat answer, though it exists in the UI radar chart.
*   **Context Requirements:** Needs Location.
*   **Follow-Up Capable:** Yes.
*   **Missing Intent Coverage:** Needs a new `SST_CONDITIONS` intent.
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the SST?" / "What is the sea surface temperature?"
    *   *Natural:* "How warm is the water?" / "Is the water temperature good for fishing?"
    *   *Conversational:* "What about the temperature?" (Requires disambiguation from weather temp).
    *   *Ambiguous:* "What is the temperature?" -> Disambiguate to SST if context is marine.

### Proposed Response Structure (Research Mode)
> Sea Surface Temperature (SST): **28.7 °C**
> Range: **Optimal (27-31°C)**
>
> The surface water temperature here is favorable for pelagic species aggregation, supporting the high productivity score.

---

## 4. Ocean Currents (Speed & Direction)

*   **Data Field:** `surfaceCurrentSpeedMs`, `surfaceCurrentDirectionDeg`
*   **Current Intent:** `CURRENT_COASTAL_CONDITIONS`
*   **Normal Mode Support:** Yes (Basic).
*   **Research Mode Support:** Yes (Basic).
*   **Context Requirements:** Needs Location.
*   **Missing Intent Coverage:** Direction is often ignored. Need to handle "Which way is the current flowing?".
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the surface current speed?"
    *   *Natural:* "How strong are the currents?" / "Which way is the current moving?"
    *   *Conversational:* "And the current?"
    *   *Ambiguous:* "What are the current conditions?" -> Must disambiguate between *ocean currents* and *present weather conditions*.

### Proposed Response Structure (Normal Mode)
> Current Speed: **0.35 m/s**
> Direction: **240° (South-West)**
>
> Ocean currents in this zone are moderate and typical for this season.

---

## 5. Chlorophyll-a Concentration

*   **Data Field:** `chlorophyllMgM3`
*   **Current Intent:** `CHLOROPHYLL_ZONE`
*   **Normal Mode Support:** Yes (Basic).
*   **Research Mode Support:** Yes (Detailed in UI, basic in chat).
*   **Context Requirements:** Needs Location.
*   **Missing Intent Coverage:** Linking chlorophyll directly to "baitfish" or "food availability" questions.
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the chlorophyll concentration?"
    *   *Natural:* "Is there enough plankton/food for fish?" / "Is the water green?"
    *   *Conversational:* "What about the chlorophyll?"

### Proposed Response Structure (Research Mode)
> Chlorophyll-a: **1.2 mg/m³**
> Status: **High Concentration**
>
> This elevated level indicates a strong phytoplankton presence, which serves as the base of the marine food web and attracts larger commercial fish.

---

## 6. Depth Metrics (MLD & D20)

*   **Data Field:** `mixedLayerDepthM` (MLD), `d20DepthM` (D20 isotherm)
*   **Current Intent:** None.
*   **Normal Mode Support:** No.
*   **Research Mode Support:** Visual only.
*   **Context Requirements:** Needs Location.
*   **Missing Intent Coverage:** Needs `MLD_CONDITIONS` and `D20_CONDITIONS`.
*   **Natural-Language Variations to Add:**
    *   *Direct:* "What is the mixed layer depth?" / "What is the D20?"
    *   *Natural:* "How deep is the warm water?" / "Where is the thermocline?"

### Proposed Response Structure (Research Mode)
> Mixed Layer Depth (MLD): **67 m**
> D20 Isotherm Depth: **95 m**
> 
> A shallower MLD concentrates nutrients and fish in the upper water column, making them more accessible to surface and mid-water fishing gear.

---

## 7. Ambiguity Disambiguation Rules

To prevent misclassification, TARANG needs explicit disambiguation for the following terms:

1. **"Current"**
   - *Rule:* If combined with "speed", "strong", "flow", "direction", or "water", classify as `CURRENT_COASTAL_CONDITIONS` (Ocean Current).
   - *Rule:* If combined with "situation", "weather", or "conditions" (e.g. "current conditions"), classify as `OVERALL_CONDITIONS` or `SAFETY_TOMORROW`.
2. **"Temperature"**
   - *Rule:* Always map to `SST_CONDITIONS` when discussing marine zones, as TARANG does not track atmospheric air temperature. (If asked about air temp, clarify that only SST is tracked).
3. **"Conditions" / "Water"**
   - *Rule:* If asked "How are the conditions?", default to safety (waves/wind). 
   - *Rule:* If asked "How is the water?", default to `WAVE_HEIGHT`, but offer a Research Mode prompt to view SST/Chlorophyll.
4. **"Good"**
   - *Rule:* "Is it good?" requires clarification (Safety vs. Fishing Potential). This is correctly handled by the current Ambiguity Safety Rule.

---

## 8. Compound-Question Handling

Currently, compound questions (e.g. "What's the wind and wave height?") fail because the regex matcher picks the first one it sees. 

**Proposed Phase 3 Solution:**
Instead of a flat regex loop returning a single string, `intentService.ts` should return an array of matched intents `IntentCategory[]`. The Response Formatters can then iterate through the multiple intents (e.g., pulling both Wind and Wave data points) and combine them into a single coherent markdown response.

## Files to Modify in Phase 2
- `src/data/questionBank.ts` (Add SST, MLD, D20 intents)
- `src/services/intentService.ts` (Add regexes for new intents, disambiguation logic for "current")
- `src/services/normalResponseFormatter.ts` (Implement the structured Markdown blocks proposed above)
- `src/services/researchResponseFormatter.ts` (Implement the scientific explanation blocks)
- `intent_test_suite.ts` (Add tests for new intents and ambiguous cases)

*Note: No modifications to decision engines or core math are required.*
