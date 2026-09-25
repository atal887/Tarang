import json
import os

with open('src/data/marineInfrastructure.json') as f:
    infra_data = json.load(f)

# Extract infrastructure IDs associated with the target demo locations
# Let's map target city names to their expected associated locations
# (Mumbai -> Mumbai, Kochi -> Kochi, Mangaluru -> Mangaluru, etc.)

target_locations = [
    'Mumbai', 'Chennai', 'Kochi', 'Mangaluru', 'Visakhapatnam',
    'Veraval', 'Porbandar', 'Paradip', 'Panaji', 'Mormugao', 'Port Blair'
]

# We need the loc_ids for these cities from indiaFishingLocations.json
with open('src/data/indiaFishingLocations.json') as f:
    loc_data = json.load(f)

target_loc_ids = set()
for city in target_locations:
    for loc in loc_data:
        if city.lower() in loc['name'].lower() and loc['fisheriesType'] == 'marine':
            target_loc_ids.add(loc['id'])

demo_infra_ids = []
for infra in infra_data:
    if infra.get('associatedLocationId') in target_loc_ids:
        demo_infra_ids.append(infra['id'])

records = []
months = [10, 11]

for infra_id in demo_infra_ids:
    for m in months:
        records.append({
            "infrastructureId": infra_id,
            "month": m,
            "windSpeedKmph": None,
            "windDirectionDeg": None,
            "significantWaveHeightM": None,
            "wavePeriodSec": None,
            "swellHeightM": None,
            "visibilityKm": None,
            "rainfallCategory": None,
            "seaCondition": None,
            "dataType": "seasonal_demo_baseline",
            "source": {
                "organization": "INCOIS (Indian National Centre for Ocean Information Services) / IMD",
                "dataset": "Live Access Server (LAS) / ERDDAP Historical Ocean State Climatology",
                "url": "https://incois.gov.in/site/index.jsp",
                "sourcePeriod": "2010-2023 Climatological Mean",
                "method": "Environmental source identified but data ingestion pending."
            }
        })

with open('src/data/environmentalBaseline.json', 'w') as f:
    json.dump(records, f, indent=2)

print(f"Generated {len(records)} environmental baseline records across {len(demo_infra_ids)} infrastructure locations.")
