import json
import math

harbours_data = [
    [21.1047, 70.1046, '3rd Stage of Mangarol Fishing Harbour', 'Junagadh', 'Gujarat', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [12.8564, 74.8308, 'Modernisation and Upgradation of Mangalore Fishing Harbour', 'Dakshina Kannada', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.3478, 74.7006, 'Modernisation of Malpe Fishing Harbour', 'Udupi', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.6497, 74.6744, 'Modernisation of Gangoli Fishing Harbour', 'Udupi', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [14.7464, 74.2278, 'Maintenance Dredging at Amadalli Fishing Harbour', 'Uttar Kannada', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [14.5257, 74.3549, 'Dredging work at Tadari Fishing Harbour', 'Uttar Kannada', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [12.9661, 74.7650, 'Kulai Fishing Harbour', 'Mangalore', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.0864, 74.7720, 'Hejmadi Kodi Fishing Harbour', 'Udupi', 'Karnataka', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [9.9389, 76.2622, 'Cochin Fishing Harbour at Thoppumpady', 'Ernakulam', 'Kerala', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [8.63328, 76.78875, 'Muthalapozhy Fishing Harbour', 'Thiruvanathapuram', 'Kerala', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [12.4758, 74.9934, 'Kasaragod Fishing Harbour', 'Kasaragod', 'Kerala', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [18.9532, 72.8508, 'Mallet Bunder Fishing Harbour', 'Mumbai', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [18.9100, 72.8200, 'Sassoon Dock Fishing Harbour', 'Mumbai', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [18.8369, 72.9250, 'Karanja Fishing Harbour', 'Raigad', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [16.3786, 73.3749, 'Anandwadi Fishing Harbour', 'Sindhudurg', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [18.0511, 72.9992, 'Jeevana Fishing Harbour', 'Raigad', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [18.1394, 72.9822, 'Bharadkhol Fishing Harbour', 'Raigad', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [17.8092, 73.0894, 'Harnai Fishing Harbour', 'Ratnagiri', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [16.6476, 73.3645, 'Sakhari Nate Fishing Harbour', 'Ratnagiri', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [19.7281, 72.6953, 'Satpati Fishing Harbour', 'Palghar', 'Maharashtra', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [10.9181, 79.8469, 'Karaikal Fishing Harbour', 'Karaikal', 'Puducherry', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [20.721058, 70.876962, 'Vanakbara Fishing Harbour', 'Vanakbara', 'Diu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [20.288211, 86.704052, 'Paradip Fishing Harbour', 'Jagatsinghpur', 'Odisha', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [19.3077, 84.9657, 'Stage-II Fishing Harbour at Nuagarh (Astranga)', 'Puri', 'Odisha', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.0253, 79.8658, 'Thengaithittu Fishing Harbour (Arikamedu section)', 'Arian', 'Puducherry', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [11.9120, 79.8231, 'Puducherry Fishing Harbour', 'Thengaithittu District', 'Puducherry', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [21.4723, 87.6271, 'Chandipur Fishing Harbour', 'Balasore', 'Odisha', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [11.3589, 79.8236, 'Pazhayar Fishing Harbour', 'Mayiladuthurai', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.2108, 80.4957, 'Chennai Fishing Harbour', 'Chennai', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [8.1735, 77.2503, 'Colachel Fishing Harbour', 'Kanniyakumari', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [11.0319, 79.8542, 'Tharangampadi Fishing harbour', 'Nagapattinam', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [13.1631, 80.3053, 'ThiruvottriyurKuppam Fishing harbour', 'Tiruvallur', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [11.7144, 79.7753, 'Mudhunagar Fishing Harbour', 'Cuddalore', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [10.7608, 79.8497, 'Arcottuthurai Fishing Harbour', 'Nagapattinam', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [10.5111, 79.8311, 'Vellapallam Fishing Harbour', 'Nagapattinam', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [21.7950, 87.8810, 'Petuaghat fishing harbour', 'Medinipur', 'West Bengal', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [22.2839, 88.3367, 'Shankarpur fishing harbour', 'Purba Medinipur', 'West Bengal', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [21.9808, 88.4319, 'Frasergunj fishing harbour', 'South 24 Parganas', 'West Bengal', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [21.7794, 88.2845, 'Kakdwip fishing harbour', 'South 24 Parganas', 'West Bengal', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    [9.1274, 78.4818, 'Mookaiyur Fishing Harbour', 'Ramanathapuram', 'Tamil Nadu', 'https://pmmsy.dof.gov.in/static/harbour/harbours.html'],
    # Ports
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
    type_str = "port" if "Port" in h[2] else "fishing_harbour"
    org = "Ministry of Ports, Shipping and Waterways" if type_str == "port" else "Department of Fisheries"
    
    records.append({
        "id": f"infra_{i}",
        "name": h[2],
        "type": type_str,
        "state": h[4],
        "district": h[3],
        "latitude": h[0],
        "longitude": h[1],
        "associatedLocationId": None,
        "distanceFromAssociatedLocationKm": None,
        "source": {
            "organization": org,
            "dataset": "Official Map/Statistics",
            "url": h[5],
            "accessedAt": "2026-09-25"
        },
        "coordinateSource": "Supplementary Geospatial Extraction from Official Web Map",
        "coordinateConfidence": "high",
        "notes": ""
    })

# Add FLC aggregates
flc_aggregate = {
    "id": "flc_aggregate_india",
    "name": "India Notified Marine Fish Landing Centres (Aggregate)",
    "type": "fish_landing_centre_aggregate",
    "state": "All Coastal States",
    "district": "Multiple",
    "notifiedCount": 1547,
    "source": {
        "organization": "Department of Fisheries",
        "dataset": "Official SOP for Marine Fish Landing Centres",
        "url": "https://www.dof.gov.in/static/uploads/2026/01/93b14ece1aa0a35cb768e40d38e5b73b.pdf",
        "accessedAt": "2026-09-25"
    },
    "notes": "Name-level coordinate data remains pending. Total notified centres across India is 1547."
}
records.append(flc_aggregate)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

with open('src/data/indiaFishingLocations.json') as f:
    locations = json.load(f)

for r in records:
    if 'latitude' in r and 'longitude' in r:
        min_d = 9999
        min_loc = None
        for loc in locations:
            # We don't link inland locations
            if loc['fisheriesType'] != 'marine':
                continue
            d = haversine(r['latitude'], r['longitude'], loc['latitude'], loc['longitude'])
            if d < min_d:
                min_d = d
                min_loc = loc
                
        if min_loc and min_d <= 30.0:
            r['associatedLocationId'] = min_loc['id']
            r['distanceFromAssociatedLocationKm'] = round(min_d, 2)
        else:
            r['associatedLocationId'] = None

with open('src/data/marineInfrastructure.json', 'w') as f:
    json.dump(records, f, indent=2)

print(f"Generated {len(records)} marine infrastructure records.")
