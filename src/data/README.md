# TARANG Master Inland Fishing Spots v5

This version separates EVIDENCE from OPERATIONAL DISCOVERY.

1. `tarang_inland_fishing_spots_master_v5.json`
   - Complete 65-record evidence layer.
   - Preserves documented fisheries resources even when exact fishing-access coordinates are not sufficiently verified.
   - Adds `evidenceClass` and `operationalDiscoveryEligible`.

2. `tarang_inland_fishing_spots_operational_candidates_v5.json`
   - Conservative subset for user-facing nearby fishing-destination discovery.
   - Requires BOTH:
     a) high coordinate confidence, and
     b) direct evidence of fishing, fish landing, fishing licensing/rights, or documented fishing activity.
   - Does NOT mean an individual user has legal permission to fish.

Important:
- This is NOT an exhaustive national inventory.
- It is NOT a live fishing-access or live safety dataset.
- `fishingPotential` remains null unless directly supported.
- Medium/low coordinate records are retained for research but excluded from precise nearby-destination discovery.
- Reservoir/fishery-resource evidence is not treated as proof of current public fishing access.
- Current legal restrictions/leases/licences must be checked separately before any real-world recommendation.
