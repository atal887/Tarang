const fs = require('fs');

const locs = JSON.parse(fs.readFileSync('src/data/indiaFishingLocations.json', 'utf8'));
const infra = JSON.parse(fs.readFileSync('src/data/marineInfrastructure.json', 'utf8'));

const test_cities = [
    'Mumbai', 'Chennai', 'Kochi', 'Mangaluru', 'Visakhapatnam', 'Veraval',
    'Porbandar', 'Paradip', 'Goa', 'Port Blair', 'Delhi', 'Bengaluru', 'Hyderabad'
];

for (const city of test_cities) {
    const matched_loc = locs.find(l => l.name.toLowerCase() === city.toLowerCase() || (l.name.toLowerCase().includes(city.toLowerCase()) && !l.name.includes('New')));
    if (!matched_loc) {
        console.log(`${city}: Location not found in master dataset.`);
        continue;
    }
    
    if (matched_loc.fisheriesType !== 'marine') {
        console.log(`${city} (Inland) -> Ports: 0, Fishing Harbours: 0`);
        continue;
    }
    
    const matched_infra = infra.filter(i => i.associatedLocationId === matched_loc.id);
    const ports = matched_infra.filter(i => i.type === 'port');
    const fhs = matched_infra.filter(i => i.type === 'fishing_harbour');
    
    console.log(`${city} -> Ports: ${ports.length} [${ports.map(p=>p.name).join(', ')}], Fishing Harbours: ${fhs.length} [${fhs.map(f=>f.name).join(', ')}]`);
}
