import json
from collections import defaultdict

with open('src/data/environmentalBaseline.json') as f:
    env = json.load(f)

# Data counters
locations = set()
oct_records = 0
nov_records = 0
populated_records = 0
null_vars = {
    'windSpeed': 0, 'windDir': 0, 'waveHeight': 0, 'wavePeriod': 0, 
    'swellHeight': 0, 'visibility': 0, 'rainfall': 0, 'seaCond': 0
}
combos = set()
duplicates = 0
provenance_complete = True

# Expected Mumbai/Kochi values to check preservation
mumbai_oct_expected = {"windSpeedKmph": 9.3, "significantWaveHeightM": 0.45, "seaCondition": "smooth"}
kochi_oct_expected = {"windSpeedKmph": 6.4, "significantWaveHeightM": 0.73, "seaCondition": "slight"}

mumbai_preserved = False
kochi_preserved = False

for r in env:
    loc_id = r['infrastructureId']
    m = r['month']
    locations.add(loc_id)
    
    # Check duplicates
    if (loc_id, m) in combos:
        duplicates += 1
    combos.add((loc_id, m))
    
    if m == 10: oct_records += 1
    if m == 11: nov_records += 1
        
    has_data = r.get('windSpeedKmph') is not None
    if has_data:
        populated_records += 1
        
    # Null checking
    if r.get('windSpeedKmph') is None: null_vars['windSpeed'] += 1
    if r.get('windDirectionDeg') is None: null_vars['windDir'] += 1
    if r.get('significantWaveHeightM') is None: null_vars['waveHeight'] += 1
    if r.get('wavePeriodSec') is None: null_vars['wavePeriod'] += 1
    if r.get('swellHeightM') is None: null_vars['swellHeight'] += 1
    if r.get('visibilityKm') is None: null_vars['visibility'] += 1
    if r.get('rainfallCategory') is None: null_vars['rainfall'] += 1
    if r.get('seaCondition') is None: null_vars['seaCond'] += 1
        
    # Provenance check
    if 'sources' not in r or 'atmospheric' not in r['sources'] or 'marine' not in r['sources']:
        provenance_complete = False
        
    # Preservation check
    if loc_id == 'infra_port_0' and m == 10:
        if (r.get('windSpeedKmph') == mumbai_oct_expected['windSpeedKmph'] and 
            r.get('significantWaveHeightM') == mumbai_oct_expected['significantWaveHeightM'] and 
            r.get('seaCondition') == mumbai_oct_expected['seaCondition']):
            mumbai_preserved = True
            
    if loc_id == 'infra_port_2' and m == 10:
        if (r.get('windSpeedKmph') == kochi_oct_expected['windSpeedKmph'] and 
            r.get('significantWaveHeightM') == kochi_oct_expected['significantWaveHeightM'] and 
            r.get('seaCondition') == kochi_oct_expected['seaCondition']):
            kochi_preserved = True

# Missing combinations
missing_combos = 0
for loc in locations:
    if (loc, 10) not in combos: missing_combos += 1
    if (loc, 11) not in combos: missing_combos += 1

print(f"Total infrastructure locations: {len(locations)}")
print(f"October records: {oct_records}")
print(f"November records: {nov_records}")
print(f"Total records: {len(env)}")
print(f"Populated records: {populated_records}")
print(f"Null-variable counts: {null_vars}")
print(f"Duplicate count: {duplicates}")
print(f"Missing combinations: {missing_combos}")
print(f"Provenance completeness: {'Complete' if provenance_complete else 'Incomplete'}")
print(f"Mumbai value preservation check: {'PASS' if mumbai_preserved else 'FAIL'}")
print(f"Kochi value preservation check: {'PASS' if kochi_preserved else 'FAIL'}")
