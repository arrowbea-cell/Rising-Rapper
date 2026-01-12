
import React, { useState, useEffect } from 'react';
import { GameState, YouTubeVideo, YouTubeVideoType, Artist } from '../types';
import { calculateYouTubeWeek, checkVirality } from '../utils/youtubeLogic';
import { Play, Video, Plus, Search, Bell, Menu, MoreVertical, ThumbsUp, ThumbsDown, MessageCircle, Share2, CheckCircle, Clock, X, Upload, Zap, DollarSign, Flame, Camera, Image as ImageIcon, Download, List, Maximize2, Volume2, Settings, MoreHorizontal, Mic, Scissors, Flag, AlignLeft, Music } from 'lucide-react';

interface YouTubeChannelProps {
  artist: Artist;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const VIDEO_TYPES: { type: YouTubeVideoType; cost: number; desc: string }[] = [
    { type: "Official MV", cost: 5000, desc: "High production value. Best for longevity." },
    { type: "Performance", cost: 2000, desc: "Live session feel. Connects with fans." },
    { type: "Shorts", cost: 0, desc: "Vertical video. High viral potential." },
    // Lyric Video is excluded from manual upload because it's auto-generated
];

const YouTubeChannel: React.FC<YouTubeChannelProps> = ({ artist, gameState, setGameState }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'VIDEOS' | 'SHORTS' | 'RELEASES'>('HOME');
  const [filter, setFilter] = useState<'LATEST' | 'POPULAR' | 'OLDEST'>('LATEST');
  
  // UPLOAD MODAL STATE
  const [showUpload, setShowUpload] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<YouTubeVideoType>('Official MV');
  const [title, setTitle] = useState('');
  const [customThumbnail, setCustomThumbnail] = useState<string | null>(null); 
  const [productionBudget, setProductionBudget] = useState(1000);
  const [conceptEffort, setConceptEffort] = useState(50);
  const [thumbnailEffort, setThumbnailEffort] = useState(50);

  // WATCH PAGE STATE
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // --- 1. AUTO-GENERATE & SIMULATION LOGIC ---
  useEffect(() => {
    // Determine Current Absolute Week
    const yearsElapsed = gameState.date.year - 2024;
    const currentAbsWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + (yearsElapsed * 48);
    const lastUpdate = gameState.youtubeLastUpdatedWeek || currentAbsWeek;
    
    // A. SYNC SONGS TO YOUTUBE (Auto-Generate Lyrics Video)
    const existingVideos = gameState.youtubeVideos || [];
    const existingSongIds = new Set(existingVideos.filter(v => v.type === 'Lyric Video').map(v => v.songId));
    
    const newAutoVideos: YouTubeVideo[] = [];
    
    gameState.songs.forEach(song => {
        if (song.isReleased && !existingSongIds.has(song.id)) {
            const initialViews = Math.floor(song.streams * 0.01) + 100;
            
            newAutoVideos.push({
                id: `yt_auto_${song.id}`,
                songId: song.id,
                title: `${song.title} (Official Audio)`,
                type: 'Lyric Video', 
                productionQuality: song.quality, 
                conceptQuality: 50,
                thumbnailQuality: 60,
                uploadWeek: song.releaseWeek || currentAbsWeek,
                isViral: false,
                viralWeeksLeft: 0,
                views: initialViews,
                weeklyViews: 0,
                likes: Math.floor(initialViews * 0.03),
                comments: Math.floor(initialViews * 0.001),
                revenue: (initialViews / 1000) * 0.5, 
                monetized: true,
                thumbnailUrl: song.coverArt
            });
        }
    });

    // Combine existing + new
    let allVideos = [...newAutoVideos, ...existingVideos];

    // B. PASSIVE SIMULATION (If time passed)
    let totalRevenue = 0;
    let totalNewHype = 0;

    if (currentAbsWeek > lastUpdate) {
        const weeksToSimulate = currentAbsWeek - lastUpdate;
        
        allVideos = allVideos.map(vid => {
            let tempVid = { ...vid };
            
            for (let i = 0; i < weeksToSimulate; i++) {
                const simWeek = lastUpdate + i + 1;
                const globalPop = gameState.regions.reduce((acc, r) => acc + r.popularity, 0) / gameState.regions.length;
                const result = calculateYouTubeWeek(tempVid, simWeek, globalPop, gameState.regions);
                
                tempVid.weeklyViews = result.views;
                tempVid.views += result.views;
                tempVid.revenue += result.revenue;
                tempVid.likes += Math.floor(result.views * 0.04 * (0.8 + Math.random() * 0.4));
                tempVid.comments += Math.floor(result.views * 0.002 * (0.8 + Math.random() * 0.4));

                if (tempVid.isViral && tempVid.viralWeeksLeft > 0) {
                    tempVid.viralWeeksLeft--;
                    if (tempVid.viralWeeksLeft <= 0) tempVid.isViral = false;
                }

                totalRevenue += result.revenue;
                totalNewHype += (result.views / 2000000); 
            }
            return tempVid;
        });
    }

    // UPDATE STATE ONCE
    if (newAutoVideos.length > 0 || currentAbsWeek > lastUpdate) {
        setGameState(prev => ({
            ...prev,
            money: prev.money + totalRevenue,
            hype: prev.hype + totalNewHype,
            youtubeVideos: allVideos,
            youtubeLastUpdatedWeek: currentAbsWeek
        }));
    }
    
  }, []); 

  // --- HANDLERS ---
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

      const prodQuality = Math.min(100, 40 + (productionBudget / 100)); 
      const isViral = checkVirality(thumbnailEffort, conceptEffort);
      
      const songData = gameState.songs.find(s => s.id === selectedSongId);
      const finalThumbnail = customThumbnail || songData?.coverArt;

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
          viralWeeksLeft: isViral ? Math.floor(Math.random() * 4) + 2 : 0, 
          views: 0,
          weeklyViews: 0,
          likes: 0,
          comments: 0,
          revenue: 0,
          monetized: true,
          thumbnailUrl: finalThumbnail
      };

      setGameState(prev => ({
          ...prev,
          money: prev.money - cost,
          youtubeVideos: [newVideo, ...(prev.youtubeVideos || [])],
          regions: prev.regions.map(r => ({ ...r, popularity: Math.min(100, r.popularity + 0.5) }))
      }));

      setShowUpload(false);
      setTitle('');
      setCustomThumbnail(null);
      setProductionBudget(1000);
  };

  const closeModal = () => {
      setShowUpload(false);
      setCustomThumbnail(null);
  }

  // --- DATA PREP ---
  const videos = gameState.youtubeVideos || [];
  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);
  const subscriberCount = Math.floor(totalViews / 45); 

  const getSortedVideos = () => {
      let vids = [...videos];
      
      if (activeTab === 'SHORTS') vids = vids.filter(v => v.type === 'Shorts');
      else if (activeTab === 'RELEASES') vids = vids.filter(v => v.type === 'Lyric Video');
      else if (activeTab === 'VIDEOS') vids = vids.filter(v => v.type !== 'Shorts' && v.type !== 'Lyric Video');
      
      if (filter === 'LATEST') return vids.sort((a, b) => b.uploadWeek - a.uploadWeek);
      if (filter === 'POPULAR') return vids.sort((a, b) => b.views - a.views);
      if (filter === 'OLDEST') return vids.sort((a, b) => a.uploadWeek - b.uploadWeek);
      
      return vids;
  };

  const displayVideos = getSortedVideos();

  // Helper
  const formatCompact = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
  const formatFull = (num: number) => new Intl.NumberFormat('en-US').format(num);
  
  const formatTimeAgo = (uploadWeek: number) => {
      const yearsElapsed = gameState.date.year - 2024;
      const currentAbsWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + (yearsElapsed * 48);
      const diff = currentAbsWeek - uploadWeek;
      
      if (diff === 0) return "New release";
      if (diff < 4) return `${diff} weeks ago`;
      if (diff < 48) return `${Math.floor(diff/4)} months ago`;
      return `${Math.floor(diff/48)} years ago`;
  };

  // --- FAKE COMMENT GENERATOR ---
  const getFakeComments = (video: YouTubeVideo) => {
      const comments = [
          "This is fire! 🔥🔥🔥",
          `Can't believe this only has ${formatCompact(video.views)} views. Underrated!`,
          "Come to Brazil please! 🇧🇷",
          "The production on this is insane.",
          "Who else is watching this in 2025?",
          "Literal chills.",
          "Bro cooked.",
          "First!",
          "Lyrics: ... wait wrong video.",
          "This goes hard."
      ];
      const seed = video.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return comments.slice(seed % 5, (seed % 5) + 3);
  };

  // --- RENDER WATCH PAGE ---
  if (selectedVideo) {
      const isShort = selectedVideo.type === 'Shorts';
      const comments = getFakeComments(selectedVideo);
      const relatedVideos = videos.filter(v => v.id !== selectedVideo.id && v.type !== 'Shorts').slice(0, 10);

      // --- SHORTS PLAYER (VERTICAL) ---
      if (isShort) {
          return (
              <div className="fixed inset-0 z-[100] bg-black flex justify-center items-center animate-in fade-in duration-200">
                  <button onClick={() => setSelectedVideo(null)} className="absolute top-6 right-6 z-50 p-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white transition-colors">
                      <X size={24}/>
                  </button>

                  {/* Vertical Container matching mobile aspect ratio */}
                  <div className="w-full h-full md:max-w-[420px] md:h-[90vh] md:max-h-[850px] relative bg-[#121212] md:rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center">
                      
                      {/* Video Area */}
                      <div className="absolute inset-0 z-0">
                          {selectedVideo.thumbnailUrl ? (
                              <img src={selectedVideo.thumbnailUrl} className="w-full h-full object-cover opacity-80" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                  <Zap size={64} className="text-zinc-600"/>
                              </div>
                          )}
                          {/* Dark Gradients for Text Readability */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
                      </div>

                      {/* Header (Top Overlay) - SIMPLIFIED */}
                      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 text-white/90">
                          <span className="font-bold drop-shadow-md">Shorts</span>
                      </div>

                      {/* Right Action Bar (Vertical) */}
                      <div className="absolute bottom-4 right-2 z-20 flex flex-col items-center gap-6 pb-4">
                          <div className="flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="bg-zinc-800/40 p-3 rounded-full hover:bg-zinc-700/60 backdrop-blur-sm transition-colors">
                                  <ThumbsUp size={28} fill="currentColor" className="text-white"/>
                              </div>
                              <span className="text-xs font-bold text-white drop-shadow-md">{formatCompact(selectedVideo.likes)}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="bg-zinc-800/40 p-3 rounded-full hover:bg-zinc-700/60 backdrop-blur-sm transition-colors">
                                  <ThumbsDown size={28} className="text-white"/>
                              </div>
                              <span className="text-xs font-bold text-white drop-shadow-md">Dislike</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="bg-zinc-800/40 p-3 rounded-full hover:bg-zinc-700/60 backdrop-blur-sm transition-colors">
                                  <MessageCircle size={28} className="text-white"/>
                              </div>
                              <span className="text-xs font-bold text-white drop-shadow-md">{formatCompact(selectedVideo.comments)}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="bg-zinc-800/40 p-3 rounded-full hover:bg-zinc-700/60 backdrop-blur-sm transition-colors">
                                  <Share2 size={28} className="text-white"/>
                              </div>
                              <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
                          </div>
                          {/* UPDATED: Spinning Vinyl (Rounded Full) */}
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white/50 overflow-hidden mt-4 cursor-pointer">
                              {artist.image && <img src={artist.image} className="w-full h-full object-cover animate-[spin_4s_linear_infinite]"/>}
                          </div>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-4 pb-8 pr-16 z-10 text-white">
                          <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white overflow-hidden">
                                  {artist.image && <img src={artist.image} className="w-full h-full object-cover"/>}
                              </div>
                              <span className="font-bold text-sm shadow-black drop-shadow-md">@{artist.name.replace(/\s/g,'')}</span>
                              <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors">Subscribe</button>
                          </div>
                          <p className="text-sm line-clamp-2 mb-2 font-medium drop-shadow-md">{selectedVideo.title}</p>
                          <div className="flex items-center gap-2 text-xs text-white/90 overflow-hidden">
                              <Music size={14}/>
                              <div className="truncate drop-shadow-md">{artist.name} - Original Audio</div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      // --- STANDARD WATCH PAGE (LANDSCAPE) ---
      return (
          <div className="fixed inset-0 z-[60] bg-[#0f0f0f] text-white flex flex-col overflow-y-auto animate-in fade-in duration-200">
              {/* HEADER */}
              <div className="h-14 bg-[#0f0f0f] flex items-center justify-between px-4 sticky top-0 z-50 border-b border-zinc-800/50">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedVideo(null)} className="p-2 hover:bg-zinc-800 rounded-full"><Menu size={24} /></button>
                      <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedVideo(null)}>
                        <div className="bg-red-600 text-white p-1 rounded-lg">
                            <Play fill="currentColor" size={16} />
                        </div>
                        <span className="font-bold text-lg tracking-tighter hidden md:block">YouTube</span>
                    </div>
                  </div>
                  <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                       <div className="flex w-full">
                           <div className="flex flex-1 items-center bg-[#121212] border border-zinc-700 rounded-l-full px-4 py-2 shadow-inner focus-within:border-blue-500 ml-8">
                               <input type="text" placeholder="Search" className="bg-transparent w-full outline-none text-zinc-300 placeholder-zinc-500" />
                           </div>
                           <button className="bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-full px-5 hover:bg-zinc-700 transition-colors flex items-center justify-center">
                               <Search size={20} className="text-zinc-400" />
                           </button>
                           <button className="ml-4 bg-[#181818] p-2.5 rounded-full hover:bg-[#303030] transition-colors">
                               <Mic size={20} />
                           </button>
                       </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <button className="hover:bg-zinc-800 p-2 rounded-full"><Video size={24} /></button>
                      <button className="hover:bg-zinc-800 p-2 rounded-full"><Bell size={24} /></button>
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer">
                          {artist.name[0]}
                      </div>
                  </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col lg:flex-row max-w-[1700px] mx-auto w-full p-4 md:p-6 gap-6">
                  {/* Primary Column */}
                  <div className="flex-1 min-w-0">
                      {/* Video Player */}
                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group shadow-2xl mb-4 border border-zinc-900">
                          {selectedVideo.thumbnailUrl ? <img src={selectedVideo.thumbnailUrl} className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700"><Video size={64}/></div>}
                          <div className="absolute inset-0 flex items-center justify-center">
                              <Play size={64} fill="white" className="drop-shadow-lg opacity-80 group-hover:scale-110 transition-transform duration-300 cursor-pointer"/>
                          </div>
                          {/* Fake Progress Bar */}
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-700/50 cursor-pointer group-hover:h-1.5 transition-all">
                               <div className="h-full bg-red-600 w-1/3 relative">
                                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform"/>
                               </div>
                          </div>
                          <div className="absolute bottom-2 left-0 w-full px-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity pb-2">
                              <div className="flex gap-4 items-center">
                                  <Play fill="white" size={20} />
                                  <Volume2 size={20} />
                                  <span className="text-xs font-medium">1:24 / 3:42</span>
                              </div>
                              <div className="flex gap-4 items-center">
                                  <Settings size={20} />
                                  <Maximize2 size={20} />
                              </div>
                          </div>
                      </div>

                      <h1 className="text-xl md:text-2xl font-bold line-clamp-2 mb-2">{selectedVideo.title}</h1>

                      {/* Info Row */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
                           <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden cursor-pointer">
                                     {artist.image ? <img src={artist.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{artist.name[0]}</div>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-bold text-sm flex items-center gap-1 cursor-pointer hover:text-zinc-300 transition-colors">
                                        {artist.name} <CheckCircle size={12} className="text-zinc-400 fill-zinc-800"/>
                                    </div>
                                    <div className="text-xs text-zinc-400">{formatCompact(subscriberCount)} subscribers</div>
                                </div>
                                <button className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">Subscribe</button>
                           </div>

                           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                <div className="flex items-center bg-[#272727] rounded-full h-9 overflow-hidden">
                                    <button className="flex items-center gap-2 px-4 hover:bg-[#3f3f3f] h-full border-r border-[#3f3f3f] transition-colors relative group">
                                        <ThumbsUp size={18} className="group-hover:scale-110 transition-transform"/> 
                                        <span className="text-sm font-bold">{formatCompact(selectedVideo.likes)}</span>
                                    </button>
                                    <button className="px-4 hover:bg-[#3f3f3f] h-full transition-colors group">
                                        <ThumbsDown size={18} className="group-hover:scale-110 transition-transform"/>
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-4 bg-[#272727] hover:bg-[#3f3f3f] rounded-full h-9 font-bold text-sm transition-colors whitespace-nowrap">
                                    <Share2 size={18} /> Share
                                </button>
                                <button className="flex items-center gap-2 px-4 bg-[#272727] hover:bg-[#3f3f3f] rounded-full h-9 font-bold text-sm transition-colors whitespace-nowrap">
                                    <Scissors size={18} /> Clip
                                </button>
                           </div>
                      </div>

                      {/* Description Box */}
                      <div className="bg-[#272727] p-3 rounded-xl hover:bg-[#3f3f3f] transition-colors cursor-pointer mb-6 text-sm group">
                           <div className="font-bold text-white mb-1 flex gap-2">
                               <span>{formatFull(selectedVideo.views)} views</span>
                               <span>{formatTimeAgo(selectedVideo.uploadWeek)}</span>
                               {selectedVideo.isViral && <span className="text-[#3ea6ff]">#trending</span>}
                           </div>
                           <div className="text-white whitespace-pre-wrap leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                               {selectedVideo.title} - Official Video by {artist.name}.<br/>
                               Stream {artist.name} on all platforms.<br/><br/>
                               Directed by: Rapper Rise Engine<br/>
                               Produced by: Studio AI<br/>
                               <span className="text-[#3ea6ff] cursor-pointer hover:underline">#{artist.genre.replace(/\s/g,'')}</span> <span className="text-[#3ea6ff] cursor-pointer hover:underline">#NewMusic</span> <span className="text-[#3ea6ff] cursor-pointer hover:underline">#2024</span>
                           </div>
                           <button className="font-bold mt-1 text-white text-xs hover:text-zinc-300">...more</button>
                      </div>

                      {/* Comments Section */}
                      <div>
                          <div className="flex items-center gap-8 mb-6">
                              <h3 className="text-xl font-bold">{formatFull(selectedVideo.comments)} Comments</h3>
                              <div className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:text-zinc-300">
                                  <AlignLeft size={20}/> Sort by
                              </div>
                          </div>
                          
                          {/* Add Comment */}
                          <div className="flex gap-4 mb-8">
                               <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold shrink-0 text-white">
                                    {artist.name[0]}
                                </div>
                                <div className="flex-1">
                                    <input type="text" placeholder="Add a comment..." className="w-full bg-transparent border-b border-zinc-700 focus:border-white outline-none py-1 text-sm text-white mb-2 transition-colors placeholder-zinc-500" />
                                    <div className="flex justify-end gap-2">
                                        <button className="text-sm font-bold px-4 py-2 hover:bg-[#272727] rounded-full text-zinc-300">Cancel</button>
                                        <button className="text-sm font-bold px-4 py-2 bg-[#3ea6ff] text-black rounded-full hover:bg-[#65b8ff] transition-colors">Comment</button>
                                    </div>
                                </div>
                          </div>

                          {/* Comment List */}
                          <div className="space-y-6">
                              {comments.map((c, i) => (
                                  <div key={i} className="flex gap-4 group">
                                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 shrink-0`}></div>
                                      <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-bold text-white cursor-pointer hover:underline">@user_{Math.floor(Math.random()*9999)}</span>
                                              <span className="text-xs text-zinc-400 hover:text-zinc-300 cursor-pointer">2 days ago</span>
                                          </div>
                                          <p className="text-sm text-white mb-2 leading-snug">{c}</p>
                                          <div className="flex items-center gap-4 text-xs text-zinc-400 font-bold">
                                              <div className="flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800 p-1.5 -ml-1.5 rounded-full transition-colors"><ThumbsUp size={14}/> {Math.floor(Math.random()*500)}</div>
                                              <div className="cursor-pointer hover:bg-zinc-800 p-1.5 rounded-full transition-colors"><ThumbsDown size={14}/></div>
                                              <span className="cursor-pointer hover:bg-zinc-800 px-3 py-1.5 rounded-full transition-colors">Reply</span>
                                          </div>
                                      </div>
                                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-800 rounded-full transition-all self-start">
                                          <MoreVertical size={16} className="text-zinc-300" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  {/* Sidebar (Up Next) */}
                  <div className="w-full lg:w-[400px] shrink-0 space-y-4">
                       {/* Filter Chips */}
                       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                           {['All', 'From ' + artist.name, 'Related', 'Recently Uploaded'].map((tag, i) => (
                               <button key={i} className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-white text-black' : 'bg-[#272727] hover:bg-[#3f3f3f] text-white'}`}>
                                   {tag}
                               </button>
                           ))}
                       </div>

                       {relatedVideos.map(vid => (
                           <div key={vid.id} onClick={() => setSelectedVideo(vid)} className="flex gap-2 cursor-pointer group">
                               <div className="w-40 aspect-video bg-zinc-800 rounded-lg overflow-hidden relative shrink-0">
                                   {vid.thumbnailUrl ? <img src={vid.thumbnailUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Video size={20} className="text-zinc-600"/></div>}
                                   <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1 rounded">3:42</div>
                               </div>
                               <div className="min-w-0 pr-4">
                                   <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug mb-1 group-hover:text-zinc-200">{vid.title}</h4>
                                   <div className="text-xs text-zinc-400 hover:text-white transition-colors">{artist.name}</div>
                                   <div className="text-xs text-zinc-400">{formatCompact(vid.views)} views • {formatTimeAgo(vid.uploadWeek)}</div>
                               </div>
                               <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded-full self-start ml-auto">
                                   <MoreVertical size={16} className="text-zinc-300" />
                               </button>
                           </div>
                       ))}
                  </div>
              </div>
          </div>
      )
  }

  // --- RENDER HELPERS (CHANNEL VIEW) ---
  const renderVideoCard = (vid: YouTubeVideo, isShort: boolean = false) => (
      <div key={vid.id} onClick={() => setSelectedVideo(vid)} className={`group cursor-pointer flex-shrink-0 ${isShort ? 'w-40' : 'w-full'}`}>
          {/* Thumbnail */}
          <div className={`relative bg-zinc-800 rounded-xl overflow-hidden mb-3 ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}>
              {vid.thumbnailUrl ? (
                  <img src={vid.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Video size={32} />
                  </div>
              )}
              
              {/* Duration Badge / Tag */}
              {!isShort && (
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-bold px-1 rounded">
                      {vid.type === 'Lyric Video' ? 'AUDIO' : '3:42'}
                  </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>

          {/* Info */}
          <div className="flex gap-3 items-start">
              {!isShort && activeTab !== 'HOME' && (
                  <div className="w-9 h-9 rounded-full bg-zinc-700 shrink-0 overflow-hidden">
                      {artist.image && <img src={artist.image} className="w-full h-full object-cover" />}
                  </div>
              )}
              <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-white/90">
                      {vid.title}
                  </h3>
                  {!isShort && (
                      <div className="text-zinc-400 text-xs mt-1 hover:text-white flex items-center gap-1">
                          {artist.name} <CheckCircle size={10} className="fill-zinc-400 text-black" />
                      </div>
                  )}
                  <div className="text-zinc-400 text-xs mt-0.5">
                      {formatCompact(vid.views)} views • {formatTimeAgo(vid.uploadWeek)}
                  </div>
              </div>
              {!isShort && (
                  <button className="text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                  </button>
              )}
          </div>
      </div>
  );

  return (
    <div className="h-full bg-[#0f0f0f] text-white flex flex-col font-sans overflow-hidden relative">
        
        {/* UPLOAD MODAL */}
        {showUpload && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={closeModal}>
                <div className="bg-[#282828] w-full max-w-3xl rounded-xl shadow-2xl border border-zinc-700 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                        <h2 className="text-xl font-bold">Upload video</h2>
                        <button onClick={closeModal}><X className="text-zinc-400 hover:text-white" /></button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto space-y-6">
                        
                        {/* TOP ROW: SONG & TYPE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 1. Select Song */}
                            <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Select Song</label>
                                <select 
                                    value={selectedSongId} 
                                    onChange={(e) => {
                                        setSelectedSongId(e.target.value);
                                        const s = gameState.songs.find(x => x.id === e.target.value);
                                        if(s) setTitle(`${s.title} (${selectedType})`);
                                    }} 
                                    className="w-full bg-[#121212] border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="">-- Choose from Discography --</option>
                                    {gameState.songs.filter(s => s.isReleased).map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 2. Title */}
                            <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Title</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    className="w-full bg-[#121212] border border-zinc-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* MIDDLE ROW: THUMBNAIL & TYPE SELECTOR */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
                             {/* 3. Thumbnail Upload */}
                             <div>
                                 <label className="block text-sm font-bold text-zinc-300 mb-2">Thumbnail</label>
                                 <div className={`relative group w-full ${selectedType === 'Shorts' ? 'aspect-[9/16] max-w-[200px]' : 'aspect-video'} bg-[#121212] border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden hover:border-zinc-500 transition-all cursor-pointer`}>
                                     {customThumbnail ? (
                                         <img src={customThumbnail} className="w-full h-full object-cover" />
                                     ) : selectedSongId ? (
                                         // Show song cover as placeholder if no custom thumb
                                         <div className="w-full h-full relative">
                                             <img src={gameState.songs.find(s => s.id === selectedSongId)?.coverArt} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                                             <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                 <span className="text-xs font-bold text-white flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-full border border-white/20 backdrop-blur-sm"><Camera size={14}/> Upload Custom</span>
                                             </div>
                                         </div>
                                     ) : (
                                         <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                             <ImageIcon size={32} className="mb-2 opacity-50"/>
                                             <span className="text-xs">Select a song or upload image</span>
                                         </div>
                                     )}
                                     <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                     <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                 </div>
                             </div>

                             {/* 4. Video Type Vertical List */}
                             <div>
                                <label className="block text-sm font-bold text-zinc-300 mb-2">Video Format</label>
                                <div className="space-y-2">
                                    {VIDEO_TYPES.map(vt => (
                                        <button
                                            key={vt.type}
                                            onClick={() => { setSelectedType(vt.type); if(selectedSongId) setTitle(gameState.songs.find(s=>s.id===selectedSongId)?.title + ` (${vt.type})`); }}
                                            className={`w-full p-3 rounded-lg border text-left transition-all text-xs ${selectedType === vt.type ? 'bg-red-900/20 border-red-500 ring-1 ring-red-500' : 'bg-[#121212] border-zinc-700 hover:bg-zinc-700'}`}
                                        >
                                            <div className="font-bold text-white">{vt.type}</div>
                                            <div className="text-[10px] text-zinc-400 mt-0.5">{vt.desc}</div>
                                            <div className="text-[10px] text-green-400 font-mono mt-1">${vt.cost}</div>
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* 5. Sliders */}
                        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-zinc-700 space-y-4">
                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-xs font-bold text-zinc-400 uppercase">Production Budget</label>
                                     <span className="text-xs font-mono text-green-400">${productionBudget}</span>
                                 </div>
                                 <input type="range" min="0" max="50000" step="500" value={productionBudget} onChange={e => setProductionBudget(parseInt(e.target.value))} className="w-full accent-red-600" />
                             </div>
                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-xs font-bold text-zinc-400 uppercase">Concept Effort</label>
                                     <span className="text-xs font-mono text-white">{conceptEffort}/100</span>
                                 </div>
                                 <input type="range" min="0" max="100" value={conceptEffort} onChange={e => setConceptEffort(parseInt(e.target.value))} className="w-full accent-blue-500" />
                             </div>
                             <div>
                                 <div className="flex justify-between mb-1">
                                     <label className="text-xs font-bold text-zinc-400 uppercase">Clickbait Level</label>
                                     <span className="text-xs font-mono text-white">{thumbnailEffort}/100</span>
                                 </div>
                                 <input type="range" min="0" max="100" value={thumbnailEffort} onChange={e => setThumbnailEffort(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                             </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-700 flex justify-end gap-3">
                        <button onClick={closeModal} className="px-4 py-2 font-bold text-zinc-300 hover:text-white">Cancel</button>
                        <button 
                            onClick={handleUpload} 
                            disabled={!selectedSongId || !title}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            UPLOAD
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* YOUTUBE TOP NAVBAR */}
        <div className="h-14 bg-[#0f0f0f] flex items-center justify-between px-6 shrink-0 sticky top-0 z-50 border-b border-zinc-800">
            <div className="flex items-center gap-4">
                <Menu size={24} className="text-white cursor-pointer" />
                <div className="flex items-center gap-1 cursor-pointer">
                    <div className="bg-red-600 text-white p-1 rounded-lg">
                        <Play fill="currentColor" size={16} />
                    </div>
                    <span className="font-bold text-lg tracking-tighter">YouTube Studio</span>
                </div>
            </div>
            
            {/* Fake Search */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mx-4">
                <div className="flex w-full">
                    <input type="text" placeholder="Search" className="w-full bg-[#121212] border border-zinc-700 rounded-l-full py-2 px-4 focus:outline-none focus:border-blue-500 text-zinc-300" />
                    <button className="bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-full px-5 hover:bg-zinc-700">
                        <Search size={20} className="text-zinc-400" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* UPLOAD BUTTON */}
                <button 
                    onClick={() => setShowUpload(true)}
                    className="hidden md:flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-zinc-700 px-3 py-1.5 rounded-full text-sm font-bold transition-colors"
                >
                    <Plus size={18} className="text-red-500" />
                    CREATE
                </button>

                <Bell size={24} className="text-zinc-300 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                    {artist.name.substring(0,1)}
                </div>
            </div>
        </div>

        {/* MAIN SCROLL AREA */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            
            {/* CHANNEL BANNER */}
            <div className="w-full h-48 md:h-64 bg-gradient-to-r from-zinc-800 via-purple-900 to-black relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <h1 className="text-6xl font-black uppercase tracking-widest text-white">{artist.name}</h1>
                </div>
            </div>

            {/* CHANNEL HEADER INFO */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] -mt-16 z-10 bg-zinc-800 overflow-hidden shadow-xl shrink-0">
                        {artist.image ? <img src={artist.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-purple-600 text-4xl">{artist.name[0]}</div>}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            {artist.name} 
                            <CheckCircle size={20} className="text-zinc-400 fill-black" />
                        </h1>
                        <div className="text-zinc-400 text-sm mt-1 flex flex-wrap gap-2">
                            <span>@{artist.name.replace(/\s/g, '').toLowerCase()}</span>
                            <span>•</span>
                            <span>{formatCompact(subscriberCount)} subscribers</span>
                            <span>•</span>
                            <span>{videos.length} videos</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400 max-w-2xl line-clamp-1">
                            Official channel of {artist.name}. Subscribe for latest music videos, performances, and behind the scenes.
                        </div>
                        
                        {/* Buttons */}
                        <div className="mt-4 flex gap-3">
                            <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-zinc-200">
                                Customize channel
                            </button>
                            {/* Updated Button per request */}
                            <button onClick={() => setShowUpload(true)} className="bg-zinc-800 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-zinc-700 flex items-center gap-2">
                                <Plus size={16} /> Upload Video
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-8 mt-8 border-b border-zinc-800 overflow-x-auto">
                    {['HOME', 'VIDEOS', 'SHORTS', 'RELEASES'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                    <button className="pb-3 text-zinc-500 hover:text-zinc-300"><Search size={20}/></button>
                </div>

                {/* FILTERS (Inside Videos Tab) */}
                {activeTab === 'VIDEOS' && (
                    <div className="flex gap-3 mt-6">
                        {['LATEST', 'POPULAR', 'OLDEST'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-white text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                )}

                {/* --- CONTENT AREA --- */}
                <div className="mt-6 pb-20">
                    
                    {/* --- HOME TAB LAYOUT --- */}
                    {activeTab === 'HOME' && (
                        <div className="space-y-12">
                            {/* 1. Featured Video (Most recent MV or Video) */}
                            {videos.length > 0 && (
                                (() => {
                                    const featured = videos.find(v => v.type === 'Official MV') || videos[0];
                                    return (
                                        <div onClick={() => setSelectedVideo(featured)} className="flex flex-col md:flex-row gap-6 mb-8 cursor-pointer group">
                                            <div className="w-full md:w-[45%] aspect-video bg-zinc-800 rounded-xl overflow-hidden relative">
                                                {featured.thumbnailUrl ? <img src={featured.thumbnailUrl} className="w-full h-full object-cover" /> : <Video size={48} className="m-auto text-zinc-600 mt-20"/>}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                    <Play fill="white" size={48} />
                                                </div>
                                            </div>
                                            <div className="flex-1 py-2">
                                                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:underline">{featured.title}</h2>
                                                <div className="text-zinc-400 text-sm mb-4 flex items-center gap-2">
                                                    <span>{formatCompact(featured.views)} views</span>
                                                    <span>•</span>
                                                    <span>{formatTimeAgo(featured.uploadWeek)}</span>
                                                </div>
                                                <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                                                    Listen to {featured.title} by {artist.name}. 
                                                    {featured.isViral ? " This video is currently trending worldwide!" : " The latest release from the upcoming project."}
                                                </p>
                                                <div className="flex gap-2">
                                                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 font-bold">{featured.type}</span>
                                                    {featured.quality > 90 && <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-yellow-500 font-bold">4K</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()
                            )}

                            {/* 2. Recent Uploads Shelf */}
                            {videos.filter(v => v.type !== 'Shorts').length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-xl font-bold">Uploads</h3>
                                        <button onClick={() => setActiveTab('VIDEOS')} className="px-3 py-1 rounded-full hover:bg-zinc-800 text-blue-400 text-sm font-bold">Play all</button>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700">
                                        {videos
                                            .filter(v => v.type !== 'Shorts')
                                            .sort((a,b) => b.uploadWeek - a.uploadWeek)
                                            .slice(0, 10)
                                            .map(vid => (
                                                <div key={vid.id} className="w-64 flex-shrink-0">
                                                    {renderVideoCard(vid)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="border-b border-zinc-800 mt-4"/>
                                </div>
                            )}

                            {/* 3. Shorts Shelf */}
                            {videos.filter(v => v.type === 'Shorts').length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Zap fill="white" className="text-white" size={24} />
                                        <h3 className="text-xl font-bold">Shorts</h3>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700">
                                        {videos
                                            .filter(v => v.type === 'Shorts')
                                            .sort((a,b) => b.uploadWeek - a.uploadWeek)
                                            .slice(0, 10)
                                            .map(vid => (
                                                <div key={vid.id}>
                                                    {renderVideoCard(vid, true)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="border-b border-zinc-800 mt-4"/>
                                </div>
                            )}

                            {/* 4. Releases Shelf */}
                            {videos.filter(v => v.type === 'Lyric Video').length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-xl font-bold">Releases</h3>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700">
                                        {videos
                                            .filter(v => v.type === 'Lyric Video')
                                            .sort((a,b) => b.uploadWeek - a.uploadWeek)
                                            .slice(0, 10)
                                            .map(vid => (
                                                <div key={vid.id} className="w-64 flex-shrink-0">
                                                    {renderVideoCard(vid)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {videos.length === 0 && (
                                <div className="text-center py-20 text-zinc-500">
                                    <Video size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>This channel has no content.</p>
                                    <button onClick={() => setShowUpload(true)} className="text-blue-400 hover:underline mt-2">Upload a video to get started</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- OTHER TABS (GRID LAYOUT) --- */}
                    {(activeTab !== 'HOME') && (
                        <>
                            {displayVideos.length === 0 ? (
                                <div className="text-center py-20">
                                    <Video size={48} className="mx-auto text-zinc-600 mb-4" />
                                    <p className="text-zinc-400">No content here yet.</p>
                                    {activeTab === 'RELEASES' ? (
                                        <p className="text-sm text-zinc-600 mt-2">Release songs in Studio to auto-generate Official Audio.</p>
                                    ) : (
                                        <button onClick={() => setShowUpload(true)} className="text-blue-400 hover:underline mt-2">Upload a video</button>
                                    )}
                                </div>
                            ) : (
                                <div className={`grid gap-x-4 gap-y-8 ${activeTab === 'SHORTS' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                                    {displayVideos.map(vid => (
                                        <div key={vid.id}>
                                            {renderVideoCard(vid, vid.type === 'Shorts')}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    </div>
  );
};

export default YouTubeChannel;
