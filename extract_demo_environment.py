import json
import urllib.request
import time

def fetch_data(lat, lon, start_date, end_date):
    marine_url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&hourly=wave_height,wave_period,swell_wave_height&start_date={start_date}&end_date={end_date}"
    req = urllib.request.Request(marine_url, headers={'User-Agent': 'Mozilla/5.0'})
    marine_res = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
    
    weather_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&hourly=wind_speed_10m,wind_direction_10m&start_date={start_date}&end_date={end_date}"
    req2 = urllib.request.Request(weather_url, headers={'User-Agent': 'Mozilla/5.0'})
    weather_res = json.loads(urllib.request.urlopen(req2, timeout=10).read().decode('utf-8'))
    
    return marine_res, weather_res

def compute_mean(arr):
    valid = [x for x in arr if x is not None]
    if not valid: return None
    return sum(valid) / len(valid)

def get_sea_condition(wave_height):
    if wave_height is None: return "unknown"
    if wave_height < 0.5: return "smooth"
    if wave_height < 1.25: return "slight"
    if wave_height < 2.5: return "moderate"
    if wave_height < 4.0: return "rough"
    return "very rough"

with open('src/data/marineInfrastructure.json') as f:
    infra_data = {item['id']: item for item in json.load(f)}

with open('src/data/environmentalBaseline.json') as f:
    env_data = json.load(f)

for r in env_data:
    i_id = r['infrastructureId']
    lat = infra_data[i_id].get('latitude')
    lon = infra_data[i_id].get('longitude')
    
    needs_fetch = r.get('windSpeedKmph') is None

    if needs_fetch and lat is not None and lon is not None:
        print(f"Fetching for {i_id} (month {r['month']})...")
        try:
            m = r['month']
            start = "2023-10-01" if m == 10 else "2023-11-01"
            end = "2023-10-31" if m == 10 else "2023-11-30"
            m_res, w_res = fetch_data(lat, lon, start, end)
            
            w_spd = compute_mean(w_res['hourly']['wind_speed_10m'])
            w_dir = compute_mean(w_res['hourly']['wind_direction_10m'])
            w_hgt = compute_mean(m_res['hourly']['wave_height'])
            w_per = compute_mean(m_res['hourly']['wave_period'])
            s_hgt = compute_mean(m_res['hourly']['swell_wave_height'])
            
            r['windSpeedKmph'] = round(w_spd, 1) if w_spd else None
            r['windDirectionDeg'] = int(w_dir) if w_dir else None
            r['significantWaveHeightM'] = round(w_hgt, 2) if w_hgt else None
            r['wavePeriodSec'] = round(w_per, 1) if w_per else None
            r['swellHeightM'] = round(s_hgt, 2) if s_hgt else None
            r['seaCondition'] = get_sea_condition(w_hgt)
            
            time.sleep(2) # rate limit
        except Exception as e:
            print(f"Failed to fetch {i_id}: {e}")
            r['windSpeedKmph'] = None
            r['windDirectionDeg'] = None
            r['significantWaveHeightM'] = None
            r['wavePeriodSec'] = None
            r['swellHeightM'] = None
            r['seaCondition'] = None

    # Update schema
    has_data = r.get('windSpeedKmph') is not None
    method_val = "nearest grid point" if has_data else "Extraction pending/failed"

    sources = {
        "atmospheric": {
            "organization": "ECMWF",
            "dataset": "ERA5 Historical Reanalysis",
            "accessMethod": "Open-Meteo Historical Weather API",
            "url": "https://archive-api.open-meteo.com/v1/archive",
            "sourcePeriod": "2023-10-01 to 2023-11-30",
            "aggregation": "monthly mean of hourly data",
            "method": method_val
        },
        "marine": {
            "organization": "Copernicus Marine Environment Monitoring Service (CMEMS)",
            "dataset": "Global Ocean Waves Reanalysis",
            "accessMethod": "Open-Meteo Marine API",
            "url": "https://marine-api.open-meteo.com/v1/marine",
            "sourcePeriod": "2023-10-01 to 2023-11-30",
            "aggregation": "monthly mean of hourly data",
            "method": method_val
        }
    }
    
    if has_data:
        sources["derived"] = {
            "organization": "TARANG",
            "dataset": "Internal Logic",
            "accessMethod": "Python Script",
            "url": "local",
            "sourcePeriod": "2023-10-01 to 2023-11-30",
            "aggregation": "N/A",
            "method": "Derived from significantWaveHeightM"
        }

    if 'source' in r:
        del r['source']
    r['sources'] = sources
    r['dataType'] = "historical_reanalysis_monthly_baseline"

with open('src/data/environmentalBaseline.json', 'w') as f:
    json.dump(env_data, f, indent=2)

print("Scaling and schema split complete.")
