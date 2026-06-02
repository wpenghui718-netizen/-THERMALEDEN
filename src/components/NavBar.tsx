import React from 'react';
import { Lock, FileText, Activity, ShieldAlert, Cpu, Eye, Compass } from 'lucide-react';
import { TabId } from '../types';
import { playBeep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface NavBarProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  systemState: 'Dormant' | 'Waking' | 'Active' | 'Mutation';
}

export default function NavBar({ activeTab, onTabChange, systemState }: NavBarProps) {
  const { t } = useLanguage();
  const tabs = [
    { id: 'entry' as TabId, num: '01', title: t('nav.entry'), stateLabel: t('nav.state_dormant'), icon: Cpu, color: 'border-slate-800 text-slate-400' },
    { id: 'wake' as TabId, num: '02', title: t('nav.wake'), stateLabel: t('nav.state_ignite'), icon: Eye, color: 'border-amber-900/40 text-amber-500' },
    { id: 'scan' as TabId, num: '03', title: t('nav.scan'), stateLabel: t('nav.state_radar'), icon: Compass, color: 'border-cyan-900/40 text-cyan-400' },
    { id: 'biosphere' as TabId, num: '04', title: t('nav.biosphere'), stateLabel: t('nav.state_colony'), icon: Activity, color: 'border-emerald-950/40 text-emerald-400' },
    { id: 'impact' as TabId, num: '05', title: t('nav.impact'), stateLabel: t('nav.state_mutation'), icon: ShieldAlert, color: 'border-red-950/40 text-red-400' },
    { id: 'memory' as TabId, num: '06', title: t('nav.memory'), stateLabel: t('nav.state_archives'), icon: FileText, color: 'border-fuchsia-950/40 text-fuchsia-400' }
  ];

  // Restrict access if systems are dormant and user has not ignited yet
  const isLocked = (tabId: TabId) => {
    if (systemState === 'Dormant') {
      return tabId !== 'entry' && tabId !== 'wake';
    }
    return false;
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 p-4 sticky bottom-0 z-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {tabs.map((tab) => {
          const locked = isLocked(tab.id);
          const active = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (locked) {
                  playBeep(240, 0.25, 'sawtooth');
                } else {
                  onTabChange(tab.id);
                  playBeep(440 + tab.num.charCodeAt(1) * 20, 0.12, 'sine');
                }
              }}
              className={`text-left p-3.5 border rounded-md relative group transition-all duration-300 font-mono select-none overflow-hidden ${
                locked 
                  ? 'border-slate-900 bg-slate-950/40 opacity-30 cursor-not-allowed' 
                  : active 
                    ? `bg-slate-900/70 ${
                        tab.id === 'entry' ? 'border-indigo-500/80 shadow-[0_0_12px_rgba(99,102,241,0.1)]' :
                        tab.id === 'wake' ? 'border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.1)]' :
                        tab.id === 'scan' ? 'border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.1)]' :
                        tab.id === 'biosphere' ? 'border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.1)]' :
                        tab.id === 'impact' ? 'border-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.1)]' :
                        'border-fuchsia-500/80 shadow-[0_0_12px_rgba(217,70,239,0.1)]'
                      } cursor-pointer` 
                    : 'border-slate-900 bg-slate-900/10 hover:border-slate-700/80 hover:bg-slate-900/20 cursor-pointer'
              }`}
              id={`nav-tab-${tab.id}`}
              disabled={locked && active}
              title={locked ? t('nav.tooltip_locked') : `Go to Tab ${tab.num}`}
            >
              {active && (
                <span className={`absolute top-0 left-0 w-1 h-full ${
                  tab.id === 'entry' ? 'bg-indigo-500' :
                  tab.id === 'wake' ? 'bg-amber-500' :
                  tab.id === 'scan' ? 'bg-cyan-500' :
                  tab.id === 'biosphere' ? 'bg-emerald-500' :
                  tab.id === 'impact' ? 'bg-red-500' :
                  'bg-fuchsia-500'
                }`} />
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="block text-[8px] text-slate-500 tracking-wider">SEC {tab.num}</span>
                  <span className={`block text-xs font-bold leading-none mt-0.5 tracking-widest ${
                    locked ? 'text-slate-500' : active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {tab.title}
                  </span>
                </div>
                {locked ? (
                  <Lock size={12} className="text-slate-600" />
                ) : (
                  <Icon size={12} className={`${active ? 'text-slate-300' : 'text-slate-600 group-hover:text-slate-400'} transition-colors`} />
                )}
              </div>

              <span className={`block text-[9px] mt-2 whitespace-nowrap overflow-hidden text-ellipsis uppercase tracking-tight ${
                locked ? 'text-slate-600' : active ? 'text-emerald-400 font-medium' : 'text-slate-500'
              }`}>
                {locked ? t('nav.restricted') : tab.stateLabel}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
