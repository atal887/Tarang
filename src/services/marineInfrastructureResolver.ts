import marineInfrastructureData from '../data/marineInfrastructure.json';

export interface InfrastructureSource {
  organization: string;
  dataset: string;
  url: string;
  accessedAt: string;
}

export interface MarineInfrastructure {
  id: string;
  name: string;
  type: "port" | "fishing_harbour" | "fish_landing_centre" | "fish_landing_centre_aggregate";
  state: string;
  district: string;
  latitude?: number;
  longitude?: number;
  associatedLocationId: string | null;
  distanceFromAssociatedLocationKm: number | null;
  notifiedCount?: number;
  source: InfrastructureSource;
  coordinateSource?: string;
  coordinateConfidence?: "high" | "medium" | "low";
  notes: string;
}

export interface InfrastructureLookupResult {
  ports: MarineInfrastructure[];
  fishingHarbours: MarineInfrastructure[];
  fishLandingCentres: MarineInfrastructure[];
  aggregateMetadata?: MarineInfrastructure[];
}

export function getNearbyMarineInfrastructure(locationId: string, isMarine: boolean): InfrastructureLookupResult {
  if (!isMarine) {
    return {
      ports: [],
      fishingHarbours: [],
      fishLandingCentres: [],
      aggregateMetadata: []
    };
  }

  // Typecast the imported JSON
  const allInfrastructure = marineInfrastructureData as unknown as MarineInfrastructure[];
  
  const ports: MarineInfrastructure[] = [];
  const fishingHarbours: MarineInfrastructure[] = [];
  const fishLandingCentres: MarineInfrastructure[] = [];
  const aggregateMetadata: MarineInfrastructure[] = [];

  for (const infra of allInfrastructure) {
    if (infra.type === "fish_landing_centre_aggregate") {
      aggregateMetadata.push(infra);
      continue;
    }
    
    // Only return infrastructure strictly associated with this location
    if (infra.associatedLocationId === locationId) {
      if (infra.type === "port") {
        ports.push(infra);
      } else if (infra.type === "fishing_harbour") {
        fishingHarbours.push(infra);
      } else if (infra.type === "fish_landing_centre") {
        fishLandingCentres.push(infra);
      }
    }
  }

  // Sort by geographic distance if available
  const sortByDistance = (a: MarineInfrastructure, b: MarineInfrastructure) => {
    const distA = a.distanceFromAssociatedLocationKm || 9999;
    const distB = b.distanceFromAssociatedLocationKm || 9999;
    return distA - distB;
  };

  ports.sort(sortByDistance);
  fishingHarbours.sort(sortByDistance);
  fishLandingCentres.sort(sortByDistance);

  return {
    ports,
    fishingHarbours,
    fishLandingCentres,
    aggregateMetadata
  };
}
