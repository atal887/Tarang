import { getEnvironmentalConditions } from './src/data/environmentResolver.js';
import locations from './src/data/indiaFishingLocations.json' assert { type: "json" };

const matchedLoc = locations.find(l => l.name.toLowerCase() === 'mumbai');
if (matchedLoc) {
  const env = getEnvironmentalConditions(matchedLoc.name, matchedLoc.latitude, matchedLoc.longitude);
  console.log("Mumbai env:", env);
} else {
  console.log("Mumbai not found in locations");
}
