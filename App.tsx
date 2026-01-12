
import React, { useState, useRef, useEffect } from 'react';
import CreateArtist from './components/CreateArtist';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import WorldMap from './components/WorldMap';
import GenreTrends from './components/GenreTrends';
import Charts from './components/Charts';
import SpotifyProfile from './components/SpotifyProfile';
import ChartHistory from './components/ChartHistory';
import TourManager from './components/TourManager'; 
import SpotifyWrapped from './components/SpotifyWrapped';
import YouTubeChannel from './components/YouTubeChannel';
import SocialMedia from './components/SocialMedia';
import HallOfFame from './components/HallOfFame'; 
import BrandShop from './components/BrandShop'; 
import WeekSimulationLoader from './components/WeekSimulationLoader'; 
import AwardCeremony from './components/AwardCeremony'; 
import GrammysHistory from './components/GrammysHistory'; 

import { Artist, GameState, View, Genre, Song, Album, ChartEntry, NPCArtist } from './types';
import { INITIAL_REGIONS, GENRE_DETAILS, INITIAL_TRENDS, THEMES, THEME_SEASON_MAPPING, INITIAL_NPCS, BACKGROUND_RANKING_DATA, INITIAL_RECORDS } from './constants';
import { Menu, X, Home, Mic2, Globe2, LineChart, Trophy, Music2, History, Plane, Save, Upload, Ghost, Snowflake, Youtube, X as XIcon, Crown, ShoppingBag, LogOut, Settings, Award, Lock, Terminal } from 'lucide-react';
import { simulateNPCWeek, calculateSongPerformance, calculateAlbumSales, generateCharts, calculateMonthlyListeners, processTourWeek } from './utils/gameEngine';
import { processWorldRecords } from './utils/recordSystem';
import { generateWeeklySocialFeed, calculateFollowerGrowth, INITIAL_SOCIAL_STATE } from './utils/socialLogic';
import { checkBrandOffers, processActiveDeals, checkBrandEvents, checkBrandScandals } from './utils/brandLogic'; 
import { generateAwards, checkAwardTriggers } from './utils/awardsLogic';
import { checkGrammyInvite } from './utils/features/grammyPerformance'; 
import { useAwardSystem } from './hooks/useAwardSystem'; 

const AUTOSAVE_KEY = 'rapper_rise_autosave_v5';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CREATE_ARTIST);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasCheckedInitialSave, setHasCheckedInitialSave] = useState(false);
  
  // Dev Key States
  const [showDevInput, setShowDevInput] = useState(false);
  const [devKeyInput, setDevKeyInput] = useState('');

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wrapped State
  const [showWrapped, setShowWrapped] = useState(false);
  const [wrappedYear, setWrappedYear] = useState(2024);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    money: 0,
    hype: 0,
    totalStreams: 0,
    totalSales: 0,
    weeklyStreams: 0,
    weeklySales: 0,
    yearlyStreams: 0, 
    yearlySales: 0, 
    date: { week: 1, month: 1, year: 2024 },
    songs: [],
    albums: [],
    regions: INITIAL_REGIONS,
    trends: INITIAL_TRENDS,
    themeFatigue: {},
    npcArtists: INITIAL_NPCS,
    activeCharts: {},
    npcSongs: [],
    npcAlbums: [],
    playerChartHistory: {},
    activeTour: null,
    youtubeVideos: [],
    socialState: INITIAL_SOCIAL_STATE,
    worldRecords: INITIAL_RECORDS,
    activeDeals: [],
    activeNominations: null, 
    awardsHistory: [],
    grammyPerformanceSongId: null
  });

  const saveToDisk = (currentArtist: Artist | null, currentState: GameState) => {
    if (!currentArtist || !hasCheckedInitialSave) return;
    try {
      const data = { artist: currentArtist, gameState: currentState, timestamp: Date.now() };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const loadAutoSave = () => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.artist && data.gameState) {
          setArtist(data.artist);
          setGameState(data.gameState);
          setCurrentView(View.DASHBOARD);
        }
      } catch (e) {
        console.error("Failed to load autosave", e);
      }
    }
  };

  const hasAutoSave = !!localStorage.getItem(AUTOSAVE_KEY);

  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.artist && data.gameState) {
          setArtist(data.artist);
          setGameState(data.gameState);
          setCurrentView(View.DASHBOARD);
        }
      } catch (e) {
        console.error("Failed to load initial save", e);
      }
    }
    setHasCheckedInitialSave(true);
  }, []);

  useEffect(() => {
    if (artist && hasCheckedInitialSave) {
      setIsAutoSaving(true);
      const timeout = setTimeout(() => {
        saveToDisk(artist, gameState);
        setIsAutoSaving(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState, artist, hasCheckedInitialSave]);

  const handleCreateArtist = (newArtist: Artist) => {
    setArtist(newArtist);
    const startPop = newArtist.startingPopularity || 0;
    const homeRegionId = getHomeRegionId(newArtist.country);
    const initialRegions = INITIAL_REGIONS.map(r => ({
        ...r, 
        popularity: r.id === homeRegionId ? startPop : 0
    }));

    const initialFatigue: Record<string, number> = {};
    THEMES.forEach(t => initialFatigue[t.id] = 0);

    const initialState: GameState = {
      ...gameState,
      money: newArtist.budget,
      hype: 10 + (startPop * 3),
      regions: initialRegions,
      themeFatigue: initialFatigue,
      socialState: { ...INITIAL_SOCIAL_STATE },
      date: { week: 1, month: 1, year: 2024 }
    };

    setGameState(initialState);
    saveToDisk(newArtist, initialState);
    setCurrentView(View.DASHBOARD);
  };

  const checkDevKey = () => {
      if (devKeyInput === 'OWNERDEVKEY') {
          setArtist(prev => prev ? { ...prev, isDev: true } : null);
          setShowDevInput(false);
          setDevKeyInput('');
          alert("DEVELOPER ACCESS GRANTED. Kernel ROOT enabled.");
      } else {
          alert("Invalid security key.");
          setDevKeyInput('');
      }
  };

  const handleNextWeek = () => {
    setIsLoading(true);
    setTimeout(() => {
        setGameState(prev => {
          try {
              let { week, month, year } = prev.date;
              const prevYear = year;
              week++;
              if (week > 4) { week = 1; month++; if (month > 12) { month = 1; year++; } }
              const yearsElapsed = year - 2024;
              const currentGameWeek = week + ((month - 1) * 4) + (yearsElapsed * 48);

              const nextFatigue = { ...prev.themeFatigue };
              Object.keys(nextFatigue).forEach(k => nextFatigue[k] = Math.max(0, nextFatigue[k] - 1.5));
              const currentTrends = { ...prev.trends }; 
              let triggerWrapped = false;
              if (year > prevYear) {
                Object.keys(currentTrends).forEach((key) => {
                    const genreKey = key as Genre;
                    let val = currentTrends[genreKey];
                    val += (Math.random() * 0.6) - 0.3;
                    val = Math.max(0.5, Math.min(1.5, val));
                    currentTrends[genreKey] = val;
                });
                nextFatigue['christmas'] = Math.floor(nextFatigue['christmas'] * 0.4);
                nextFatigue['halloween'] = Math.floor(nextFatigue['halloween'] * 0.4);
                triggerWrapped = true;
              }

              const activeThemes = THEME_SEASON_MAPPING[month] || [];
              const isChristmas = month === 12;
              const isHalloween = month === 10;

              const { newSongs: newNpcSongs, newAlbums: newNpcAlbums } = simulateNPCWeek(prev.npcArtists, activeThemes, isChristmas, currentTrends, currentGameWeek);
              let allNpcSongs = [...newNpcSongs, ...prev.npcSongs];
              let allNpcAlbums = [...newNpcAlbums, ...prev.npcAlbums];

              let weekTotalStreams = 0;
              let weekTotalSales = 0;
              const updatedPlayerSongs = prev.songs.map(song => {
                  if (!song.isReleased) return song;
                  const processed = calculateSongPerformance(song, prev.regions, currentTrends, nextFatigue, activeThemes, month, prev.hype, currentGameWeek, artist?.monthlyListeners || 0);

                  let payolaBoost = song.pendingPayolaStreams || 0;
                  const finalWeeklyStreams = (processed.weeklyStreams || 0) + payolaBoost;
                  const finalTotalStreams = processed.streams + payolaBoost;
                  const finalRegionalData = { ...processed.regionalData };
                  if (payolaBoost > 0) {
                      if (!finalRegionalData['USA']) finalRegionalData['USA'] = { streams: 0, sales: 0 };
                      finalRegionalData['USA'].streams += payolaBoost;
                  }
                  weekTotalStreams += finalWeeklyStreams;
                  weekTotalSales += processed.weeklySales || 0;
                  return { ...processed, weeklyStreams: finalWeeklyStreams, streams: finalTotalStreams, streamsThisYear: (processed.streamsThisYear || 0) + payolaBoost, regionalData: finalRegionalData, pendingPayolaStreams: 0 };
              });

              const updatedNpcSongs = allNpcSongs.map(song => {
                  const npc = prev.npcArtists.find(n => n.id === song.artistId);
                  return calculateSongPerformance(song, prev.regions, currentTrends, nextFatigue, activeThemes, month, 0, currentGameWeek, npc?.monthlyListeners || 0, npc);
              }).filter(s => (s.weeklyStreams || 0) > 100); 

              const updateAlbumStats = (albums: Album[], currentSongs: Song[], isPlayer: boolean) => {
                  return albums.map(album => {
                    if (!album.isReleased) return album;
                    const liveAlbumSongs = currentSongs.filter(s => (album.tracks || []).map(t => t.id).includes(s.id));
                    const newTotalStreams = liveAlbumSongs.reduce((acc, s) => acc + (s.streams || 0), 0);
                    const weeklyTrackStreams = liveAlbumSongs.reduce((acc, s) => acc + (s.weeklyStreams || 0), 0);
                    const ses = Math.floor(weeklyTrackStreams / 1500);
                    let weeklySales = isPlayer ? calculateAlbumSales(album, prev.regions, prev.hype, artist?.monthlyListeners || 0, prev.activeCharts, currentGameWeek).sales : Math.floor((album.quality * 50) * Math.pow(0.9, Math.max(0, currentGameWeek - (album.releaseWeek || 0))));
                    return { ...album, weeklySales, weeklySES: ses, totalSales: album.totalSales + weeklySales, totalStreams: newTotalStreams };
                  });
              };

              const updatedPlayerAlbums = updateAlbumStats(prev.albums, updatedPlayerSongs, true);
              const updatedNpcAlbums = updateAlbumStats(allNpcAlbums, updatedNpcSongs, false);
              const nextCharts = generateCharts([...updatedPlayerSongs, ...updatedNpcSongs], [...updatedPlayerAlbums, ...updatedNpcAlbums], prev.activeCharts, prev.regions);

              let tourRevenue = 0, tourHypeGain = 0;
              let activeTourState = prev.activeTour;
              if (activeTourState) {
                  const tourResult = processTourWeek(activeTourState, prev.regions, currentGameWeek);
                  activeTourState = tourResult.tour;
                  tourRevenue = tourResult.weekRevenue;
                  tourHypeGain = tourResult.hypeGain;
              }

              const updatedRegions = prev.regions.map(region => {
                  let newPop = region.popularity * 0.995; 
                  if (weekTotalStreams > 0) newPop += Math.min(1.5, (weekTotalStreams / 15000000) * (GENRE_DETAILS[artist?.genre || Genre.POP].strongRegions.includes(region.id) ? 1.5 : 0.7));
                  return { ...region, popularity: Math.min(100, Math.max(0, newPop)) };
              });

              const playerML = calculateMonthlyListeners(artist?.monthlyListeners || 0, updatedPlayerSongs, updatedRegions, currentTrends, isChristmas, isHalloween, true);
              if (artist) setArtist({ ...artist, monthlyListeners: playerML });

              const totalRevenue = (weekTotalStreams * 0.003) + (weekTotalSales * 0.70) + (updatedPlayerAlbums.reduce((acc, a) => acc + (a.weeklySales || 0), 0) * 7.00) + tourRevenue;
              let currentHype = Math.min(1000, (prev.hype * (prev.hype > 800 ? 0.99 : 0.998)) + tourHypeGain);

              const nextState = {
                  ...prev,
                  date: { week, month, year },
                  weeklyStreams: weekTotalStreams,
                  money: prev.money + totalRevenue, 
                  songs: updatedPlayerSongs,
                  albums: updatedPlayerAlbums,
                  regions: updatedRegions,
                  hype: currentHype,
                  trends: currentTrends,
                  themeFatigue: nextFatigue,
                  npcSongs: updatedNpcSongs,
                  npcAlbums: updatedNpcAlbums,
                  activeCharts: nextCharts,
                  activeTour: activeTourState
              };

              if (triggerWrapped) { setWrappedYear(prevYear); setShowWrapped(true); }
              saveToDisk(artist, nextState);
              return nextState;
          } catch (error) {
              console.error("Simulation failed:", error);
              return prev; 
          }
        });
        setIsLoading(false);
    }, 1200);
  };

  const handleNavigation = (view: View) => {
    if (view !== View.CREATE_ARTIST && !artist) return;
    setCurrentView(view);
  };

  const navItems = [
      { id: View.DASHBOARD, icon: Home, label: "Home" },
      { id: View.STUDIO, icon: Mic2, label: "Studio" },
      { id: View.SOCIAL, icon: XIcon, label: "Socials" },
      { id: View.CHARTS, icon: Trophy, label: "Charts" },
      { id: View.SPOTIFY, icon: Music2, label: "Profile" },
      { id: View.YOUTUBE, icon: Youtube, label: "YouTube" },
      { id: View.TOUR, icon: Plane, label: "Tour" },
      { id: View.SHOP, icon: ShoppingBag, label: "Empire" },
      { id: View.GRAMMYS, icon: Award, label: "Awards" },
      { id: View.WORLD_MAP, icon: Globe2, label: "World" },
      { id: View.TRENDS, icon: LineChart, label: "Market" },
      { id: View.HALL_OF_FAME, icon: Crown, label: "Records" },
  ];

  const renderContent = () => {
    if (currentView === View.CREATE_ARTIST) return <CreateArtist onCreate={handleCreateArtist} onLoadSave={handleImportSave} onContinue={loadAutoSave} hasAutoSave={hasAutoSave} />;
    if (currentView === View.DASHBOARD && artist) return <Dashboard artist={artist} gameState={gameState} onNextWeek={handleNextWeek} setGameState={setGameState} />;
    if (currentView === View.STUDIO && artist) return <Studio artist={artist} gameState={gameState} setGameState={setGameState} />;
    if (currentView === View.WORLD_MAP && artist) return <WorldMap gameState={gameState} />;
    if (currentView === View.TRENDS && artist) return <GenreTrends gameState={gameState} />;
    if (currentView === View.CHARTS && artist) return <Charts gameState={gameState} />;
    if (currentView === View.TOUR && artist) return <TourManager gameState={gameState} setGameState={setGameState} />;
    if (currentView === View.SPOTIFY && artist) return <SpotifyProfile artist={artist} gameState={gameState} onUpdateArtist={setArtist} />;
    if (currentView === View.YOUTUBE && artist) return <YouTubeChannel artist={artist} gameState={gameState} setGameState={setGameState} />;
    if (currentView === View.SOCIAL && artist) return <SocialMedia artist={artist} gameState={gameState} setGameState={setGameState} />;
    if (currentView === View.HALL_OF_FAME && artist) return <HallOfFame gameState={gameState} />; 
    if (currentView === View.SHOP && artist) return <BrandShop gameState={gameState} />; 
    if (currentView === View.GRAMMYS && artist) return <GrammysHistory gameState={gameState} artist={artist} />; 
    return null;
  };

  const getHomeRegionId = (countryName: string): string => {
      switch(countryName) {
          case "United States": return 'USA';
          case "United Kingdom": return 'UK';
          case "Canada": return 'CAN';
          case "South Korea": return 'KOR';
          case "Japan": return 'JPN';
          case "Brazil": case "Mexico": return 'LATAM';
          case "Nigeria": return 'AFR';
          case "Australia": case "Indonesia": return 'OCE';
          default: return 'USA';
      }
  };

  const handleExportSave = () => {
    if (!artist) return;
    const blob = new Blob([JSON.stringify({ artist, gameState }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `rapper_rise_${artist.name}_save.json`; link.click();
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (data.artist && data.gameState) {
                setArtist(data.artist); setGameState(data.gameState);
                localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
                setCurrentView(View.DASHBOARD);
            }
        } catch (err) { alert("Corrupted save file."); }
    };
    reader.readAsText(file);
  };

  const handleCloseWrapped = () => {
      setShowWrapped(false);
      setGameState(prev => ({ ...prev, yearlyStreams: 0, yearlySales: 0, songs: prev.songs.map(s => ({ ...s, streamsThisYear: 0 })) }));
  };

  const { activeAwardData, awardMode, handleCloseAwards } = useAwardSystem(artist, setGameState);

  return (
    <div className="bg-[#020617] min-h-screen text-white relative flex overflow-hidden font-sans">
      {isLoading && <WeekSimulationLoader week={gameState.date.week} />}
      <input type="file" ref={fileInputRef} onChange={handleImportSave} accept=".json" className="hidden" />
      {showWrapped && artist && <SpotifyWrapped artist={artist} gameState={gameState} onClose={handleCloseWrapped} year={wrappedYear} />}
      {activeAwardData && <AwardCeremony data={activeAwardData} mode={awardMode} onClose={handleCloseAwards} isPerforming={!!gameState.grammyPerformanceSongId} performanceSongId={gameState.grammyPerformanceSongId} artist={artist} currentWeek={gameState.date.week + ((gameState.date.month - 1) * 4) + ((gameState.date.year - 2024) * 48)} setGameState={setGameState} />}

      {artist && (
          <div className="fixed left-0 top-0 h-full w-20 bg-black/60 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col items-center py-6">
              <div className="mb-8">{gameState.date.month === 12 ? <Snowflake className="text-cyan-400" /> : <Music2 className="text-white" />}</div>
              <nav className="flex-1 flex flex-col gap-2 w-full px-2 overflow-y-auto">
                  {navItems.map((item) => (
                      <button key={item.id} onClick={() => handleNavigation(item.id)} className={`w-full h-12 rounded-xl flex items-center justify-center transition-all relative group ${currentView === item.id ? 'bg-white/10 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}><item.icon size={22} /><span className="absolute left-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-[60] shadow-xl">{item.label}</span></button>
                  ))}
              </nav>
              
              <div className="mt-auto flex flex-col gap-2 w-full px-2 pt-4 border-t border-white/5">
                  {/* DEV KEY TERMINAL TRIGGER */}
                  {!artist.isDev && (
                      <div className="relative group">
                          <button 
                            onClick={() => setShowDevInput(!showDevInput)} 
                            className={`w-full h-10 rounded-xl flex items-center justify-center transition-colors ${showDevInput ? 'bg-green-500 text-black' : 'text-zinc-500 hover:text-white'}`}
                          >
                            <Lock size={18} />
                          </button>
                          {showDevInput && (
                              <div className="absolute left-20 bottom-0 bg-[#0a0a0a] border border-green-500/50 p-3 rounded-2xl shadow-2xl z-[100] w-48 animate-in slide-in-from-left duration-200">
                                  <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono mb-2"><Terminal size={10}/> AUTH_KEY_REQUIRED</div>
                                  <input 
                                    type="password" 
                                    value={devKeyInput} 
                                    onChange={(e) => setDevKeyInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && checkDevKey()}
                                    placeholder="KEY..." 
                                    className="w-full bg-black border border-green-900 rounded-lg px-2 py-1.5 text-xs text-green-400 font-mono focus:border-green-500 outline-none mb-2"
                                    autoFocus
                                  />
                                  <button onClick={checkDevKey} className="w-full bg-green-600 text-black text-[10px] font-black py-1.5 rounded uppercase hover:bg-green-400 transition-colors">Authorize</button>
                              </div>
                          )}
                      </div>
                  )}

                  <button onClick={handleExportSave} className="w-full h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-white group"><Save size={20} /><span className="absolute left-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-[60]">Export Save</span></button>
                  <button onClick={() => { if(confirm("Quit?")) { setCurrentView(View.CREATE_ARTIST); setArtist(null); } }} className="w-full h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-red-400 group"><LogOut size={20} /><span className="absolute left-16 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 z-[60]">Quit</span></button>
              </div>
          </div>
      )}

      {isAutoSaving && (
          <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur text-[10px] font-mono text-green-500 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2 animate-pulse">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              CAREER SAVED
          </div>
      )}

      <div className={`flex-1 flex flex-col h-screen overflow-hidden ${artist ? 'pl-20' : ''}`}>
        <main className="flex-1 overflow-auto relative bg-[#020617]">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
