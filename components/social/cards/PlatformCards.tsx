
import React from 'react';
import { SocialCardData } from '../../../types';
import { Disc, BadgeCheck, Play } from 'lucide-react';

interface CardProps {
    data: SocialCardData;
}

export const PlatformCard: React.FC<CardProps> = ({ data }) => {
    
    // 1. FAN WRAPPED
    if (data.type === 'FAN_WRAPPED') {
        const bgGradient = 'bg-gradient-to-br from-[#121212] via-[#2a2a2a] to-[#1ed760]/20';
        return (
            <div className={`mt-3 w-full max-w-[350px] aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 font-sans mx-auto ${bgGradient}`}>
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#1ed760] rounded-full blur-[60px] opacity-40"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-30"></div>
                <div className="absolute inset-0 p-6 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-2xl font-black text-white leading-none tracking-tighter w-1/2">My Top Artist</div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#1ed760]">{data.title.split(' ')[0]}</div>
                        </div>
                    </div>
                    <div className="w-full flex justify-center mb-6 relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1ed760] shadow-[0_0_30px_rgba(30,215,96,0.3)] bg-zinc-800 relative z-10">
                            {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-4xl text-zinc-600 bg-black">{data.artist?.charAt(0)}</div>}
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{data.artist}</h1>
                        <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1ed760] mb-2 border border-white/5">{data.bigStat} Listener</div>
                        <div className="text-sm text-zinc-400 font-medium">{data.subStat} Listened</div>
                    </div>
                    <div className="mt-auto bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase mb-2 tracking-widest pl-1">My Top Songs</div>
                        <div className="space-y-1.5">
                            {data.listItems?.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="text-[#1ed760] font-black text-xs w-4">{idx + 1}</div>
                                    <div className="text-xs font-bold text-white truncate">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-100"><Disc className="text-[#1ed760]" size={24} /></div>
            </div>
        );
    }

    // 2. MOST STREAMED GRAPHIC
    if (data.type === 'MOST_STREAMED_GRAPHIC') {
        return (
            <div className="mt-3 w-full max-w-[480px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 font-sans group cursor-pointer">
                <div className="absolute inset-0 bg-[#101010]">
                    {data.coverArt ? (
                        <img src={data.coverArt} className="absolute right-[-10%] bottom-0 w-[90%] h-[90%] object-cover object-top mask-image-gradient-b filter grayscale contrast-125 brightness-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ maskImage: 'linear-gradient(to top, black 80%, transparent 100%)' }} />
                    ) : <div className="absolute right-0 bottom-0 w-2/3 h-full bg-zinc-800" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#1ed760]/20 to-transparent mix-blend-screen"></div>
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <div className="bg-[#1ed760] text-black text-[10px] font-black px-2 py-1 rounded w-fit mb-2 uppercase tracking-widest">Global Data</div>
                            <h2 className="text-3xl font-black text-white italic tracking-tighter leading-[0.8] uppercase drop-shadow-md">Most<br/>Streamed<br/>Artist</h2>
                        </div>
                        <div className="text-right"><div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1ed760] to-white opacity-20">2025</div></div>
                    </div>
                    <div>
                        <div className="h-[2px] w-12 bg-[#1ed760] mb-3"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-2 drop-shadow-2xl">{data.artist}</h1>
                        <div className="flex items-center gap-2"><BadgeCheck className="text-[#1ed760] fill-black" size={20} /><span className="text-sm font-bold text-zinc-300 uppercase tracking-widest">{data.bigStat}</span></div>
                    </div>
                </div>
                <div className="absolute top-4 right-4 opacity-80"><Disc className="text-white" size={32} /></div>
            </div>
        );
    }

    // 3. SPOTIFY MILESTONE
    if (data.type === 'SPOTIFY_MILESTONE') {
        const isBlue = data.accentColor?.includes('blue');
        const bgClass = isBlue ? 'bg-[#3b82f6]' : 'bg-[#1ed760]';
        const textClass = isBlue ? 'text-[#3b82f6]' : 'text-[#1ed760]';
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative flex flex-col">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${bgClass}`}></div>
                <div className="p-5 pl-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 bg-zinc-800 rounded shadow-lg overflow-hidden shrink-0">{data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover" />}</div>
                            <div className="min-w-0"><h3 className="text-white font-bold text-base line-clamp-1">{data.title}</h3><p className="text-zinc-400 text-xs">{data.artist}</p></div>
                        </div>
                        <Disc className="text-zinc-600" size={18} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-black text-white tracking-tighter">{data.bigStat}</div>
                        <div className={`text-xs font-bold ${textClass}`}>{data.trend}</div>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">{data.subStat}</p>
                </div>
            </div>
        );
    }

    // 4. VIDEO MILESTONE
    if (data.type === 'VIDEO_MILESTONE') {
        return (
            <div className="mt-3 w-full max-w-[500px] aspect-video relative rounded-3xl overflow-hidden shadow-2xl group border border-white/5 cursor-pointer hover:scale-[1.01] transition-transform">
                {data.coverArt ? <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" /> : <div className="absolute inset-0 bg-red-900" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <div className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg border border-red-500/50"><Play fill="currentColor" size={10} /> YouTube Charts</div>
                    </div>
                    <div className="flex flex-col justify-end h-full">
                        <div className="text-center transform translate-y-4">
                            <div className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl leading-none">{data.bigStat}</div>
                            <div className="text-white/90 font-bold uppercase tracking-[0.4em] text-xs mt-2 drop-shadow-md">{data.subStat}</div>
                        </div>
                        <div className="mt-auto pt-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shadow-2xl border-2 border-white/10 shrink-0">{data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover" />}</div>
                            <div className="min-w-0"><h3 className="text-white font-black text-lg leading-none line-clamp-1 drop-shadow-lg mb-1">{data.title}</h3><p className="text-zinc-300 text-sm font-medium">{data.artist}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 5. YOUTUBE POSTER
    if (data.type === 'YOUTUBE_POSTER') {
        return (
            <div className="mt-3 w-full max-w-[480px] aspect-video relative rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group cursor-pointer">
                {data.coverArt ? (
                    <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" />
                ) : <div className="absolute inset-0 bg-red-950"/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
                
                <div className="absolute top-4 left-4">
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                        <Play size={10} fill="currentColor"/> YouTube
                    </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{data.title}</h2>
                    <div className="h-1 w-20 bg-red-600 my-2"></div>
                    <p className="text-sm font-bold text-zinc-200 uppercase tracking-[0.3em] drop-shadow-md">{data.subStat}</p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-xs text-zinc-400 font-medium truncate">{data.artist} - {data.footer}</p>
                </div>
            </div>
        );
    }

    // 6. LINK CARD
    if (data.type === 'LINK_CARD') {
        return (
            <div className="mt-3 w-full max-w-[480px] rounded-xl overflow-hidden border border-zinc-800 cursor-pointer hover:bg-zinc-900/50 transition-colors group">
                <div className="aspect-[1.91/1] w-full bg-zinc-800 relative overflow-hidden">
                    {data.coverArt ? (
                        <img src={data.coverArt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Disc size={48} className="text-zinc-600"/></div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold">
                        {data.linkUrl}
                    </div>
                </div>
                <div className="p-3 bg-[#111]">
                    <div className="text-sm font-bold text-white truncate">{data.title}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1">{data.footer} • {data.artist}</div>
                </div>
            </div>
        );
    }

    return null;
};
