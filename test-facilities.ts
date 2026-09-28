import { getNearbyMarineFacilities } from './src/data/marineInfrastructureResolver.js';
import locationsData from './src/data/indiaFishingLocations.json' assert { type: "json" };

function testFacilities(locationName, monthStr) {
  const loc = locationsData.find(l => l.name === locationName);
  if (!loc) {
    console.log(`\n=== ${locationName} + ${monthStr} ===`);
    console.log("NOT FOUND in indiaFishingLocations.json");
    return;
  }
  
  const month = monthStr === "October" ? 10 : monthStr === "November" ? 11 : 9;
  
  const candidates = getNearbyMarineFacilities(loc.id, month);
  console.log(`\n=== ${locationName} (ID: ${loc.id}) + ${monthStr} ===`);
  console.log(`Candidates count: ${candidates.length}`);
  
  if (candidates.length > 0) {
    const first = candidates[0];
    console.log("Example Candidate 1:");
    console.log(`  Facility ID: ${first.facilityId}`);
    console.log(`  Name: ${first.facilityName}`);
    console.log(`  Type: ${first.facilityType}`);
    console.log(`  Distance: ${first.distanceKm} km`);
    if (first.environment) {
      console.log(`  Env Wind: ${first.environment.windSpeedKmph} km/h`);
      console.log(`  Env Waves: ${first.environment.significantWaveHeightM} m`);
      console.log(`  Env Weather: ${first.environment.weatherCondition}`);
    } else {
      console.log("  Environment: null");
    }
  }
}

testFacilities("Mumbai", "October");
testFacilities("Kochi", "October");
testFacilities("Chennai", "October");
testFacilities("Delhi", "October");
