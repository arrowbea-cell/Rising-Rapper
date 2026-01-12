
import React, { useState } from 'react';
import { Artist, GameState } from '../types';
import { MONTH_NAMES } from '../constants';
import { Play, TrendingUp, DollarSign, Calendar, User, ShoppingBag, Activity, Ghost, Snowflake, Sparkles, Disc, Globe, Terminal, ShieldAlert } from 'lucide-react';
import DevConsole from './DevConsole';

interface DashboardProps {
  artist: Artist;
  gameState: GameState;
  onNextWeek: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const Dashboard: React.FC<DashboardProps> = ({ artist, gameState, onNextWeek, setGameState }) => {
  const { date, money, weeklyStreams, weeklySales, hype } = gameState;
  const [showDevConsole, setShowDevConsole] = useState(false);

  const currentMonth = date.month;
  const isHalloween = currentMonth === 10;
  const isChristmas = currentMonth === 12;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
  };

  const formatMoney = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="flex-1 h-full p-8 overflow-y-auto relative bg-[#020617]">
      {showDevConsole && <DevConsole artist={artist} gameState={gameState} setGameState={setGameState} onClose={() => setShowDevConsole(false)} />}
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10 animate-in slide-in-from-top duration-500">
        <div className="flex items-center gap-6">
           <div className={`w-24 h-24 rounded-2xl overflow-hidden border-4 flex items-center justify-center shrink-0 shadow-2xl relative group ${artist.isDev ? 'border-green-500' : isHalloween ? 'border-orange-500/50' : isChristmas ? 'border-red-500/50' : 'border-white/10'}`}>
             {artist.image ? (
               <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             ) : (
               <div className="w-full h-full bg-zinc-900 flex items-center justify-center"><User size={40} className="text-zinc-600" /></div>
             )}
             {artist.isDev && (
                 <div className="absolute bottom-1 right-1 bg-green-500 text-black p-0.5 rounded shadow-lg">
                     <Terminal size={12} />
                 </div>
             )}
           </div>
           
           <div>
            <div className="flex items-center gap-3">
                <h2 className="text-5xl font-black text-white tracking-tighter flex items-center gap-3 drop-shadow-xl">
                    {artist.name}
                    {isHalloween && <Ghost className="text-orange-500 animate-bounce" size={32}/>}
                    {isChristmas && <Snowflake className="text-cyan-300 animate-pulse" size={32}/>}
                </h2>
                {artist.isDev && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert size={12} /> System Admin
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 text-zinc-400 mt-2 font-medium tracking-wide">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs uppercase font-bold text-zinc-300 backdrop-blur-md">{artist.genre}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Globe size={14} /> {artist.country}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg">
           <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Current Cycle</p>
              <p className="text-xl font-mono font-bold text-white">
                 W{date.week} • <span className={isHalloween ? 'text-orange-400' : isChristmas ? 'text-red-400' : 'text-zinc-300'}>{MONTH_NAMES[date.month - 1]}</span> {date.year}
              </p>
           </div>
           <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 border border-white/5">
                <Calendar size={20} />
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-yellow-500/20 p-6 rounded-3xl shadow-xl group hover:border-yellow-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 rounded-2xl bg-yellow-950/30 text-yellow-500 border border-yellow-500/20 shadow-inner">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Net Worth</p>
          <h3 className="text-3xl font-black text-white font-mono tracking-tight">{formatMoney(money)}</h3>
        </div>

        <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-purple-500/20 p-6 rounded-3xl shadow-xl group hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative">
            <div className="p-3 rounded-2xl bg-purple-950/30 text-purple-500 border border-purple-500/20 shadow-inner">
              <Sparkles size={24} />
            </div>
             <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden self-center">
                 <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, hype/10)}%` }} />
             </div>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Global Hype</p>
          <h3 className="text-3xl font-black text-white font-mono tracking-tight">{Math.floor(hype)} <span className="text-sm text-zinc-600 font-bold">/ 1000</span></h3>
        </div>

        <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-blue-500/20 p-6 rounded-3xl shadow-xl group hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative">
             <div className="p-3 rounded-2xl bg-blue-950/30 text-blue-500 border border-blue-500/20 shadow-inner">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">7 Days</span>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Weekly Streams</p>
          <h3 className="text-3xl font-black text-white font-mono tracking-tight">{formatNumber(weeklyStreams)}</h3>
        </div>

         <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border border-green-500/20 p-6 rounded-3xl shadow-xl group hover:border-green-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
          <div className="flex justify-between items-start mb-4 relative">
             <div className="p-3 rounded-2xl bg-green-950/30 text-green-500 border border-green-500/20 shadow-inner">
              <ShoppingBag size={24} />
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">7 Days</span>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Weekly Sales</p>
          <h3 className="text-3xl font-black text-white font-mono tracking-tight">{formatNumber(weeklySales)}</h3>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
        {artist.isDev && (
            <button
                onClick={() => setShowDevConsole(true)}
                className="bg-green-600 text-black p-5 rounded-full shadow-[0_0_20px_#16a34a] hover:bg-green-400 transition-all active:scale-90 border-2 border-green-400"
            >
                <Terminal size={24} />
            </button>
        )}
        <button
          onClick={onNextWeek}
          className={`flex items-center gap-3 px-8 py-5 rounded-full font-black text-xl hover:scale-105 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] uppercase tracking-wide border-2 ${
              isHalloween 
                ? 'bg-orange-600 text-black border-orange-400 hover:shadow-orange-500/50' 
                : isChristmas 
                    ? 'bg-red-600 text-white border-red-400 hover:shadow-red-500/50' 
                    : 'bg-white text-black border-zinc-200 hover:border-white hover:shadow-cyan-500/30'
          }`}
        >
          <span>Advance Week</span>
          <Play fill="currentColor" size={24} />
        </button>
      </div>
      
      {/* Recent Activities Panel */}
      <div className="mt-8 bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative z-10">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-cyan-400" /> Recent Performance
        </h3>
        <div className="flex flex-col gap-4">
            {weeklyStreams > 0 ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                        <Disc className="text-zinc-400" />
                    </div>
                    <div>
                        <div className="font-bold text-white">Streaming Activity</div>
                        <div className="text-sm text-zinc-400">Your catalog generated <span className="text-cyan-400 font-mono">{formatNumber(weeklyStreams)}</span> streams this week.</div>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center text-zinc-500 font-medium bg-black/20 rounded-2xl border border-dashed border-white/5">
                    No significant activity reported this week. Release music to generate data.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
