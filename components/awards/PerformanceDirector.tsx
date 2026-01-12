
import React from 'react';
import { Mic2, Flame, AlertTriangle, Music } from 'lucide-react';

interface PerformanceDirectorProps {
    onStyleSelect: (style: 'VOCAL' | 'SPECTACLE' | 'CONTROVERSIAL') => void;
    songTitle: string;
}

export const PerformanceDirector: React.FC<PerformanceDirectorProps> = ({ onStyleSelect, songTitle }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500 relative bg-black/90">
            {/* Stage Background Hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-black pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-5xl text-center px-6">
                <div className="bg-white text-black font-black text-xs uppercase tracking-[0.3em] inline-block px-4 py-1 mb-6 rounded-sm">Backstage Director</div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">Stage Direction</h2>
                <p className="text-zinc-400 mb-10 text-lg">You are performing <span className="text-white font-bold">"{songTitle}"</span>. How should we stage it?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* OPTION 1: VOCAL */}
                    <button onClick={() => onStyleSelect('VOCAL')} className="group bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 p-8 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Mic2 size={100} /></div>
                        <div className="w-16 h-16 bg-blue-900/30 text-blue-400 rounded-full mb-6 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Mic2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Pure Vocals</h3>
                        <p className="text-zinc-400 text-sm mb-4">Just you and the microphone. Focus on talent and emotion.</p>
                        <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider">
                            <span className="bg-zinc-800 px-2 py-1 rounded text-green-400">++ Respect</span>
                            <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-400">Safe</span>
                        </div>
                    </button>

                    {/* OPTION 2: SPECTACLE */}
                    <button onClick={() => onStyleSelect('SPECTACLE')} className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 p-8 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Flame size={100} /></div>
                        <div className="w-16 h-16 bg-yellow-900/30 text-yellow-400 rounded-full mb-6 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                            <Music size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">High Energy</h3>
                        <p className="text-zinc-400 text-sm mb-4">Pyrotechnics, backup dancers, and massive choreography.</p>
                        <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider">
                            <span className="bg-zinc-800 px-2 py-1 rounded text-green-400">++ Hype</span>
                            <span className="bg-zinc-800 px-2 py-1 rounded text-yellow-400">Medium Risk</span>
                        </div>
                    </button>

                    {/* OPTION 3: CONTROVERSIAL */}
                    <button onClick={() => onStyleSelect('CONTROVERSIAL')} className="group bg-zinc-900 border border-zinc-800 hover:border-red-500/50 p-8 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><AlertTriangle size={100} /></div>
                        <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full mb-6 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Controversial</h3>
                        <p className="text-zinc-400 text-sm mb-4">Shock value. Bizarre costumes, political statements, or blood.</p>
                        <div className="flex gap-2 text-[10px] uppercase font-bold tracking-wider">
                            <span className="bg-zinc-800 px-2 py-1 rounded text-purple-400">+++ Viral</span>
                            <span className="bg-zinc-800 px-2 py-1 rounded text-red-400">High Risk</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
