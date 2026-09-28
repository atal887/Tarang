import { getEnvironmentalConditions } from './src/data/environmentResolver.js';
import { resolveFishingLocation } from './src/data/locationResolver.js';
import locations from './src/data/indiaFishingLocations.json' assert { type: "json" };

function testLookup(name, monthStr) {
  const loc = locations.find(l => l.name === name);
  if (!loc) {
    console.log(`${name}: NOT FOUND in indiaFishingLocations.json`);
    return;
  }
  
  // mock the month (10=Oct, 11=Nov)
  const realDate = Date;
  global.Date = class extends realDate {
    getMonth() {
      // getMonth() returns 0-11. We mapped evalMonth to currentMonth + 1 if it was 9 or 10.
      // So if we want evalMonth 10 (Oct), we need getMonth() to return 9.
      // If we want evalMonth 11 (Nov), we need getMonth() to return 10.
      return monthStr === "October" ? 9 : monthStr === "November" ? 10 : 9;
    }
  };

  const env = getEnvironmentalConditions(name, loc.latitude, loc.longitude);
  console.log(`\n=== ${name} + ${monthStr} ===`);
  if (!env) {
    console.log('Result: null/unsupported');
  } else {
    console.log(`isMarine: ${env.isMarine}`);
    console.log(`weatherDesc: ${env.weatherDesc}`);
    console.log(`wind: ${env.wind}`);
    if (env.isMarine) {
      console.log(`waves: ${env.waves}`);
      console.log(`waveApplicability: ${env.waveApplicability}`);
      console.log(`cycloneStatus: ${env.cycloneStatus}`);
    } else {
      console.log(`rainfall: ${env.rainfall}`);
      console.log(`waveApplicability: ${env.waveApplicability}`);
    }
  }

  global.Date = realDate;
}

testLookup("Mumbai", "October");
testLookup("Kochi", "October");
testLookup("Delhi", "October");
testLookup("Bengaluru", "November");
