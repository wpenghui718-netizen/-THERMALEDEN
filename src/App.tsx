import React, { useState, useEffect } from 'react';
import { TabId, LogEntry, Specimen, SystemMetrics } from './types';
import { INITIAL_LOGS, INITIAL_SPECIMENS } from './utils/data';
import { initAudio, setVolume, playBeep, playMelodicSequence } from './utils/audio';

import Header from './components/Header';
import EntryTab from './components/EntryTab';
import WakeTab from './components/WakeTab';
import ScanTab from './components/ScanTab';
import BiosphereTab from './components/BiosphereTab';
import ImpactTab from './components/ImpactTab';
import MemoryTab from './components/MemoryTab';
import NavBar from './components/NavBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('entry');
  const [systemState, setSystemState] = useState<'Dormant' | 'Waking' | 'Active' | 'Mutation'>('Dormant');
  const [isMuted, setIsMuted] = useState(true);

  // Core structured states
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [specimens, setSpecimens] = useState<Specimen[]>(INITIAL_SPECIMENS);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    coreTemp: 84.0,
    stability: 100,
    metabolicResonance: 0,
    ventPressure: 24,
    systemStress: 14,
    cumulativeHeat: 12.4
  });

  // Toggle visual elements and handle procedural ambient synthesizer
  const toggleMuted = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      initAudio();
      setVolume('high');
    } else {
      setVolume('mute');
    }
  };

  // Log auxiliary callback helper
  const addLog = (category: string, message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog: LogEntry = {
      id: `dyn_log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      category,
      message,
      type
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Set sequence wake initiations click
  const handleInitiateWake = () => {
    setSystemState('Waking');
    setActiveTab('wake');
    addLog('IGNITION', 'Catalytic geological thermal ignition carrier triggered.', 'warning');
    addLog('STREAMS', 'Reclaiming kernel diagnostic modules for deep thermal sanctuary.', 'info');
  };

  // Action complete on progress bar reach 100
  const handleSequenceComplete = () => {
    setSystemState('Active');
    setActiveTab('biosphere');
    setSystemMetrics((prev) => ({
      ...prev,
      coreTemp: 341.2,
      stability: 94,
      metabolicResonance: 56.4
    }));
    addLog('CORE_ONLINE', 'Deep biosphere active. Sub-crust thermal venting calibrated.', 'success');
    addLog('BIOS_SYNTH', 'Chemosynthesis bio reactor loops initialized at -3,480m.', 'info');
    
    // Play cool chord sequence
    setTimeout(() => {
      playMelodicSequence();
    }, 400);
  };

  // Full manual simulator reset callback
  const handleResetSystem = () => {
    setSystemState('Dormant');
    setActiveTab('entry');
    setLogs(INITIAL_LOGS);
    setSpecimens(INITIAL_SPECIMENS);
    setSystemMetrics({
      coreTemp: 84.0,
      stability: 100,
      metabolicResonance: 0,
      ventPressure: 24,
      systemStress: 14,
      cumulativeHeat: 12.4
    });
    addLog('SYS_RESET', 'System returned to cold cryogenic state. Resonator shutdown.', 'critical');
  };

  // Simulated ambient fluctuations and logs ticker loop
  useEffect(() => {
    if (systemState === 'Dormant') return;

    const timer = setInterval(() => {
      // Periodic ticker update parameters
      setSystemMetrics((prev) => {
        // Temperature fluctuates slightly based on current temp
        let tempChange = (Math.random() - 0.5) * 1.5;
        let pChange = (Math.random() - 0.5) * 2;
        let stressChange = (Math.random() - 0.5) * 1.2;

        const updatedTemp = Math.max(84, Math.min(480, prev.coreTemp + tempChange));
        const updatedPressure = Math.max(10, Math.min(100, prev.ventPressure + pChange));
        
        // System stress grows if temperature is extremely high (>390) or pressure is dangerously high (>80)
        let pressureStressor = updatedPressure > 75 ? (updatedPressure - 75) * 0.8 : -0.5;
        let thermalStressor = updatedTemp > 380 ? (updatedTemp - 380) * 0.4 : -0.3;
        
        const updatedStress = Math.max(10, Math.min(100, prev.systemStress + stressChange + pressureStressor + thermalStressor));
        
        // Accumulate MJ energy slowly based on temperature output
        const heatLoad = (updatedTemp * 0.04) / 60;
        const updatedHeat = prev.cumulativeHeat + heatLoad;

        return {
          ...prev,
          coreTemp: updatedTemp,
          ventPressure: updatedPressure,
          systemStress: updatedStress,
          cumulativeHeat: updatedHeat
        };
      });

      // Randomized nominal status logging to feed chronologies
      if (Math.random() > 0.85) {
        const telemetryLogs = [
          { cat: 'RESONATOR', msg: 'Resonant harmonic waves stabilized on deep tectonic fault.', t: 'info' as const },
          { cat: 'CHEMO_AN', msg: 'Sulfide extraction buffers reporting optimal bio uptake levels.', t: 'success' as const },
          { cat: 'PRESSURE', msg: 'Core containment integrity is nominal. Automatic venting on stand-by.', t: 'info' as const },
        ];
        const chosen = telemetryLogs[Math.floor(Math.random() * telemetryLogs.length)];
        addLog(chosen.cat, chosen.msg, chosen.t);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [systemState]);

  // Handle extreme triggers and alerts (e.g. stress or temperature matches warning status)
  useEffect(() => {
    if (systemMetrics.systemStress > 78) {
      const isCriticalLogPresent = logs.some(l => l.category === 'SYS_CRITICAL' && Date.now() - Number(l.id.split('_')[2]) < 10000);
      if (!isCriticalLogPresent) {
        addLog('SYS_CRITICAL', 'CRITICAL STRESS PLUME LIMIT REACHED. MANUALLY RELEASE STEAM VALVES IMMEDIATELY!', 'critical');
        playBeep(330, 0.4, 'sawtooth');
      }
    }
  }, [systemMetrics.systemStress]);

  return (
    <div className="min-h-screen text-slate-100 bg-[#020617] flex flex-col justify-between select-none scanline-effect">
      
      {/* HUD System Monitor Header */}
      <Header
        systemState={systemState}
        coreTemp={systemMetrics.coreTemp}
        stability={systemMetrics.stability}
        systemStress={systemMetrics.systemStress}
        isMuted={isMuted}
        onToggleMute={toggleMuted}
        onResetSystem={handleResetSystem}
      />

      {/* Primary Tab Views Switcher */}
      <main className="flex-1 flex flex-col relative">
        {activeTab === 'entry' && (
          <EntryTab onInitiateWake={handleInitiateWake} />
        )}

        {activeTab === 'wake' && (
          <WakeTab 
            onSequenceComplete={handleSequenceComplete} 
            isCompleted={systemState === 'Active'}
          />
        )}

        {activeTab === 'scan' && (
          <ScanTab />
        )}

        {activeTab === 'biosphere' && (
          <BiosphereTab
            specimens={specimens}
            systemMetrics={systemMetrics}
            onModifyMetrics={(updated) => setSystemMetrics((prev) => ({ ...prev, ...updated }))}
            onUpdateSpecimens={(updated) => setSpecimens(updated)}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactTab
            systemMetrics={systemMetrics}
            specimens={specimens}
            onModifyMetrics={(updated) => setSystemMetrics((prev) => ({ ...prev, ...updated }))}
            onUpdateSpecimens={(updated) => setSpecimens(updated)}
            onAddLog={addLog}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryTab 
            logs={logs} 
            systemMetrics={systemMetrics} 
            onAddLog={addLog}
          />
        )}
      </main>

      {/* Cybernetic Navigation Bar */}
      <NavBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        systemState={systemState}
      />
    </div>
  );
}
