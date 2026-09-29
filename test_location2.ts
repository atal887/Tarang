import { resolveFishermanContext } from './src/services/contextResolver';
import { formatNormalResponse } from './src/services/normalResponseFormatter';
import { evaluateFishermanContext } from './src/services/decisionEngine';

for (const loc of ["Mumbai", "Delhi"]) {
  const ctx = resolveFishermanContext({ query: `Is ${loc} a marine location?`, defaultLocationName: loc, defaultBoatType: "motorized" });
  const decision = evaluateFishermanContext(ctx.locationId, ctx.dateTime, ctx.boatType, ctx.originalQuery);
  console.log(formatNormalResponse(["LOCATION_CHECK"], ctx, decision));
}
