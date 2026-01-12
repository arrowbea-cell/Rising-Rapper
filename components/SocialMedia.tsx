
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GameState, Artist, SocialPost, NPCArtist, BrandOffer, CampaignStyle } from '../types';
import { handlePlayerPost, INITIAL_SOCIAL_STATE } from '../utils/socialLogic';
import { generateBrandPost, negotiateBrandDeal, executeCampaign, promoteBrandProduct } from '../utils/brandLogic';
import { generateGrammyTrends } from '../utils/social/grammySocials'; 
import { BRANDS, GENRE_DETAILS } from '../constants';
import { Home, User, Bell, Mail, MoreHorizontal, PenTool, Image as ImageIcon, Smile, Calendar, X as XIcon, Search, ArrowLeft, Flame, DollarSign, Settings, Disc, Send, CheckCircle, Briefcase, BadgeCheck, Timer, ShoppingBag, Zap, MapPin, Camera as CameraIcon, TrendingUp, Heart, Repeat, MessageCircle, Music, Award } from 'lucide-react';

// Sub Components
import { SocialPostItem } from './social/SocialPostItem';
import { SocialRightSidebar } from './social/SocialRightSidebar';

interface SocialMediaProps {
  artist: Artist;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

// ... (Mock data moved or kept if small)
const generateMockNotifications = (npcs: NPCArtist[]) => {
    const types = ['LIKE', 'RETWEET', 'FOLLOW', 'MENTION'] as const;
    return Array.from({ length: 15 }).map((_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        const isNpc = Math.random() > 0.5;
        const name = isNpc ? npc.name : `User${Math.floor(Math.random() * 99999)}`;
        
        return {
            id: i, type, user: name, avatar: isNpc ? undefined : null, 
            content: type === 'MENTION' ? "This track is actually fire! 🔥" : undefined,
            time: `${Math.floor(Math.random() * 24) + 1}h`
        };
    });
};

const SocialMedia: React.FC<SocialMediaProps> = ({ artist, gameState, setGameState }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'EXPLORE' | 'NOTIFICATIONS' | 'MESSAGES' | 'PROFILE'>('HOME');
  const [feedTab, setFeedTab] = useState<'FOR_YOU' | 'FOLLOWING'>('FOR_YOU');
  
  // Compose State
  const [composeOpen, setComposeOpen] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postIntent, setPostIntent] = useState<'STANDARD' | 'PROMO' | 'BEEF' | 'FLEX' | 'MEME'>('STANDARD');
  
  const [showSongSelect, setShowSongSelect] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

  // Message Detail View
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  // Brand Logic States
  const [pendingOffer, setPendingOffer] = useState<BrandOffer | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CampaignStyle | null>(null);
  
  // GRAMMY ACCEPT
  const [showGrammySongSelect, setShowGrammySongSelect] = useState(false);
  
  // NEW: SELECT BRAND TO PROMOTE
  const [showBrandSelect, setShowBrandSelect] = useState(false);

  const selectedSong = selectedSongId ? gameState.songs.find(s => s.id === selectedSongId) : null;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  
  const [notifications] = useState(() => generateMockNotifications(gameState.npcArtists));

  useEffect(() => {
      if (!gameState.socialState) {
          setGameState(prev => ({ ...prev, socialState: INITIAL_SOCIAL_STATE }));
      }
  }, []);

  useEffect(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const trends = useMemo(() => {
      const t = [];
      const { date, activeCharts, activeDeals } = gameState;

      // 1. INJECT GRAMMY TRENDS FIRST
      const grammyTrends = generateGrammyTrends(date.month, date.week, artist);
      t.push(...grammyTrends);

      if (activeDeals && activeDeals.length > 0) {
          const deal = activeDeals[0];
          const brand = BRANDS.find(b => b.id === deal.brandId);
          if (brand) {
              t.push({ category: `Business · ${brand.tier}`, topic: `${artist.name} x ${brand.name}`, stat: 'Official Partner', context: 'Brand Deal' });
          }
      }
      
      const hot100 = activeCharts['HOT_100'] || [];
      if (hot100.length > 0) {
          const top = hot100[0];
          const isNew = top.movement === 'new';
          t.push({ category: 'Music · Trending', topic: `${top.artistName} - ${top.title}`, stat: `${new Intl.NumberFormat('en-US', { notation: "compact" }).format(top.metric1)} posts`, image: top.coverArt, context: isNew ? 'Trending with #NewMusic' : `Trending with ${top.artistName}` });
      }
      if (date.month === 12) t.push({ category: 'Events · Trending', topic: '#MerryChristmas', stat: '2.5M posts', context: 'Holiday Season' });
      else if (date.month === 10) t.push({ category: 'Events · Trending', topic: '#SpookySzn', stat: '1.8M posts', context: 'Halloween' });
      
      const topGenre = Object.entries(gameState.trends).sort((a,b) => (b[1] as number) - (a[1] as number))[0];
      if (topGenre) {
          const genreName = GENRE_DETAILS[topGenre[0] as any]?.name || 'Music';
          t.push({ category: 'Music · Trending', topic: `${genreName} Revolution`, stat: '500K posts', context: 'Genre trends' });
      }
      if (t.length < 5) t.push({ category: 'Technology · Trending', topic: 'AI Music Tools', stat: '50K posts', context: 'Tech' });
      
      return t.slice(0, 5); 
  }, [gameState.date.week, gameState.trends, gameState.activeCharts, gameState.hype, gameState.activeDeals]);

  const whoToFollow = useMemo(() => {
      return gameState.npcArtists.filter(n => n.popularityGlobal > 50).sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const social = gameState.socialState || INITIAL_SOCIAL_STATE;
  const currentWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + ((gameState.date.year - 2024) * 48);

  // --- FILTERED POSTS LOGIC ---
  const feedPosts = useMemo(() => {
      return social.posts.filter(p => {
          if (feedTab === 'FOLLOWING') {
              // Assuming following means following everyone except player (unless user follows themselves, but standard logic implies feed of others)
              return p.authorId !== 'player';
          }
          
          // FOR YOU TAB LOGIC:
          // Filter out Player posts (Promos, Standard, etc.) that are older than 2 weeks
          if (p.authorId === 'player') {
              // FIX: Detect legacy/bugged timestamps (created with Date.now() > 1M) and hide them
              if (p.timestamp > 1000000) return false; 

              const age = currentWeek - p.timestamp;
              if (age > 2) return false; // Remove if older than 2 weeks
          }
          
          return true;
      });
  }, [social.posts, feedTab, currentWeek]);

  const handleSendPost = () => {
      if (postIntent === 'PROMO' && gameState.money < 500) { alert("Not enough money for Promo!"); return; }
      const attachedSong = selectedSongId ? gameState.songs.find(s => s.id === selectedSongId) : undefined;
      const result = handlePlayerPost(postIntent, artist, gameState, postText, postImage || undefined, attachedSong);
      
      setGameState(prev => {
          const currentSocial = prev.socialState || INITIAL_SOCIAL_STATE;
          return {
              ...prev,
              hype: Math.max(0, prev.hype + result.hypeChange),
              money: prev.money + result.moneyChange,
              socialState: { ...currentSocial, posts: [result.post, ...currentSocial.posts], reputation: Math.max(0, Math.min(100, currentSocial.reputation + result.repChange)) }
          };
      });
      setComposeOpen(false); setPostText(''); setPostImage(null); setPostIntent('STANDARD'); setSelectedSongId(null); setActiveTab('PROFILE');
  };

  const handlePromotePartner = (deal: BrandOffer) => {
      // CHANGED: Passed currentWeek to ensure correct expiration time
      const { post, hypeChange, repChange, relationshipBoost } = promoteBrandProduct(deal, artist.name, social.followers, currentWeek);
      setGameState(prev => {
          const currentSocial = prev.socialState || INITIAL_SOCIAL_STATE;
          const updatedDeals = prev.activeDeals?.map(d => {
              if (d.id === deal.id) return { ...d, relationshipScore: Math.min(100, d.relationshipScore + relationshipBoost) };
              return d;
          });
          return {
              ...prev, hype: Math.max(0, prev.hype + hypeChange), activeDeals: updatedDeals,
              socialState: { ...currentSocial, posts: [post, ...currentSocial.posts], reputation: Math.max(0, Math.min(100, currentSocial.reputation + repChange)) }
          };
      });
      setComposeOpen(false); setShowBrandSelect(false); setActiveTab('PROFILE');
  };

  const toggleLike = (postId: string) => {
      const newLiked = new Set(likedPosts);
      if (newLiked.has(postId)) newLiked.delete(postId); else newLiked.add(postId);
      setLikedPosts(newLiked);
  };

  const handleNegotiate = (offer: BrandOffer) => {
      const { success, newOffer, responseText } = negotiateBrandDeal(offer, social.reputation);
      setGameState(prev => {
          const updatedMessages = prev.socialState?.messages.map(m => {
              if (m.brandOffer && m.brandOffer.id === offer.id) {
                  return { ...m, content: responseText, brandOffer: success ? newOffer! : { ...offer, isRejected: true } };
              }
              return m;
          }) || [];
          return { ...prev, socialState: { ...prev.socialState!, messages: updatedMessages } };
      });
      setShowGrammySongSelect(false); // Reset just in case
  };

  const handleStartCampaign = () => {
      if (!pendingOffer || !selectedStyle) return;
      const finalOffer = executeCampaign(pendingOffer, selectedStyle, artist.name);
      
      setGameState(prev => {
          const updatedMessages = prev.socialState?.messages.map(m => {
              if (m.brandOffer && m.brandOffer.id === finalOffer.id) return { ...m, brandOffer: { ...finalOffer, isAccepted: true, isRejected: false } };
              return m;
          }) || [];

          let newMoney = prev.money + finalOffer.payout;
          if (finalOffer.campaignResult?.bonusMoney) newMoney += finalOffer.campaignResult.bonusMoney;
          let newHype = prev.hype + 20;
          if (finalOffer.campaignResult?.bonusHype) newHype += finalOffer.campaignResult.bonusHype;
          
          const newActiveDeals = prev.activeDeals ? [...prev.activeDeals] : [];
          const newPosts = prev.socialState?.posts ? [...prev.socialState.posts] : [];
          const existingIndex = newActiveDeals.findIndex(d => d.industry === finalOffer.industry);
          if (existingIndex >= 0) newActiveDeals[existingIndex] = { ...finalOffer, isAccepted: true };
          else newActiveDeals.push({ ...finalOffer, isAccepted: true });
          
          const brandPost = generateBrandPost(finalOffer, currentWeek, artist.name);
          newPosts.unshift(brandPost);

          return { ...prev, money: newMoney, hype: newHype, activeDeals: newActiveDeals, socialState: { ...prev.socialState!, messages: updatedMessages, posts: newPosts } };
      });
      setPendingOffer(null); setSelectedStyle(null); setSelectedMessageId(null);
  };

  const handleRejectOffer = (offer: BrandOffer) => {
      setGameState(prev => {
          const updatedMessages = prev.socialState?.messages.map(m => {
              if (m.brandOffer && m.brandOffer.id === offer.id) return { ...m, brandOffer: { ...offer, isAccepted: false, isRejected: true } };
              return m;
          }) || [];
          return { ...prev, socialState: { ...prev.socialState!, messages: updatedMessages } }
      });
      setSelectedMessageId(null);
  };

  // --- GRAMMY ACCEPTANCE ---
  const handleAcceptGrammy = (songId: string) => {
      setGameState(prev => ({
          ...prev,
          grammyPerformanceSongId: songId, // Lock the song
          hype: prev.hype + 100 // Instant Hype boost for accepting
      }));
      setShowGrammySongSelect(false);
      setSelectedMessageId(null);
      alert("Invitation Accepted! You will perform at the ceremony in February.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatNumber = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
  };

  const formatMoney = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  const renderMessagesView = () => {
      if (selectedMessageId) {
          const message = social.messages.find(m => m.id === selectedMessageId);
          if (!message) return <div>Message not found</div>;
          const brand = BRANDS.find(b => b.id === message.senderId);
          const isBrand = !!brand;
          const isGrammy = message.specialAction === 'GRAMMY_PERFORMANCE';

          return (
              <div className="flex flex-col h-full">
                  <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-4 sticky top-0 bg-black/80 backdrop-blur z-10">
                      <button onClick={() => setSelectedMessageId(null)} className="hover:bg-zinc-800 p-2 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                      <div className="flex flex-col"><span className="font-bold text-lg leading-none">{message.senderName}</span><span className="text-zinc-500 text-sm">{message.handle}</span></div>
                      <div className="ml-auto"><Settings size={20} className="text-zinc-500"/></div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="flex items-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0 overflow-hidden">
                              {isBrand ? <div className={`w-full h-full ${brand?.logoColor || 'bg-zinc-800'} flex items-center justify-center`}><Briefcase size={14} className="text-white"/></div> : isGrammy ? <div className="w-full h-full bg-[#bfa068] flex items-center justify-center"><Award size={16} className="text-black"/></div> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">{message.senderName[0]}</div>}
                          </div>
                          <div className="bg-[#2f3336] text-white px-4 py-3 rounded-2xl rounded-bl-none max-w-[80%] text-[15px]">
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              {/* BRAND OFFER UI */}
                              {message.brandOffer && !message.brandOffer.isAccepted && !message.brandOffer.isRejected && (
                                  <div className="mt-3 pt-3 border-t border-zinc-600 flex flex-col gap-2">
                                      <div className="text-xs text-zinc-400 font-mono mb-1">CONTRACT OFFER: {formatMoney(message.brandOffer.payout)}</div>
                                      <div className="flex gap-2">
                                          <button onClick={() => setPendingOffer(message.brandOffer!)} className="flex-1 bg-white text-black font-bold py-1.5 rounded-lg text-sm hover:bg-zinc-200">Accept</button>
                                          <button onClick={() => handleNegotiate(message.brandOffer!)} disabled={message.brandOffer.isNegotiated} className="flex-1 bg-blue-500 text-white font-bold py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50">Negotiate</button>
                                          <button onClick={() => handleRejectOffer(message.brandOffer!)} className="flex-1 bg-zinc-800 text-red-400 font-bold py-1.5 rounded-lg text-sm hover:bg-zinc-700">Decline</button>
                                      </div>
                                  </div>
                              )}
                              {/* GRAMMY INVITE UI */}
                              {isGrammy && !gameState.grammyPerformanceSongId && (
                                  <div className="mt-3 pt-3 border-t border-zinc-600">
                                      {showGrammySongSelect ? (
                                          <div className="space-y-2">
                                              <p className="text-xs font-bold text-zinc-400 uppercase">Select Song to Perform:</p>
                                              <div className="max-h-40 overflow-y-auto space-y-1">
                                                  {gameState.songs.filter(s => s.isReleased).map(s => (
                                                      <button key={s.id} onClick={() => handleAcceptGrammy(s.id)} className="w-full text-left bg-black/50 hover:bg-black p-2 rounded flex items-center gap-2 text-xs">
                                                          <Disc size={12}/> {s.title}
                                                      </button>
                                                  ))}
                                              </div>
                                              <button onClick={() => setShowGrammySongSelect(false)} className="text-xs text-red-400 hover:underline">Cancel</button>
                                          </div>
                                      ) : (
                                          <button onClick={() => setShowGrammySongSelect(true)} className="w-full bg-[#bfa068] text-black font-bold py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">
                                              Accept & Select Song
                                          </button>
                                      )}
                                  </div>
                              )}
                              {/* STATUS BADGES */}
                              {message.brandOffer?.isAccepted && <div className="mt-2 text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> OFFER ACCEPTED</div>}
                              {message.brandOffer?.isRejected && <div className="mt-2 text-red-400 text-xs font-bold flex items-center gap-1"><XIcon size={12}/> OFFER DECLINED</div>}
                              {isGrammy && gameState.grammyPerformanceSongId && <div className="mt-2 text-[#bfa068] text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> PERFORMANCE CONFIRMED</div>}
                          </div>
                      </div>
                  </div>
                  <div className="p-3 border-t border-zinc-800 flex items-center gap-2">
                      <div className="flex-1 bg-[#202327] rounded-full flex items-center px-4 py-2"><input type="text" placeholder="Start a new message" className="bg-transparent outline-none text-white w-full placeholder-zinc-500" disabled/></div>
                      <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors"><Send size={20}/></button>
                  </div>
              </div>
          )
      }
      return (
          <div>
              <div className="p-4 flex items-center justify-between border-b border-zinc-800"><h2 className="text-xl font-bold">Messages</h2><Settings size={20} className="text-zinc-500"/></div>
              <div className="p-2">
                  <div className="bg-[#202327] rounded-full flex items-center px-4 py-2 mb-2 focus-within:ring-1 focus-within:ring-blue-500 border border-transparent">
                      <Search size={16} className="text-zinc-500" /><input type="text" placeholder="Search Direct Messages" className="bg-transparent outline-none text-white ml-3 w-full placeholder-zinc-500 text-[15px]" />
                  </div>
              </div>
              {social.messages.length === 0 ? <div className="p-10 text-center text-zinc-500"><Mail size={48} className="mx-auto mb-4 opacity-20"/><p>No messages yet.</p><p className="text-sm">Brand offers will appear here.</p></div> : social.messages.slice().reverse().map((msg) => {
                  const isGrammy = msg.specialAction === 'GRAMMY_PERFORMANCE';
                  return (
                    <div key={msg.id} onClick={() => setSelectedMessageId(msg.id)} className="p-4 flex gap-3 hover:bg-white/[0.03] cursor-pointer transition-colors relative">
                        {isGrammy ? (
                            <div className="w-12 h-12 rounded-full bg-[#bfa068] flex items-center justify-center shrink-0 border border-yellow-700">
                                <Award size={24} className="text-black"/>
                            </div>
                        ) : msg.senderId.startsWith('brand_') ? (
                            <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0"><Briefcase size={20} className="text-zinc-400"/></div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-zinc-700 overflow-hidden border border-zinc-800"><div className="w-full h-full flex items-center justify-center font-bold">{msg.senderName[0]}</div></div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center"><div className="flex items-center gap-1"><span className="font-bold text-white truncate max-w-[150px]">{msg.senderName}</span>{msg.brandOffer && <BadgeCheck size={14} className="text-yellow-500 fill-yellow-500/10"/>}<span className="text-zinc-500 text-[15px] truncate hidden sm:block">{msg.handle}</span><span className="text-zinc-500 text-[15px]">· {msg.timestamp === currentWeek ? 'now' : '1d'}</span></div></div>
                            <div className={`text-[15px] truncate ${!msg.isRead ? 'text-white font-bold' : 'text-zinc-500'}`}>
                                {isGrammy ? 'OFFICIAL INVITATION: 67th GRAMMY Awards Performance' : msg.brandOffer ? (msg.brandOffer.isRenewal ? 'Renewal Offer: ' : 'Sent you an offer: ') + msg.brandOffer.type : msg.content}
                            </div>
                        </div>
                        {!msg.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full self-center"></div>}
                    </div>
                  )
              })}
          </div>
      );
  };

  return (
    <div className="h-full bg-black text-white flex justify-center font-sans overflow-hidden relative">
        {/* --- CAMPAIGN STRATEGY MODAL --- */}
        {pendingOffer && (
            <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPendingOffer(null)}>
                <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-zinc-700 flex justify-between items-center"><h3 className="text-xl font-bold text-white flex items-center gap-2"><Briefcase size={20} className="text-yellow-500" /> Plan Campaign</h3><button onClick={() => setPendingOffer(null)} className="text-zinc-400 hover:text-white"><XIcon size={20}/></button></div>
                    <div className="p-6">
                        <div className="mb-6 bg-zinc-900 p-4 rounded-xl border border-zinc-800"><div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Client</div><div className="text-lg font-bold text-white mb-2">{pendingOffer.brandName}</div><div className="text-sm text-zinc-400 italic">"{pendingOffer.description}"</div></div>
                        <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Choose Creative Direction</h4>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[{ id: 'EDITORIAL', label: 'High Fashion', icon: CameraIcon, desc: 'Artistic, serious, expensive.' }, { id: 'STREET', label: 'Street / Authentic', icon: Flame, desc: 'Raw, urban, real vibes.' }, { id: 'VIRAL', label: 'Viral / Meme', icon: Zap, desc: 'Funny, internet culture, risky.' }, { id: 'COMMERCIAL', label: 'Safe / Commercial', icon: Smile, desc: 'Clean, family friendly, boring.' }].map((style) => (
                                <button key={style.id} onClick={() => setSelectedStyle(style.id as any)} className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${selectedStyle === style.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'}`}><style.icon size={20} className="mb-2" /><div className="font-bold text-sm mb-1">{style.label}</div><div className="text-[10px] opacity-70 leading-tight">{style.desc}</div>{selectedStyle === style.id && <div className="absolute top-2 right-2"><CheckCircle size={16} fill="black" textAnchor="middle" className="text-white"/></div>}</button>
                            ))}
                        </div>
                        <button onClick={handleStartCampaign} disabled={!selectedStyle} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">Launch Campaign</button>
                    </div>
                </div>
            </div>
        )}

        {/* ... Left Sidebar ... */}
        <div className="hidden md:flex w-[80px] xl:w-[275px] flex-col h-full border-r border-zinc-800 px-2 xl:px-4 py-4 justify-between shrink-0 sticky top-0">
            <div className="space-y-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-zinc-900 transition-colors cursor-pointer xl:ml-0 mx-auto mb-4"><XIcon size={30} className="text-white fill-white" /></div>
                {[{ id: 'HOME', icon: Home, label: 'Home' }, { id: 'EXPLORE', icon: Search, label: 'Explore' }, { id: 'NOTIFICATIONS', icon: Bell, label: 'Notifications' }, { id: 'MESSAGES', icon: Mail, label: 'Messages', badge: social.messages.filter(m => !m.isRead).length }, { id: 'PROFILE', icon: User, label: 'Profile' }].map((item) => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id as any); setSelectedMessageId(null); }} className={`flex items-center gap-4 p-3 rounded-full hover:bg-zinc-900 transition-colors w-full xl:justify-start justify-center group ${activeTab === item.id ? 'font-bold' : 'font-normal'} relative`}><div className="relative"><item.icon size={26} className={`${activeTab === item.id ? 'stroke-[3px]' : 'stroke-2'}`} />{item.badge && item.badge > 0 ? <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.badge}</div> : null}</div><span className="hidden xl:inline text-xl mr-4">{item.label}</span></button>
                ))}
                <button onClick={() => setComposeOpen(true)} className="bg-white hover:bg-zinc-200 text-black rounded-full p-4 xl:w-[90%] w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg transition-colors xl:mt-8 mx-auto xl:mx-0"><span className="hidden xl:inline">Post</span><PenTool className="xl:hidden" size={24} /></button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-full hover:bg-zinc-900 cursor-pointer xl:justify-start justify-center mb-4 transition-colors"><div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden border border-zinc-600">{artist.image ? <img src={artist.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold bg-purple-600">{artist.name[0]}</div>}</div><div className="hidden xl:block overflow-hidden flex-1"><div className="font-bold text-sm truncate">{artist.name}</div><div className="text-zinc-500 text-sm truncate">@{artist.name.replace(/\s/g,'').toLowerCase()}</div></div><MoreHorizontal size={16} className="hidden xl:block text-zinc-500" /></div>
        </div>

        {/* ... Middle Feed ... */}
        <div className="flex-1 max-w-[600px] border-r border-zinc-800 h-full overflow-y-auto scrollbar-hide relative pb-24" ref={scrollRef}>
            {activeTab === 'HOME' && <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 cursor-pointer transition-opacity"><div className="flex w-full"><div onClick={() => { setFeedTab('FOR_YOU'); scrollRef.current?.scrollTo({top:0, behavior:'smooth'}); }} className="flex-1 h-[53px] flex items-center justify-center hover:bg-zinc-900/50 transition-colors relative"><span className={`font-bold text-[15px] ${feedTab === 'FOR_YOU' ? 'text-white' : 'text-zinc-500'}`}>For you</span>{feedTab === 'FOR_YOU' && <div className="absolute bottom-0 w-14 h-1 bg-blue-500 rounded-full"></div>}</div><div onClick={() => { setFeedTab('FOLLOWING'); scrollRef.current?.scrollTo({top:0, behavior:'smooth'}); }} className="flex-1 h-[53px] flex items-center justify-center hover:bg-zinc-900/50 transition-colors relative"><span className={`font-bold text-[15px] ${feedTab === 'FOLLOWING' ? 'text-white' : 'text-zinc-500'}`}>Following</span>{feedTab === 'FOLLOWING' && <div className="absolute bottom-0 w-20 h-1 bg-blue-500 rounded-full"></div>}</div></div></div>}
            
            {activeTab === 'MESSAGES' ? renderMessagesView() : activeTab === 'PROFILE' ? (
                <div>
                    <div className="h-[200px] bg-zinc-800 w-full relative group overflow-hidden">{artist.image && <img src={artist.image} className="w-full h-full object-cover opacity-60 blur-sm scale-110" /><div className="absolute inset-0 bg-black/20" />}</div>
                    <div className="px-4 pb-4 border-b border-zinc-800 relative">
                        <div className="flex justify-between items-start">
                            <div className="w-[134px] h-[134px] rounded-full border-4 border-black bg-zinc-900 -mt-[15%] overflow-hidden relative">{artist.image ? <img src={artist.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-purple-600">{artist.name[0]}</div>}</div>
                            <button className="mt-3 border border-zinc-600 text-white font-bold px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors text-sm">Edit profile</button>
                        </div>
                        <div className="mt-3"><h1 className="text-xl font-extrabold leading-none flex items-center gap-1">{artist.name}{social.isVerified && <BadgeCheck size={18} className="text-blue-400 fill-blue-400/10" />}</h1><div className="text-zinc-500 text-[15px]">@{artist.name.replace(/\s/g,'').toLowerCase()}</div></div>
                        <div className="mt-3 text-[15px] text-white leading-snug">{artist.genre} Artist • 📍 {artist.country} <br/>Making waves in the industry. <span className="text-blue-400">#RapperRise</span></div>
                        
                        {gameState.activeDeals && gameState.activeDeals.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">{gameState.activeDeals.map(d => <div key={d.id} className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center justify-between"><div className="flex items-center gap-2"><Briefcase size={12} className="text-zinc-400" /><span className="text-xs font-bold">{d.brandName} <span className="font-normal text-zinc-500">({d.industry})</span></span></div><div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono"><Timer size={10} /> {d.weeksRemaining} wks left</div></div>)}</div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-zinc-500 text-sm"><div className="flex items-center gap-1"><MapPin size={16}/> {artist.country}</div><div className="flex items-center gap-1"><Calendar size={16}/> Joined 2024</div></div>
                        <div className="mt-3 flex gap-5 text-[14px]"><span className="text-white font-bold hover:underline cursor-pointer">{formatNumber(social.following)} <span className="text-zinc-500 font-normal">Following</span></span><span className="text-white font-bold hover:underline cursor-pointer">{formatNumber(social.followers)} <span className="text-zinc-500 font-normal">Followers</span></span></div>
                    </div>
                    <div className="flex border-b border-zinc-800">{['Posts', 'Replies', 'Highlights', 'Media', 'Likes'].map((tab, i) => (<div key={tab} className="flex-1 hover:bg-zinc-900/50 transition-colors h-[53px] flex items-center justify-center font-bold text-[15px] text-zinc-500 hover:text-zinc-200 cursor-pointer relative group">{tab}{i === 0 && <div className="absolute bottom-0 w-14 h-1 bg-blue-500 rounded-full" />}</div>))}</div>
                    <div>{social.posts.filter(p => p.authorId === 'player').length === 0 ? (<div className="p-10 text-center mx-auto max-w-sm"><p className="font-bold text-3xl mb-2 text-white">No posts yet</p><p className="text-zinc-500 text-[15px]">This account hasn't posted anything yet.</p><button onClick={() => setComposeOpen(true)} className="mt-6 bg-blue-500 text-white font-bold px-5 py-3 rounded-full text-[15px] hover:bg-blue-600 transition-colors">Post now</button></div>) : (social.posts.filter(p => p.authorId === 'player').map(post => <SocialPostItem key={post.id} post={post} artistImage={artist.image} likedPosts={likedPosts} onToggleLike={toggleLike} currentYear={gameState.date.year} currentWeekFull={currentWeek} />))}</div>
                </div>
            ) : activeTab === 'EXPLORE' ? (
                <div>
                    <div className="px-4 h-[53px] flex items-center w-full sticky top-0 bg-black/90 backdrop-blur z-20 border-b border-zinc-800"><div className="bg-[#202327] rounded-full flex items-center px-4 py-2 w-full group focus-within:bg-black focus-within:ring-1 focus-within:ring-blue-500 border border-transparent"><Search size={18} className="text-zinc-500 group-focus-within:text-blue-500" /><input type="text" placeholder="Search" className="bg-transparent outline-none text-white ml-3 w-full placeholder-zinc-500 text-[15px]" /></div></div>
                    <div className="border-b border-zinc-800"><h3 className="font-black text-xl px-4 py-3">Trends for you</h3>{trends.map((trend, i) => (<div key={i} className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors relative"><div className="flex justify-between text-xs text-zinc-500"><span>{trend.category}</span><MoreHorizontal size={14} className="hover:text-blue-400"/></div><div className="font-bold text-[15px] mt-0.5 text-white">{trend.topic}</div><div className="text-xs text-zinc-500 mt-0.5">{trend.stat}</div></div>))}</div>
                </div>
            ) : (
                <div>
                    <div className="hidden md:block border-b border-zinc-800 p-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0 overflow-hidden border border-zinc-600">{artist.image && <img src={artist.image} className="w-full h-full object-cover"/>}</div>
                            <div className="flex-1">
                                <div onClick={() => setComposeOpen(true)} className="text-zinc-500 text-xl cursor-text py-2">What is happening?!</div>
                                <div className="flex justify-between items-center mt-2 border-t border-zinc-800 pt-3"><div className="flex gap-2 text-blue-400"><ImageIcon size={18} className="cursor-pointer hover:bg-blue-500/10 p-2 rounded-full box-content -m-2"/><Smile size={18} className="cursor-pointer hover:bg-blue-500/10 p-2 rounded-full box-content -m-2"/><Calendar size={18} className="cursor-pointer hover:bg-blue-500/10 p-2 rounded-full box-content -m-2"/></div><button onClick={() => setComposeOpen(true)} className="bg-blue-500 text-white font-bold px-4 py-1.5 rounded-full text-[15px] hover:bg-blue-600 transition-colors disabled:opacity-50">Post</button></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {feedPosts.length === 0 ? (
                            <div className="p-10 text-center max-w-sm mx-auto">
                                <div className="text-3xl font-bold mb-2">Welcome to X!</div>
                                <p className="text-zinc-500 text-[15px] mb-6">This is the best place to see what’s happening in your world.</p>
                                <button onClick={() => setComposeOpen(true)} className="bg-blue-500 text-white font-bold px-8 py-3 rounded-full text-[15px]">Let's go!</button>
                            </div>
                        ) : (
                            feedPosts.map(post => <SocialPostItem key={post.id} post={post} artistImage={artist.image} likedPosts={likedPosts} onToggleLike={toggleLike} currentYear={gameState.date.year} currentWeekFull={currentWeek} />)
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* ... Right Sidebar ... */}
        {activeTab !== 'EXPLORE' && <SocialRightSidebar trends={trends} whoToFollow={whoToFollow} />}

        {/* --- COMPOSE MODAL --- */}
        {composeOpen && (
            <div className="fixed inset-0 z-[100] bg-zinc-500/20 backdrop-blur-sm flex items-start justify-center pt-12" onClick={() => setComposeOpen(false)}>
                <div className="bg-black w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden border border-zinc-800" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center p-3 border-b border-zinc-800">
                        <button onClick={() => setComposeOpen(false)} className="hover:bg-zinc-900 rounded-full p-2 transition-colors"><XIcon size={20}/></button>
                        {/* CHANGED: Drafts text to Post Button */}
                        <button 
                            onClick={handleSendPost} 
                            disabled={(!postText && !postImage && !selectedSongId && postIntent === 'STANDARD')}
                            className="text-blue-400 font-bold text-sm pr-2 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Post
                        </button>
                    </div>
                    <div className="p-4 flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0 overflow-hidden border border-zinc-600">{artist.image && <img src={artist.image} className="w-full h-full object-cover"/>}</div>
                        <div className="flex-1">
                            <textarea value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="What is happening?!" className="w-full bg-transparent text-xl placeholder-zinc-500 text-white outline-none resize-none min-h-[100px]"/>
                            {selectedSong && (<div className="relative mt-2 mb-4 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 flex items-center p-3 gap-3"><div className="w-12 h-12 bg-zinc-800 rounded shrink-0 overflow-hidden">{selectedSong.coverArt ? <img src={selectedSong.coverArt} className="w-full h-full object-cover"/> : <Disc size={24} className="m-auto mt-3 text-zinc-500"/>}</div><div className="flex-1 min-w-0"><div className="text-sm font-bold text-white truncate">{selectedSong.title}</div><div className="text-xs text-zinc-400">{artist.name}</div></div><button onClick={() => setSelectedSongId(null)} className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><XIcon size={16} /></button></div>)}
                            {postImage && !selectedSong && (<div className="relative mt-2 mb-4"><img src={postImage} alt="Upload" className="rounded-xl max-h-[300px] w-auto border border-zinc-800" /><button onClick={() => setPostImage(null)} className="absolute top-2 left-2 bg-black/70 rounded-full p-1 text-white hover:bg-black"><XIcon size={16}/></button></div>)}
                            <div className="border-t border-zinc-800 pt-3 mt-2">
                                <div className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-2">Intent (Affects Hype/Money)</div>
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                    {[{ id: 'STANDARD', label: 'Standard', icon: Send, cost: 0, color: 'zinc' }, { id: 'PROMO', label: 'Promo', icon: TrendingUp, cost: -500, color: 'blue' }, { id: 'BEEF', label: 'Beef', icon: Flame, cost: 0, color: 'red' }, { id: 'FLEX', label: 'Flex', icon: DollarSign, cost: 0, color: 'green' }, { id: 'MEME', label: 'Meme', icon: Smile, cost: 0, color: 'purple' }].map(type => (
                                        <button key={type.id} onClick={() => setPostIntent(type.id as any)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${postIntent === type.id ? type.color === 'red' ? 'bg-red-900/30 border-red-500 text-red-400' : type.color === 'blue' ? 'bg-blue-900/30 border-blue-500 text-blue-400' : type.color === 'green' ? 'bg-green-900/30 border-green-500 text-green-400' : type.color === 'purple' ? 'bg-purple-900/30 border-purple-500 text-purple-400' : 'bg-white text-black border-white' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}><type.icon size={12} /> {type.label} {type.cost !== 0 && <span className="opacity-70 ml-1">(${Math.abs(type.cost)})</span>}</button>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center relative">
                                    <div className="flex gap-2 text-blue-400">
                                        <label className="cursor-pointer p-2 box-content rounded-full hover:bg-blue-500/10 -ml-2" title="Upload Image"><ImageIcon size={20} /><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={!!selectedSongId} /></label>
                                        <button onClick={() => setShowSongSelect(!showSongSelect)} className={`cursor-pointer p-2 box-content rounded-full hover:bg-blue-500/10 ${selectedSongId ? 'text-blue-500' : 'text-blue-400'}`} title="Attach Song" disabled={!!postImage}><Music size={20} /></button>
                                        {gameState.activeDeals && gameState.activeDeals.length > 0 && <button onClick={() => setShowBrandSelect(!showBrandSelect)} className="cursor-pointer p-2 box-content rounded-full hover:bg-blue-500/10 text-blue-400" title="Promote Partner"><ShoppingBag size={20} /></button>}
                                        <Smile size={20} className="cursor-pointer p-2 box-content rounded-full hover:bg-blue-500/10"/><Calendar size={20} className="cursor-pointer p-2 box-content rounded-full hover:bg-blue-500/10"/>
                                    </div>
                                    {showSongSelect && (<div className="absolute bottom-full left-0 w-64 bg-black border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-20 mb-2"><div className="p-2 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase">Select a Song</div>{gameState.songs.filter(s => s.isReleased).length === 0 ? (<div className="p-4 text-center text-xs text-zinc-500">No songs released yet.</div>) : (gameState.songs.filter(s => s.isReleased).map(s => (<div key={s.id} onClick={() => { setSelectedSongId(s.id); setShowSongSelect(false); setPostImage(null); }} className="flex items-center gap-3 p-2 hover:bg-zinc-800 cursor-pointer text-sm border-b border-zinc-900"><div className="w-8 h-8 bg-zinc-700 rounded overflow-hidden shrink-0">{s.coverArt ? <img src={s.coverArt} className="w-full h-full object-cover"/> : <Disc size={16} className="m-auto mt-2 text-zinc-500"/>}</div><div className="truncate">{s.title}</div></div>)))}</div>)}
                                    {showBrandSelect && (<div className="absolute bottom-full left-0 w-64 bg-black border border-zinc-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-20 mb-2"><div className="p-2 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase">Select Partner</div>{gameState.activeDeals?.map(d => (<div key={d.id} onClick={() => handlePromotePartner(d)} className="flex items-center gap-3 p-3 hover:bg-zinc-800 cursor-pointer text-sm border-b border-zinc-900 group"><Briefcase size={16} className="text-zinc-500 group-hover:text-white"/><div><div className="font-bold text-white">{d.brandName}</div>{d.products.length > 0 && <div className="text-[10px] text-zinc-400">Promote: {d.products[d.products.length-1].name}</div>}</div></div>))}</div>)}
                                    <button onClick={handleSendPost} disabled={(!postText && !postImage && !selectedSongId && postIntent === 'STANDARD')} className="bg-blue-500 text-white font-bold px-6 py-2 rounded-full text-[15px] hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">Post</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* MOBILE FAB */}
        <button onClick={() => setComposeOpen(true)} className="md:hidden fixed bottom-20 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg z-50 hover:scale-105 transition-transform"><PenTool size={24} /></button>

        {/* MOBILE BOTTOM NAV */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 flex justify-around items-center h-[53px] z-40 pb-1">
            <button onClick={() => setActiveTab('HOME')} className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'HOME' ? 'text-white' : 'text-zinc-500'}`}><Home size={26} fill={activeTab === 'HOME' ? "currentColor" : "none"} /></button>
            <button onClick={() => setActiveTab('EXPLORE')} className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'EXPLORE' ? 'text-white' : 'text-zinc-500'}`}><Search size={26} strokeWidth={activeTab === 'EXPLORE' ? 3 : 2} /></button>
            <button onClick={() => setActiveTab('NOTIFICATIONS')} className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'NOTIFICATIONS' ? 'text-white' : 'text-zinc-500'}`}><Bell size={26} fill={activeTab === 'NOTIFICATIONS' ? "currentColor" : "none"} /></button>
            <button onClick={() => setActiveTab('MESSAGES')} className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'MESSAGES' ? 'text-white' : 'text-zinc-500'}`}><Mail size={26} fill={activeTab === 'MESSAGES' ? "currentColor" : "none"} /></button>
            <button onClick={() => setActiveTab('PROFILE')} className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'PROFILE' ? 'text-white' : 'text-zinc-500'}`}><User size={26} fill={activeTab === 'PROFILE' ? "currentColor" : "none"} /></button>
        </div>
    </div>
  );
};

export default SocialMedia;
