import React, { useEffect, useRef, useState } from 'react';
import { Monster } from '../types';

interface AudioControllerProps {
  monster1: Monster;
  monster2: Monster;
  isBattleActive: boolean;
}

type AudioMode = 'auto' | 'manual';

const AudioController: React.FC<AudioControllerProps> = ({ monster1, monster2, isBattleActive }) => {
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);

  const [mode, setMode] = useState<AudioMode>('auto');
  const [manualPlayingId, setManualPlayingId] = useState<string | null>(null);

  // Logic to determine who is winning for Auto Mode
  const hp1Pct = monster1.currentHp / monster1.maxHp;
  const hp2Pct = monster2.currentHp / monster2.maxHp;
  const diff = hp1Pct - hp2Pct; // > 0.25 M1 Wins, < -0.25 M2 Wins
  const threshold = 0.25;

  useEffect(() => {
    // If battle ends or inactive, stop all
    if (!isBattleActive) {
      if (audioRef1.current) { audioRef1.current.pause(); }
      if (audioRef2.current) { audioRef2.current.pause(); }
      return;
    }

    const m1Audio = audioRef1.current;
    const m2Audio = audioRef2.current;

    if (!m1Audio || !m2Audio) return;

    const playM1 = () => {
        m2Audio.pause();
        if (m1Audio.paused) m1Audio.play().catch(() => {});
    };

    const playM2 = () => {
        m1Audio.pause();
        if (m2Audio.paused) m2Audio.play().catch(() => {});
    };

    const stopAll = () => {
        m1Audio.pause();
        m2Audio.pause();
    };

    if (mode === 'manual') {
        if (manualPlayingId === monster1.id) playM1();
        else if (manualPlayingId === monster2.id) playM2();
        else stopAll();
    } else {
        // AUTO MODE
        if (diff > threshold) {
            playM1(); // M1 Dominating
        } else if (diff < -threshold) {
            playM2(); // M2 Dominating
        } else {
            // Keep playing whoever is playing, or M1 default
            if (m1Audio.paused && m2Audio.paused) {
                playM1();
            }
        }
    }

  }, [isBattleActive, mode, manualPlayingId, diff, monster1.id, monster2.id]);


  // Helper styles for buttons
  const btnBase = "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all border";
  const activeStyle = (isActive: boolean, color: string) => 
    isActive 
      ? `bg-${color} text-black border-${color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`
      : `bg-transparent text-gray-400 border-white/20 hover:border-white/50`;

  return (
    <div className="w-full bg-black/80 backdrop-blur border-t border-white/10 p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-50">
      
      {/* Hidden Audio Elements */}
      <audio ref={audioRef1} src={monster1.audioUrl} loop />
      <audio ref={audioRef2} src={monster2.audioUrl} loop />

      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-xs font-mono uppercase">Music Control</span>
        
        {/* Auto Toggle */}
        <button 
            onClick={() => { setMode('auto'); setManualPlayingId(null); }}
            className={`${btnBase} ${mode === 'auto' ? 'bg-white text-black border-white' : 'text-gray-500 border-gray-700'}`}
        >
            Auto DJ
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* P1 Control */}
        <button 
            onClick={() => { setMode('manual'); setManualPlayingId(monster1.id); }}
            disabled={!monster1.audioUrl}
            className={`${btnBase} ${mode === 'manual' && manualPlayingId === monster1.id ? 'bg-neon-blue text-black border-neon-blue' : 'text-neon-blue border-neon-blue/30'}`}
        >
            Play {monster1.name.substring(0, 15)}...
        </button>

        {/* P2 Control */}
        <button 
            onClick={() => { setMode('manual'); setManualPlayingId(monster2.id); }}
            disabled={!monster2.audioUrl}
            className={`${btnBase} ${mode === 'manual' && manualPlayingId === monster2.id ? 'bg-neon-pink text-black border-neon-pink' : 'text-neon-pink border-neon-pink/30'}`}
        >
             Play {monster2.name.substring(0, 15)}...
        </button>

        {/* Stop */}
        <button 
            onClick={() => { setMode('manual'); setManualPlayingId(null); }}
            className={`${btnBase} border-red-900 text-red-500 hover:bg-red-900/20`}
        >
            Stop
        </button>
      </div>
    </div>
  );
};

export default AudioController;