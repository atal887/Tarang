import { formatNormalResponse } from './src/services/normalResponseFormatter';

console.log(formatNormalResponse(["LOCATION_CHECK"], { originalQuery: "Is Mumbai a marine location?", locationName: "Mumbai", dateTime: new Date(), locationId: "mumbai", boatType: "motorized" } as any, {} as any));
console.log(formatNormalResponse(["LOCATION_CHECK"], { originalQuery: "Is Delhi a marine location?", locationName: "Delhi", dateTime: new Date(), locationId: "delhi", boatType: "motorized" } as any, {} as any));
