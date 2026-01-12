
import React, { useState } from 'react';
import { GameState } from '../types';
import { ArrowLeft, TrendingUp, Music, LayoutList, Trophy, Minus, Globe } from 'lucide-react';
import { INITIAL_REGIONS } from '../constants';

interface ChartHistoryProps {
  gameState: GameState;
}

const ChartHistory: React.FC<ChartHistoryProps> = ({ gameState }) => {
  const [selectedChart, setSelectedChart] = useState<string>('HOT_100');
  
  const historyData = gameState.playerChartHistory[selectedChart] || {};
  const songIds = Object.keys(historyData);
  
  // Get all songs object for reference
  const getSong = (id: string) => gameState.songs.find(s => s.id === id);

  return (
    <div className="p-8 h-full bg-zinc-950 flex flex-col font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Trophy className="text-yellow-500" /> 
            Chart History
        </h2>
        
        {/* CHART SELECTOR */}
        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5 backdrop-blur-md overflow-x-auto max-w-full">
            <button 
                onClick={() => setSelectedChart('HOT_100')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${selectedChart === 'HOT_100' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
                HOT 100
            </button>
            <button 
                onClick={() => setSelectedChart('GLOBAL_200')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${selectedChart === 'GLOBAL_200' ? 'bg-zinc-100 text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
            >
                GLOBAL 200
            </button>
            <div className="w-px bg-zinc-700 mx-1 h-4 self-center" />
            <select 
                value={selectedChart.includes('_') && selectedChart !== 'HOT_100' && selectedChart !== 'GLOBAL_200' ? selectedChart : ''}
                onChange={(e) => e.target.value && setSelectedChart(e.target.value)}
                className="bg-transparent text-xs font-bold text-zinc-400 hover:text-white outline-none cursor-pointer"
            >
                <option value="" disabled className="bg-zinc-900">REGIONAL</option>
                {INITIAL_REGIONS.map(r => (
                    <option key={r.id} value={r.id} className="bg-zinc-900">{r.name}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
         {songIds.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
                 <LayoutList size={48} className="mb-4 opacity-50" />
                 <p className="text-lg">No chart history for {selectedChart}.</p>
                 <p className="text-sm">Release songs and reach the charts to see data.</p>
             </div>
         ) : (
             <div className="space-y-12">
                 {songIds.map(songId => {
                     const history = historyData[songId];
                     const song = getSong(songId);
                     if (!song) return null;
                     
                     // Calculate stats
                     const peak = Math.min(...history.map(h => h.rank));
                     const weeksOnChart = history.length;
                     const latest = history[history.length - 1];

                     return (
                         <div key={songId} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                             {/* Song Header */}
                             <div className="flex items-start justify-between mb-6">
                                 <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden shadow-lg">
                                         {song.coverArt ? <img src={song.coverArt} className="w-full h-full object-cover" /> : <Music className="m-auto mt-4 text-zinc-600"/>}
                                     </div>
                                     <div>
                                         <h3 className="text-2xl font-bold text-white">{song.title}</h3>
                                         <div className="flex gap-4 text-sm text-zinc-400 mt-1">
                                             <span className="bg-zinc-800 px-2 rounded text-zinc-300 font-bold text-xs flex items-center">{selectedChart}</span>
                                             <span>Peak: <span className="text-white font-bold">#{peak}</span></span>
                                             <span>Weeks: <span className="text-white font-bold">{weeksOnChart}</span></span>
                                             <span>Latest: <span className="text-white font-bold">#{latest.rank}</span></span>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Chart Graph (Simplified Visualization) */}
                             <div className="h-40 w-full bg-zinc-950/50 border border-zinc-800 rounded-xl relative flex items-end px-4 py-6 gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700">
                                 {/* Grid Lines */}
                                 <div className="absolute top-4 left-0 w-full border-t border-zinc-800/50 text-[10px] text-zinc-600 pl-1">#1</div>
                                 <div className="absolute top-1/2 left-0 w-full border-t border-zinc-800/50 text-[10px] text-zinc-600 pl-1">#50</div>
                                 <div className="absolute bottom-4 left-0 w-full border-t border-zinc-800/50 text-[10px] text-zinc-600 pl-1">#100</div>

                                 {history.map((point, idx) => {
                                     // Rank 1 = 100% height, Rank 100 = 0% height (roughly)
                                     const heightPerc = Math.max(5, 100 - point.rank);
                                     
                                     return (
                                         <div key={idx} className="flex flex-col items-center justify-end h-full w-8 group relative shrink-0">
                                             <div 
                                                className={`w-2 rounded-t-full transition-all ${point.rank === 1 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : point.rank <= 10 ? 'bg-emerald-500' : 'bg-purple-500/50'}`}
                                                style={{ height: `${heightPerc}%` }}
                                             />
                                             {/* Tooltip */}
                                             <div className="absolute bottom-full mb-2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity border border-zinc-700">
                                                 Wk {point.week} - #{point.rank}
                                             </div>
                                         </div>
                                     )
                                 })}
                             </div>
                         </div>
                     )
                 })}
             </div>
         )}
      </div>
    </div>
  );
};

export default ChartHistory;
