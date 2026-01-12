
import React from 'react';
import { SocialCardData } from '../../../types';
import { BadgeCheck, Newspaper, ArrowLeft, Disc, ShoppingBag, User } from 'lucide-react';

interface CardProps {
    data: SocialCardData;
}

export const NewsCard: React.FC<CardProps> = ({ data }) => {

    // 1. NEWS HEADLINE
    if (data.type === 'NEWS_HEADLINE') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white rounded-lg overflow-hidden shadow-xl border border-zinc-200">
                <div className="bg-red-600 px-4 py-1.5 flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-white uppercase tracking-widest">Breaking News</span>
                </div>
                <div className="p-4 flex gap-4 items-start">
                    <div className="w-20 h-20 bg-zinc-200 shrink-0 overflow-hidden rounded-md relative border border-zinc-300">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <Newspaper className="m-auto mt-6 text-zinc-400"/>}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-black text-black leading-tight mb-2 line-clamp-3 uppercase font-sans tracking-tight">{data.title}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            <span className="text-red-600">{data.footer}</span>
                            <span>•</span>
                            <span>{data.subStat}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. MAGAZINE COVER
    if (data.type === 'MAGAZINE_COVER') {
        return (
            <div className="mt-3 w-full max-w-[350px] aspect-[3/4] relative rounded-sm overflow-hidden shadow-2xl border border-zinc-800 group cursor-pointer hover:scale-[1.01] transition-transform mx-auto">
                {data.coverArt ? <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-zinc-800" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-4 left-0 w-full text-center z-10">
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none drop-shadow-xl uppercase mix-blend-overlay opacity-90 scale-y-110 font-serif">{data.magazineName || 'ICON'}</h1>
                </div>
                <div className="absolute bottom-8 left-4 right-4 text-white z-10">
                    <h2 className="text-4xl font-black uppercase leading-[0.9] mb-3 drop-shadow-md font-serif italic text-yellow-400">{data.title}</h2>
                    <div className="space-y-1 border-l-2 border-white pl-3">
                        {data.headlines?.map((line, i) => <p key={i} className="text-xs font-bold uppercase tracking-widest drop-shadow-md text-white">{line}</p>)}
                    </div>
                </div>
            </div>
        );
    }

    // 3. REVIEW CARD
    if (data.type === 'REVIEW_CARD') {
        const score = parseFloat(data.score || '0');
        const color = score >= 8.0 ? 'text-red-500' : score >= 5 ? 'text-yellow-500' : 'text-zinc-500';
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-lg overflow-hidden shadow-xl border border-zinc-200">
                <div className="flex">
                    <div className="w-1/3 bg-zinc-100 relative">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-200"><Disc size={32}/></div>}
                    </div>
                    <div className="w-2/3 p-4 flex flex-col justify-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{data.publication || 'MUSIC REVIEW'}</div>
                        <h3 className="font-bold text-lg leading-tight mb-1">{data.title}</h3>
                        <p className="text-xs text-zinc-600 mb-3">{data.artist}</p>
                        <div className="flex items-center gap-3">
                            <div className={`text-4xl font-black ${color}`}>{data.score}</div>
                            {score >= 8.0 && <div className="text-[8px] font-bold uppercase border border-red-500 text-red-500 px-1 py-0.5 rounded">Best New Music</div>}
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-zinc-50 border-t border-zinc-100"><p className="text-sm font-serif italic text-zinc-800 line-clamp-3">"{data.quote}"</p></div>
            </div>
        );
    }

    // 4. QUOTE CARD
    if (data.type === 'QUOTE_CARD') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <div className="p-6">
                    <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 shrink-0">
                            {data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <div className="font-bold text-white text-lg">{data.artist}</div>
                            <div className="text-zinc-500 text-xs uppercase tracking-wider font-bold">On {data.footer}</div>
                        </div>
                    </div>
                    <p className="text-xl text-zinc-200 font-medium leading-relaxed"><span className="text-zinc-600 mr-1">"</span>{data.quote}<span className="text-zinc-600 ml-1">"</span></p>
                </div>
                {data.linkUrl && (
                    <div className="bg-zinc-900 px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Read Full Story</span>
                        <ArrowLeft className="rotate-180 text-zinc-500" size={16} />
                    </div>
                )}
            </div>
        );
    }

    // 5. BANNER NEWS
    if (data.type === 'BANNER_NEWS') {
        return (
            <div className="mt-3 w-full max-w-[480px] aspect-[2.5/1] relative rounded-lg overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
                {data.coverArt ? (
                    <div className="absolute inset-0">
                        <img src={data.coverArt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#991b1b] via-[#991b1b]/80 to-transparent mix-blend-multiply"></div>
                    </div>
                ) : <div className="absolute inset-0 bg-red-900" />}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-center relative z-10">
                    <div className="bg-white text-red-700 w-fit px-2 py-0.5 text-[10px] font-black uppercase tracking-widest mb-2 transform -skew-x-12">Breaking</div>
                    <h2 className="text-3xl font-black text-white italic uppercase leading-none tracking-tighter drop-shadow-md max-w-[80%]">{data.title}</h2>
                    <div className="h-1 w-20 bg-white mt-3"></div>
                    <p className="text-white/80 font-bold uppercase text-xs mt-2 tracking-wide flex items-center gap-2"><BadgeCheck size={14} className="text-white fill-red-600"/> {data.subStat}</p>
                </div>
                <div className="absolute bottom-3 right-3 text-white/50"><Disc size={24} /></div>
            </div>
        );
    }

    // 6. SPLIT IMAGE NEWS
    if (data.type === 'SPLIT_IMAGE_NEWS') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-black rounded-lg overflow-hidden border border-zinc-800 flex">
                <div className="w-1/2 aspect-square relative border-r border-zinc-800">
                    {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Disc size={32} className="text-zinc-600"/></div>}
                </div>
                <div className="w-1/2 aspect-square relative">
                    {data.opponentImage ? <img src={data.opponentImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-800"><User size={32} className="text-zinc-600"/></div>}
                </div>
            </div>
        );
    }

    // 7. BRAND AD
    if (data.type === 'BRAND_AD') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-lg overflow-hidden shadow-xl border border-zinc-200 group relative">
                <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-100 bg-white">
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${data.accentColor || 'bg-black'} flex items-center justify-center text-white text-[10px] font-bold`}>{data.subStat ? data.subStat[0] : 'B'}</div>
                        <span className="font-bold text-sm tracking-tight">{data.subStat}</span>
                        <BadgeCheck size={14} className="text-blue-500" />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium">Sponsored</span>
                </div>
                <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden">
                    {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><ShoppingBag size={48}/></div>}
                    {data.bottomImages && data.bottomImages.length > 0 && (
                        <div className="absolute bottom-4 right-4 w-20 h-28 border-4 border-white shadow-2xl rotate-[-3deg] overflow-hidden rounded-sm bg-black">
                            <img src={data.bottomImages[0]} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-black text-xl leading-none mb-1 uppercase tracking-tight">{data.title}</h3>
                            <p className="text-xs text-zinc-500 font-medium">The new collection. Available now.</p>
                        </div>
                        <button className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors">Shop Now</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
