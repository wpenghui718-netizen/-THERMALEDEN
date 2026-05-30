export type TabId = 'entry' | 'wake' | 'scan' | 'biosphere' | 'impact' | 'memory';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
}

export interface Specimen {
  id: string;
  name: string;
  classification: string;
  thermalTolerance: string;
  status: 'DORMANT' | 'STABLE' | 'MUTATING' | 'THRIVING';
  resonance: number;
}

export interface SystemMetrics {
  coreTemp: number;
  stability: number;
  metabolicResonance: number;
  ventPressure: number;
  systemStress: number;
  cumulativeHeat: number;
}
