import locationsData from '../data/indiaFishingLocations.json';
import type { LocationData } from '../data/locationResolver';

const locations = locationsData as unknown as LocationData[];

export interface ResolverInput {
  query: string;
  defaultLocationName: string;
  defaultBoatType: string;
}

export interface ResolvedContext {
  locationId: string;
  locationName: string;
  dateTime: Date;
  timeDescription: string;
  boatType: string;
  inferred: {
    location: boolean; // true if fell back to default, false if explicit in query
    dateTime: boolean; // true if fell back to default, false if explicit in query
    boatType: boolean; // true if fell back to default, false if explicit in query
  };
  originalQuery: string;
}

export function resolveFishermanContext(input: ResolverInput): ResolvedContext {
  const queryLower = input.query.toLowerCase();
  
  // 1. Resolve Location
  let resolvedLocation: LocationData | null = null;
  let locationInferred = true;

  // Sort locations by name length descending to match more specific names first
  const sortedLocations = [...locations].sort((a, b) => b.name.length - a.name.length);

  // Helper to remove diacritics
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const queryNormalized = normalize(input.query);
  
  for (const loc of sortedLocations) {
    const locNormalized = normalize(loc.name);
    if (locNormalized.length > 2) { // avoid matching 2-letter stop words
      // Use regex for word boundary to avoid partial matches
      const regex = new RegExp(`\\b${locNormalized}\\b`);
      if (regex.test(queryNormalized)) {
        resolvedLocation = loc;
        locationInferred = false;
        break;
      }
    }
  }

  // Fallback to default location
  if (!resolvedLocation) {
    const defaultNormalized = normalize(input.defaultLocationName.split(',')[0].trim());
    resolvedLocation = locations.find(l => normalize(l.name) === defaultNormalized) || locations[0];
  }

  // 2. Resolve Boat Type
  let resolvedBoatType = input.defaultBoatType;
  let boatTypeInferred = true;

  if (queryLower.includes('mechanized') || queryLower.includes('trawler')) {
    resolvedBoatType = 'mechanized';
    boatTypeInferred = false;
  } else if (queryLower.includes('non-motorized') || queryLower.includes('non motorized') || queryLower.includes('canoe')) {
    resolvedBoatType = 'non_motorized';
    boatTypeInferred = false;
  } else if (queryLower.includes('motorized') || queryLower.includes('boat')) {
    resolvedBoatType = 'motorized';
    boatTypeInferred = false;
  }

  // 3. Resolve Date/Time
  let resolvedDate = new Date();
  let timeDescription = "tomorrow evening";
  let dateTimeInferred = true;

  if (queryLower.includes('today')) {
    timeDescription = "today";
    dateTimeInferred = false;
  } else if (queryLower.includes('tomorrow')) {
    resolvedDate.setDate(resolvedDate.getDate() + 1);
    timeDescription = "tomorrow";
    dateTimeInferred = false;
  } else if (queryLower.includes('day after tomorrow')) {
    resolvedDate.setDate(resolvedDate.getDate() + 2);
    timeDescription = "day after tomorrow";
    dateTimeInferred = false;
  } else {
    // Default to tomorrow evening
    resolvedDate.setDate(resolvedDate.getDate() + 1);
  }

  if (queryLower.includes('morning')) {
    resolvedDate.setHours(6, 0, 0, 0);
    if (!dateTimeInferred) timeDescription += " morning";
  } else if (queryLower.includes('evening') || queryLower.includes('night')) {
    resolvedDate.setHours(18, 0, 0, 0);
    if (!dateTimeInferred) timeDescription += " evening";
  } else {
    resolvedDate.setHours(18, 0, 0, 0); // Default evening
  }

  return {
    locationId: resolvedLocation.id,
    locationName: resolvedLocation.name,
    dateTime: resolvedDate,
    timeDescription: timeDescription,
    boatType: resolvedBoatType,
    inferred: {
      location: locationInferred,
      dateTime: dateTimeInferred,
      boatType: boatTypeInferred
    },
    originalQuery: input.query
  };
}
