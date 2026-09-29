import { formatNormalResponse } from './src/services/normalResponseFormatter.ts';

try {
  console.log(formatNormalResponse(['LOCATION_CHECK'], {
    locationId: 'loc_1',
    locationName: 'Delhi',
    dateTime: new Date(),
    boatType: 'motorized',
    originalQuery: 'what about mumbai',
    timeDescription: 'tomorrow',
    inferred: { location: true }
  } as any, {} as any));
} catch (e) {
  console.error("CRASH", e);
}
