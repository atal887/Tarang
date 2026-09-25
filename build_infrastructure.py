import json
import math
import re

with open('harbours_scraped.json') as f:
    harbours_data = json.load(f)

ports_data = [
    [18.9322, 72.8466, 'Mumbai Port', 'Mumbai', 'Maharashtra', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [18.9500, 72.9500, 'Jawaharlal Nehru Port Trust (JNPT)', 'Raigad', 'Maharashtra', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [9.9631, 76.2625, 'Cochin Port', 'Ernakulam', 'Kerala', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [12.9288, 74.8142, 'New Mangalore Port', 'Dakshina Kannada', 'Karnataka', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [15.4093, 73.8043, 'Mormugao Port', 'South Goa', 'Goa', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [13.0846, 80.2934, 'Chennai Port', 'Chennai', 'Tamil Nadu', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [17.6970, 83.2848, 'Visakhapatnam Port', 'Visakhapatnam', 'Andhra Pradesh', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [20.2644, 86.6710, 'Paradip Port', 'Jagatsinghpur', 'Odisha', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [22.5401, 88.3185, 'Syama Prasad Mookerjee Port (Kolkata Port)', 'Kolkata', 'West Bengal', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [22.0256, 88.1065, 'Haldia Port', 'Purba Medinipur', 'West Bengal', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [23.0135, 70.2197, 'Deendayal Port (Kandla)', 'Kutch', 'Gujarat', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [8.7562, 78.1873, 'V. O. Chidambaranar Port (Tuticorin)', 'Thoothukudi', 'Tamil Nadu', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [13.2562, 80.3340, 'Kamarajar Port (Ennore)', 'Chennai', 'Tamil Nadu', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [21.6366, 69.6015, 'Porbandar Port', 'Porbandar', 'Gujarat', 'https://shipmin.gov.in/en/publication/trw-publication'],
    [11.6667, 92.7333, 'Port Blair Port', 'South Andaman', 'Andaman & Nicobar Islands', 'https://shipmin.gov.in/en/publication/trw-publication'],
]

records = []
for i, h in enumerate(harbours_data):
    name_lower = h['name'].lower()
    is_flc = 'landing' in name_lower or 'flc' in name_lower
    type_str = "fish_landing_centre" if is_flc else "fishing_harbour"
    records.append({
        "id": f"infra_pmmsy_{i}",
        "name": h['name'], "type": type_str, "state": h['state'], "district": h['district'],
        "latitude": h['lat'], "longitude": h['lon'],
        "associatedLocationId": None, "distanceFromAssociatedLocationKm": None,
        "source": {
            "organization": "Department of Fisheries",
            "dataset": "PMMSY Official Web Map", "url": "https://pmmsy.dof.gov.in/static/harbour/harbours.html", "accessedAt": "2026-09-25"
        },
        "coordinateSource": "Extracted from PMMSY Web Map visualization arrays",
        "coordinateConfidence": "medium", "notes": ""
    })

for i, h in enumerate(ports_data):
    records.append({
        "id": f"infra_port_{i}",
        "name": h[2], "type": "port", "state": h[4], "district": h[3],
        "latitude": h[0], "longitude": h[1],
        "associatedLocationId": None, "distanceFromAssociatedLocationKm": None,
        "source": {
            "organization": "Ministry of Ports, Shipping and Waterways",
            "dataset": "Basic Port Statistics of India 2024-25 (Demo-relevant port subset)", "url": h[5], "accessedAt": "2026-09-25"
        },
        "coordinateSource": "Supplementary Geospatial Extraction (GeoNames/OpenStreetMap)",
        "coordinateConfidence": "high", "notes": "Representing a demo-relevant subset of major and key non-major ports. India has over 200 non-major ports."
    })

records.append({
    "id": "flc_aggregate_india",
    "name": "India Notified Marine Fish Landing Centres (Aggregate)",
    "type": "fish_landing_centre_aggregate",
    "state": "All Coastal States", "district": "Multiple", "notifiedCount": 1547,
    "source": {
        "organization": "Department of Fisheries",
        "dataset": "Official SOP for Marine Fish Landing Centres", "url": "https://www.dof.gov.in/static/uploads/2026/01/93b14ece1aa0a35cb768e40d38e5b73b.pdf", "accessedAt": "2026-09-25"
    },
    "notes": "Name-level coordinate data remains pending for the majority of the 1547 centres. Only the 31 FLCs from the PMMSY map are listed individually."
})

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

with open('src/data/indiaFishingLocations.json') as f: locations = json.load(f)

synonyms = {'Cochin': 'Kochi', 'Mangalore': 'Mangaluru', 'Tuticorin': 'Thoothukkudi', 'Goa': 'Panaji', 'Trivandrum': 'Thiruvananthapuram', 'Calicut': 'Kozhikode'}

for r in records:
    if 'latitude' in r and 'longitude' in r:
        nearby_locs = []
        for loc in locations:
            if loc['fisheriesType'] != 'marine': continue
            d = haversine(r['latitude'], r['longitude'], loc['latitude'], loc['longitude'])
            if d <= 30.0: nearby_locs.append((d, loc))
        if not nearby_locs:
            r['associatedLocationId'] = None
            continue
        nearby_locs.sort(key=lambda x: x[0])
        admin_match = None
        infra_name = r['name'].lower()
        infra_dist_lower = r['district'].lower() if r.get('district') else ""
        for syn, repl in synonyms.items():
            infra_name = infra_name.replace(syn.lower(), repl.lower())
            infra_dist_lower = infra_dist_lower.replace(syn.lower(), repl.lower())
        for d, loc in nearby_locs:
            loc_name = loc['name'].lower()
            if loc_name in infra_name or loc_name in infra_dist_lower:
                admin_match = (d, loc)
                break
        best_match = admin_match if admin_match else nearby_locs[0]
        r['associatedLocationId'] = best_match[1]['id']
        r['distanceFromAssociatedLocationKm'] = round(best_match[0], 2)

with open('src/data/marineInfrastructure.json', 'w') as f: json.dump(records, f, indent=2)
print(f"Generated {len(records)} marine infrastructure records.")
