
import React, { useState, useEffect } from 'react';
import { GameState, YouTubeVideo, YouTubeVideoType, Song } from '../types';
import { calculateYouTubeWeek, checkVirality } from '../utils/youtubeLogic';
import { Play, Video, Plus, BarChart2, DollarSign, TrendingUp, Zap, Film, Music, CheckCircle, ArrowLeft, X, Youtube, Eye, ThumbsUp, MessageCircle } from 'lucide-react';

interface YouTubeManagerProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onClose: () => void;
}

const VIDEO_TYPES: { type: YouTubeVideoType; cost: number; desc: string }[] = [
    { type: "Official MV", cost: 5000, desc: "High production value. Best for longevity." },
    { type: "Lyric Video", cost: 500, desc: "Cheap, quick. Good for standard tracks." },
    { type: "Performance", cost: 2000, desc: "Live feel. Connects with fans." },
    { type: "Shorts", cost: 0, desc: "Viral potential. Short lifespan." },
];

const YouTubeManager: React.FC<YouTubeManagerProps> = ({ gameState, setGameState, onClose }) => {
  const [tab, setTab] = useState<'DASHBOARD' | 'UPLOAD'>('DASHBOARD');
  
  // UPLOAD STATE
  const [selectedSongId, setSelectedSongId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<YouTubeVideoType>('Official MV');
  const [title, setTitle] = useState('');
  const [productionBudget, setProductionBudget] = useState(1000); // Adds to quality
  const [conceptEffort, setConceptEffort] = useState(50); // 0-100 slider
  const [thumbnailEffort, setThumbnailEffort] = useState(50); // 0-100 slider

  // --- PASSIVE SIMULATION LOGIC ---
  useEffect(() => {
    // Determine Current Absolute Week
    const yearsElapsed = gameState.date.year - 2024;
    const currentAbsWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + (yearsElapsed * 48);
    const lastUpdate = gameState.youtubeLastUpdatedWeek || currentAbsWeek;
    
    // Only simulate if time has passed
    if (currentAbsWeek > lastUpdate) {
        const weeksToSimulate = currentAbsWeek - lastUpdate;
        console.log(`[YouTube] Simulating ${weeksToSimulate} weeks...`);

        const videos = gameState.youtubeVideos || [];
        let totalRevenue = 0;
        let totalNewHype = 0;

        const updatedVideos = videos.map(vid => {
            let tempVid = { ...vid };
            
            for (let i = 0; i < weeksToSimulate; i++) {
                const simWeek = lastUpdate + i + 1;
                
                // Get Global Pop (Avg of regions)
                const globalPop = gameState.regions.reduce((acc, r) => acc + r.popularity, 0) / gameState.regions.length;

                const result = calculateYouTubeWeek(tempVid, simWeek, globalPop, gameState.regions);
                
                tempVid.weeklyViews = result.views;
                tempVid.views += result.views;
                tempVid.revenue += result.revenue;
                
                // Engagement simulation
                tempVid.likes += Math.floor(result.views * 0.04);
                tempVid.comments += Math.floor(result.views * 0.002);

                if (tempVid.isViral && tempVid.viralWeeksLeft > 0) {
                    tempVid.viralWeeksLeft--;
                    if (tempVid.viralWeeksLeft <= 0) tempVid.isViral = false;
                }

                totalRevenue += result.revenue;
                // Views contribute to Hype (Small amount)
                totalNewHype += (result.views / 100000);
            }
            return tempVid;
        });

        // UPDATE GAME STATE
        setGameState(prev => ({
            ...prev,
            money: prev.money + totalRevenue,
            hype: prev.hype + totalNewHype,
            youtubeVideos: updatedVideos,
            youtubeLastUpdatedWeek: currentAbsWeek
        }));
    }
  }, []); // Run once on mount

  const handleUpload = () => {
      const typeInfo = VIDEO_TYPES.find(t => t.type === selectedType);
      const cost = (typeInfo?.cost || 0) + productionBudget;
      
      if (gameState.money < cost) {
          alert("Insufficient funds!");
          return;
      }
      if (!selectedSongId || !title) return;

      const yearsElapsed = gameState.date.year - 2024;
      const currentAbsWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + (yearsElapsed * 48);

      // Calculate Quality
      const prodQuality = Math.min(100, 40 + (productionBudget / 100)); // Budget impacts prod quality
      
      // Virality Check
      const isViral = checkVirality(thumbnailEffort, conceptEffort);
      
      const newVideo: YouTubeVideo = {
          id: `yt_${Date.now()}`,
          songId: selectedSongId,
          title: title,
          type: selectedType,
          productionQuality: Math.floor(prodQuality),
          conceptQuality: conceptEffort,
          thumbnailQuality: thumbnailEffort,
          uploadWeek: currentAbsWeek,
          isViral: isViral,
          viralWeeksLeft: isViral ? Math.floor(Math.random() * 4) + 2 : 0, // 2-5 weeks
          views: 0,
          weeklyViews: 0,
          likes: 0,
          comments: 0,
          revenue: 0,
          monetized: true, // Auto monetize for now
          thumbnailUrl: gameState.songs.find(s => s.id === selectedSongId)?.coverArt
      };

      setGameState(prev => ({
          ...prev,
          money: prev.money - cost,
          youtubeVideos: [newVideo, ...(prev.youtubeVideos || [])],
          // Boost popularity slightly on upload
          regions: prev.regions.map(r => ({ ...r, popularity: Math.min(100, r.popularity + 0.5) }))
      }));

      setTab('DASHBOARD');
      // Reset Form
      setTitle('');
      setProductionBudget(1000);
  };

  const videos = gameState.youtubeVideos || [];
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
  const totalRevenue = videos.reduce((acc, v) => acc + v.revenue, 0);
  const subscribers = Math.floor(totalViews / 45); // Approx sub count

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);

  return (
    <div className="h-full bg-[#0f0f0f] text-white flex flex-col font-sans">
        {/* HEADER */}
        <div className="h-16 bg-[#0f0f0f] border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full"><ArrowLeft size={20}/></button>
                <div className="flex items-center gap-1">
                    <Youtube className="text-red-600" size={28} />
                    <span className="font-bold text-xl tracking-tight">Studio</span>
                </div>
            </div>
            <div className="flex gap-4">
                 <button 
                    onClick={() => setTab('DASHBOARD')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === 'DASHBOARD' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
                 >
                     Dashboard
                 </button>
                 <button 
                    onClick={() => setTab('UPLOAD')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === 'UPLOAD' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                 >
                     <Plus size={16} /> Create
                 </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {tab === 'DASHBOARD' ? (
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* CHANNEL OVERVIEW */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-zinc-800">
                             <div className="text-zinc-400 text-sm font-bold mb-1">Subscribers</div>
                             <div className="text-3xl font-black">{formatNumber(subscribers)}</div>
                        </div>
                        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-zinc-800">
                             <div className="text-zinc-400 text-sm font-bold mb-1">Total Views</div>
                             <div className="text-3xl font-black">{formatNumber(totalViews)}</div>
                        </div>
                        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-zinc-800">
                             <div className="text-zinc-400 text-sm font-bold mb-1">Est. Revenue</div>
                             <div className="text-3xl font-black text-green-400">${formatNumber(totalRevenue)}</div>
                        </div>
                        <div className="bg-[#1f1f1f] p-6 rounded-xl border border-zinc-800">
                             <div className="text-zinc-400 text-sm font-bold mb-1">Content</div>
                             <div className="text-3xl font-black">{videos.length} <span className="text-sm font-normal text-zinc-500">videos</span></div>
                        </div>
                    </div>

                    {/* CONTENT LIST */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Channel Content</h3>
                        <div className="bg-[#1f1f1f] border border-zinc-800 rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-4 bg-zinc-900 border-b border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                <div>Video</div>
                                <div className="text-center">Type</div>
                                <div className="text-center">Views</div>
                                <div className="text-center">Engagement</div>
                                <div className="text-center">Status</div>
                            </div>
                            
                            {videos.length === 0 ? (
                                <div className="p-10 text-center text-zinc-500">
                                    <Video size={48} className="mx-auto mb-4 opacity-20" />
                                    No videos uploaded yet.
                                </div>
                            ) : (
                                videos.map(video => (
                                    <div key={video.id} className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] p-4 border-b border-zinc-800 items-center hover:bg-white/5 transition-colors">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-24 h-14 bg-zinc-800 rounded overflow-hidden shrink-0 relative">
                                                {video.thumbnailUrl ? <img src={video.thumbnailUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><Video size={20}/></div>}
                                                {video.isViral && video.viralWeeksLeft > 0 && <div className="absolute top-1 right-1 bg-red-600 text-white text-[8px] font-bold px-1 rounded flex items-center gap-0.5"><Zap size={8} fill="currentColor"/> VIRAL</div>}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate text-white">{video.title}</div>
                                                <div className="text-xs text-zinc-500 truncate">{video.type} • Uploaded W{2024 + Math.floor(video.uploadWeek/48)}</div>
                                            </div>
                                        </div>
                                        <div className="text-center text-xs font-bold text-zinc-400">{video.type === 'Shorts' ? '⚡ Shorts' : 'Video'}</div>
                                        <div className="text-center">
                                            <div className="text-sm font-bold">{formatNumber(video.views)}</div>
                                            {video.weeklyViews > 0 && <div className="text-[10px] text-green-500">+{formatNumber(video.weeklyViews)}/wk</div>}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs text-zinc-300 flex items-center justify-center gap-1"><ThumbsUp size={10}/> {formatNumber(video.likes)}</div>
                                            <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1"><MessageCircle size={10}/> {formatNumber(video.comments)}</div>
                                        </div>
                                        <div className="text-center flex justify-center">
                                            {video.monetized ? (
                                                <span className="text-green-500"><DollarSign size={16} /></span>
                                            ) : <span className="text-zinc-600"><DollarSign size={16} /></span>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* UPLOAD FORM */
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
                    
                    <div className="bg-[#1f1f1f] p-6 rounded-xl border border-zinc-800 space-y-6">
                        {/* Song Selection */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Select Song</label>
                            <select 
                                value={selectedSongId} 
                                onChange={(e) => {
                                    setSelectedSongId(e.target.value);
                                    const s = gameState.songs.find(x => x.id === e.target.value);
                                    if(s) setTitle(`${s.title} (${selectedType})`);
                                }} 
                                className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-4 py-3 text-white"
                            >
                                <option value="">-- Choose Song --</option>
                                {gameState.songs.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Content Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {VIDEO_TYPES.map(vt => (
                                    <button
                                        key={vt.type}
                                        onClick={() => { setSelectedType(vt.type); if(selectedSongId) setTitle(gameState.songs.find(s=>s.id===selectedSongId)?.title + ` (${vt.type})`); }}
                                        className={`p-3 rounded-lg border text-left transition-all ${selectedType === vt.type ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500' : 'bg-[#121212] border-zinc-800 hover:bg-zinc-800'}`}
                                    >
                                        <div className="font-bold text-sm">{vt.type}</div>
                                        <div className="text-xs text-zinc-500">{vt.desc}</div>
                                        <div className="text-xs text-zinc-300 font-mono mt-1">${vt.cost} Base</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Video Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#121212] border border-zinc-700 rounded-lg px-4 py-3 text-white" />
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-sm font-bold text-zinc-400">Production Budget</label>
                                     <span className="text-sm font-mono text-green-400">${productionBudget}</span>
                                 </div>
                                 <input type="range" min="0" max="50000" step="500" value={productionBudget} onChange={e => setProductionBudget(parseInt(e.target.value))} className="w-full accent-red-600" />
                                 <div className="text-xs text-zinc-500">Increases base quality multiplier.</div>
                             </div>

                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-sm font-bold text-zinc-400">Concept / Idea</label>
                                     <span className="text-sm font-mono text-white">{conceptEffort}/100</span>
                                 </div>
                                 <input type="range" min="0" max="100" value={conceptEffort} onChange={e => setConceptEffort(parseInt(e.target.value))} className="w-full accent-blue-500" />
                                 <div className="text-xs text-zinc-500">Higher effort increases viral chance.</div>
                             </div>

                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-sm font-bold text-zinc-400">Thumbnail & Clickbait</label>
                                     <span className="text-sm font-mono text-white">{thumbnailEffort}/100</span>
                                 </div>
                                 <input type="range" min="0" max="100" value={thumbnailEffort} onChange={e => setThumbnailEffort(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                                 <div className="text-xs text-zinc-500">Higher effort increases viral chance but risks backlash.</div>
                             </div>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end pt-4">
                            <button 
                                onClick={handleUpload}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                Upload Video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default YouTubeManager;
