import { getEnvironmentalProfile } from './src/services/environmentResolver';

// Need to find an infrastructure ID to test. We'll use one of the generated ones.
import fs from 'fs';
const envData = JSON.parse(fs.readFileSync('src/data/environmentalBaseline.json', 'utf8'));

if (envData.length > 0) {
    const testId = envData[0].infrastructureId;
    const res10 = getEnvironmentalProfile(testId, 10);
    const res11 = getEnvironmentalProfile(testId, 11);
    const res12 = getEnvironmentalProfile(testId, 12);
    
    console.log("Oct:", res10?.infrastructureId, "Month:", res10?.month, "DataType:", res10?.dataType, "Wind:", res10?.windSpeedKmph);
    console.log("Nov:", res11?.infrastructureId, "Month:", res11?.month);
    console.log("Dec (should be null):", res12);
    
    // Validate schema
    let valid = true;
    for (const r of envData) {
        if (r.month !== 10 && r.month !== 11) valid = false;
        if (r.windSpeedKmph !== null && r.windSpeedKmph < 0) valid = false;
        if (!r.source || !r.source.organization) valid = false;
    }
    console.log("All records schema valid:", valid);
    console.log("Total records:", envData.length);
}
