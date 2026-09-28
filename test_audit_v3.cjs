const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data', name), 'utf8'));
}

const places = load('tarang_place_registry_7935_v1 copy.json');
const infra = load('tarang_marine_infrastructure_clean_v1 copy.json');
const env = load('tarang_marine_infrastructure_environment_clean_v1 copy.json');
const cands = load('tarang_marine_nearby_candidates_clean_v1 copy.json');

console.log('1. Place registry:', places.length);
console.log('2. Infrastructure:', infra.length);
console.log('3. Infrastructure environment:', env.length);
console.log('4. Nearby candidates:', cands.length);

const placeIds = new Set(places.map(p => p.locationId));
const infraIds = new Set(infra.map(i => i.facilityId));

const unresolvedCandsPlace = cands.filter(c => !placeIds.has(c.locationId));
console.log('5. All candidate locationIds resolve to place registry:', unresolvedCandsPlace.length === 0);

const unresolvedCandsInfra = cands.filter(c => !infraIds.has(c.facilityId));
console.log('6. All candidate facilityIds resolve to 81 infra:', unresolvedCandsInfra.length === 0);

const harbours = infra.filter(i => i.facilityType === 'fishing_harbour');
const harboursWithoutState = harbours.filter(h => !h.stateCode);
console.log(`7. All ${harbours.length} harbours have populated state fields:`, harbours.length > 0 && harboursWithoutState.length === 0);

const hasCanonical = places.some(p => 'canonicalDisplayName' in p);
const hasMatchKey = places.some(p => 'nameMatchKey' in p);
const hasAmbiguous = places.some(p => 'nameIsAmbiguous' in p);
console.log(`8. Place registry contains fields: canonicalDisplayName=${hasCanonical}, nameMatchKey=${hasMatchKey}, nameIsAmbiguous=${hasAmbiguous}`);
