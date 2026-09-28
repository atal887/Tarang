const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/pages/Home.tsx',
  'src/data/marineFishingConditionResolver.ts',
  'src/data/inlandFishingResolver.ts',
  'src/data/locationResolver.ts',
  'src/data/marineInfrastructureResolver.ts',
  'src/services/contextResolver.ts',
  'src/data/environmentResolver.ts'
];

const replacements = [
  ['tarang_place_registry_7935_v1 copy.json', 'tarang_place_registry_7935_v1.json'],
  ['tarang_marine_infrastructure_clean_v1 copy.json', 'tarang_marine_infrastructure_clean_v1.json'],
  ['tarang_marine_infrastructure_environment_clean_v1 copy.json', 'tarang_marine_infrastructure_environment_clean_v1.json'],
  ['tarang_marine_nearby_candidates_clean_v1 copy.json', 'tarang_marine_nearby_candidates_clean_v1.json'],
  ['tarang_location_environment_7935x2 copy.json', 'tarang_location_environment_7935x2.json'],
  ['indiaFishingLocations.json', 'tarang_place_registry_7935_v1.json']
];

for (const file of filesToFix) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [oldName, newName] of replacements) {
    content = content.replace(new RegExp(oldName, 'g'), newName);
  }
  fs.writeFileSync(filePath, content);
}
console.log('Imports updated.');
