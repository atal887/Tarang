import json
import urllib.request
import math

targets = [
    {"id": "infra_port_0", "name": "Mumbai Port", "lat": 18.9322, "lon": 72.8466},
    {"id": "infra_pmmsy_35", "name": "Modernisation of Sassoon Dock Fishing Harbour", "lat": 18.91, "lon": 72.82},
    {"id": "infra_port_2", "name": "Cochin Port", "lat": 9.9631, "lon": 76.2625},
    {"id": "infra_pmmsy_22", "name": "Cochin Fishing Harbour at Thoppumpady", "lat": 9.9389, "lon": 76.2622},
]

def fetch_data(lat, lon, start_date, end_date):
    # Fetch marine data
    marine_url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&hourly=wave_height,wave_period,swell_wave_height&start_date={start_date}&end_date={end_date}"
    req = urllib.request.Request(marine_url, headers={'User-Agent': 'Mozilla/5.0'})
    marine_res = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    
    # Fetch weather data
    weather_url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&hourly=wind_speed_10m,wind_direction_10m&start_date={start_date}&end_date={end_date}"
    req2 = urllib.request.Request(weather_url, headers={'User-Agent': 'Mozilla/5.0'})
    weather_res = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
    
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

results = {}

for t in targets:
    print(f"Fetching data for {t['name']}...")
    try:
        # Oct 2023
        m_oct, w_oct = fetch_data(t['lat'], t['lon'], "2023-10-01", "2023-10-31")
        # Nov 2023
        m_nov, w_nov = fetch_data(t['lat'], t['lon'], "2023-11-01", "2023-11-30")
        
        # Calculate means
        oct_wave = compute_mean(m_oct['hourly']['wave_height'])
        oct_period = compute_mean(m_oct['hourly']['wave_period'])
        oct_swell = compute_mean(m_oct['hourly']['swell_wave_height'])
        oct_wind = compute_mean(w_oct['hourly']['wind_speed_10m'])
        oct_wind_dir = compute_mean(w_oct['hourly']['wind_direction_10m'])
        
        nov_wave = compute_mean(m_nov['hourly']['wave_height'])
        nov_period = compute_mean(m_nov['hourly']['wave_period'])
        nov_swell = compute_mean(m_nov['hourly']['swell_wave_height'])
        nov_wind = compute_mean(w_nov['hourly']['wind_speed_10m'])
        nov_wind_dir = compute_mean(w_nov['hourly']['wind_direction_10m'])
        
        results[t['id']] = {
            10: {
                "windSpeedKmph": round(oct_wind, 1) if oct_wind else None,
                "windDirectionDeg": int(oct_wind_dir) if oct_wind_dir else None,
                "significantWaveHeightM": round(oct_wave, 2) if oct_wave else None,
                "wavePeriodSec": round(oct_period, 1) if oct_period else None,
                "swellHeightM": round(oct_swell, 2) if oct_swell else None,
                "seaCondition": get_sea_condition(oct_wave)
            },
            11: {
                "windSpeedKmph": round(nov_wind, 1) if nov_wind else None,
                "windDirectionDeg": int(nov_wind_dir) if nov_wind_dir else None,
                "significantWaveHeightM": round(nov_wave, 2) if nov_wave else None,
                "wavePeriodSec": round(nov_period, 1) if nov_period else None,
                "swellHeightM": round(nov_swell, 2) if nov_swell else None,
                "seaCondition": get_sea_condition(nov_wave)
            }
        }
    except Exception as e:
        print(f"Error fetching {t['name']}: {e}")

# Update JSON
with open('src/data/environmentalBaseline.json') as f:
    env_data = json.load(f)

for r in env_data:
    if r['infrastructureId'] in results:
        m = r['month']
        new_data = results[r['infrastructureId']][m]
        r['windSpeedKmph'] = new_data['windSpeedKmph']
        r['windDirectionDeg'] = new_data['windDirectionDeg']
        r['significantWaveHeightM'] = new_data['significantWaveHeightM']
        r['wavePeriodSec'] = new_data['wavePeriodSec']
        r['swellHeightM'] = new_data['swellHeightM']
        r['seaCondition'] = new_data['seaCondition']
        
        # Provenance Update
        r['source'] = {
            "organization": "Copernicus Marine Service & ECMWF ERA5 (via Open-Meteo)",
            "dataset": "Copernicus Global Ocean Waves Reanalysis / ERA5 Historical Weather",
            "url": "https://open-meteo.com/en/docs",
            "sourcePeriod": "Oct-Nov 2023 Climatological Baseline",
            "method": "Nearest grid cell bilinear extraction; hourly aggregation to monthly mean."
        }

with open('src/data/environmentalBaseline.json', 'w') as f:
    json.dump(env_data, f, indent=2)

print("Extraction completed and baseline updated for Mumbai and Kochi test targets.")
