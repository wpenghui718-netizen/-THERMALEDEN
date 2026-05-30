import React, { useState } from 'react';
import { AlertCircle, Flame, Wind, Activity, Zap, RefreshCw, TriangleAlert } from 'lucide-react';
import { SystemMetrics, Specimen } from '../types';
import { playBeep } from '../utils/audio';

interface ImpactTabProps {
  systemMetrics: SystemMetrics;
  specimens: Specimen[];
  onModifyMetrics: (updated: Partial<SystemMetrics>) => void;
  onUpdateSpecimens: (updated: Specimen[]) => void;
  onAddLog: (category: string, message: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export default function ImpactTab({
  systemMetrics,
  specimens,
  onModifyMetrics,
  onUpdateSpecimens,
  onAddLog
}: ImpactTabProps) {
  const [disturbance, setDisturbance] = useState(45);
  const [isVenting, setIsVenting] = useState(false);
  const [seismicStress, setSeismicStress] = useState(38);

  const triggerMutationPulse = () => {
    playBeep(220, 0.4, 'sawtooth');
    playBeep(440, 0.3, 'sawtooth');
    
    // Mutate random biological spec
    const mutated = specimens.map((spec) => {
      if (Math.random() > 0.4) {
        const mutations = ['METABOLIC_BURST', 'GENOMIC_GLITCH', 'SULFUR_HYPER_ADAPTED', 'THERMAL_IMMUNE_S2'];
        const randomMut = mutations[Math.floor(Math.random() * mutations.length)];
        return {
          ...spec,
          classification: `${spec.classification} [${randomMut}]`,
          status: 'MUTATING' as const,
          resonance: Math.min(100, spec.resonance + 12)
        };
      }
      return spec;
    });

    onUpdateSpecimens(mutated);
    
    // Disturbance spike
    const newDist = Math.min(100, disturbance + 25);
    setDisturbance(newDist);
    
    // System stress spike
    const newStress = Math.min(100, systemMetrics.systemStress + 20);
    onModifyMetrics({ systemStress: newStress });

    onAddLog('GEN_PULSE', 'Operator triggered custom high-energy nuclear mutation pulse.', 'critical');
    onAddLog('MUTATION', 'Specimen DNA altered via radioactive sulfur emissions.', 'warning');
  };

  const releaseVentLoad = () => {
    setIsVenting(true);
    playBeep(150, 0.8, 'sawtooth');
    
    setTimeout(() => {
      setIsVenting(false);
      const coolerTemp = Math.max(90, systemMetrics.coreTemp - 84);
      const reducedPressure = Math.max(10, systemMetrics.ventPressure - 40);
      const lowerStress = Math.max(10, systemMetrics.systemStress - 30);
      
      onModifyMetrics({
        coreTemp: coolerTemp,
        ventPressure: reducedPressure,
        systemStress: lowerStress
      });

      onAddLog('SHIELD_VENT', 'Emergency steam valve vented successfully. Core cooled by 84°C.', 'success');
      playBeep(880, 0.2, 'sine');
    }, 1500);
  };

  const forceStabilizer = () => {
    playBeep(440, 0.35, 'sine');
    setDisturbance(10);
    setSeismicStress(15);
    
    onModifyMetrics({
      stability: 94,
      systemStress: 15,
      ventPressure: 20
    });

    onAddLog('SAFE_OVERRIDE', 'Coaxial carbon safety stabilizers forced manual reset.', 'success');
  };

  return (
    <div className="flex-1 p-6 grid-bg-ambient min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Impact & Mutation controllers (col-span-12 or col-span-5) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-red-400 bg-red-950/50 border border-red-800/40 px-2 py-0.5 rounded uppercase tracking-widest inline-block select-none">
                05 // DISTURBANCE MATRIX
              </span>
              <h3 className="text-xl font-light text-white uppercase font-sans">
                MUTATION <span className="font-bold text-red-400">CHAMBER</span>
              </h3>
            </div>
            <div className="w-12 h-[2px] bg-red-400" />
            
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              Manually stress the environmental chamber. Extreme user disturbance metrics triggers rapid mutation adaptions across the vent micro biome.
            </p>

            {/* Dials sliders in simple clean layouts */}
            <div className="space-y-3 font-mono pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>USER DISTURBANCE METRIC</span>
                  <span className="text-red-400 font-bold">{disturbance}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${disturbance}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>SEISMIC FRICTION INDEX</span>
                  <span className="text-red-400 font-bold">{seismicStress}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={seismicStress}
                  onChange={(e) => {
                    setSeismicStress(Number(e.target.value));
                    playBeep(210 + Number(e.target.value) * 1.5, 0.04, 'triangle');
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                  id="slider-seismic-stress"
                />
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500">
            <span>RIFT CRATER STRESS: MAXIMUM</span>
          </div>
        </div>

        {/* Center element: Environmental anomaly satellite map (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/40 rounded-lg p-5">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">ANOMALY PLUME DETECTOR</span>
            
            <div className="w-full h-48 rounded overflow-hidden border border-slate-800 relative bg-slate-950 skeleton-screen">
              {/* Glitched scanning lines */}
              <div className="absolute inset-x-0 h-[2px] bg-red-500/30 top-1/2 animate-[scan_4s_linear_infinite]" />
              <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.5)_50%) bg-[size:100%_4px] z-10 pointer-events-none opacity-40" />
              
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIucajdKQs5zLRXbmCTBGlFfcAI9EkmKTP9jDV_ILeH2ThyxE6HoRnE1PZP33Pu7Z4KdKtgnXJ2lgt0Y-lWDwo0xW2vDeOlm7eicbvxQfk-g9gJqVZebQeu0Idq4DCaOWbqpFMNm0eueUCDJtWSIjNbCQxyTR1WDY5J_JD0p4BEvSZVSSDlZMBPOiGWLH2d1ud3nxLvnqQIyzXtUBARHpyhbVnZud8jJpJ7LOHbWe8GEiVbk69JSasXum3YjpzByN_XME0tYGDWfA" 
                alt="Environmental Plume Stress Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.6] contrast-[1.3] grayscale hover:grayscale-0 transition-all duration-1000"
              />

              <div className="absolute top-2 left-2 bg-red-950/80 border border-red-800 text-[8px] font-mono text-red-400 px-1.5 py-0.5 rounded uppercase">
                CRITICAL_DISTORTION
              </div>
            </div>

            <div className="p-3 bg-red-950/10 border border-red-900/40 rounded flex items-start gap-2 text-red-400">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <div className="font-mono text-[10px] leading-relaxed">
                <span>[DANGER] High pressure warning inside sector RED-RIFT-04. Initiating manual venting overrides reduces vent explosion probability by 88%.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Intervention manual triggers (col-span-12 or col-span-3) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <TriangleAlert className="text-red-400" size={14} />
              <span className="font-mono text-[9px] font-bold text-slate-300">INTERVENTION BOARD</span>
            </div>

            <div className="space-y-3">
              {/* Trigger mutant code button */}
              <button
                onClick={triggerMutationPulse}
                className="w-full py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/40 hover:border-red-400 text-red-400 font-mono text-xs font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] uppercase select-none shadow-[0_0_10px_rgba(239,68,68,0.05)]"
                id="btn-mutation-pulse"
              >
                <Zap size={13} className="animate-bounce" />
                <span>MUTATION PULSE</span>
              </button>

              {/* Vent Pressure button */}
              <button
                onClick={releaseVentLoad}
                disabled={isVenting}
                className={`w-full py-3 border font-mono text-xs font-bold tracking-widest rounded flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] uppercase select-none ${
                    isVenting 
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-500 animate-pulse' 
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-600/40 hover:border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                }`}
                id="btn-steam-vent"
              >
                <Wind size={13} className={isVenting ? 'animate-spin' : ''} />
                <span>{isVenting ? 'RELEASE VELOCITY...' : 'VENT GEOTHERMAL LOAD'}</span>
              </button>

              {/* Solid reset overrides */}
              <button
                onClick={forceStabilizer}
                className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-slate-500 text-slate-400 hover:text-white font-mono text-xs tracking-wider rounded flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] uppercase select-none"
                id="btn-force-stabilize"
              >
                <RefreshCw size={12} />
                <span>STABILIZER OVERRIDE</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono text-center select-none pt-4">
            MANEO_SEC_SYSTEMS_OVERRIDE // DEEP RIFT
          </p>
        </div>

      </div>
    </div>
  );
}
