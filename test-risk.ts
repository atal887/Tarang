import { getNearbyMarineFacilities } from './src/data/marineInfrastructureResolver.js';
import { evaluateMarineFacilityRisk } from './src/data/marineRiskResolver.js';
import locationsData from './src/data/indiaFishingLocations.json' assert { type: "json" };

function testRisk(locationName, monthStr, vesselType) {
  const loc = locationsData.find(l => l.name === locationName);
  if (!loc) {
    console.log(`NOT FOUND in indiaFishingLocations.json`);
    return;
  }
  
  const month = monthStr === "October" ? 10 : monthStr === "November" ? 11 : 9;
  const candidates = getNearbyMarineFacilities(loc.id, month);
  
  if (candidates.length === 0) {
    console.log(`No candidates for ${locationName}`);
    return;
  }
  
  // Test the first candidate
  const first = candidates[0];
  const evalResult = evaluateMarineFacilityRisk(first, vesselType);
  
  console.log(`\n=== ${locationName} + ${monthStr} | ${vesselType} ===`);
  console.log(`Facility: ${evalResult.facilityName} (${evalResult.facilityType})`);
  console.log(`Distance: ${evalResult.distanceKm} km`);
  console.log(`Wind: ${evalResult.windSpeedKmph} km/h`);
  console.log(`Waves: ${evalResult.significantWaveHeightM} m`);
  console.log(`Score: ${evalResult.riskScore ? evalResult.riskScore.toFixed(2) : 'null'}`);
  console.log(`Band: ${evalResult.riskBand}`);
  console.log(`Suitability: ${evalResult.suitability}`);
}

const vessels = ['non_motorized', 'motorized', 'mechanized'];
for (const v of vessels) {
  testRisk("Mumbai", "October", v);
}
for (const v of vessels) {
  testRisk("Kochi", "October", v);
}
