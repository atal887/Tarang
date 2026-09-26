import { type ResolvedMarineFacility, type FacilityEnvironment } from './marineInfrastructureResolver';
import infrastructureEnvData from './tarang_marine_infrastructure_environment_81x2.json';

export interface ConditionedMarineFacility extends ResolvedMarineFacility {}

export function resolveMarineFishingConditions(
  facilities: ResolvedMarineFacility[],
  dateTime: Date
): ConditionedMarineFacility[] {
  const currentMonth = dateTime.getMonth(); // 0-11
  // Tarang snapshot dataset defaults to October (10) for any non-Sept/Oct dates
  const evalMonth = (currentMonth === 9 || currentMonth === 10) ? currentMonth + 1 : 10;
  
  const environments = infrastructureEnvData as unknown as FacilityEnvironment[];

  return facilities.map(facility => {
    // Look up the deterministic environment for this specific facility and month
    const env = environments.find(e => e.facilityId === facility.facilityId && e.month === evalMonth);
    
    return {
      ...facility,
      environment: env || null
    };
  });
}
