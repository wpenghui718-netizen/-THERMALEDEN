// Immersive Web Audio Engine for ThermalEden
// Generates persistent procedural drone, pulse waves and notification beeps

let audioCtx: AudioContext | null = null;
let droneOsc: OscillatorNode | null = null;
let droneFilter: BiquadFilterNode | null = null;
let droneGain: GainNode | null = null;

let pulseOsc: OscillatorNode | null = null;
let pulseGain: GainNode | null = null;

export function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Create master drone (deep hydrothermal low sub rumble)
    droneOsc = audioCtx.createOscillator();
    droneFilter = audioCtx.createBiquadFilter();
    droneGain = audioCtx.createGain();

    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note - deep underwater depth
    
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(110, audioCtx.currentTime);
    droneFilter.Q.setValueAtTime(8, audioCtx.currentTime);

    droneGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(audioCtx.destination);
    
    droneOsc.start();

    // Secondary pulse wave (replicating a heartbeat of the core)
    pulseOsc = audioCtx.createOscillator();
    pulseGain = audioCtx.createGain();
    
    pulseOsc.type = 'sine';
    pulseOsc.frequency.setValueAtTime(0.4, audioCtx.currentTime); // LFO at 0.4Hz for thermal metabolic rhythm
    
    const pulseFilter = audioCtx.createBiquadFilter();
    pulseFilter.type = 'bandpass';
    pulseFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
    
    pulseOsc.connect(pulseGain);
    pulseGain.connect(audioCtx.destination);
    // Silent initially unless unmuted or activated
    pulseGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    pulseOsc.start();

    // Start resume loop if suspended by browser security
    if (audioCtx.state === 'suspended') {
      const resume = () => {
        audioCtx?.resume();
        window.removeEventListener('click', resume);
      };
      window.addEventListener('click', resume);
    }
  } catch (err) {
    console.warn("Web Audio API not supported", err);
  }
}

export function setVolume(volume: 'mute' | 'low' | 'high') {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;
  
  const destVal = volume === 'mute' ? 0 : volume === 'low' ? 0.04 : 0.12;
  
  if (droneGain) {
    droneGain.gain.exponentialRampToValueAtTime(destVal, audioCtx.currentTime + 0.5);
  }
}

export function playBeep(freq: number = 880, duration: number = 0.15, type: OscillatorType = 'sine') {
  if (!audioCtx) {
    try {
      initAudio();
    } catch { return; }
  }
  if (!audioCtx || audioCtx.state === 'suspended') return;
  
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Fail silently to prevent console clutter
  }
}

export function playWakeUpSweep() {
  if (!audioCtx) initAudio();
  if (!audioCtx || audioCtx.state === 'suspended') return;
  
  try {
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.frequency.setValueAtTime(110, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.2);
    
    osc2.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.2);
    
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 1.3);
    osc2.stop(audioCtx.currentTime + 1.3);
  } catch (e) {}
}

export function playMelodicSequence() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 0.4, 'triangle');
    }, idx * 150);
  });
}
