import React from 'react';
import { GameState, RegionStats } from '../types';
import { Map, BarChart3, Globe2, Signal, TrendingUp, Users, Lock } from 'lucide-react';

interface WorldMapProps {
  gameState: GameState;
}

const WorldMap: React.FC<WorldMapProps> = ({ gameState }) => {
  const getStatus = (pop: number) => {
    if (pop < 1) return { label: 'UNKNOWN', color: 'text-zinc-600', border: 'border-zinc-800' };
    if (pop < 15) return { label: 'UNDERGROUND', color: 'text-blue-400', border: 'border-blue-900/50' };
    if (pop < 40) return { label: 'RISING STAR', color: 'text-purple-400', border: 'border-purple-900/50' };
    if (pop < 75) return { label: 'MAINSTREAM', color: 'text-pink-400', border: 'border-pink-900/50' };
    return { label: 'GLOBAL ICON', color: 'text-emerald-400', border: 'border-emerald-900/50' };
  };

  const totalPop = gameState.regions.reduce((acc, r) => acc + r.popularity, 0);
  const avgPop = (totalPop / gameState.regions.length).toFixed(1);

  return (
    <div className="p-6 md:p-10 h-full flex flex-col bg-zinc-950 font-mono relative overflow-hidden">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-end justify-between mb-10 z-10 border-b border-zinc-800 pb-6">
         <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center relative">
                 <Globe2 className="text-blue-500 animate-pulse" size={28} />
                 <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">COMMAND CENTER</h2>
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Signal size={14} /> LIVE REGIONAL METRICS
                </div>
             </div>
         </div>

         <div className="text-right">
             <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Global Penetration</div>
             <div className="text-4xl font-black text-white">{avgPop}%</div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 overflow-y-auto pb-4">
        {gameState.regions.map((region) => {
          const status = getStatus(region.popularity);
          
          return (
            <div key={region.id} className={`bg-zinc-900/80 backdrop-blur-sm border ${status.border} p-5 rounded-sm relative group transition-all hover:bg-zinc-800/80 hover:-translate-y-1 hover:shadow-2xl`}>
               {/* Decorative corners */}
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-500" />
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-500" />
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-500" />
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-500" />

               <div className="flex justify-between items-start mb-6">
                  <div>
                      <h3 className="font-bold text-xl text-white tracking-tight">{region.name}</h3>
                      <div className={`text-xs font-bold tracking-widest mt-1 ${status.color}`}>{status.label}</div>
                  </div>
                  <div className="bg-black/40 px-2 py-1 rounded text-zinc-400 text-xs border border-white/5 font-mono">
                      x{region.marketSize.toFixed(1)} CAP
                  </div>
               </div>

               {/* Central Stat */}
               <div className="flex items-end gap-2 mb-4">
                   <div className="text-5xl font-black text-white tracking-tighter">{region.popularity.toFixed(1)}</div>
                   <div className="text-sm text-zinc-500 mb-2">%</div>
               </div>

               {/* Progress Bar (Segmented) */}
               <div className="flex gap-1 h-2 mb-4">
                   {Array.from({ length: 10 }).map((_, i) => (
                       <div 
                         key={i} 
                         className={`flex-1 rounded-sm transition-all duration-500 ${region.popularity > (i * 10) ? getProgressBarColor(region.popularity) : 'bg-zinc-800'}`}
                       />
                   ))}
               </div>

               <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-white/5 pt-3 mt-2">
                   <div className="flex items-center gap-1.5">
                       <Users size={12} />
                       <span>Audience: High</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                       <TrendingUp size={12} className={region.popularity > 0 ? "text-green-500" : "text-zinc-600"} />
                       <span>Growth: {region.popularity > 0 ? "Active" : "Stagnant"}</span>
                   </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getProgressBarColor = (val: number) => {
    if (val < 20) return 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]';
    if (val < 50) return 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]';
    if (val < 80) return 'bg-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
}

export default WorldMap;