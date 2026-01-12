
import React, { useState, useMemo } from 'react';
import { GameState, WorldRecord } from '../types';
import { INITIAL_REGIONS } from '../constants';
import { Trophy, Globe, MapPin, Music, Snowflake, User, Crown, Flame, ShoppingBag, TrendingUp, Award, Star, Zap, Globe2, LayoutGrid, Disc } from 'lucide-react';

interface HallOfFameProps {
  gameState: GameState;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ gameState }) => {
  const [selectedScope, setSelectedScope] = useState<string>('GLOBAL'); // 'GLOBAL' or Region ID (e.g., 'USA')

  const getIcon = (iconName?: string) => {
      switch(iconName) {
          case 'Globe': return <Globe className="text-blue-400" size={24} />;
          case 'MapPin': return <MapPin className="text-red-400" size={24} />;
          case 'Music': return <Music className="text-purple-400" size={24} />;
          case 'Snowflake': return <Snowflake className="text-cyan-400" size={24} />;
          case 'ShoppingBag': return <ShoppingBag className="text-emerald-400" size={24} />;
          case 'Crown': return <Crown className="text-yellow-400" size={24} />;
          case 'Flame': return <Flame className="text-orange-400" size={24} />;
          case 'TrendingUp': return <TrendingUp className="text-green-400" size={24} />;
          case 'Award': return <Award className="text-indigo-400" size={24} />;
          case 'Star': return <Star className="text-pink-400" size={24} />;
          case 'Zap': return <Zap className="text-yellow-300" size={24} />;
          case 'Users': return <User className="text-blue-300" size={24} />;
          default: return <Trophy className="text-yellow-500" size={24} />;
      }
  };

  // Filter Logic
  const filteredRecords = useMemo(() => {
      if (selectedScope === 'GLOBAL') {
          // Show Global, Genre, and Theme records (Assuming they represent global stats)
          return gameState.worldRecords.filter(r => ['GLOBAL', 'GENRE', 'THEME'].includes(r.category));
      } else {
          // Show Region Specific Records
          return gameState.worldRecords.filter(r => r.category === 'REGION' && r.scopeValue === selectedScope);
      }
  }, [selectedScope, gameState.worldRecords]);

  // Grouping for Display
  const groupedRecords = useMemo(() => {
      const groups: Record<string, WorldRecord[]> = {};
      
      filteredRecords.forEach(r => {
          // Improve grouping labels
          let label = r.category;
          if (selectedScope === 'GLOBAL') {
              if (r.category === 'GLOBAL') label = 'World Records';
              if (r.category === 'GENRE') label = 'Genre Kings (Global)';
              if (r.category === 'THEME') label = 'Theme Masters (Global)';
          } else {
              label = `${INITIAL_REGIONS.find(reg => reg.id === selectedScope)?.name} Records`;
          }

          if (!groups[label]) groups[label] = [];
          groups[label].push(r);
      });
      return groups;
  }, [filteredRecords, selectedScope]);

  return (
    <div className="h-full bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden relative">
        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-black to-black pointer-events-none" />

        {/* --- HEADER & TOP NAV --- */}
        <div className="shrink-0 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5 z-20">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 tracking-tighter uppercase flex items-center gap-3 drop-shadow-sm">
                            <Trophy size={36} className="text-yellow-500 fill-yellow-500/20" />
                            Hall of Fame
                        </h1>
                        <p className="text-zinc-400 font-medium mt-1 ml-1">The Official Book of World Records</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-3xl font-black text-yellow-500">
                            {filteredRecords.filter(r => r.isHeldByPlayer).length} <span className="text-zinc-600 text-lg">/ {filteredRecords.length}</span>
                        </div>
                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Records Held</div>
                    </div>
                </div>

                {/* HORIZONTAL SCROLL NAV */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
                    <button 
                        onClick={() => setSelectedScope('GLOBAL')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all border whitespace-nowrap shrink-0 ${selectedScope === 'GLOBAL' ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'}`}
                    >
                        <Globe2 size={16} /> Global
                    </button>

                    <div className="w-px bg-zinc-800 h-6 self-center mx-2" />

                    {INITIAL_REGIONS.map(region => (
                        <button 
                            key={region.id}
                            onClick={() => setSelectedScope(region.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all border whitespace-nowrap shrink-0 ${selectedScope === region.id ? 'bg-white text-black border-white shadow-lg' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'}`}
                        >
                            <MapPin size={16} /> {region.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 overflow-y-auto relative z-10 p-8 scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="max-w-7xl mx-auto space-y-12">
                {Object.entries(groupedRecords).map(([groupName, records]: [string, WorldRecord[]]) => (
                    <div key={groupName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <LayoutGrid size={24} className="text-zinc-500" /> {groupName}
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {records.map(record => {
                                const isPlayer = record.isHeldByPlayer;
                                const song = record.songId ? (gameState.songs.find(s => s.id === record.songId) || gameState.npcSongs.find(s => s.id === record.songId)) : null;
                                
                                return (
                                    <div key={record.id} className={`group relative bg-[#121212] border ${isPlayer ? 'border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-white/5'} rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300`}>
                                        
                                        {/* Glow Effect for Player */}
                                        {isPlayer && <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent pointer-events-none"></div>}

                                        <div className="p-6 relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl border shadow-inner ${isPlayer ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-zinc-800/50 border-white/5'}`}>
                                                    {getIcon(record.icon)}
                                                </div>
                                                {isPlayer && <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1"><Crown size={12} fill="black" /> You hold this</div>}
                                            </div>

                                            <h4 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">{record.title}</h4>
                                            <p className="text-xs text-zinc-500 mb-6 leading-relaxed line-clamp-2 font-medium">{record.description}</p>

                                            <div className="mt-auto pt-5 border-t border-white/5 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border border-white/10 shrink-0 shadow-lg relative">
                                                    {song?.coverArt ? (
                                                        <img src={song.coverArt} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-zinc-700 text-zinc-400">{record.holderName[0]}</div>
                                                    )}
                                                    {isPlayer && <div className="absolute inset-0 border-2 border-yellow-500 rounded-full"></div>}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className={`text-sm font-bold truncate ${isPlayer ? 'text-yellow-400' : 'text-zinc-300'}`}>{record.holderName}</div>
                                                    <div className="text-2xl font-black font-mono text-white tracking-tight leading-none mt-0.5">
                                                        {new Intl.NumberFormat('en-US', { notation: "compact" }).format(record.value)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Song Info Overlay on Hover */}
                                        {song && (
                                            <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center z-20 backdrop-blur-sm">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase mb-3 tracking-[0.2em]">Record Breaking Track</span>
                                                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-2xl mb-3 border border-white/10">
                                                    {song.coverArt ? <img src={song.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800 flex items-center justify-center"><Disc className="text-zinc-600"/></div>}
                                                </div>
                                                <div className="font-bold text-white text-lg leading-tight mb-1">{song.title}</div>
                                                <div className="text-emerald-400 text-xs font-mono bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/30 mt-2">Broken Week {record.dateBrokenWeek}</div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default HallOfFame;
