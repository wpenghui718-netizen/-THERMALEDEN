import React from 'react';
import { Shield, Flame, Activity, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { playBeep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  systemState: string;
  coreTemp: number;
  stability: number;
  systemStress: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetSystem: () => void;
}

export default function Header({
  systemState,
  coreTemp,
  stability,
  systemStress,
  isMuted,
  onToggleMute,
  onResetSystem
}: HeaderProps) {
  const { t } = useLanguage();
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50">
      {/* Branding & Registry */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-3 w-3 bg-red-500 rounded-full animate-ping absolute top-0 left-0" />
          <div className="h-3 w-3 bg-red-600 rounded-full" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-[0.25em] text-white font-sans uppercase">
              {t('header.title')}
            </h1>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider border border-slate-800 px-1 py-0.5 rounded uppercase">
              {t('header.version')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
            {t('header.subtitle')}
          </p>
        </div>
      </div>

      {/* Real-time Ticker Metrics */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 font-mono text-[11px]">
        {/* Core Temperature */}
        <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-2 hover:border-red-500/30 transition-colors">
          <Flame size={12} className="text-amber-500 animate-pulse" />
          <div>
            <div className="text-slate-500 text-[8px] uppercase">{t('header.core_temp')}</div>
            <div className={`font-semibold tracking-wider ${coreTemp > 300 ? 'text-red-400' : 'text-slate-200'}`}>
              {coreTemp.toFixed(1)} °C
            </div>
          </div>
        </div>

        {/* Stability Rating */}
        <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-2 hover:border-cyan-500/30 transition-colors">
          <Shield size={12} className="text-cyan-400" />
          <div>
            <div className="text-slate-500 text-[8px] uppercase">{t('header.stability')}</div>
            <div className={`font-semibold tracking-wider ${stability < 40 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {stability.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* System Stress */}
        <div className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded flex items-center gap-2 hover:border-violet-500/30 transition-colors">
          <Activity size={12} className="text-red-400" />
          <div>
            <div className="text-slate-500 text-[8px] uppercase">{t('header.sys_stress')}</div>
            <div className={`font-semibold tracking-wider ${systemStress > 70 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-300'}`}>
              {systemStress.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* State Badge */}
        <div className="bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded flex flex-col justify-center">
          <div className="text-slate-500 text-[8px] uppercase">{t('header.bios_state')}</div>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${
              systemState === 'Dormant' ? 'bg-slate-600' : 
              systemState === 'Waking' ? 'bg-amber-400 animate-pulse' : 
              systemState === 'Active' ? 'bg-emerald-400' : 
              'bg-red-400 animate-ping'
            }`} />
            <span className="font-bold uppercase text-[10px] tracking-widest text-white">
              {systemState === 'Dormant' ? t('header.state_dormant') :
               systemState === 'Waking' ? t('header.state_waking') :
               systemState === 'Active' ? t('header.state_active') :
               t('header.state_mutation')}
            </span>
          </div>
        </div>
      </div>

      {/* Audio controls & Reset */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onToggleMute();
            playBeep(isMuted ? 600 : 400, 0.1);
          }}
          className={`p-2 rounded border font-mono text-[10px] uppercase transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            isMuted 
              ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600 bg-slate-900/40' 
              : 'border-emerald-900/60 text-emerald-400 hover:bg-emerald-950/20 bg-emerald-950/10 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
          }`}
          title={isMuted ? t('header.tooltip_audio') : t('header.tooltip_audio_on')}
          id="btn-sound-toggle"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
          <span>{isMuted ? t('header.audio_off') : t('header.audio_on')}</span>
        </button>

        <button
          onClick={() => {
            onResetSystem();
            playBeep(330, 0.35, 'sawtooth');
          }}
          className="p-2 text-slate-400 border border-slate-800 rounded bg-slate-900/40 hover:bg-slate-900 hover:text-red-400 hover:border-red-900 transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[10px] uppercase"
          title={t('header.tooltip_reset')}
          id="btn-system-reset"
        >
          <RefreshCw size={13} />
          <span>{t('header.reset')}</span>
        </button>
      </div>
    </header>
  );
}
