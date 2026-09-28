# TARANG Clean Data Package v1

This package is the cleaned foundation for the TARANG productivity-intelligence build.

Critical provenance:
Environmental values are deterministic synthetic prototype baselines constrained by researched variable definitions and regional patterns. They are NOT live observations.

Key cleaning performed:
- Added a canonical 7,935-location registry with ID-first matching and ambiguity flags.
- Repaired 27 nearby-candidate IDs containing a leading form-feed control character.
- Populated missing state metadata for the 66 PMMSY fishing-harbour records using the official 66-harbour list.
- Replaced missing/NaN facility-environment state values with valid state strings.
- Preserved sourceName while adding canonicalDisplayName.
- Revalidated coordinates, IDs, month uniqueness, candidate distances, and marine/inland field applicability.
- No new fishing destinations were invented.

Important scope rules:
- The 15 ports are a demo-relevant subset, not a complete national port inventory.
- PFZ potential and fishing potential must not be double-counted until their derivation is formally specified.
- The prototype cannot claim exact fish abundance, guaranteed catch, species-specific prediction, official live PFZ, or long-term productivity trends from this snapshot alone.
