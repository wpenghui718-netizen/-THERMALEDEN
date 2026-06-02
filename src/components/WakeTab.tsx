import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal as TerminalIcon, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { playBeep, playWakeUpSweep } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

interface WakeTabProps {
  onSequenceComplete: () => void;
  isCompleted: boolean;
}

export default function WakeTab({ onSequenceComplete, isCompleted }: WakeTabProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([
    t('wake.log_pre1'),
    t('wake.log_pre2'),
    t('wake.log_pre3')
  ]);
  const [isBooting, setIsBooting] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const potentialLogKeys = [
    'wake.log_align',
    'wake.log_detect',
    'wake.log_geo',
    'wake.log_inject',
    'wake.log_status',
    'wake.log_monitor',
    'wake.log_vent',
    'wake.log_heating',
    'wake.log_stress',
    'wake.log_resonance',
    'wake.log_metabolic',
    'wake.log_ready'
  ];

  useEffect(() => {
    let timer: any;
    if (isBooting && progress < 100) {
      timer = setTimeout(() => {
        const nextProg = progress + Math.floor(Math.random() * 8) + 3;
        const reachedEnd = nextProg >= 100;
        
        setProgress(reachedEnd ? 100 : nextProg);
        
        // Add random cool log line
        if (Math.random() > 0.4 && progress < 90) {
          const randomMsg = t(potentialLogKeys[Math.floor(Math.random() * potentialLogKeys.length)]);
          const formatted = `[ OK ] [${new Date().toLocaleTimeString()}] ${randomMsg}`;
          setLogLines(prev => [...prev.slice(-15), formatted]);
          playBeep(450 + nextProg * 3, 0.08, 'sine');
        }
      }, 180);
    }
    return () => clearTimeout(timer);
  }, [progress, isBooting]);

  // Handle auto complete sounds
  useEffect(() => {
    if (progress === 100 && isBooting) {
      setIsBooting(false);
      const finished = t('wake.log_success');
      setLogLines(prev => [...prev.slice(-15), finished]);
      playWakeUpSweep();
    }
  }, [progress]);

  // Scroll terminal to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logLines]);

  const accelerateBoot = () => {
    if (progress < 100 && isBooting) {
      setProgress(prev => Math.min(100, prev + 15));
      setLogLines(prev => [...prev, t('wake.log_boost')]);
      playBeep(880, 0.1, 'square');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 min-h-[70vh] grid-bg-ambient justify-center items-center relative">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Status Bar and Main Progress Hub (col-span-12 or col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-amber-500 tracking-widest block uppercase">
              {t('wake.badge')}
            </span>
            <h2 className="text-3xl font-light text-white tracking-wide uppercase">
              {t('wake.title')} <span className="font-bold text-amber-500">{t('wake.title_highlight')}</span>
            </h2>
          </div>

          {/* Central Reactor Power Visual */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
            
            {/* Glowing Waking Reactor Circular Logo */}
            <div className="relative h-32 w-32 flex-shrink-0 flex items-center justify-center rounded-full border border-amber-500/20 bg-slate-950/60 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
              <div 
                className="absolute inset-0 rounded-full border border-dashed border-amber-500/30 animate-[spin_10s_linear_infinite]"
                style={{ animationDuration: `${(105 - progress) / 3}s` }}
              />
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmmW-rNcoeECLLa6s80gdmQGlyMGJRBa0VKh-y7TUVNpUeBCE3NpPQ2YR0GtOBNtLRRN7sgFHMzpB15VY7zqdTKVVsdYN1MkcW7ESyYJXz-1jGwVWBMWx6wsvagGJLGSNgOplJ69Wjm3IUmltHbSQF-nEaPzsSdEmfAdAlJFxTJYBr4oI73GTOJ668uGRznW-oGxr3-e7O48ht4IRZzFi5UlK0IuRu2TlNm7ENil8iwK_kGpTDhnPYqBINueb9kJal_6X9wj1nvfE" 
                alt="Igniting Core"
                referrerPolicy="no-referrer"
                className="h-24 w-24 rounded-full object-cover grayscale brightness-90 animate-pulse transition-transform"
                style={{ 
                  transform: `scale(${1 + (progress / 400)})`,
                  filter: `hue-rotate(${progress * 0.4}deg) brightness(${0.4 + (progress / 180)})`
                }}
              />
              
              <div className="absolute inset-0 bg-radial-[circle_40%_at_center] from-amber-500/10 to-transparent pointer-events-none" />
            </div>

            {/* Core statistics ticker */}
            <div className="space-y-3 flex-1 w-full">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">{t('wake.matrix')}</span>
                <span className="text-amber-400 font-bold">{progress}%</span>
              </div>
              
              {/* Process Bar */}
              <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-4 overflow-hidden p-0.5">
                <div 
                  className="bg-amber-500 h-full rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all ease-out duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-500">
                <div>
                  <span className="block text-slate-400">{t('wake.temp_index')}</span>
                  <span className="text-slate-300 font-bold">{(84 + (progress * 2.8)).toFixed(1)}°C</span>
                </div>
                <div>
                  <span className="block text-slate-400">{t('wake.stability')}</span>
                  <span className="text-slate-300 font-bold">{(100 - (progress * 0.4)).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={accelerateBoot}
              disabled={progress >= 100}
              className="px-5 py-2.5 bg-slate-900 border border-slate-700/80 hover:border-amber-500 text-slate-300 hover:text-white rounded font-mono text-xs tracking-wider flex items-center gap-1.5 transition-all select-none disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              id="btn-accelerate"
            >
              <Zap size={13} className="text-amber-400" />
              <span>{t('wake.btn_accelerate')}</span>
            </button>

            {progress === 100 && (
              <button
                onClick={() => {
                  onSequenceComplete();
                  playBeep(660, 0.4, 'triangle');
                }}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded font-mono text-xs font-bold tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-bounce"
                id="btn-engage-active"
              >
                <CheckCircle2 size={13} />
                <span>{t('wake.btn_engage')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right scrolling Boot Logs Terminal (col-span-12 or col-span-5) */}
        <div className="lg:col-span-5 h-[340px] border border-slate-800 bg-slate-950/90 rounded-lg p-4 font-mono text-xs flex flex-col justify-between overflow-hidden relative">
          
          {/* Top header decoration */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <TerminalIcon size={12} className="text-amber-500" />
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('wake.log_title')}</span>
            </div>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-800" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            </div>
          </div>

          {/* Log scrolling box */}
          <div className="flex-1 overflow-y-auto space-y-1.5 text-[10px] pr-2 scrollbar-thin">
            {logLines.map((line, idx) => (
              <div 
                key={idx} 
                className={`${
                  line.includes('[SUCCESS]') ? 'text-emerald-400 font-semibold' :
                  line.includes('[FAIL]') || line.includes('STRESS') ? 'text-red-400 font-semibold' :
                  line.includes('OPERATOR') ? 'text-violet-400 font-bold' :
                  'text-slate-400'
                } leading-relaxed`}
              >
                {line}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          <div className="border-t border-slate-800 mt-2 pt-2 flex items-center justify-between text-[9px] text-slate-500">
            <span>{t('wake.coord')}</span>
            <span>{t('wake.freq')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
