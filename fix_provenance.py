import json

with open('src/data/environmentalBaseline.json') as f:
    data = json.load(f)

for r in data:
    # Everyone gets updated dataType
    r['dataType'] = "historical_reanalysis_monthly_baseline"
    
    # Update source schema
    old_source = r['source']
    
    # Determine if it's the populated one (Mumbai/Kochi) or the unpopulated one
    if r['windSpeedKmph'] is not None:
        new_source = {
            "organization": "ECMWF / Copernicus Marine Service",
            "dataset": "ERA5 historical reanalysis / Global Ocean Waves Reanalysis",
            "accessMethod": "Open-Meteo Historical Weather & Marine APIs",
            "url": "https://open-meteo.com/en/docs",
            "sourcePeriod": "2023-10-01 to 2023-11-30",
            "aggregation": "monthly mean of hourly data",
            "method": "nearest grid point"
        }
    else:
        # For the unpopulated ones, we just match the schema but keep them pending
        new_source = {
            "organization": "ECMWF / Copernicus Marine Service",
            "dataset": "ERA5 historical reanalysis / Global Ocean Waves Reanalysis",
            "accessMethod": "Open-Meteo Historical Weather & Marine APIs",
            "url": "https://open-meteo.com/en/docs",
            "sourcePeriod": "2023-10-01 to 2023-11-30",
            "aggregation": "monthly mean of hourly data",
            "method": "Environmental source identified but data ingestion pending."
        }
    
    r['source'] = new_source

with open('src/data/environmentalBaseline.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Provenance updated!")
