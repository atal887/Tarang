import urllib.request
import zipfile
import io
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
    if len(parts) > 14 and parts[7] == 'PPL':
        pop = int(parts[14]) if parts[14].isdigit() else 0
        records.append({
            'name': parts[1],
            'lat': float(parts[4]),
            'lon': float(parts[5]),
            'state': parts[10],
            'district': parts[11],
            'pop': pop
        })

records = sorted(records, key=lambda x: x['pop'], reverse=True)[:7933]
print(f"Found {len(records)} records")

# Rough Indian coastlines for distance calculation
coasts = [
    (23.7, 68.0), (22.0, 69.0), (20.0, 72.5), (18.0, 72.8), (15.0, 74.0),
    (12.0, 75.0), (8.0, 77.0), (10.0, 79.5), (13.0, 80.2), (16.0, 81.5),
    (18.0, 84.0), (20.0, 86.5), (21.5, 88.0)
]

def dist(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1-lat2)**2 + (lon1-lon2)**2)

locations = []
marine_count = 0
inland_count = 0
for i, r in enumerate(records):
    min_dist = min(dist(r['lat'], r['lon'], clat, clon) for clat, clon in coasts)
    
    # Approx 30-40km is ~0.3-0.4 degrees
    if min_dist < 0.4:
        fisheriesType = "marine"
        waterContext = "coastal_sea"
        region = "coastal"
        marine_count += 1
    else:
        fisheriesType = "inland"
        waterContext = "inland_general"
        region = "inland"
        inland_count += 1
        
    locations.append({
        'id': f"loc_{i}",
        'name': r['name'],
        'state': r['state'],
        'district': r['district'],
        'subDistrict': "Unknown",
        'fisheriesType': fisheriesType,
        'waterContext': waterContext,
        'region': region,
        'latitude': r['lat'],
        'longitude': r['lon']
    })

with open('src/data/indiaFishingLocations.json', 'w') as f:
    json.dump(locations, f)
print(f"Marine: {marine_count}, Inland: {inland_count}")
