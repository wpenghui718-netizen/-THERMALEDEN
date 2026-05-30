import React, { useState, useEffect } from 'react';
import { Microchip, Activity, Thermometer, ShieldCheck, HelpCircle, Dna, Info } from 'lucide-react';
import { Specimen, SystemMetrics } from '../types';
import { playBeep } from '../utils/audio';

interface BiosphereTabProps {
  specimens: Specimen[];
  systemMetrics: SystemMetrics;
  onModifyMetrics: (updated: Partial<SystemMetrics>) => void;
  onUpdateSpecimens: (updated: Specimen[]) => void;
}

export default function BiosphereTab({
  specimens,
  systemMetrics,
  onModifyMetrics,
  onUpdateSpecimens,
}: BiosphereTabProps) {
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen>(specimens[0]);
  const [thermalSlider, setThermalSlider] = useState(systemMetrics.coreTemp);
  const [mineralSaturation, setMineralSaturation] = useState(65);

  // Synced sliders with metrics on drag
  useEffect(() => {
    // Determine dynamic stability based on thermal target peak (between 300°C and 380°C is sweet spot for high stability)
    const deviation = Math.abs(thermalSlider - 340);
    const calculatedStability = Math.max(10, Math.min(100, 100 - (deviation * 0.4)));
    
    // Metabolic resonance peak based on stability and mineral food source
    const calculatedResonance = (calculatedStability * 0.6) + (mineralSaturation * 0.4);

    onModifyMetrics({
      coreTemp: thermalSlider,
      stability: calculatedStability,
      metabolicResonance: calculatedResonance,
    });

    // Dynamically calculate statuses for all species
    const updatedSpecimens = specimens.map((spec) => {
      let status: Specimen['status'] = 'STABLE';
      let resonance = 50;

      if (spec.id === 'spec_01') { // Pyrococcus furiosus (Thrives 70 - 103)
        // High thermal tolerator
        if (thermalSlider > 320) { status = 'THRIVING'; resonance = 95; }
        else if (thermalSlider < 180) { status = 'DORMANT'; resonance = 10; }
        else { status = 'STABLE'; resonance = 60; }
      } else if (spec.id === 'spec_02') { // Methanocaldococcus (85 - 110)
        if (thermalSlider > 240 && thermalSlider <= 360) { status = 'THRIVING'; resonance = 90; }
        else if (thermalSlider > 360) { status = 'MUTATING'; resonance = 70; }
        else if (thermalSlider < 120) { status = 'DORMANT'; resonance = 5; }
      } else if (spec.id === 'spec_03') { // Riftia Giant Worms (prefers boundary, cooler 20-35 C)
        if (thermalSlider < 220) { status = 'THRIVING'; resonance = 88; }
        else if (thermalSlider > 320) { status = 'MUTATING'; resonance = 35; }
        else { status = 'STABLE'; resonance = 62; }
      } else if (spec.id === 'spec_04') { // Pompeii worm (Extreme, high temp)
        if (thermalSlider > 351) { status = 'MUTATING'; resonance = 98; }
        else if (thermalSlider > 280) { status = 'THRIVING'; resonance = 92; }
        else { status = 'STABLE'; resonance = 50; }
      } else if (spec.id === 'spec_05') { // Hydrothermal vent shrimp
        if (thermalSlider > 320) { status = 'MUTATING'; resonance = 15; }
        else if (thermalSlider > 180 && thermalSlider <= 300) { status = 'THRIVING'; resonance = 80; }
        else { status = 'DORMANT'; resonance = 20; }
      }

      return { ...spec, status, resonance };
    });

    onUpdateSpecimens(updatedSpecimens);
  }, [thermalSlider, mineralSaturation]);

  // Keep selected specimen item in sync with updated list
  const currentSpecimenState = specimens.find(s => s.id === selectedSpecimen.id) || selectedSpecimen;

  return (
    <div className="flex-1 p-6 grid-bg-ambient min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Thermocline Hydrothermal Controls (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded uppercase tracking-widest inline-block select-none">
                04 // ECOLOGICAL REGULATOR
              </span>
              <h3 className="text-xl font-light text-white uppercase font-sans">
                THERMAL <span className="font-bold text-emerald-400">INJECTORS</span>
              </h3>
            </div>
            <div className="w-12 h-[2px] bg-emerald-400" />
            
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Regulate core vent thermodynamic emissions. Throttling temperature directly drives chemosynthetic synthesis inside the deep ecological chambers.
            </p>

            {/* Microscopic core graphics / Peak metabolic resonance */}
            <div className="w-full bg-slate-900/50 border border-slate-800 rounded p-4 flex items-center justify-between gap-4 font-mono select-none">
              <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center bg-slate-950 rounded-full border border-emerald-500/10">
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-[spin_30s_linear_infinite]" />
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWf2D9AqlkGyrcDyUuEEowH68n9XMyNg5lwBxG4x-t7SVd-tP2bbP4VNE7EoDb3RvFnboKWlZjok8diLJtKnERJ3ZLEIVuv_KLx_b5IshAgr1e-wkpCkgXv7EohwrTYTbVQe8M_oDyS0kLxLQCJT5PS-j8p7ffgEbFMs54oZ_91ysKVCG3RjHRJ_bfkc1o6a8rq4VPs1H_oKbIgXJ58YsHPqCMKa71PgTDHG5P9vqLwux43cSoR7pPNTRB0w05FwTyYgRr9_hAs_c" 
                  alt="Metabolic Sphere"
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-full object-cover shadow-[0_0_15px_rgba(52,211,153,0.15)] animate-pulse"
                />
              </div>

              <div className="flex-1 text-right">
                <span className="text-[8px] text-slate-500 uppercase block">METABOLIC_RESONANCE</span>
                <span className="text-xl font-bold text-emerald-400 tracking-wider">
                  {systemMetrics.metabolicResonance.toFixed(1)} Hz
                </span>
                <span className="text-[8px] text-slate-400 block mt-1 uppercase">
                  STATUS: {systemMetrics.metabolicResonance > 75 ? 'HYPERCELLULAR' : 'STABLE_BIOME'}
                </span>
              </div>
            </div>

            {/* Slider items */}
            <div className="space-y-4 font-mono">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Thermometer size={12} className="text-amber-500" />
                    COAXIAL CORE TEMP:
                  </span>
                  <span className="text-emerald-400 font-bold">{thermalSlider.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="84"
                  max="440"
                  step="0.5"
                  value={thermalSlider}
                  onChange={(e) => {
                    setThermalSlider(Number(e.target.value));
                    playBeep(220 + Number(e.target.value) * 1.5, 0.05, 'triangle');
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  id="slider-core-temp"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Activity size={12} className="text-emerald-500" />
                    H2S MICRO MINERAL FOOD:
                  </span>
                  <span className="text-emerald-400 font-bold">{mineralSaturation}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={mineralSaturation}
                  onChange={(e) => {
                    setMineralSaturation(Number(e.target.value));
                    playBeep(330 + Number(e.target.value) * 2, 0.05, 'sine');
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  id="slider-mineral-sat"
                />
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-3 text-[10px] font-mono text-slate-500 flex justify-between select-none">
            <span>SATELLITE SECTOR: RED-RIFT-04</span>
            <span>PH_LEVEL: 6.4 (ACIDIC)</span>
          </div>
        </div>

        {/* Center: List of resident micro-organisms (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col border border-slate-800 bg-slate-950/40 rounded-lg p-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 justify-between">
            <div className="flex items-center gap-1.5">
              <Dna className="text-emerald-400" size={15} />
              <span className="font-mono text-[10px] font-bold text-slate-200">BIOSPHERE INHABITANTS</span>
            </div>
            <span className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 uppercase">
              POP: {specimens.length}
            </span>
          </div>

          {/* List display */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] scrollbar-thin">
            {specimens.map((spec) => {
              const works = currentSpecimenState.id === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => {
                    setSelectedSpecimen(spec);
                    playBeep(800, 0.1, 'sine');
                  }}
                  className={`w-full p-3 rounded border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    works 
                      ? 'bg-emerald-950/25 border-emerald-500/80' 
                      : 'bg-slate-900/10 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/20'
                  }`}
                  id={`btn-specimen-select-${spec.id}`}
                >
                  <div className="space-y-0.5 truncate flex-1">
                    <span className="block font-mono text-[11px] font-bold text-slate-200 truncate">{spec.name}</span>
                    <span className="block text-[9px] text-slate-500 font-sans truncate">{spec.classification}</span>
                  </div>

                  <span className={`font-mono text-[9px] font-semibold px-2 py-0.5 rounded border ${
                    spec.status === 'DORMANT' ? 'border-slate-800 text-slate-500 bg-slate-950' :
                    spec.status === 'STABLE' ? 'border-cyan-900 text-cyan-400 bg-cyan-950/20' :
                    spec.status === 'THRIVING' ? 'border-emerald-900 text-emerald-400 bg-emerald-950/30' :
                    'border-red-900 text-red-400 bg-red-950/40 animate-pulse'
                  }`}>
                    {spec.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Microcellular Specimen Inspector (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Microchip className="text-emerald-400" size={15} />
              <div>
                <span className="font-mono text-[8px] text-slate-500 uppercase block">CYBERNETIC SPECIMEN ENVELOPE</span>
                <span className="font-mono text-xs font-bold text-slate-200">{currentSpecimenState.name}</span>
              </div>
            </div>

            {/* Specimen Cellular View with hotlinked graphics */}
            <div className="w-full h-32 rounded overflow-hidden border border-slate-800 relative bg-slate-950">
              <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.5)_50%) bg-[size:100%_4px] z-10 pointer-events-none opacity-40" />
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkPrBJM1t-P2AZPEVnWRLsUZMhl1i61eoMt1MhXyU4jC2rGlC56mdLF4YIeHrlm7uNBgBoTPH7acmSS2gqd__oVbKIA_rPLgCUM7tPmdUEEzSRh-KkxS56IU54wX-0j5lryHi1NbKYuRMZHJJRT99Op_XFTSD6k8BZmUiddEen0HIpb-9Ab9UDxJs3xGRsU18E8EjB71pmp2uU93_A6ARokYit56IP8Hl3xbHB0Y9ofiuiJHm2miwuUZiloFiZwfrDS5wzyav7hCM" 
                alt="Microscopic Bio Structure"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-75 contrast-125"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 text-[8px] font-mono text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                CHEMOSYNTHESIS PATHWAY
              </div>
            </div>

            {/* Biological Metrics Info */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">THERMAL INDEX:</span>
                <span className="text-slate-300">{currentSpecimenState.thermalTolerance}</span>
              </div>

              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">GROWTH STAGE:</span>
                <span className={`${currentSpecimenState.status === 'THRIVING' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  {currentSpecimenState.resonance > 80 ? 'HYPER-EXTREMOPHILE' : 'DEVELOPING_COLONY'}
                </span>
              </div>

              <div className="flex justify-between pb-1.5">
                <span className="text-slate-500">RESISTANCE INDEX:</span>
                <span className="text-emerald-400">{currentSpecimenState.resonance.toFixed(0)}% resonance</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 p-3 rounded border border-slate-800 mt-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-emerald-500 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Extremophilic organisms feed on toxic mineral effluents like Hydrogen Sulfide gas. Maintain Coaxial Core Temp above <span className="text-emerald-400 font-medium">300°C</span> to achieve maximum biological thrives.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
