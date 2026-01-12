
import React, { useState } from 'react';
import { Artist, GameState, Song, Album, ChartEntry } from '../types';
import { RELEASE_STRATEGIES, PRODUCTION_TIERS, THEMES, THEME_SEASON_MAPPING, INITIAL_REGIONS } from '../constants';
import { Mic2, Disc, Library, Music, Music2, Archive, CheckCircle, AlertCircle, ArrowLeft, Play, Upload, Save, Sparkles, Snowflake, Ghost, Flame, Gift, Camera, X, BarChart3, Globe, TrendingUp, LayoutTemplate, Share2, Download, Layers, DollarSign, Calendar, ListMusic, User, Youtube, Video, Crown, Activity, Users, Radio, Zap, Lock } from 'lucide-react';

interface StudioProps {
  artist: Artist;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

enum StudioView {
  MENU = 'MENU',
  CREATE_SONG = 'CREATE_SONG',
  CREATE_ALBUM = 'CREATE_ALBUM',
  DISCOGRAPHY = 'DISCOGRAPHY',
  REPACKAGE = 'REPACKAGE',
}

type ModalTab = 'OVERVIEW' | 'TRACKLIST' | 'SHARE';
type CollabType = 'NONE' | 'NPC' | 'CUSTOM';

const Studio: React.FC<StudioProps> = ({ artist, gameState, setGameState }) => {
  const [view, setView] = useState<StudioView>(StudioView.MENU);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [songTitle, setSongTitle] = useState('');
  const [productionTier, setProductionTier] = useState(PRODUCTION_TIERS[0]);
  const [releaseStrategy, setReleaseStrategy] = useState(RELEASE_STRATEGIES[0]);
  const [songCover, setSongCover] = useState<string | null>(null);
  const [songStep, setSongStep] = useState(0); 
  const [collabType, setCollabType] = useState<CollabType>('NONE');
  const [selectedNpcId, setSelectedNpcId] = useState<string>('');
  const [customCollabName, setCustomCollabName] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [repackageTarget, setRepackageTarget] = useState<Album | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<Song | Album | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>('OVERVIEW');
  const [payolaTarget, setPayolaTarget] = useState<Song | null>(null);

  const goBack = () => {
      setSongStep(0); setRepackageTarget(null); setSongCover(null); setAlbumCover(null);
      setCollabType('NONE'); setSelectedNpcId(''); setCustomCollabName('');
      setView(StudioView.MENU);
  }

  const handleConfirmPayola = (cost: number, streams: number) => {
      if (!payolaTarget) return;
      if (gameState.money < cost) {
          alert("Insufficient funds for this package.");
          return;
      }

      setGameState(prev => ({
          ...prev,
          money: prev.money - cost,
          songs: prev.songs.map(s => s.id === payolaTarget.id ? {
              ...s,
              pendingPayolaStreams: (s.pendingPayolaStreams || 0) + streams,
              isViral: true
          } : s)
      }));
      setPayolaTarget(null);
      alert("Contract signed. The streams will hit during next week's simulation.");
  };

  const renderReleaseModal = () => {
      if (!selectedRelease) return null;
      const isAlbum = 'tracks' in selectedRelease;

      return (
          <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedRelease(null)}>
              <div className="bg-[#111] border border-zinc-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-zinc-800 rounded-2xl overflow-hidden shadow-lg border border-white/5">
                              {selectedRelease.coverArt ? <img src={selectedRelease.coverArt} className="w-full h-full object-cover" /> : <Music className="m-auto mt-4 text-zinc-600" />}
                          </div>
                          <div>
                              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedRelease.title}</h2>
                              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{isAlbum ? 'Studio Album' : 'Single Release'}</p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedRelease(null)} className="text-zinc-500 hover:text-white"><X size={28} /></button>
                  </div>
                  <div className="flex border-b border-zinc-800">
                      <button onClick={() => setModalTab('OVERVIEW')} className={`flex-1 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-colors ${modalTab === 'OVERVIEW' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>Overview</button>
                      {isAlbum && <button onClick={() => setModalTab('TRACKLIST')} className={`flex-1 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-colors ${modalTab === 'TRACKLIST' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>Tracklist</button>}
                      <button onClick={() => setModalTab('SHARE')} className={`flex-1 py-4 font-bold text-xs uppercase tracking-[0.2em] transition-colors ${modalTab === 'SHARE' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>Stats</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
                      {modalTab === 'OVERVIEW' && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                  <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Streams</div>
                                  <div className="text-3xl font-black text-white">{new Intl.NumberFormat('en-US', { notation: 'compact' }).format('totalStreams' in selectedRelease ? selectedRelease.totalStreams : selectedRelease.streams)}</div>
                              </div>
                              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                  <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Quality Score</div>
                                  <div className="text-3xl font-black text-purple-400">{selectedRelease.quality}/100</div>
                              </div>
                              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                  <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Genre</div>
                                  <div className="text-3xl font-black text-blue-400">{selectedRelease.genre}</div>
                              </div>
                          </div>
                      )}
                      {modalTab === 'TRACKLIST' && isAlbum && (
                          <div className="space-y-2">
                              {(selectedRelease as Album).tracks.map((track, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                      <div className="flex items-center gap-4">
                                          <span className="text-zinc-600 font-mono">{idx + 1}</span>
                                          <span className="font-bold text-white uppercase">{track.title}</span>
                                      </div>
                                      <span className="text-xs text-zinc-500 font-mono">{new Intl.NumberFormat('en-US', { notation: 'compact' }).format(track.streams)} streams</span>
                                  </div>
                              ))}
                          </div>
                      )}
                      {modalTab === 'SHARE' && (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                              <BarChart3 size={64} className="text-zinc-800 mb-4" />
                              <p className="text-zinc-500 italic uppercase text-xs font-bold">Deep analytics processing for Year {gameState.date.year}...</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const PayolaModal = () => {
      if (!payolaTarget) return null;

      const PACKAGES = [
          { name: 'Local Radio', cost: 50000, streams: 2000000, desc: 'Heavy rotation on local stations.', color: 'border-zinc-700 bg-zinc-900', icon: Radio },
          { name: 'National Syndicate', cost: 250000, streams: 10000000, desc: 'Nationwide coverage on key networks.', color: 'border-blue-900 bg-blue-950/30', icon: Zap },
          { name: 'Heavy Rotation', cost: 1000000, streams: 45000000, desc: 'Aggressive worldwide saturation.', color: 'border-purple-900 bg-purple-950/30', icon: Globe },
          { name: 'The Industry Plant', cost: 5000000, streams: 250000000, desc: 'Manipulated algorithmic dominance.', color: 'border-red-600 bg-red-950/30', icon: Crown },
          { name: 'Algorithm Hijack', cost: 15000000, streams: 800000000, desc: 'Force-fed to every user globally.', color: 'border-emerald-600 bg-emerald-950/30', icon: Activity },
          { name: 'Global Monopoly', cost: 50000000, streams: 3000000000, desc: 'Shatter all world records overnight.', color: 'border-yellow-500 bg-yellow-950/30', icon: Flame },
      ];

      return (
          <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" onClick={() => setPayolaTarget(null)}>
              <div className="bg-[#0f0f0f] border border-red-900/50 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
                  <div className="bg-red-950/20 p-8 border-b border-red-900/30 flex justify-between items-start">
                      <div>
                          <div className="flex items-center gap-2 text-red-500 font-black tracking-widest text-xs uppercase mb-1"><Lock size={12}/> Shady Business</div>
                          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Buy Airplay</h2>
                          <p className="text-zinc-400 text-sm">Inject fake listeners into "{payolaTarget.title}".</p>
                      </div>
                      <button onClick={() => setPayolaTarget(null)} className="text-zinc-500 hover:text-white"><X size={28}/></button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                      {PACKAGES.map((pkg, idx) => (
                          <button key={idx} onClick={() => handleConfirmPayola(pkg.cost, pkg.streams)} className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all hover:scale-[1.03] text-left group relative overflow-hidden ${pkg.color} ${gameState.money < pkg.cost ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-white/40 shadow-lg'}`} disabled={gameState.money < pkg.cost}>
                              <div className="flex justify-between items-start">
                                  <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0 border border-white/10 text-white"><pkg.icon size={20}/></div>
                                  <div className="text-sm font-mono text-emerald-400 font-black">${new Intl.NumberFormat('en-US', { notation: 'compact' }).format(pkg.cost)}</div>
                              </div>
                              <div>
                                  <h3 className="font-black text-white uppercase text-sm tracking-tight">{pkg.name}</h3>
                                  <div className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{pkg.desc}</div>
                                  <div className="text-xs font-black text-red-500 mt-3 flex items-center gap-1">+{new Intl.NumberFormat('en-US', {notation: "compact"}).format(pkg.streams)} STREAMS</div>
                              </div>
                          </button>
                      ))}
                  </div>
                  <div className="p-4 bg-black/60 text-center text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">Transactions are non-refundable.</div>
              </div>
          </div>
      );
  };

  const handleCreateSong = (shouldRelease: boolean) => {
    const cost = productionTier.cost + (shouldRelease ? releaseStrategy.cost : 0) + (collabType === 'NPC' ? (gameState.npcArtists.find(n => n.id === selectedNpcId)?.popularityGlobal || 0) * 1000 : collabType === 'CUSTOM' ? 2000 : 0);
    if (gameState.money < cost) { alert("No money!"); return; }

    const newSong: Song = {
      id: Date.now().toString(),
      artistName: artist.name,
      title: songTitle + (selectedNpcId ? ` (feat. ${gameState.npcArtists.find(n => n.id === selectedNpcId)?.name})` : customCollabName ? ` (feat. ${customCollabName})` : ''),
      quality: Math.min(100, (Math.floor(Math.random() * (productionTier.qualityMax - productionTier.qualityMin + 1)) + productionTier.qualityMin) * (shouldRelease ? 1.1 : 1)),
      streams: 0, sales: 0, revenue: 0, isReleased: shouldRelease, genre: artist.genre, theme: selectedTheme.id, type: 'Single', artistId: 'player',
      releasePopularity: gameState.regions.reduce((acc, r) => ({ ...acc, [r.id]: r.popularity }), {}),
      coverArt: songCover || undefined, pendingPayolaStreams: 0
    };

    setGameState(prev => ({ ...prev, money: prev.money - cost, songs: [newSong, ...prev.songs], hype: prev.hype + (shouldRelease ? releaseStrategy.hypeBonus : 0) }));
    setSongTitle(''); setSongCover(null); setSongStep(0); setView(StudioView.DISCOGRAPHY);
  };

  const handleCreateAlbum = (shouldRelease: boolean) => {
    if (!albumTitle.trim() || selectedSongIds.length < 2) return;
    setGameState(prev => {
      const selectedSongs = prev.songs.filter(s => selectedSongIds.includes(s.id));
      const newAlbum: Album = { id: `alb_${Date.now()}`, artistName: artist.name, title: albumTitle, tracks: selectedSongs, type: selectedSongs.length >= 7 ? 'LP' : 'EP', isReleased: shouldRelease, totalStreams: 0, totalSales: 0, quality: Math.floor(selectedSongs.reduce((a,b)=>a+b.quality,0)/selectedSongs.length), artistId: 'player', coverArt: albumCover || undefined, weeklySales: 0, weeklySES: 0 };
      return { ...prev, albums: [newAlbum, ...prev.albums], hype: prev.hype + 50 };
    });
    setAlbumTitle(''); setSelectedSongIds([]); setAlbumCover(null); setView(StudioView.DISCOGRAPHY);
  };

  if (view === StudioView.MENU) {
    return (
      <div className="p-8 h-full bg-[#020617] flex flex-col">
        <h2 className="text-4xl font-black italic tracking-tighter mb-12 uppercase text-zinc-200">Studio Floor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <button onClick={() => setView(StudioView.CREATE_SONG)} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl hover:bg-zinc-800 transition-all text-left group shadow-2xl"><Mic2 size={48} className="mb-6 text-purple-500" /><h3 className="text-2xl font-black uppercase mb-2 text-white">Record Single</h3><p className="text-zinc-500 text-sm font-medium">Create a new track. Choose theme and tier.</p></button>
          <button onClick={() => setView(StudioView.CREATE_ALBUM)} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl hover:bg-zinc-800 transition-all text-left group shadow-2xl"><Disc size={48} className="mb-6 text-blue-500" /><h3 className="text-2xl font-black uppercase mb-2 text-white">Project Lab</h3><p className="text-zinc-500 text-sm font-medium">Bundle tracks into EPs or LPs.</p></button>
          <button onClick={() => setView(StudioView.DISCOGRAPHY)} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl hover:bg-zinc-800 transition-all text-left group shadow-2xl"><Library size={48} className="mb-6 text-emerald-500" /><h3 className="text-2xl font-black uppercase mb-2 text-white">Catalog</h3><p className="text-zinc-500 text-sm font-medium">Manage releases and buy airplay.</p></button>
        </div>
      </div>
    );
  }

  if (view === StudioView.CREATE_SONG) {
    if (songStep === 0) {
        return (
            <div className="p-8 h-full flex flex-col max-w-5xl mx-auto overflow-y-auto">
                <button onClick={goBack} className="flex items-center text-zinc-500 hover:text-white mb-8 gap-2 font-bold uppercase text-xs"><ArrowLeft size={16} /> Cancel Session</button>
                <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">Phase 1: Vision</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
                    {THEMES.map(theme => (
                        <div key={theme.id} onClick={() => setSelectedTheme(theme)} className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedTheme.id === theme.id ? 'bg-purple-900/30 border-purple-500 ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                            <h4 className="font-black uppercase text-white mb-2 text-sm">{theme.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-medium leading-tight">{theme.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-auto pt-8 border-t border-white/5 flex justify-end"><button onClick={() => setSongStep(1)} className="bg-white text-black px-10 py-4 rounded-full font-black uppercase italic tracking-tighter hover:scale-105 transition-transform flex items-center gap-2">Proceed <ArrowLeft className="rotate-180" size={20} /></button></div>
            </div>
        )
    }
    return (
      <div className="p-8 h-full flex flex-col max-w-4xl mx-auto overflow-y-auto pb-24">
        <button onClick={() => setSongStep(0)} className="flex items-center text-zinc-500 hover:text-white mb-8 gap-2 font-bold uppercase text-xs"><ArrowLeft size={16} /> Back to Themes</button>
        <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter italic">Phase 2: Recording</h2>
        <div className="space-y-10">
           <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-10">
             <div className="flex-1 space-y-6">
                <div><label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Track Title</label><input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} placeholder="ENTER TITLE..." className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-4 text-xl font-black text-white outline-none focus:border-purple-500 transition-colors" /></div>
                <div><label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Selected Direction</label><div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-zinc-400 font-bold flex justify-between items-center italic">{selectedTheme.name} <button onClick={() => setSongStep(0)} className="text-xs text-purple-400 hover:underline uppercase not-italic">Change</button></div></div>
             </div>
             <div className="w-full md:w-64 shrink-0">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Visual ID</label>
                <div className="relative group w-full aspect-square rounded-2xl overflow-hidden bg-zinc-950 border-2 border-dashed border-zinc-800 hover:border-purple-500 transition-all cursor-pointer">
                    {songCover ? <img src={songCover} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-zinc-600"><Camera size={32} className="mb-2" /><span className="text-[10px] font-black uppercase">Upload Art</span></div>}
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setSongCover(r.result as string); r.readAsDataURL(f); } }} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
             </div>
           </div>
           <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800"><h3 className="text-lg font-black uppercase mb-6">Production Quality</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{PRODUCTION_TIERS.map((tier) => (<button key={tier.id} onClick={() => setProductionTier(tier)} className={`p-5 rounded-2xl border text-left transition-all ${productionTier.id === tier.id ? 'bg-purple-900/30 border-purple-500 ring-2 ring-purple-500' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'}`}><div className="font-black uppercase text-sm mb-1">{tier.name}</div><div className="text-lg font-mono font-bold text-emerald-400 mb-2">${tier.cost.toLocaleString()}</div><div className="text-[10px] text-zinc-500 font-bold uppercase">Pot. Quality: {tier.qualityMin}-{tier.qualityMax}</div></button>))}</div></div>
           <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800"><h3 className="text-lg font-black uppercase mb-6">Release Strategy</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{RELEASE_STRATEGIES.map((strat) => (<button key={strat.id} onClick={() => setReleaseStrategy(strat)} className={`p-5 rounded-2xl border text-left transition-all flex justify-between items-center ${releaseStrategy.id === strat.id ? 'bg-blue-900/30 border-blue-500 ring-2 ring-blue-500' : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'}`}><div><div className="font-black uppercase text-sm mb-1">{strat.name}</div><div className="text-[10px] text-zinc-500 font-medium italic">{strat.description}</div></div><div className="text-right"><div className="text-sm font-mono text-zinc-300 font-bold">${strat.cost.toLocaleString()}</div><div className="text-[10px] text-emerald-400 font-black">+{strat.hypeBonus} HYPE</div></div></button>))}</div></div>
        </div>
        <div className="mt-12 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6"><div className="text-2xl font-black uppercase italic">Investment: <span className={productionTier.cost + (releaseStrategy.cost || 0) > gameState.money ? "text-red-500" : "text-emerald-400"}>${(productionTier.cost + (releaseStrategy.cost || 0)).toLocaleString()}</span></div><div className="flex gap-4"><button onClick={() => handleCreateSong(false)} className="bg-zinc-800 text-zinc-200 px-8 py-4 rounded-full font-black uppercase text-sm hover:bg-zinc-700 transition-all border border-zinc-700">The Vault</button><button onClick={() => handleCreateSong(true)} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase italic tracking-tighter hover:scale-105 transition-transform flex items-center gap-2">Release Now</button></div></div>
      </div>
    );
  }

  if (view === StudioView.DISCOGRAPHY) {
    return (
      <div className="p-8 h-full bg-[#020617] flex flex-col relative overflow-y-auto">
        {renderReleaseModal()}
        {payolaTarget && <PayolaModal />}
        <div className="flex items-center gap-4 mb-10"><button onClick={goBack} className="p-3 bg-zinc-900 rounded-2xl hover:bg-zinc-800 border border-zinc-800 transition-colors"><ArrowLeft size={24} /></button><h2 className="text-4xl font-black uppercase italic tracking-tighter">Your Catalog</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div><h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-zinc-400"><Disc size={20} /> Projects</h3><div className="space-y-4">{gameState.albums.length === 0 ? <div className="p-10 border border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600 font-bold italic">No projects released.</div> : gameState.albums.map(album => (<div key={album.id} onClick={() => setSelectedRelease(album)} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex gap-5 items-center group hover:bg-zinc-800/50 transition-colors cursor-pointer"><div className="w-20 h-20 bg-zinc-800 rounded-2xl shrink-0 overflow-hidden shadow-2xl">{album.coverArt ? <img src={album.coverArt} className="w-full h-full object-cover" /> : <Disc className="m-auto mt-6 text-zinc-700" size={32} />}</div><div className="flex-1 min-w-0"><h4 className="font-black text-xl text-white truncate uppercase italic">{album.title}</h4><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{album.type} • {album.tracks.length} Tracks</span></div><div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 font-mono text-emerald-400 text-sm font-bold">{new Intl.NumberFormat('en-US', { notation: 'compact' }).format(album.totalStreams)}</div></div>))}</div></div>
           <div><h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-zinc-400"><Music size={20} /> Singles</h3><div className="space-y-4">{gameState.songs.filter(s => s.type === 'Single').map(song => (<div key={song.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex justify-between items-center group relative hover:bg-zinc-800/50 transition-colors"><div className="flex items-center gap-5 min-w-0 cursor-pointer flex-1" onClick={() => setSelectedRelease(song)}><div className="w-16 h-16 bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl shrink-0">{song.coverArt && <img src={song.coverArt} className="w-full h-full object-cover" />}</div><div className="min-w-0"><h4 className="font-black text-lg text-white truncate uppercase italic">{song.title}</h4><div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{song.theme} • {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(song.streams)} streams</div>{song.pendingPayolaStreams ? <div className="text-[8px] font-black px-2 py-0.5 mt-1 rounded bg-red-900/40 text-red-500 border border-red-500/20 inline-block uppercase tracking-widest animate-pulse">Boosting...</div> : null}</div></div>{song.isReleased && !song.pendingPayolaStreams && (<button onClick={(e) => { e.stopPropagation(); setPayolaTarget(song); }} className="opacity-0 group-hover:opacity-100 transition-all bg-red-900/20 hover:bg-red-600 border border-red-900 hover:border-red-500 text-red-500 hover:text-white px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl"><Radio size={16} /> Payola</button>)}</div>))}</div></div>
        </div>
      </div>
    );
  }
  return null;
};

export default Studio;
