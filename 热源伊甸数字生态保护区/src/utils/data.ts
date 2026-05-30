import { Specimen, LogEntry } from '../types';

export const INITIAL_SPECIMENS: Specimen[] = [
  {
    id: 'spec_01',
    name: 'Pyrococcus furiosus',
    classification: 'Hyperthermophilic Archaea',
    thermalTolerance: '70°C - 103°C',
    status: 'DORMANT',
    resonance: 0,
  },
  {
    id: 'spec_02',
    name: 'Methanocaldococcus',
    classification: 'Methanogenic Archaebacteria',
    thermalTolerance: '85°C - 110°C',
    status: 'DORMANT',
    resonance: 0,
  },
  {
    id: 'spec_03',
    name: 'Riftia pachyptila',
    classification: 'Giant Tubeworm (Symbiosis)',
    thermalTolerance: '2°C - 30°C (Boundary)',
    status: 'DORMANT',
    resonance: 0,
  },
  {
    id: 'spec_04',
    name: 'Alvinella pompejana',
    classification: 'Pompeii Annelid Worm',
    thermalTolerance: '20°C - 80°C',
    status: 'DORMANT',
    resonance: 0,
  },
  {
    id: 'spec_05',
    name: 'Rimicaris exoculata',
    classification: 'Hydrothermal Vent Shrimp',
    thermalTolerance: '10°C - 45°C',
    status: 'DORMANT',
    resonance: 0,
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log_01',
    timestamp: '08:42:15',
    category: 'CRYOGENICS',
    message: 'Ambient ocean temperature stable at 2.4°C.',
    type: 'info',
  },
  {
    id: 'log_02',
    timestamp: '09:15:30',
    category: 'RESONATOR',
    message: 'Seismic thermal resonance indicators detect deep-crust flow activity.',
    type: 'info',
  },
  {
    id: 'log_03',
    timestamp: '09:20:11',
    category: 'SAFETY',
    message: 'Core pressure stabilizer reporting nominal containment values.',
    type: 'success',
  }
];

export interface MemoryShard {
  id: string;
  epoch: string;
  title: string;
  source: string;
  snippet: string;
  unlockedAtTemp: number;
}

export const MEMORY_SHARDS: MemoryShard[] = [
  {
    id: 'shard_a',
    epoch: 'EP-01 // COLD START',
    title: 'The Primordial Igniter Paradigm',
    source: 'BIOS_SYS_KERNEL_92',
    snippet: 'Before hydrothermal ventilation occurred, the deep-ocean basin existed in absolute energetic stagnation. Cellular structures were frozen in suspended animation. The catalyst was a thermal flash from the earth\'s mantle.',
    unlockedAtTemp: 80,
  },
  {
    id: 'shard_b',
    epoch: 'EP-02 // THERMAL RISE',
    title: 'Chemosynthesis Synthesis Matrix',
    source: 'ECOLOGY_DEPT_REP',
    snippet: 'By stripping hydrogen sulfide (H2S), the early archaebacteria developed independent metabolic loops completely free from the sunlight domain. This severed the dependency of biological Eden from the surface of the planet.',
    unlockedAtTemp: 180,
  },
  {
    id: 'shard_c',
    epoch: 'EP-03 // SYMBIOTIC BOND',
    title: 'Riftia Giant Worm Paradox',
    source: 'GENETIC_ARCHIVE_55',
    snippet: 'The giant tubeworms contain no mouth, gut, or digestive system. Instead, millions of microbial endosymbionts populate their trophosome tissues, converting poisonous sulfur gas directly into energy compounds.',
    unlockedAtTemp: 260,
  },
  {
    id: 'shard_d',
    epoch: 'EP-04 // CRITICAL MASS',
    title: 'Supercritical Water Phase Shift',
    source: 'PHYSICS_LABS_CORE',
    snippet: 'At pressures exceeding 218 atmospheres and temperatures over 374°C, water transitions into a supercritical phase. In this state, water behaves neither like a liquid nor a gas, dissolving minerals directly with unprecedented rate.',
    unlockedAtTemp: 340,
  }
];
