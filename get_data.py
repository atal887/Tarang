import urllib.request
import zipfile
import io
import csv
import json
import math

print("Downloading Geonames IN.zip...")
url = "https://download.geonames.org/export/dump/IN.zip"
response = urllib.request.urlopen(url)
with zipfile.ZipFile(io.BytesIO(response.read())) as z:
    with z.open('IN.txt') as f:
        content = f.read().decode('utf-8')

records = []
for line in content.split('\n'):
    parts = line.split('\t')
    if len(parts) > 14 and parts[7] == 'PPL' and parts[14].isdigit():
        pop = int(parts[14])
        if pop > 8000:
            records.append({
                'name': parts[1],
                'lat': float(parts[4]),
                'lon': float(parts[5]),
                'state': parts[10],
                'pop': pop
            })

records = sorted(records, key=lambda x: x['pop'], reverse=True)[:7933]
print(f"Found {len(records)} records")

states_marine = {
    '02': 'marine', # Andhra Pradesh
    '09': 'marine', # Gujarat
    '13': 'marine', # Kerala
    '16': 'marine', # Maharashtra
    '19': 'marine', # Odisha
    '25': 'marine', # Tamil Nadu
    '28': 'marine', # West Bengal
    '07': 'marine', # Daman and Diu
    '11': 'marine', # Goa
    '33': 'marine', # Andaman and Nicobar
    '17': 'marine', # Lakshadweep
    '22': 'marine', # Puducherry
    '12': 'marine', # Karnataka
}

locations = []
for i, r in enumerate(records):
    # Calculate if it's near coast (rough bounding box)
    # This is a very rough approximation, we will use the state and a simple coastal distance check if needed
    is_marine = False
    state_code = r['state']
    
    # We will refine marine based on distance from coast.
    # But for a quick mock, let's say cities in coastal states within some long/lat bounds are marine.
    
    locations.append({
        'id': f"loc_{i}",
        'name': r['name'],
        'state': r['state'],
        'district': "Unknown",
        'subDistrict': "Unknown",
        'fisheriesType': "inland", # will update
        'waterContext': "inland_general",
        'region': "unknown",
        'latitude': r['lat'],
        'longitude': r['lon']
    })

with open('src/data/indiaFishingLocations.json', 'w') as f:
    json.dump(locations, f)
print("Done")
