import React from 'react';
import { GameState, Genre } from '../types';
import { GENRE_DETAILS, THEMES, THEME_SEASON_MAPPING } from '../constants';
import { TrendingUp, TrendingDown, Minus, LineChart, Flame, Snowflake, Ghost, Zap, Heart, Skull, DollarSign, Radio, Clock, Swords } from 'lucide-react';

interface GenreTrendsProps {
  gameState: GameState;
}

const GenreTrends: React.FC<GenreTrendsProps> = ({ gameState }) => {
  const currentMonth = gameState.date.month;
  const activeThemes = THEME_SEASON_MAPPING[currentMonth] || [];
  const isChristmas = currentMonth === 12;
  const isHalloween = currentMonth === 10;

  // Calculate Meta Top Picks
  const sortedGenres = Object.values(GENRE_DETAILS).sort((a, b) => (gameState.trends[b.id] || 0) - (gameState.trends[a.id] || 0));
  const topGenre = sortedGenres[0];
  const topTrendValue = gameState.trends[topGenre.id] || 1.0;

  const getTrendIcon = (value: number) => {
    if (value >= 1.2) return <TrendingUp className="text-emerald-500" size={18} />;
    if (value <= 0.8) return <TrendingDown className="text-red-500" size={18} />;
    return <Minus className="text-zinc-500" size={18} />;
  };

  const getTrendStatus = (value: number) => {
    if (value >= 1.4) return { text: "BULL RUN", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (value >= 1.1) return { text: "UPTREND", color: "text-emerald-500", bg: "bg-emerald-500/5" };
    if (value > 0.9) return { text: "STABLE", color: "text-zinc-400", bg: "bg-zinc-500/5" };
    if (value > 0.6) return { text: "CORRECTION", color: "text-red-400", bg: "bg-red-500/5" };
    return { text: "CRASH", color: "text-red-600 font-bold", bg: "bg-red-500/10" };
  };

  const getBarColor = (value: number) => {
      if (value >= 1.1) return 'bg-emerald-500';
      if (value <= 0.9) return 'bg-red-500';
      return 'bg-zinc-500';
  };

  const getThemeIcon = (id: string) => {
      switch(id) {
          case 'love': return <Heart size={16} />;
          case 'heartbreak': return <Heart size={16} className="text-blue-400" />;
          case 'toxic': return <Skull size={16} className="text-purple-400" />;
          case 'party': return <Zap size={16} className="text-yellow-400" />;
          case 'flex': return <DollarSign size={16} className="text-emerald-400" />;
          case 'luxury': return <DollarSign size={16} className="text-amber-400" />;
          case 'street': return <Minus size={16} className="rotate-90 text-zinc-400" />; // Simplified grid
          case 'diss': return <Swords size={16} className="text-red-500" />;
          case 'summer': return <Flame size={16} className="text-orange-400" />;
          case 'nostalgia': return <Clock size={16} className="text-teal-400" />;
          case 'conscious': return <Radio size={16} className="text-indigo-400" />;
          case 'christmas': return <Snowflake size={16} className="text-blue-200" />;
          case 'halloween': return <Ghost size={16} className="text-orange-500" />;
          default: return <Flame size={16} />;
      }
  };

  const getThemeStatus = (themeId: string) => {
      if (themeId === 'christmas' && isChristmas) return { text: "HOLIDAY META", color: "text-red-500", border: "border-red-500" };
      if (themeId === 'halloween' && isHalloween) return { text: "SPOOKY SZN", color: "text-purple-500", border: "border-purple-500" };
      if (activeThemes.includes(themeId)) return { text: "SEASONAL PICK", color: "text-orange-400", border: "border-orange-500/50" };
      return { text: "STANDARD", color: "text-zinc-600", border: "border-zinc-800" };
  };

  // Group themes for better UI
  const themeGroups = {
      "High Volume": ['christmas', 'halloween', 'diss', 'party'],
      "Emotion": ['love', 'heartbreak', 'toxic', 'nostalgia'],
      "Lifestyle": ['flex', 'luxury', 'street', 'conscious'],
      "Vibe": ['summer', 'dark', 'inspo']
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden relative">
       {/* Tech Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black pointer-events-none" />
       
       <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                        <LineChart className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter">MARKET INTELLIGENCE</h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> LIVE DATA FEED • YEAR {gameState.date.year}
                        </div>
                    </div>
                </div>
            </div>

            {/* META SNAPSHOT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="bg-gradient-to-br from-emerald-900/20 to-zinc-900 border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={100} className="text-emerald-500" />
                    </div>
                    <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-2">#1 DOMINANT GENRE</div>
                    <div className="text-4xl font-black text-white mb-1">{topGenre.name}</div>
                    <div className="text-sm text-zinc-400">Market Index: <span className="text-white font-mono">{topTrendValue.toFixed(2)}x</span></div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 border border-purple-500/20 p-6 rounded-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Flame size={100} className="text-purple-500" />
                    </div>
                    <div className="text-xs text-purple-500 font-bold uppercase tracking-widest mb-2">SEASONAL HIGHLIGHT</div>
                    <div className="text-4xl font-black text-white mb-1">{activeThemes[0] ? activeThemes[0].toUpperCase() : 'NONE'}</div>
                    <div className="text-sm text-zinc-400">Current Theme Fatigue: <span className="text-white font-mono">{gameState.themeFatigue[activeThemes[0]] || 0}%</span></div>
                </div>
            </div>

            {/* GENRE TICKERS */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full"></span> 
                    GENRE PERFORMANCE
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sortedGenres.map((genre) => {
                        const trendValue = gameState.trends[genre.id] || 1.0;
                        const status = getTrendStatus(trendValue);
                        return (
                            <div key={genre.id} className={`bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between hover:bg-zinc-800 transition-colors`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-zinc-200 text-sm">{genre.name}</span>
                                    {getTrendIcon(trendValue)}
                                </div>
                                <div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-mono text-white leading-none">{trendValue.toFixed(2)}</span>
                                        <span className={`text-[10px] font-bold ${status.color}`}>{status.text}</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-800 mt-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${getBarColor(trendValue)}`} style={{ width: `${Math.min(100, (trendValue/1.5)*100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* THEME MATRIX */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-purple-500 rounded-full"></span> 
                    THEME LANDSCAPE
                </h3>
                
                <div className="space-y-6">
                    {Object.entries(themeGroups).map(([groupName, themeIds]) => (
                        <div key={groupName}>
                            <h4 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3 ml-1">{groupName}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {themeIds.map(tid => {
                                    const theme = THEMES.find(t => t.id === tid);
                                    if (!theme) return null;
                                    const status = getThemeStatus(theme.id);
                                    const fatigue = gameState.themeFatigue[theme.id] || 0;
                                    
                                    return (
                                        <div key={theme.id} className={`bg-zinc-900/50 border ${status.border} p-4 rounded-xl relative group transition-all hover:translate-x-1`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 font-bold text-white">
                                                    {getThemeIcon(theme.id)}
                                                    {theme.name}
                                                </div>
                                                <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${status.color} border-current opacity-70`}>{status.text}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 mb-3 line-clamp-1">{theme.description}</p>
                                            
                                            {/* Fatigue Meter */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-zinc-600 font-mono">FATIGUE</span>
                                                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${fatigue > 60 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, fatigue)}%` }} />
                                                </div>
                                                <span className="text-[10px] text-zinc-500 font-mono w-6 text-right">{Math.floor(fatigue)}%</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
       </div>
    </div>
  );
};

export default GenreTrends;