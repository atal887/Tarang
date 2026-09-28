import { getNearbyMarineFacilities } from './src/data/marineInfrastructureResolver.js';
import { resolveMarineFishingConditions } from './src/data/marineFishingConditionResolver.js';

console.log("\n--- Test: Marine Fishing Condition Resolver ---");
const facilities = getNearbyMarineFacilities("loc_0", 10);
const conditioned = resolveMarineFishingConditions(facilities, new Date());

console.log(`Resolved ${conditioned.length} facilities.`);
conditioned.slice(0, 2).forEach((f, i) => {
  console.log(`  ${i+1}. ${f.facilityName}`);
  console.log(`     Distance: ${f.distanceKm.toFixed(1)} km`);
  console.log(`     Wind: ${f.environment?.windSpeedKmph} km/h`);
  console.log(`     Waves: ${f.environment?.significantWaveHeightM} m`);
});
