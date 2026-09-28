import fs from 'fs';
import path from 'path';

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data', name), 'utf8'));
}

const places = load('tarang_place_registry_7935_v1.json');
const infra = load('tarang_marine_infrastructure_clean_v1.json');
const env = load('tarang_marine_infrastructure_environment_clean_v1.json');
const cands = load('tarang_marine_nearby_candidates_clean_v1.json');

console.log('1. Record Count:');
console.log(`- Places: ${places.length}`);
console.log(`- Infrastructure: ${infra.length}`);
console.log(`- Environment: ${env.length}`);
console.log(`- Candidates: ${cands.length}`);

console.log('\n2. Key Fields Present (sample from first record):');
console.log('- Places:', Object.keys(places[0]).join(', '));
console.log('- Infrastructure:', Object.keys(infra[0]).join(', '));
console.log('- Environment:', Object.keys(env[0]).join(', '));
console.log('- Candidates:', Object.keys(cands[0]).join(', '));

const placeIds = new Set(places.map(p => p.id));
const infraIds = new Set(infra.map(i => i.facilityId));

console.log('\n3. Candidate resolution:');
const unresolvedCands = cands.filter(c => !infraIds.has(c.facilityId));
console.log(`- All candidates resolve to a facility: ${unresolvedCands.length === 0}`);

console.log('\n4. Infrastructure resolution:');
// Wait, do infra records resolve to places? Is there a locationId on them?
// No, infra records don't have locationId according to keys: facilityId, facilityType, name, district, latitude, longitude, coordinateStatus, source, sourceUrl, state
// Let's check if infra resolves to place using something else, or if the question meant "does nearby candidates resolve to places?".
const unresolvedCandsPlace = cands.filter(c => !placeIds.has(c.locationId));
console.log(`- All candidates resolve to a place: ${unresolvedCandsPlace.length === 0} (${unresolvedCandsPlace.length} unresolved)`);

console.log('\n5. Fishing Harbours state fields:');
// facilityType instead of type
const harbours = infra.filter(i => i.facilityType === 'fishing_harbour');
const harboursWithoutState = harbours.filter(h => !h.state);
console.log(`- ${harbours.length} harbours found.`);
console.log(`- Harbours with populated state field: ${harbours.length - harboursWithoutState.length}/${harbours.length}`);

console.log('\n6. Place Registry canonical/ambiguity fields:');
const hasCanonical = places.some(p => 'canonical' in p || 'canonicalName' in p || 'canonical_name' in p);
const hasAmbiguity = places.some(p => 'ambiguity' in p || 'isAmbiguous' in p || 'ambiguous' in p || 'ambiguity_status' in p);
console.log(`- Contains canonical fields: ${hasCanonical}`);
console.log(`- Contains ambiguity fields: ${hasAmbiguity}`);
