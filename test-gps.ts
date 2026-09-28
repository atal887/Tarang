import { getEnvironmentalConditions } from './src/data/environmentResolver.js';
import { resolveFishingLocation } from './src/data/locationResolver.js';

// Simulate GPS location near Kochi
const lat = 9.96;
const lon = 76.23;

const locName = "Current Location";
const env = getEnvironmentalConditions(locName, lat, lon);

console.log("Resolved env:", env);

const resolved = resolveFishingLocation(lat, lon);
console.log("Resolved loc:", resolved);
