import { useState, useEffect } from 'react';
import type { EnvironmentalConditions } from '../data/environmentResolver';
import type { DecisionResult } from '../services/decisionEngine';
import type { ResolvedContext } from '../services/contextResolver';

export interface DigitalTwinState {
  active: boolean;
  baseline: EnvironmentalConditions | null;
  modified: EnvironmentalConditions | null;
  context: ResolvedContext | null;
  predictions: DecisionResult | null;
  baselineDecision: DecisionResult | null;
  isSimulating: boolean;
}

let globalTwinState: DigitalTwinState = {
  active: false,
  baseline: null,
  modified: null,
  context: null,
  predictions: null,
  baselineDecision: null,
  isSimulating: false,
};

const listeners: Set<() => void> = new Set();

export function useTwinStore() {
  const [twinState, setLocalTwin] = useState<DigitalTwinState>(globalTwinState);

  useEffect(() => {
    const listener = () => setLocalTwin(globalTwinState);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setTwinState = (newState: Partial<DigitalTwinState>) => {
    globalTwinState = { ...globalTwinState, ...newState };
    listeners.forEach((listener) => listener());
  };

  return { twinState, setTwinState };
}
