with open('build_infrastructure.py') as f: code = f.read()
target = """    for d, loc in nearby_locs:
        loc_name = loc['name'].lower()
        if loc_name in infra_name:
            best_match = (d, loc)
            break"""
replacement = """    for d, loc in nearby_locs:
        loc_name = loc['name'].lower()
        infra_dist_lower = r['district'].lower() if r.get('district') else ""
        if loc_name in infra_name or loc_name in infra_dist_lower:
            best_match = (d, loc)
            break"""
with open('build_infrastructure.py', 'w') as f: f.write(code.replace(target, replacement))
