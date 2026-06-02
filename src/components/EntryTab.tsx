import React from 'react';
import { Play, Power, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { playBeep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface EntryTabProps {
  onInitiateWake: () => void;
}

export default function EntryTab({ onInitiateWake }: EntryTabProps) {
  const { t } = useLanguage();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden grid-bg-ambient min-h-[70vh]">
      {/* Absolute glow backing */}
      <div className="absolute inset-0 bg-radial-[circle_80%_at_center] from-slate-950/20 via-slate-950 to-slate-950 z-0 pointer-events-none" />

      {/* Futuristic Border Accents */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-slate-800 pointer-events-none" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-slate-800 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-slate-800 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-slate-800 pointer-events-none" />

      <div className="z-10 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Cybernetic Circle Art / Sphere Graphics */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative h-64 w-64 md:h-80 md:w-80 flex items-center justify-center rounded-full border border-slate-800/40 p-4 bg-slate-950/40 backdrop-blur-sm shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            {/* Outer concentric rotating ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-700/30 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border-2 border-slate-800/20 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute inset-10 rounded-full border border-dotted border-slate-800/60" />

            {/* Glowing Dormant Orb with Custom Hotlinked Image */}
            <div 
              className="h-44 w-44 md:h-52 md:w-52 rounded-full relative overflow-hidden border border-slate-700/50 shadow-[0_0_30px_rgba(30,41,59,0.5)] group cursor-pointer"
              onClick={() => playBeep(220, 0.4, 'sine')}
              title="Inspect Dormant Core"
            >
              {/* Scanline pattern */}
              <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.45)_50%) bg-[size:100%_4px] z-10 pointer-events-none opacity-80" />
              
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXFNM2610dHVX4CQtJ5nf_y0u3fLsEjpepIvsWewIf4ofuVMSiihsFtK2mqf_HgLmzkkhxr8zvNpcN7mU3t20xYayab2qaIs_DYevsFeyG_OckQfEg7C3zcQgoyhmhAncuBkY1oGLk7svV-MSyD8GvHAcKLfSBm2hCqlD8-i6orjBZLZgc6s1LE052JL8qn2n0BWSqj1ZEcXnGHd_9FdPbhCRS0LH9rIEdFnOHYPObGVeWgFy_d4m8GX16UhXx_bwP2yuEcMOVoAY" 
                alt="ThermalEden Dormant Core"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.3] contrast-[1.2] grayscale group-hover:brightness-[0.45] transition-all duration-700"
              />

              {/* Status overlay */}
              <div className="absolute inset-x-0 bottom-4 text-center z-20">
                <span className="font-mono text-[9px] text-slate-400 bg-slate-950/90 px-2 py-0.5 border border-slate-800 rounded uppercase tracking-widest inline-block select-none">
                  {t('entry.state_dormant')}
                </span>
              </div>
            </div>

            {/* Orbiting HUD details */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 tracking-wider select-none">
              {t('entry.sec_core')}
            </div>
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-500 tracking-wider select-none">
              {t('entry.depth')}
            </div>
          </div>

          {/* Core Telemetry Indicators */}
          <div className="mt-4 flex gap-4 text-slate-500 font-mono text-[10px]">
            <div>{t('entry.stability_val')}</div>
            <div>•</div>
            <div>{t('entry.h2s_conc')}</div>
          </div>
        </div>

        {/* Right Side: Narrative Panel & System Ignition Controls */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-widest inline-block font-semibold">
              {t('entry.badge')}
            </span>
            <h2 className="text-3xl font-light tracking-wide text-white uppercase font-sans">
              {t('entry.title')} <span className="font-bold text-amber-500">{t('entry.title_highlight')}</span>
            </h2>
            <div className="w-16 h-[2px] bg-amber-500" />
          </div>

          <div className="text-slate-300 space-y-4 text-sm font-sans leading-relaxed">
            <p>
              {t('entry.p1')}
            </p>
            <p className="border-l-2 border-slate-800 pl-4 py-1.5 text-slate-400 text-xs font-mono">
              {t('entry.p2')}
            </p>
          </div>

          {/* Action Station */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-mono text-[10px] text-slate-400 tracking-wider block">{t('entry.action_label')}</span>
              <span className="font-mono text-xs text-slate-500 block">{t('entry.action_req')}</span>
            </div>

            <button
              onClick={() => {
                onInitiateWake();
                playBeep(440, 0.2, 'sawtooth');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold tracking-widest hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer group uppercase active:scale-[0.98]"
              id="btn-initiate-wake"
            >
              <Power size={14} className="group-hover:rotate-45 transition-transform duration-300" />
              <span>{t('entry.btn_wake')}</span>
            </button>
          </div>

          {/* Warning Footer */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <AlertTriangle size={11} className="text-slate-600" />
            <span>{t('entry.warning')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
