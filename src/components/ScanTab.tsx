import React, { useState } from 'react';
import { Radar, RefreshCcw, Compass, MapPin, Layers, Crosshair } from 'lucide-react';
import { playBeep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface VentCarrier {
  id: string;
  name: string;
  depth: number;
  temp: number;
  flowVelocity: number;
  minerals: string;
  coords: { x: number; y: number }; // Percentage offsets from radar center (0-100)
}

const THERMAL_CARRIERS: VentCarrier[] = [
  { id: 'v_01', name: 'CORE_VENT_ALPHA', depth: -3482, temp: 351.4, flowVelocity: 2.8, minerals: 'Iron Sulfides, Pyrite', coords: { x: 35, y: 30 } },
  { id: 'v_02', name: 'SULFUR_CHIMNEY_ABYSSUS', depth: -3412, temp: 288.2, flowVelocity: 1.9, minerals: 'Sphalerite, Chalcopyrite', coords: { x: 70, y: 40 } },
  { id: 'v_03', name: 'BLACK_CADENCE_SERPENTINA', depth: -3590, temp: 402.1, flowVelocity: 3.4, minerals: 'Gold, Barite, Anhydrite', coords: { x: 45, y: 75 } },
  { id: 'v_04', name: 'WHITE_DRIFT_CASCADE', depth: -3325, temp: 184.8, flowVelocity: 1.1, minerals: 'Silica, Carbonates', coords: { x: 20, y: 65 } }
];

function ventNameKey(id: string): string {
  return `vent.${id}`;
}

export default function ScanTab() {
  const { t } = useLanguage();
  const [selectedVent, setSelectedVent] = useState<VentCarrier>(THERMAL_CARRIERS[0]);
  const [sweepFreq, setSweepFreq] = useState(8);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshScan = () => {
    setIsRefreshing(true);
    playBeep(980, 0.4, 'sawtooth');
    setTimeout(() => {
      setIsRefreshing(false);
      playBeep(1200, 0.15, 'sine');
    }, 1200);
  };

  return (
    <div className="flex-1 p-6 grid-bg-ambient min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Radar Control Panel (col-span-12 or col-span-3) */}
        <div className="lg:col-span-3 space-y-6 flex flex-col justify-between border border-slate-800 bg-slate-950/60 rounded-lg p-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded uppercase tracking-widest inline-block select-none">
                {t('scan.badge')}
              </span>
              <h3 className="text-xl font-light text-white uppercase font-sans">
                {t('scan.title')} <span className="font-bold text-cyan-400">{t('scan.title_highlight')}</span>
              </h3>
            </div>
            
            <div className="w-12 h-[2px] bg-cyan-400" />
            
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {t('scan.desc')}
            </p>
          </div>

          <div className="space-y-4 font-mono">
            {/* Calibration Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{t('scan.sweep')}</span>
                <span className="text-cyan-400 font-bold">{sweepFreq} Hz</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                value={sweepFreq}
                onChange={(e) => {
                  setSweepFreq(Number(e.target.value));
                  playBeep(300 + Number(e.target.value) * 10, 0.05, 'sine');
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="slider-sweep-freq"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{t('scan.zoom')}</span>
                <span className="text-cyan-400 font-bold">{zoomLevel}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={zoomLevel}
                onChange={(e) => {
                  setZoomLevel(Number(e.target.value));
                  playBeep(200 + Number(e.target.value) * 2, 0.05, 'sine');
                }}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="slider-zoom"
              />
            </div>
          </div>

          <button
            onClick={handleRefreshScan}
            disabled={isRefreshing}
            className="w-full py-2.5 bg-cyan-950/40 border border-cyan-800/80 hover:border-cyan-400 text-cyan-400 rounded font-mono text-xs tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] uppercase select-none"
            id="btn-trigger-scan"
          >
            <RefreshCcw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? t('scan.btn_scanning') : t('scan.btn_scan')}</span>
          </button>
        </div>

        {/* Center: Glowing Radar Sweep Grid (col-span-12 or col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center border border-slate-800 bg-slate-950/40 rounded-lg p-6 relative overflow-hidden">
          
          {/* Radar Container */}
          <div className="relative h-64 w-64 md:h-80 md:w-80 border-2 border-cyan-500/10 rounded-full flex items-center justify-center bg-slate-950/80 shadow-[0_0_50px_rgba(6,182,212,0.03)] px-3 py-3 select-none">
            
            {/* Radar Circular Markings */}
            <div className="absolute inset-4 border border-cyan-500/10 rounded-full" />
            <div className="absolute inset-16 border border-cyan-500/10 rounded-full" />
            <div className="absolute inset-28 border border-dashed border-cyan-500/10 rounded-full" />
            <div className="absolute inset-40 border border-cyan-500/10 rounded-full" />

            {/* Radar Crosshair lines */}
            <div className="absolute h-full w-[1px] bg-cyan-500/10" />
            <div className="absolute w-full h-[1px] bg-cyan-500/10" />

            {/* Glowing Sweep Line */}
            {!isRefreshing && (
              <div 
                className="absolute inset-0 rounded-full radar-sweep pointer-events-none"
                style={{ 
                  background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.18) 0deg, rgba(6, 182, 212, 0) 90deg)',
                  animationDuration: `${16 - sweepFreq}s`
                }}
              />
            )}

            {/* Dynamic Interactive Dot Coordinates */}
            {THERMAL_CARRIERS.map((vent) => {
              const isActive = selectedVent.id === vent.id;
              return (
                <button
                  key={vent.id}
                  onClick={() => {
                    setSelectedVent(vent);
                    playBeep(700, 0.15, 'triangle');
                  }}
                  className="absolute group duration-300 transition-all focus:outline-none"
                  style={{ 
                    left: `${vent.coords.x}%`, 
                    top: `${vent.coords.y}%`,
                    transform: `translate(-50%, -50%) scale(${zoomLevel / 100})`
                  }}
                  title={t(ventNameKey(vent.id))}
                  id={`btn-radar-dot-${vent.id}`}
                >
                  <span className={`absolute -inset-2.5 rounded-full ${isActive ? 'bg-cyan-400/20 border border-cyan-400/40 animate-ping' : 'bg-transparent'} group-hover:bg-cyan-500/10 transition-all`} />
                  <span className={`relative flex h-3 w-3 items-center justify-center`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-md ${isActive ? 'bg-cyan-400 scale-125' : 'bg-slate-600 border border-slate-500 group-hover:bg-cyan-300'}`} />
                  </span>
                  
                  {/* Small tag */}
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/90 text-slate-400 border border-slate-800 text-[8px] font-mono px-1 py-0.5 rounded whitespace-nowrap opacity-30 group-hover:opacity-100 transition-opacity">
                    {t(ventNameKey(vent.id))}
                  </span>
                </button>
              );
            })}

            {/* Ambient center point decoration */}
            <div className="absolute h-1.5 w-1.5 bg-cyan-400 rounded-full" />
          </div>

          {/* Radar Footer decoration */}
          <div className="mt-4 flex justify-between w-full font-mono text-[9px] text-slate-500">
            <span>{t('scan.range')}</span>
            <span>{t('scan.bearing')}</span>
          </div>
        </div>

        {/* Right Side: Selected Thermal Carrier Detail Card (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Compass className="text-cyan-400" size={16} />
              <div>
                <span className="font-mono text-[8px] text-slate-500 uppercase block">{t('scan.target')}</span>
                <span className="font-mono text-xs font-bold text-slate-200">{t(ventNameKey(selectedVent.id))}</span>
              </div>
            </div>

            {/* Spec Image of Ridge with referrer policy */}
            <div className="w-full h-32 rounded overflow-hidden border border-slate-800 relative bg-slate-950">
              <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.5)_50%) bg-[size:100%_4px] z-10 pointer-events-none opacity-40" />
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzuBUI34oJxOJU3RcXrRQX7WATqo9NCsuk9eEYyPfuQEkNjkTJ8nL7jr-aM-V1d1GJv_KVo2-jkKNrvaGOWp1OEMCTbbluPot8FXgIIuWHPge2PVTT5xoR85JfhwTCn210e_r_E3ScyACt4NrFRXgVNa4LTDmz55oN6XemW6YgDSCHAarpQbmMR1Z8rW-44WW5CXHYt1gBRB7px4xmeSVcxNujOJOnn2PaglyYwXP0MFWEzz_OJcNqQK7T7FQyk68iDNg8x3nrR7Q" 
                alt="Sonar Scan Layer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.65] contrast-125"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 text-[8px] font-mono text-cyan-400 px-1.5 py-0.5 rounded uppercase">
                {t('scan.sonar')}
              </div>
            </div>

            {/* Metrical data listing */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">{t('scan.depth')}</span>
                <span className="text-slate-300">{selectedVent.depth} M</span>
              </div>

              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">{t('scan.temp')}</span>
                <span className="text-cyan-400 font-semibold">{selectedVent.temp}°C</span>
              </div>

              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">{t('scan.velocity')}</span>
                <span className="text-slate-300">{selectedVent.flowVelocity} M/S</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">{t('scan.minerals')}</span>
                <span className="text-slate-300 text-right text-[10px] max-w-[150px] truncate">{selectedVent.minerals}</span>
              </div>
            </div>
          </div>

          {/* Prompt Selector */}
          <div className="border-t border-slate-800/60 pt-4 mt-4 space-y-2">
            <span className="font-mono text-[9px] text-slate-500 block">{t('scan.sector')}</span>
            <div className="grid grid-cols-2 gap-2">
              {THERMAL_CARRIERS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVent(v);
                    playBeep(640, 0.1, 'sine');
                  }}
                  className={`py-1.5 px-2 rounded border font-mono text-[9px] text-center uppercase tracking-tight truncate cursor-pointer transition-colors ${
                    selectedVent.id === v.id
                      ? 'bg-cyan-950/30 border-cyan-500/85 text-cyan-400 font-semibold'
                      : 'border-slate-800/80 bg-slate-900/10 text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                  id={`btn-select-vent-${v.id}`}
                >
                  {v.name.split('_').slice(-1)[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
