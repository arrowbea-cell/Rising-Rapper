
import React, { useState } from 'react';
import { GameState, ChartEntry, ChartType } from '../types';
import { INITIAL_REGIONS } from '../constants';
import { ArrowUp, ArrowDown, Minus, Trophy, Globe, Disc, Music, Crown, TrendingUp, BarChart3, Calendar, Layers } from 'lucide-react';

interface ChartsProps {
  gameState: GameState;
}

const Charts: React.FC<ChartsProps> = ({ gameState }) => {
  const [activeTab, setActiveTab] = useState<ChartType>('HOT_100');
  const [selectedRegion, setSelectedRegion] = useState('USA');
  const [regionalMode, setRegionalMode] = useState<'SONGS' | 'ALBUMS'>('SONGS');

  const getActiveChartData = (): ChartEntry[] => {
    if (activeTab === 'HOT_100') return gameState.activeCharts['HOT_100'] || [];
    if (activeTab === 'GLOBAL_200') return gameState.activeCharts['GLOBAL_200'] || [];
    if (activeTab === 'GLOBAL_ALBUMS') return gameState.activeCharts['GLOBAL_ALBUMS'] || [];
    if (activeTab === 'REGIONAL') {
        if (regionalMode === 'ALBUMS') {
            return gameState.activeCharts[`${selectedRegion}_ALBUMS`] || [];
        }
        return gameState.activeCharts[selectedRegion] || [];
    }
    return [];
  };

  const chartData = getActiveChartData();
  const isAlbumChart = activeTab === 'GLOBAL_ALBUMS' || (activeTab === 'REGIONAL' && regionalMode === 'ALBUMS');
  const topSong = chartData[0];

  const getMovementIcon = (entry: ChartEntry) => {
    if (entry.movement === 'new') return <span className="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)]">NEW</span>;
    if (entry.movement === 're-entry') return <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(59,130,246,0.4)]">RE</span>;
    if (entry.movement === 'up') return <div className="flex items-center text-emerald-400 font-bold text-xs gap-0.5"><ArrowUp size={12} strokeWidth={3} /> {Math.abs((entry.lastWeekRank || 101) - entry.rank)}</div>;
    if (entry.movement === 'down') return <div className="flex items-center text-red-500 font-bold text-xs gap-0.5"><ArrowDown size={12} strokeWidth={3} /> {Math.abs((entry.lastWeekRank || 101) - entry.rank)}</div>;
    return <Minus size={12} className="text-zinc-600" />;
  };

  const getRankStyle = (rank: number) => {
      if (rank === 1) return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-110";
      if (rank === 2) return "text-zinc-300 drop-shadow-[0_0_5px_rgba(212,212,216,0.5)] scale-105";
      if (rank === 3) return "text-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.5)] scale-105";
      return "text-zinc-500";
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-900/20 via-[#09090b] to-[#09090b] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="p-6 md:px-8 md:py-6 z-20 shrink-0 border-b border-white/5 backdrop-blur-xl bg-[#09090b]/60 sticky top-0">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
               <Trophy className="text-yellow-500 relative z-10" size={28} />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-900/50">Official Data</span>
                    <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1"><Calendar size={10}/> Week {gameState.date.week}, {gameState.date.year}</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter">GLOBAL CHARTS</h1>
             </div>
          </div>

          {/* TAB NAV */}
          <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5 backdrop-blur-md overflow-x-auto max-w-full">
             {[
               { id: 'HOT_100', label: 'HOT 100' },
               { id: 'GLOBAL_200', label: 'GLOBAL 200' },
               { id: 'GLOBAL_ALBUMS', label: 'ALBUMS' },
               { id: 'REGIONAL', label: 'REGIONAL' }
             ].map((tab) => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as ChartType)} 
                 className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-zinc-100 text-black shadow-lg shadow-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
               >
                 {tab.label}
               </button>
             ))}
          </div>
        </div>

        {/* REGION FILTER & MODE TOGGLE */}
        {activeTab === 'REGIONAL' && (
             <div className="flex justify-between items-center mt-4">
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right max-w-[70%]">
                    {INITIAL_REGIONS.map(r => (
                        <button 
                        key={r.id} 
                        onClick={() => setSelectedRegion(r.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${selectedRegion === r.id ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}`}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>

                <div className="flex bg-zinc-800 p-0.5 rounded-lg shrink-0 ml-2">
                     <button 
                        onClick={() => setRegionalMode('SONGS')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${regionalMode === 'SONGS' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                     >
                         <Music size={12} className="inline mr-1"/> Songs
                     </button>
                     <button 
                        onClick={() => setRegionalMode('ALBUMS')}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${regionalMode === 'ALBUMS' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                     >
                         <Layers size={12} className="inline mr-1"/> Albums
                     </button>
                </div>
            </div>
        )}
      </div>

      {/* CHART CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-thin scrollbar-thumb-zinc-800 relative z-10">
        
        {/* NUMBER 1 SPOTLIGHT */}
        {topSong && (
            <div className="mb-10 relative group">
                {/* Glow Effect behind #1 */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-transparent rounded-3xl blur-2xl opacity-40" />
                
                <div className="relative bg-[#09090b] border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden">
                    {/* Background Art Blur */}
                    {topSong.coverArt && (
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <img src={topSong.coverArt} className="w-full h-full object-cover blur-3xl scale-110" />
                        </div>
                    )}

                    <div className="relative z-10 shrink-0">
                        <div className="absolute -top-5 -left-5 w-12 h-12 bg-yellow-400 text-black font-black text-xl flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] z-20 border-4 border-[#09090b]">1</div>
                        <div className="w-40 h-40 md:w-52 md:h-52 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 rotate-1 group-hover:rotate-0 transition-transform duration-500">
                             {topSong.coverArt ? <img src={topSong.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Disc size={48} className="text-zinc-600"/></div>}
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1 relative z-10 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 w-full">
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 border border-yellow-400/20 tracking-wider">
                                    <Crown size={12} fill="currentColor" /> {selectedRegion === 'USA' && activeTab === 'REGIONAL' ? 'USA' : selectedRegion === 'UK' ? 'UK' : 'World'} #1
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-none tracking-tight line-clamp-2">{topSong.title}</h3>
                                <p className="text-xl text-zinc-400 font-medium mb-6 flex items-center gap-2 justify-center md:justify-start">
                                    {topSong.artistName} 
                                    {topSong.isPlayer && <span className="bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg shadow-purple-500/30">YOU</span>}
                                </p>
                            </div>
                            
                            <div className="hidden md:block">
                                <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center bg-zinc-900">
                                    <BarChart3 className="text-emerald-500" />
                                </div>
                            </div>
                        </div>

                        {/* Updated Grid: Shows Points instead of Streams/Sales */}
                        <div className="grid grid-cols-3 gap-3">
                             <div className="bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/5">
                                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">Chart Points</p>
                                <p className="text-xl font-mono font-bold text-emerald-400 tracking-tight">{new Intl.NumberFormat('en-US').format(topSong.score)}</p>
                             </div>
                             <div className="bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/5">
                                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">Peak Rank</p>
                                <p className="text-xl font-mono font-bold text-yellow-500">#{topSong.peakRank}</p>
                             </div>
                             <div className="bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/5">
                                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-wider mb-1">Weeks on Chart</p>
                                <p className="text-xl font-mono font-bold text-white">{topSong.weeksOnChart}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* LIST */}
        <div className="flex flex-col gap-1 pb-10">
            {/* Headers - Removed Sales/Stream columns, added Points */}
            <div className="flex px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                <div className="w-12 text-center">Rank</div>
                <div className="w-12 text-center">Trend</div>
                <div className="flex-1 pl-14">{isAlbumChart ? 'Album / Artist' : 'Track / Artist'}</div>
                <div className="w-32 text-right hidden md:block">Points</div>
            </div>

            {chartData.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 flex flex-col items-center">
                    <Disc className="animate-spin mb-4 opacity-20" size={40} />
                    Calculating Charts...
                </div>
            ) : (
                chartData.slice(1, 100).map((entry) => (
                    <div 
                      key={`${entry.rank}-${entry.songId || entry.albumId}`} 
                      className={`group relative flex items-center gap-4 p-2 rounded-lg border transition-all duration-200 
                        ${entry.isPlayer 
                            ? 'bg-purple-500/10 border-purple-500/40 hover:bg-purple-500/20' 
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                        }`}
                    >
                        {/* RANK */}
                        <div className="w-12 text-center shrink-0">
                            <div className={`text-xl font-black font-mono tracking-tighter ${getRankStyle(entry.rank)}`}>{entry.rank}</div>
                        </div>

                        {/* MOVEMENT */}
                        <div className="w-12 flex flex-col items-center justify-center shrink-0 opacity-80 group-hover:opacity-100">
                           {getMovementIcon(entry)}
                           {entry.weeksOnChart > 1 && (
                               <span className="text-[9px] text-zinc-600 font-mono mt-0.5">Wk{entry.weeksOnChart}</span>
                           )}
                        </div>

                        {/* INFO & ARTWORK */}
                        <div className="flex-1 min-w-0 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-md bg-zinc-800 overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform duration-300">
                                {entry.coverArt ? <img src={entry.coverArt} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><Music size={16} className="text-zinc-600"/></div>}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <TrendingUp size={16} className="text-white" />
                                </div>
                            </div>
                            
                            <div className="min-w-0">
                                <div className={`font-bold truncate text-sm md:text-base ${entry.isPlayer ? 'text-purple-300' : 'text-zinc-200'}`}>{entry.title}</div>
                                <div className="text-xs text-zinc-500 truncate flex items-center gap-2 font-medium">
                                    {entry.artistName}
                                    {entry.isPlayer && <span className="bg-purple-600 text-white text-[8px] px-1.5 py-[1px] rounded-sm font-bold uppercase tracking-wide">You</span>}
                                </div>
                            </div>
                        </div>

                        {/* STATS (POINTS ONLY) */}
                        <div className="text-right hidden md:block w-32">
                             <div className="text-sm font-mono text-zinc-400 font-bold tracking-tight group-hover:text-emerald-400 transition-colors">
                                {new Intl.NumberFormat('en-US').format(entry.score)}
                             </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
