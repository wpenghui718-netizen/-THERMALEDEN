import React, { useState } from 'react';
import { Database, Search, Download, Clock, ShieldCheck, HelpCircle, HardDrive, Cpu } from 'lucide-react';
import { LogEntry, SystemMetrics } from '../types';
import { MEMORY_SHARDS, MemoryShard } from '../utils/data';
import { playBeep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface MemoryTabProps {
  logs: LogEntry[];
  systemMetrics: SystemMetrics;
  onAddLog: (category: string, message: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
}

export default function MemoryTab({ logs, systemMetrics, onAddLog }: MemoryTabProps) {
  const { t } = useLanguage();
  const [selectedShard, setSelectedShard] = useState<MemoryShard>(MEMORY_SHARDS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const shardEpochKey = (id: string) => `shard.${id.replace('shard_', '')}_epoch`;
  const shardTitleKey = (id: string) => `shard.${id.replace('shard_', '')}_title`;
  const shardSourceKey = (id: string) => `shard.${id.replace('shard_', '')}_source`;
  const shardSnippetKey = (id: string) => `shard.${id.replace('shard_', '')}_snippet`;

  const filteredLogs = logs.filter((l) => 
    l.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerDownload = (shardId: string, title: string) => {
    playBeep(1100, 0.25, 'triangle');
    setDownloadSuccess(shardId);
    onAddLog('ARCHIVE_DL', `Successfully downloaded crypt key index shard: ${title}`, 'success');
    
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2000);
  };

  return (
    <div className="flex-1 p-6 grid-bg-ambient min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Micro Cumulative Heat Energy Graph (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-fuchsia-400 bg-fuchsia-950/50 border border-fuchsia-800/40 px-2 py-0.5 rounded uppercase tracking-widest inline-block select-none">
                {t('memory.badge')}
              </span>
              <h3 className="text-xl font-light text-white uppercase font-sans">
                {t('memory.title')} <span className="font-bold text-fuchsia-400">{t('memory.title_highlight')}</span>
              </h3>
            </div>
            <div className="w-12 h-[2px] bg-fuchsia-400" />
            
            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {t('memory.desc')}
            </p>

            {/* Static SVG Heat Graph Curve */}
            <div className="bg-slate-900/40 border border-slate-800 p-3 rounded">
              <div className="flex justify-between items-center text-[10px] font-mono mb-2 text-slate-400">
                <span>{t('memory.heat_index')}</span>
                <span className="text-fuchsia-400 font-bold">{systemMetrics.cumulativeHeat.toFixed(1)} {t('memory.gj')}</span>
              </div>
              
              <div className="h-28 w-full border-b border-l border-slate-800 relative flex items-end">
                {/* SVG Curve Path Drawing */}
                <svg className="absolute inset-0 h-full w-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 0,80 Q 40,60 80,75 T 160,35 T 240,20 T 320,10" 
                    fill="none" 
                    stroke="rgba(217, 70, 239, 0.55)" 
                    strokeWidth="2.5" 
                    strokeDasharray="200" 
                    strokeDashoffset="0"
                    className="animate-[dash_5s_ease-out_infinite]"
                  />
                  {/* Glowing core dots */}
                  <circle cx="80" cy="75" r="3" fill="#d946ef" className="animate-pulse" />
                  <circle cx="240" cy="20" r="3.5" fill="#d946ef" />
                </svg>

                <div className="absolute right-2 top-2 bg-slate-950/90 border border-slate-800 text-[8px] font-mono text-slate-500 px-1 py-0.5 rounded uppercase select-none">
                  {t('memory.sector')}
                </div>
              </div>

              <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-2">
                <span>{t('memory.epoch_cold')}</span>
                <span>{t('memory.epoch_active')}</span>
              </div>
            </div>

            {/* Micro image of server structures */}
            <div className="w-full h-24 rounded overflow-hidden border border-slate-800 relative bg-slate-950">
              <div className="absolute inset-0 bg-linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.5)_50%) bg-[size:100%_4px] z-10 pointer-events-none opacity-40" />
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWjPNpS6bzLEfOiC1rWg1LTxGKAAohzIwwROxbEJqu_w8V-wWieVwGX6ieDXdrMBUetoNZaTXEuG37d-ltSlX-ck6i16v6mSf7332nZ1VGk17uIROCA1VkhsACqMNrgVJ3AmVJMdy504kjknes3KEUGLC2gAoqkjmdq65SGLxTjE7iIvd8Ix9UjN5JrSDUtJxago2TxIAM4ZM-KRQYE6_9g0M32avJAVQ7k-CNH3vTfIDlzmls8lZVfAKP9CJOKrzm4QOk_pzLi5w" 
                alt="Silicon Core Processor Map"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.6] contrast-125"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 flex justify-between select-none">
            <span>{t('memory.unlocked')} {MEMORY_SHARDS.filter(s => systemMetrics.coreTemp >= s.unlockedAtTemp).length}/4</span>
            <span>{t('memory.encrypt')}</span>
          </div>
        </div>

        {/* Center column: Retrieval core archives (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col border border-slate-800 bg-slate-950/40 rounded-lg p-5">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 mb-4">
            <HardDrive className="text-fuchsia-400" size={15} />
            <span className="font-mono text-[10px] font-bold text-slate-200">{t('memory.shards')}</span>
          </div>

          {/* List display */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[380px] scrollbar-thin">
            {MEMORY_SHARDS.map((shard) => {
              const isUnlocked = systemMetrics.coreTemp >= shard.unlockedAtTemp;
              const isActive = selectedShard.id === shard.id;
              
              return (
                <button
                  key={shard.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedShard(shard);
                      playBeep(920, 0.1, 'sine');
                    } else {
                      playBeep(200, 0.25, 'sawtooth');
                    }
                  }}
                  className={`w-full p-3 rounded border text-left flex flex-col gap-1.5 transition-all relative overflow-hidden select-none ${
                    !isUnlocked 
                      ? 'border-slate-900 bg-slate-950 opacity-40 cursor-not-allowed' 
                      : isActive 
                        ? 'bg-fuchsia-950/20 border-fuchsia-500/80 shadow-[0_0_10px_rgba(217,70,239,0.05)] text-slate-200 cursor-pointer' 
                        : 'bg-slate-900/10 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/20 text-slate-300 cursor-pointer'
                  }`}
                  id={`btn-shard-select-${shard.id}`}
                  disabled={!isUnlocked}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="font-mono text-[10px] text-fuchsia-400 font-bold block">{t(shardEpochKey(shard.id))}</span>
                    <span className="font-mono text-[9px] text-slate-500">
                      {isUnlocked ? t('memory.decrypted') : `${t('memory.reqd_temp')} ${shard.unlockedAtTemp}°C`}
                    </span>
                  </div>

                  <span className="font-sans text-xs font-semibold block truncate leading-tight">
                    {t(shardTitleKey(shard.id))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Chronology Digital Logs System (col-span-12 or col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between border border-slate-800 bg-slate-950/80 rounded-lg p-5">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Database className="text-fuchsia-500" size={15} />
                  <span className="font-mono text-[10px] font-bold text-slate-200">{t('memory.chronology')}</span>
                </div>
                <span className="font-mono text-[8px] bg-slate-950 border border-slate-800 px-1 py-0.5 rounded text-fuchsia-400 select-none">
                  {t('memory.integrity')}
                </span>
              </div>

              {/* Text Search Box */}
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder={t('memory.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-[10px] font-mono pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-fuchsia-500 text-slate-300 tracking-wider uppercase"
                  id="log-search-input"
                />
              </div>

              {/* Logs scrolling core table */}
              <div className="overflow-y-auto space-y-2 h-[220px] pr-1.5 scrollbar-thin">
                {filteredLogs.reverse().map((log) => (
                  <div key={log.id} className="p-2 border border-slate-900 bg-slate-950/40 rounded text-[9px] font-mono leading-relaxed space-y-1 hover:bg-slate-900/30 transition-colors">
                    <div className="flex items-center justify-between text-slate-500 text-[8px]">
                      <span>[{log.timestamp}] // {log.category}</span>
                      <span className={`px-1 rounded border text-[7px] uppercase font-bold select-none ${
                        log.type === 'success' ? 'border-emerald-900/60 text-emerald-400 bg-emerald-950/20' :
                        log.type === 'warning' ? 'border-amber-900/60 text-amber-400 bg-amber-950/20' :
                        log.type === 'critical' ? 'border-red-900/60 text-red-400 bg-red-950/20 animate-pulse' :
                        'border-slate-800 text-slate-400 bg-slate-900'
                      }`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-normal">{log.message}</p>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <p className="text-center text-slate-600 font-mono text-[10px] pt-12 select-none uppercase">
                    {t('memory.no_logs')}
                  </p>
                )}
              </div>
            </div>

            {/* Selected archive preview details */}
            <div className="border-t border-slate-850 pt-4 mt-2">
              <span className="font-mono text-[8px] text-fuchsia-400 uppercase tracking-widest block font-bold">{t('memory.active_shard')}</span>
              <p className="font-mono text-[10px] text-slate-500 mb-1">{t(shardSourceKey(selectedShard.id))} // {t(shardEpochKey(selectedShard.id))}</p>
              
              <div className="p-3 bg-slate-900/30 border border-slate-800/80 rounded h-[110px] overflow-y-auto text-[10px] font-sans text-slate-300 leading-normal scrollbar-thin">
                {t(shardSnippetKey(selectedShard.id))}
              </div>

              <button
                onClick={() => triggerDownload(selectedShard.id, selectedShard.title)}
                disabled={downloadSuccess !== null}
                className={`w-full py-1.5 border font-mono text-[9px] tracking-widest rounded mt-2 cursor-pointer flex items-center justify-center gap-1.5 transition-all uppercase select-none ${
                    downloadSuccess === selectedShard.id
                      ? 'bg-emerald-950/20 border-emerald-500/80 text-emerald-400 font-bold'
                      : 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border-fuchsia-600/40 hover:border-fuchsia-400 text-fuchsia-300'
                }`}
                id="btn-download-shard"
              >
                <Download size={11} />
                <span>{downloadSuccess === selectedShard.id ? t('memory.btn_downloaded') : t('memory.btn_download')}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
