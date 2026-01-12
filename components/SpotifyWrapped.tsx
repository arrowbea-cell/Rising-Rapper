
import React, { useState, useEffect } from 'react';
import { GameState, Artist, Song } from '../types';
import { X, Music, Globe, Play, Disc, DollarSign, Zap, Star, Crown, TrendingUp, Mic2, Layers, Activity, Users, Sparkles, Award } from 'lucide-react';

interface SpotifyWrappedProps {
  artist: Artist;
  gameState: GameState;
  onClose: () => void;
  year: number;
}

const SpotifyWrapped: React.FC<SpotifyWrappedProps> = ({ artist, gameState, onClose, year }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // --- DATA CALCULATION ---
  const releasedSongs = gameState.songs.filter(s => s.isReleased);
  
  // Top Song
  const topSong = releasedSongs.sort((a, b) => (b.streamsThisYear || 0) - (a.streamsThisYear || 0))[0];
  
  // Totals
  const totalStreamsYear = gameState.yearlyStreams;
  const totalRevenueYear = (gameState.yearlySales * 1.29) + (gameState.yearlyStreams * 0.004); 
  
  // Top Region
  const topRegion = gameState.regions.sort((a, b) => b.popularity - a.popularity)[0];

  // Rank Percentile (Logic to make player feel special)
  const getPercentile = () => {
      if (totalStreamsYear > 500000000) return "Top 0.001%";
      if (totalStreamsYear > 100000000) return "Top 0.01%";
      if (totalStreamsYear > 10000000) return "Top 0.1%";
      if (totalStreamsYear > 1000000) return "Top 1%";
      if (totalStreamsYear > 100000) return "Top 5%";
      return "Top 20%";
  };

  // Persona Logic (Based on gameplay stats)
  const getPersona = () => {
      const avgQuality = releasedSongs.reduce((acc, s) => acc + s.quality, 0) / (releasedSongs.length || 1);
      const songCount = releasedSongs.length; 
      const hype = gameState.hype;

      if (totalStreamsYear > 500000000) return { 
          name: "THE TITAN", 
          desc: "You don't just participate in the industry. You ARE the industry.", 
          color: "text-yellow-400",
          bg: "bg-yellow-500",
          border: "border-yellow-400",
          icon: <Crown size={64} className="text-black" />
      };
      if (songCount > 12) return { 
          name: "THE MACHINE", 
          desc: "Sleep? Never heard of it. Your output is inhuman.", 
          color: "text-red-400",
          bg: "bg-red-600",
          border: "border-red-500",
          icon: <Zap size={64} className="text-white" />
      };
      if (avgQuality > 85) return { 
          name: "THE VIRTUOSO", 
          desc: "You don't miss. Every single track is a masterpiece.", 
          color: "text-purple-300",
          bg: "bg-purple-600",
          border: "border-purple-400",
          icon: <Sparkles size={64} className="text-white" />
      };
      if (topRegion && topRegion.popularity > 80) return { 
          name: "THE CULT LEADER", 
          desc: `You own the streets of ${topRegion.name}. They worship you there.`, 
          color: "text-emerald-300",
          bg: "bg-emerald-600",
          border: "border-emerald-400",
          icon: <Users size={64} className="text-white" />
      };
      if (hype > 800) return { 
          name: "THE ICON", 
          desc: "Cameras flash wherever you go. You are the moment.", 
          color: "text-pink-300",
          bg: "bg-pink-600",
          border: "border-pink-400",
          icon: <Star size={64} className="text-white" />
      };
      return { 
          name: "THE RISING STAR", 
          desc: "You're just getting started, but the world is watching closely.", 
          color: "text-blue-300",
          bg: "bg-blue-600",
          border: "border-blue-400",
          icon: <TrendingUp size={64} className="text-white" />
      };
  };

  const persona = getPersona();
  const SLIDES = 6;
  const SLIDE_DURATION = 6000; 

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
        setProgress(old => {
            if (old >= 100) {
                if (currentSlide < SLIDES - 1) {
                    setCurrentSlide(c => c + 1);
                    return 0;
                } else {
                    return 100; // End
                }
            }
            return old + (100 / (SLIDE_DURATION / 100));
        });
    }, 100);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentSlide < SLIDES - 1) {
          setCurrentSlide(c => c + 1);
          setProgress(0);
      } else {
          onClose();
      }
  };

  const handlePrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentSlide > 0) {
          setCurrentSlide(c => c - 1);
          setProgress(0);
      }
  };

  const formatCompact = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  const formatMoney = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  // --- BACKGROUNDS ---
  const getBackground = (slide: number) => {
      // Just a base bg, mostly overridden by slide specific styles
      return "bg-black"; 
  };

  // --- SLIDE RENDERER ---
  const renderSlide = () => {
      switch (currentSlide) {
          case 0: // INTRO - KINETIC TYPOGRAPHY
              return (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden bg-black font-sans">
                      {/* Abstract Background Shapes */}
                      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600 rounded-full blur-[100px] opacity-60 animate-pulse" />
                      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[100px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
                      
                      <div className="z-10 flex flex-col gap-4 items-center scale-110">
                          <span className="text-white/80 font-bold uppercase tracking-[0.5em] text-xs md:text-sm animate-in fade-in slide-in-from-bottom duration-1000">Your year in music</span>
                          <h1 className="text-8xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mix-blend-overlay animate-in zoom-in duration-700">
                              {year}
                          </h1>
                          <div className="bg-[#1ed760] text-black font-black text-2xl md:text-4xl px-8 py-3 -rotate-3 mt-4 animate-in spin-in-6 duration-700 delay-300 shadow-[8px_8px_0px_rgba(255,255,255,0.2)]">
                              WRAPPED
                          </div>
                      </div>
                  </div>
              );

          case 1: // TOTAL STREAMS - BIG IMPACT
              return (
                  <div className="flex flex-col h-full p-8 relative overflow-hidden bg-[#242424]">
                      {/* Geometric Pattern Overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] [background-size:20px_20px]"></div>

                      <div className="z-10 flex flex-col justify-center h-full space-y-4">
                          <p className="text-3xl font-bold text-[#1ed760] animate-in slide-in-from-left duration-700">The world listened.</p>
                          
                          <div className="relative py-4">
                              <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none break-all animate-in zoom-in duration-500 delay-100 drop-shadow-2xl">
                                  {formatCompact(totalStreamsYear)}
                              </h2>
                              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 bg-white text-black text-sm font-black px-3 py-1 rotate-12 shadow-lg animate-bounce">
                                  STREAMS
                              </div>
                          </div>

                          <div className="mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in slide-in-from-bottom duration-700 delay-300 max-w-sm self-start">
                              <p className="text-zinc-300 text-xs font-bold uppercase mb-2 tracking-widest">Global Status</p>
                              <p className="text-white text-xl font-medium leading-snug">
                                  You are in the <span className="text-[#1ed760] font-black text-2xl bg-white/10 px-2 rounded">{getPercentile()}</span> of artists worldwide.
                              </p>
                          </div>
                      </div>
                  </div>
              );

          case 2: // TOP SONG - VINYL VIBE
              return (
                  <div className="flex flex-col justify-between h-full p-6 relative overflow-hidden bg-gradient-to-b from-indigo-900 to-black">
                      {topSong ? (
                          <>
                              {/* Background Blur */}
                              {topSong.coverArt && (
                                  <div className="absolute inset-0 opacity-40 blur-3xl scale-125 pointer-events-none">
                                      <img src={topSong.coverArt} className="w-full h-full object-cover" />
                                  </div>
                              )}

                              <div className="z-10 mt-4 animate-in slide-in-from-top duration-700 text-center">
                                  <div className="inline-block bg-black/30 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6">
                                      One song defined your year
                                  </div>
                              </div>

                              {/* Vinyl Visual */}
                              <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 group">
                                  <div className="w-64 h-64 md:w-80 md:h-80 relative">
                                       {/* Disc */}
                                       <div className="absolute inset-0 bg-black rounded-full shadow-2xl flex items-center justify-center animate-[spin_8s_linear_infinite]">
                                           {/* Grooves */}
                                           <div className="absolute inset-0 rounded-full border-[20px] border-zinc-900 opacity-80"></div>
                                           <div className="absolute inset-4 rounded-full border-[1px] border-zinc-800 opacity-50"></div>
                                           <div className="absolute inset-8 rounded-full border-[1px] border-zinc-800 opacity-50"></div>
                                           
                                           {/* Label / Cover */}
                                           <div className="w-[45%] h-[45%] bg-cover bg-center rounded-full border-4 border-zinc-900 relative z-20" style={{ backgroundImage: topSong.coverArt ? `url(${topSong.coverArt})` : 'none' }}>
                                               {!topSong.coverArt && <Music className="text-zinc-500 m-auto mt-4" size={24}/>}
                                           </div>
                                       </div>
                                       {/* Highlight sheen */}
                                       <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                                  </div>

                                  <div className="mt-8 text-center">
                                      <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight mb-2 drop-shadow-lg">
                                          {topSong.title}
                                      </h2>
                                      <p className="text-white/70 text-lg font-mono">{formatCompact(topSong.streamsThisYear || 0)} streams</p>
                                  </div>
                              </div>

                              {/* Audio Wave Visualizer */}
                              <div className="z-10 flex items-end justify-center gap-1 h-16 w-full animate-in slide-in-from-bottom duration-700 delay-200 opacity-50">
                                  {[...Array(20)].map((_, i) => (
                                      <div key={i} 
                                           className="w-1.5 bg-white rounded-t-full animate-pulse" 
                                           style={{ 
                                               height: `${Math.random() * 100}%`,
                                               animationDelay: `${i * 0.05}s`,
                                               animationDuration: '0.6s'
                                           }} 
                                      />
                                  ))}
                              </div>
                          </>
                      ) : (
                          <div className="flex items-center justify-center h-full text-white/50 text-2xl font-bold">No data available.</div>
                      )}
                  </div>
              );

          case 3: // MONEY & HYPE - THE HUSTLE
              return (
                  <div className="flex flex-col h-full bg-black relative">
                      {/* Diagonal Split Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-black to-purple-900"></div>
                      
                      <div className="flex-1 flex flex-col justify-center px-8 relative z-10">
                          {/* MONEY SECTION */}
                          <div className="mb-12 animate-in slide-in-from-left duration-700">
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="p-2 bg-emerald-500 rounded-full text-black"><DollarSign size={20} /></div>
                                  <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase">The Bag</span>
                              </div>
                              <div className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                  {formatMoney(totalRevenueYear)}
                              </div>
                              <p className="text-zinc-400 text-sm mt-1">Generated Revenue</p>
                          </div>

                          {/* HYPE SECTION */}
                          <div className="text-right animate-in slide-in-from-right duration-700 delay-300">
                              <div className="flex items-center gap-2 mb-2 justify-end">
                                  <span className="text-purple-400 font-bold tracking-widest text-sm uppercase">The Clout</span>
                                  <div className="p-2 bg-purple-500 rounded-full text-white"><Activity size={20} /></div>
                              </div>
                              <div className="text-6xl md:text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                  {Math.floor(gameState.hype)}
                              </div>
                              <p className="text-zinc-400 text-sm mt-1">Peak Hype Score / 1000</p>
                          </div>
                      </div>
                      
                      {/* Decorative Line */}
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-12 pointer-events-none"></div>
                  </div>
              );

          case 4: // PERSONA - RPG CARD STYLE
              return (
                  <div className="flex flex-col items-center justify-center h-full p-6 relative overflow-hidden bg-zinc-950">
                      {/* Animated Grid Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
                      
                      <div className="z-10 w-full max-w-sm animate-in zoom-in duration-700">
                          <p className="text-center text-zinc-400 font-bold mb-6 uppercase tracking-[0.2em] text-xs">Your Artist Persona</p>
                          
                          {/* THE CARD CONTAINER */}
                          <div className={`relative bg-[#18181b] border-4 ${persona.border} rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden aspect-[3/4] flex flex-col`}>
                              
                              {/* Card Header/Art */}
                              <div className={`h-1/2 ${persona.bg} flex items-center justify-center relative overflow-hidden`}>
                                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                  <div className="relative z-10 bg-black/20 p-6 rounded-full border-2 border-white/20 backdrop-blur-sm shadow-xl">
                                      {persona.icon}
                                  </div>
                                  {/* Shine effect */}
                                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                              </div>

                              {/* Card Body */}
                              <div className="h-1/2 p-6 flex flex-col justify-center text-center bg-[#18181b] relative">
                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black px-4 py-1 rounded-full border border-zinc-700 uppercase tracking-widest">
                                      Class Type
                                  </div>
                                  <h2 className={`text-3xl md:text-4xl font-black mb-3 uppercase leading-none ${persona.color} drop-shadow-md`}>
                                      {persona.name}
                                  </h2>
                                  <div className="w-12 h-1 bg-zinc-700 mx-auto mb-4 rounded-full"></div>
                                  <p className="text-zinc-300 text-sm font-medium leading-relaxed">
                                      {persona.desc}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              );

          case 5: // SUMMARY CARD (Classic Shareable)
              return (
                  <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 animate-in fade-in duration-500 bg-[#742a2a] bg-gradient-to-b from-[#991b1b] to-black">
                      
                      {/* SHAREABLE CARD */}
                      <div className="bg-[#121212] p-6 md:p-8 rounded-[20px] shadow-2xl w-full max-w-sm border border-white/10 relative overflow-hidden group transform hover:scale-[1.02] transition-transform duration-300">
                          {/* Noise Texture */}
                          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                          
                          <div className="relative z-10 flex flex-col h-full">
                              <div className="flex justify-between items-start mb-8">
                                  <div>
                                      <h2 className="text-3xl font-black text-white italic tracking-tighter">WRAPPED</h2>
                                      <div className="h-1 w-full bg-[#1ed760] mt-1"></div>
                                  </div>
                                  <span className="text-xl font-bold text-white/50">{year}</span>
                              </div>

                              <div className="flex items-center gap-4 mb-8">
                                  <div className="w-24 h-24 rounded-lg bg-zinc-800 border-2 border-zinc-700 overflow-hidden shadow-lg rotate-[-2deg]">
                                      {artist.image ? <img src={artist.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Mic2 className="text-zinc-500"/></div>}
                                  </div>
                                  <div>
                                      <div className="text-2xl font-bold text-white leading-none mb-2">{artist.name}</div>
                                      <div className={`text-[10px] uppercase font-black px-3 py-1 rounded bg-[#1ed760] text-black inline-block`}>{persona.name}</div>
                                  </div>
                              </div>

                              <div className="space-y-3 mb-8">
                                  <StatRow label="Top Genre" value={artist.genre} icon={<Layers size={14} className="text-[#1ed760]"/>} />
                                  <StatRow label="Total Streams" value={formatCompact(totalStreamsYear)} icon={<Play size={14} className="text-[#1ed760]"/>} />
                                  <StatRow label="Top Track" value={topSong?.title || "N/A"} icon={<Music size={14} className="text-[#1ed760]"/>} />
                                  <StatRow label="Top Region" value={topRegion?.name || "N/A"} icon={<Globe size={14} className="text-[#1ed760]"/>} />
                                  <StatRow label="Wealth" value={formatMoney(totalRevenueYear)} icon={<DollarSign size={14} className="text-[#1ed760]"/>} />
                              </div>

                              <div className="mt-auto pt-6 border-t border-zinc-800 text-center flex justify-between items-center">
                                  <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Rapper Rise</div>
                                  <div className="flex gap-1">
                                      <div className="w-2 h-2 rounded-full bg-[#1ed760]"></div>
                                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <button 
                          onClick={onClose} 
                          className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                      >
                          Close <X size={18} />
                      </button>
                  </div>
              );

          default: return null;
      }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center font-sans" onClick={onClose}>
        {/* Mobile-like Container */}
        <div 
            className={`w-full max-w-md h-full md:h-[85vh] md:rounded-[2rem] relative overflow-hidden shadow-2xl flex flex-col transition-colors duration-700 ease-in-out border border-white/5 ${getBackground(currentSlide)}`}
            onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} // Pause on click
        >
            
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 w-full p-3 pt-4 flex gap-1.5 z-50">
                {Array.from({ length: SLIDES }).map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                           className={`h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_5px_rgba(255,255,255,0.8)]`}
                           style={{ 
                               width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%' 
                           }}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Click Areas */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-40 cursor-w-resize" onClick={handlePrev} />
            <div className="absolute inset-y-0 right-0 w-1/3 z-40 cursor-e-resize" onClick={handleNext} />

            {/* Content Area */}
            <div className="flex-1 relative z-0 h-full">
                {renderSlide()}
            </div>
            
            {/* Close Button (Top Right) */}
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                className="absolute top-6 right-4 z-50 p-2 text-white/50 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
        </div>
    </div>
  );
};

const StatRow = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex justify-between items-center group p-2 rounded hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3 text-zinc-400 text-sm font-bold uppercase tracking-wider">
            {icon} {label}
        </div>
        <div className="font-bold text-white text-lg truncate max-w-[150px]">{value}</div>
    </div>
)

export default SpotifyWrapped;
