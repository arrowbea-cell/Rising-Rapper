
import React, { useState, useEffect, useRef } from 'react';
import { Artist, GameState, Song, Album } from '../types';
import { 
  Play, Pause, Heart, MoreHorizontal, Clock3, 
  BadgeCheck, ArrowLeft, ChevronLeft, ChevronRight, 
  Search, Users, Disc, Music2, Calendar, MapPin, Shuffle, ListMusic, Edit2, X, CheckCircle
} from 'lucide-react';

interface SpotifyProfileProps {
  artist: Artist;
  gameState: GameState;
  onUpdateArtist?: (updatedArtist: Artist) => void;
}

const SpotifyProfile: React.FC<SpotifyProfileProps> = ({ artist, gameState, onUpdateArtist }) => {
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllDiscography, setShowAllDiscography] = useState(false);
  const [isSelectingPick, setIsSelectingPick] = useState(false); // Modal state for Artist Pick
  const [filter, setFilter] = useState<'ALL' | 'ALBUMS' | 'SINGLES'>('ALL');
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- DATA PREP ---
  const releasedSongs = [...gameState.songs].filter(s => s.isReleased);
  
  // Sort by Weekly Streams for "Popular" section
  const popularSongs = [...releasedSongs].sort((a, b) => (b.weeklyStreams || 0) - (a.weeklyStreams || 0));
  const topTracks = showAllPopular ? popularSongs.slice(0, 10) : popularSongs.slice(0, 5);

  const albums = gameState.albums.filter(a => a.isReleased).sort((a, b) => (b.releaseWeek || 0) - (a.releaseWeek || 0));
  const singles = gameState.songs.filter(s => s.isReleased && s.type === 'Single').sort((a, b) => (b.releaseWeek || 0) - (a.releaseWeek || 0));

  // Helper to calculate total weekly streams for an item (Song or Album)
  const getItemWeeklyStreams = (item: Album | Song) => {
      if ('tracks' in item) {
           return item.tracks.reduce((acc, t) => {
               const liveSong = gameState.songs.find(s => s.id === t.id);
               return acc + (liveSong?.weeklyStreams || 0);
           }, 0);
      }
      return item.weeklyStreams || 0;
  };

  const filteredDiscography = 
    filter === 'ALL' 
        ? [...albums, ...singles].sort((a, b) => getItemWeeklyStreams(b) - getItemWeeklyStreams(a)) // Sort by Hype/Streams
        : filter === 'ALBUMS' 
            ? albums 
            : singles;

  // Apply Show More Limit (Default 4)
  const visibleDiscography = showAllDiscography ? filteredDiscography : filteredDiscography.slice(0, 4);

  // --- ARTIST PICK LOGIC ---
  // Default to Latest Release (Discography[0] in date sort, but we used streams sort above for display. Let's get actual latest)
  const chronologicalDiscography = [...albums, ...singles].sort((a, b) => (b.releaseWeek || 0) - (a.releaseWeek || 0));
  const defaultPick = chronologicalDiscography[0];
  
  // Find User's Pick if it exists
  const findItemById = (id: string) => [...albums, ...singles].find(i => i.id === id);
  const userPick = artist.artistPickId ? findItemById(artist.artistPickId) : null;
  
  // Final Active Pick (User > Default)
  const activePick = userPick || defaultPick;

  // --- THEME & SCROLL ---
  const isHalloween = gameState.date.month === 10;
  const isChristmas = gameState.date.month === 12;

  const getThemeColors = () => {
      if (isHalloween) return { 
          bgGradient: 'from-orange-900', 
          playButton: 'bg-orange-500 text-black', 
          verified: 'text-orange-500',
          subText: 'text-orange-200'
      };
      if (isChristmas) return { 
          bgGradient: 'from-red-900', 
          playButton: 'bg-green-500 text-black', 
          verified: 'text-green-400',
          subText: 'text-green-100'
      };
      return { 
          bgGradient: 'from-zinc-800', 
          playButton: 'bg-[#1ed760] text-black', 
          verified: 'text-[#3d91f4]',
          subText: 'text-zinc-300'
      }; 
  };

  const theme = getThemeColors();

  const handleScroll = () => {
      if (scrollRef.current) {
          const scrollTop = scrollRef.current.scrollTop;
          const opacity = Math.min(1, scrollTop / 200);
          setHeaderOpacity(opacity);
      }
  };

  // --- UTILS ---
  const formatStreams = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatDuration = (id: string) => {
      const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const min = 2 + (seed % 3);
      const sec = seed % 60;
      return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSetPick = (id: string) => {
      if (onUpdateArtist) {
          onUpdateArtist({ ...artist, artistPickId: id });
          setIsSelectingPick(false);
      }
  };

  return (
    <div className="h-full bg-[#121212] text-white font-sans overflow-hidden flex flex-col relative select-none">
      
      {/* PICK SELECTION MODAL */}
      {isSelectingPick && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsSelectingPick(false)}>
              <div className="bg-[#242424] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Select Artist Pick</h3>
                      <button onClick={() => setIsSelectingPick(false)}><X className="text-zinc-400 hover:text-white" /></button>
                  </div>
                  <div className="overflow-y-auto p-2">
                      {chronologicalDiscography.length === 0 ? (
                          <div className="p-8 text-center text-zinc-500">No releases available.</div>
                      ) : (
                          chronologicalDiscography.map(item => {
                              const isSelected = activePick?.id === item.id;
                              return (
                                  <div 
                                    key={item.id} 
                                    onClick={() => handleSetPick(item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                                  >
                                      <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden shrink-0">
                                          {item.coverArt ? <img src={item.coverArt} className="w-full h-full object-cover"/> : <Disc className="m-auto mt-3 text-zinc-500"/>}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className="font-bold truncate text-white">{item.title}</div>
                                          <div className="text-xs text-zinc-400">{'tracks' in item ? 'Album' : 'Single'} • {item.releaseWeek ? 'Released' : 'Unknown'}</div>
                                      </div>
                                      {isSelected && <CheckCircle className="text-green-500" size={20} />}
                                  </div>
                              )
                          })
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* STICKY HEADER (Changes Opacity) */}
      <div 
        className="h-16 w-full absolute top-0 left-0 z-40 flex items-center justify-between px-6 transition-colors duration-300"
        style={{ backgroundColor: `rgba(7, 7, 7, ${headerOpacity})` }}
      >
         <div className="flex gap-4 items-center">
             {/* Artist Name in Header when Scrolled */}
             <div className={`font-bold text-xl transition-opacity duration-300 ${headerOpacity > 0.8 ? 'opacity-100' : 'opacity-0'}`}>
                 {artist.name}
             </div>
         </div>
         <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-xs border border-white/10">
                 {artist.name[0]}
             </div>
         </div>
      </div>

      {/* MAIN SCROLL AREA */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700/50 hover:scrollbar-thumb-zinc-600 active:scrollbar-thumb-zinc-500 relative"
      >
          
          {/* HERO SECTION (IMMERSIVE) */}
          <div className={`relative h-[40vh] md:h-[45vh] min-h-[340px] w-full bg-gradient-to-b ${theme.bgGradient} to-[#121212]`}>
              
              {/* Background Image Layer */}
              {artist.image && (
                  <div className="absolute inset-0 z-0">
                      <img src={artist.image} className="w-full h-full object-cover opacity-60 mask-image-b" style={{maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'}} />
                  </div>
              )}
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-10" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-20 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck size={24} className={`${theme.verified} fill-white`} />
                      <span className="text-sm font-medium tracking-wide flex items-center gap-1">
                          Verified Artist
                      </span>
                  </div>
                  
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-xl leading-none">
                      {artist.name}
                  </h1>
                  
                  <div className="text-white font-medium text-base drop-shadow-md">
                      {formatStreams(artist.monthlyListeners || 0)} monthly listeners
                  </div>
              </div>
          </div>

          {/* MAIN CONTENT BODY */}
          <div className="bg-gradient-to-b from-[#121212] to-black min-h-screen relative z-20 px-6 md:px-8 pb-20 pt-8">
              
              <div className="flex flex-col lg:flex-row gap-12 mt-4">
                  
                  {/* LEFT COLUMN: Popular & Discography */}
                  <div className="flex-1 min-w-0">
                      
                      {/* POPULAR TRACKS */}
                      <section className="mb-10">
                          <h2 className="text-2xl font-bold mb-4 text-white">Popular</h2>
                          <div className="flex flex-col">
                              {topTracks.length === 0 ? (
                                  <div className="text-zinc-500 py-8 text-sm">No popular tracks yet.</div>
                              ) : (
                                  topTracks.map((song, idx) => (
                                      <div key={song.id} className="group grid grid-cols-[16px_1fr_60px] items-center gap-4 px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-default">
                                          {/* Index / Play */}
                                          <div className="text-base text-zinc-400 font-mono flex items-center justify-center relative w-4">
                                              <span className="group-hover:hidden text-sm">{idx + 1}</span>
                                              <Play size={14} fill="white" className="hidden group-hover:block text-white absolute" />
                                          </div>

                                          {/* Title & Image & Streams */}
                                          <div className="flex items-center gap-4 min-w-0">
                                              <div className="w-10 h-10 bg-zinc-800 shadow-lg shrink-0">
                                                  {song.coverArt ? <img src={song.coverArt} className="w-full h-full object-cover" /> : <Music2 className="m-2 text-zinc-600"/>}
                                              </div>
                                              <div className="flex flex-col truncate pr-4">
                                                  <span className={`text-base font-medium truncate ${song.isReleased ? 'text-white' : 'text-zinc-500'} group-hover:text-white`}>{song.title}</span>
                                                  <span className="text-xs text-zinc-400 font-medium">{formatStreams(song.streams)}</span>
                                              </div>
                                          </div>

                                          {/* Duration */}
                                          <div className="text-sm text-zinc-400 font-variant-numeric text-right flex items-center justify-end gap-4">
                                              <Heart size={16} className="opacity-0 group-hover:opacity-100 hover:text-white text-zinc-400 transition-opacity cursor-pointer" />
                                              <span className="w-10 text-right">{formatDuration(song.id)}</span>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                          {popularSongs.length > 5 && (
                              <button 
                                onClick={() => setShowAllPopular(!showAllPopular)}
                                className="mt-4 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest pl-4 transition-colors"
                              >
                                  {showAllPopular ? 'Show Less' : 'See More'}
                              </button>
                          )}
                      </section>

                      {/* DISCOGRAPHY */}
                      <section>
                          <div className="flex items-center justify-between mb-4">
                              <h2 className="text-2xl font-bold hover:underline cursor-pointer">Discography</h2>
                              <div className="flex gap-2">
                                  {['ALL', 'ALBUMS', 'SINGLES'].map((f) => (
                                      <button 
                                        key={f}
                                        onClick={() => { setFilter(f as any); setShowAllDiscography(false); }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'}`}
                                      >
                                          {f.charAt(0) + f.slice(1).toLowerCase()}
                                      </button>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                              {visibleDiscography.map((item) => {
                                  const isAlbum = 'tracks' in item;
                                  const year = item.releaseWeek ? `${gameState.date.year}` : 'Unreleased';
                                  
                                  return (
                                      <div key={item.id} className="p-4 bg-[#181818] hover:bg-[#282828] rounded-md group transition-all duration-300 cursor-pointer">
                                          <div className="w-full aspect-square bg-zinc-800 shadow-xl mb-4 relative rounded-md overflow-hidden">
                                              {item.coverArt ? <img src={item.coverArt} className="w-full h-full object-cover" /> : <Disc className="m-auto mt-10 text-zinc-600 opacity-50" size={48} />}
                                              
                                              {/* Play Button Overlay (Moves up and fades in) */}
                                              <div className={`absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20`}>
                                                  <div className={`w-12 h-12 ${theme.playButton} rounded-full flex items-center justify-center shadow-xl hover:scale-105`}>
                                                      <Play fill="black" size={24} className="ml-1" />
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="font-bold truncate mb-1 text-base text-white">{item.title}</div>
                                          <div className="text-sm text-zinc-400 flex items-center gap-1 line-clamp-2">
                                              {year} • {isAlbum ? 'Album' : 'Single'}
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>
                          
                          {/* Show All Toggle for Discography */}
                          {filteredDiscography.length > 4 && (
                              <button 
                                onClick={() => setShowAllDiscography(!showAllDiscography)}
                                className="mt-6 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors w-full text-center py-2 hover:bg-white/5 rounded"
                              >
                                  {showAllDiscography ? 'Show Less' : 'Show All'}
                              </button>
                          )}
                      </section>
                  </div>

                  {/* RIGHT COLUMN: Sidebar (About, Merch, Tour) */}
                  <div className="w-full lg:w-[360px] shrink-0 space-y-8 lg:mt-0 mt-8">
                      
                      {/* ARTIST PICK (Dynamic - Manual or System) */}
                      {activePick && (
                          <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                  <h3 className="font-bold text-2xl">Artist Pick</h3>
                                  {onUpdateArtist && (
                                      <button 
                                        onClick={() => setIsSelectingPick(true)}
                                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors"
                                      >
                                          <Edit2 size={12} /> Change
                                      </button>
                                  )}
                              </div>
                              <div className="flex gap-3 items-start group cursor-pointer hover:bg-[#282828] transition-colors rounded-md p-2 -ml-2 relative">
                                  <div className="w-20 h-20 bg-zinc-800 shrink-0 rounded overflow-hidden shadow-md">
                                      {activePick.coverArt ? <img src={activePick.coverArt} className="w-full h-full object-cover" /> : <Music2 className="m-auto mt-6 text-zinc-600" />}
                                  </div>
                                  <div className="flex flex-col gap-1 min-w-0 pt-1">
                                      <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-full bg-zinc-700 overflow-hidden">
                                              {artist.image && <img src={artist.image} className="w-full h-full object-cover" />}
                                          </div>
                                          <span className="text-xs text-zinc-400 font-medium">Posted by {artist.name}</span>
                                      </div>
                                      <div className="font-bold text-white group-hover:underline truncate">{activePick.title}</div>
                                      <div className="text-xs text-zinc-400">{'tracks' in activePick ? 'Album' : activePick.type}</div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* ON TOUR */}
                      <div>
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-2xl">On Tour</h3>
                              {gameState.activeTour && <span className="text-xs font-bold text-zinc-400 uppercase hover:underline cursor-pointer">Show All</span>}
                          </div>
                          
                          {gameState.activeTour ? (
                              <div className="bg-[#242424] hover:bg-[#2a2a2a] p-0 rounded-lg overflow-hidden group cursor-pointer transition-colors border-none">
                                  <div className="p-4 flex gap-4 items-center">
                                      <div className="bg-[#121212] w-14 h-16 rounded flex flex-col items-center justify-center shrink-0 border border-zinc-800">
                                          <span className="text-xs font-bold uppercase text-white">Wk</span>
                                          <span className="text-xl font-black text-white">{gameState.date.week}</span>
                                      </div>
                                      <div className="min-w-0">
                                          <div className="text-base font-bold text-white truncate group-hover:underline">
                                              {gameState.regions.find(r => r.id === gameState.activeTour?.regions[gameState.activeTour?.currentLegIndex])?.name || 'World Tour'}
                                          </div>
                                          <div className="text-sm text-zinc-400 truncate">
                                              {gameState.activeTour.name}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-zinc-400 text-sm">
                                  No upcoming dates.
                              </div>
                          )}
                      </div>

                      {/* ABOUT CARD */}
                      <div 
                        className="relative w-full aspect-[3/2] rounded-lg overflow-hidden group cursor-pointer bg-[#242424] hover:scale-[1.02] transition-transform duration-300"
                        style={{
                            backgroundImage: artist.image ? `url(${artist.image})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                      >
                          {/* Fallback if no image */}
                          {!artist.image && <div className="absolute inset-0 flex items-center justify-center text-zinc-600"><Users size={64}/></div>}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-between">
                              <h3 className="font-bold text-2xl">About</h3>
                              <div>
                                  <div className="font-black text-3xl mb-1">#{artist.globalRank || '-'}</div>
                                  <div className="text-xs font-bold text-white uppercase tracking-wide mb-2">in the world</div>
                                  <p className="line-clamp-3 text-white text-sm font-medium leading-relaxed drop-shadow-md">
                                      {artist.name} is a {artist.genre} artist from {artist.country}. 
                                      Currently dominating the charts with {formatStreams(artist.monthlyListeners || 0)} listeners.
                                  </p>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SpotifyProfile;
