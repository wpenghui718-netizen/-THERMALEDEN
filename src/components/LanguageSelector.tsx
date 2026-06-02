import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { Globe, Check, Languages } from 'lucide-react';

const LANG_OPTIONS: { id: Language; flag: string }[] = [
  { id: 'en', flag: '🇬🇧' },
  { id: 'zh-CN', flag: '🇨🇳' },
];

export default function LanguageSelector() {
  const { t, lang, confirmLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(lang);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      confirmLanguage(selected);
    }, 400);
  };

  if (confirmed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] scanline-effect">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-2 border-emerald-500/50 flex items-center justify-center bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Check size={32} className="text-emerald-400" />
          </div>
          <span className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase animate-pulse">
            {t('lang.saved')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] scanline-effect">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg-ambient opacity-40" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-slate-800 pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-slate-800 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-slate-800 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-slate-800 pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="border border-slate-800 bg-slate-950/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          {/* Header */}
          <div className="border-b border-slate-800 px-8 pt-8 pb-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
                <Languages size={28} className="text-amber-400" />
              </div>
              {/* Orbiting ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/20 animate-[spin_12s_linear_infinite]" />
            </div>

            <h2 className="text-lg font-bold tracking-[0.2em] text-white font-sans uppercase mb-1">
              {t('lang.title')}
            </h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">
              {t('lang.subtitle')}
            </p>
          </div>

          {/* Language options */}
          <div className="p-6 space-y-3">
            {LANG_OPTIONS.map((opt) => {
              const isActive = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`w-full p-4 rounded border text-left flex items-center gap-4 transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? 'bg-slate-900/70 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                      : 'bg-slate-900/20 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/30'
                  }`}
                >
                  {/* Flag circle */}
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 border transition-all ${
                    isActive
                      ? 'border-amber-500/40 bg-amber-950/20'
                      : 'border-slate-800 bg-slate-950 group-hover:border-slate-700'
                  }`}>
                    {opt.flag}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className={`block font-mono text-sm font-bold tracking-wider transition-colors ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {t(`lang.${opt.id}`)}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono tracking-tight mt-0.5">
                      {t(`lang.${opt.id}.desc`)}
                    </span>
                  </div>

                  {/* Check indicator */}
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? 'border-amber-500 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                      : 'border-slate-700 bg-transparent'
                  }`}>
                    {isActive && <Check size={12} className="text-slate-950" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer / Confirm */}
          <div className="border-t border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-600">
              <Globe size={11} />
              <span>LANG_SEL // v1.0</span>
            </div>

            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-[11px] font-bold tracking-widest hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer active:scale-[0.98] uppercase select-none flex items-center gap-2"
            >
              <Check size={14} />
              <span>{t('lang.confirm')}</span>
            </button>
          </div>
        </div>

        {/* Bottom text decoration */}
        <p className="text-center mt-4 text-[8px] font-mono text-slate-700 tracking-wider uppercase select-none">
          THERMAL EDEN DIGITAL BIOSYSTEM // INTERFACE LANGUAGE MODULE
        </p>
      </div>
    </div>
  );
}
