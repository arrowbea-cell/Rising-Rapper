
import React from 'react';
import { GameState, Artist } from '../types';
import { Terminal, DollarSign, Sparkles, Users, Trophy, X, ShieldCheck, Zap } from 'lucide-react';

interface DevConsoleProps {
  artist: Artist;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

const DevConsole: React.FC<DevConsoleProps> = ({ artist, gameState, setGameState, onClose }) => {
  
  const cheatMoney = () => {
    setGameState(prev => ({ ...prev, money: prev.money + 100000000 }));
  };

  const cheatHype = () => {
    setGameState(prev => ({ ...prev, hype: 1000 }));
  };

  const cheatListeners = () => {
    if (artist) {
        // We'd usually need a way to update the artist object here, but artist is passed from parent state
        // In this architecture, listeners are updated via setArtist in App.tsx. 
        // For the sake of this dev console, we will assume we can set a massive weekly stream 
        // which will naturally force the listener logic to spike in the next week.
        setGameState(prev => ({ 
            ...prev, 
            weeklyStreams: prev.weeklyStreams + 100000000,
            totalStreams: prev.totalStreams + 100000000
        }));
    }
  };

  const cheatFame = () => {
      setGameState(prev => ({
          ...prev,
          regions: prev.regions.map(r => ({ ...r, popularity: 100 }))
      }));
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-[#0a0a0a] border border-green-500/50 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.2)]" onClick={e => e.stopPropagation()}>
            <div className="bg-green-500/10 p-6 border-b border-green-500/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Terminal className="text-green-500" />
                    <div>
                        <h2 className="text-xl font-black text-green-500 uppercase tracking-tighter">System Terminal</h2>
                        <p className="text-[10px] text-green-800 font-mono">Kernel Access: Level 0 (ROOT)</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={cheatMoney} className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-green-500 hover:bg-green-500/5 transition-all group">
                    <div className="p-3 rounded-xl bg-green-950 text-green-500"><DollarSign size={24} /></div>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-green-400">Inject Capital</div>
                        <div className="text-xs text-zinc-500 font-mono">+$100,000,000.00</div>
                    </div>
                </button>

                <button onClick={cheatHype} className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
                    <div className="p-3 rounded-xl bg-purple-950 text-purple-500"><Sparkles size={24} /></div>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-purple-400">Force Hype</div>
                        <div className="text-xs text-zinc-500 font-mono">Set Index to 1000</div>
                    </div>
                </button>

                <button onClick={cheatListeners} className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all group">
                    <div className="p-3 rounded-xl bg-blue-950 text-blue-500"><Users size={24} /></div>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-blue-400">Ghost Streams</div>
                        <div className="text-xs text-zinc-500 font-mono">+100M Simulated Streams</div>
                    </div>
                </button>

                <button onClick={cheatFame} className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group">
                    <div className="p-3 rounded-xl bg-yellow-950 text-yellow-500"><Trophy size={24} /></div>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-yellow-400">Global Dominance</div>
                        <div className="text-xs text-zinc-500 font-mono">Max Popularity All Regions</div>
                    </div>
                </button>
            </div>

            <div className="bg-black/60 p-4 px-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-900">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-mono uppercase">Developer Environment Active</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-[10px] font-black text-red-900 hover:text-red-500 uppercase tracking-widest transition-colors">Wipe System Logs</button>
                    <div className="flex items-center gap-1 text-green-500/50">
                        <Zap size={12} />
                        <span className="text-[9px] font-mono">v5.0_ADMIN</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DevConsole;
