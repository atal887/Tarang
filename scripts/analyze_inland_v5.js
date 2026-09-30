import fs from 'fs';
import path from 'path';

const dataDir = '/Users/nandiniatal/Tarang/src/data';
const masterFile = path.join(dataDir, 'tarang_inland_fishing_spots_master_v5.json');
const opFile = path.join(dataDir, 'tarang_inland_fishing_spots_operational_candidates_v5.json');

const analyzeDataset = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);
  
  console.log(`\n=== Analysis of ${path.basename(filePath)} ===`);
  console.log(`Total Records: ${data.length}`);
  
  const evidenceClass = {};
  const coordConfidence = {};
  let opEligible = 0;
  
  data.forEach(record => {
    // Evidence Class
    const ec = record.evidenceClass || 'Unknown';
    evidenceClass[ec] = (evidenceClass[ec] || 0) + 1;
    
    // Coordinate Confidence
    const cc = record.coordinateConfidence || 'Unknown';
    coordConfidence[cc] = (coordConfidence[cc] || 0) + 1;
    
    // Operational Discovery Eligible
    if (record.operationalDiscoveryEligible === true) {
      opEligible++;
    }
  });
  
  console.log(`\nEvidence Class Distribution:`);
  Object.entries(evidenceClass).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  
  console.log(`\nCoordinate Confidence Distribution:`);
  Object.entries(coordConfidence).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
  
  console.log(`\nOperational Discovery Eligible: ${opEligible} (out of ${data.length})`);
};

analyzeDataset(masterFile);
analyzeDataset(opFile);
