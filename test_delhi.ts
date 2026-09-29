import { resolveFishermanContext } from './src/services/contextResolver';
import { getLocationEnvironment } from './src/data/environmentResolver';

const ctx = resolveFishermanContext({ query: "Is Delhi a marine location?", defaultLocationName: "Delhi", defaultBoatType: "motorized" });
console.log("Location ID:", ctx.locationId);
console.log("Env:", getLocationEnvironment(ctx.locationId, 10));
