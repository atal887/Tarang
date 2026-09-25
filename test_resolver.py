import json

with open('src/data/indiaFishingLocations.json') as f:
    locs = json.load(f)
with open('src/data/marineInfrastructure.json') as f:
    infra = json.load(f)

test_cities = [
    'Mumbai', 'Chennai', 'Kochi', 'Mangaluru', 'Visakhapatnam', 'Veraval',
    'Porbandar', 'Paradip', 'Goa', 'Port Blair', 'Delhi', 'Bengaluru', 'Hyderabad'
]

for city in test_cities:
    matched_loc = None
    for l in locs:
        if l['name'].lower() == city.lower() or (city.lower() in l['name'].lower() and 'new' not in l['name'].lower()):
            matched_loc = l
            break
            
    if not matched_loc:
        print(f"{city}: Location not found in master dataset.")
        continue
        
    if matched_loc['fisheriesType'] != 'marine':
        print(f"{city} (Inland) -> Ports: 0, Fishing Harbours: 0")
        continue
        
    matched_infra = [i for i in infra if i.get('associatedLocationId') == matched_loc['id']]
    ports = [i['name'] for i in matched_infra if i['type'] == 'port']
    fhs = [i['name'] for i in matched_infra if i['type'] == 'fishing_harbour']
    
    print(f"{city} -> Ports: {len(ports)} [{', '.join(ports)}], Fishing Harbours: {len(fhs)} [{', '.join(fhs)}]")
