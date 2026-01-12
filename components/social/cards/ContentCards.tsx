
import React from 'react';
import { SocialCardData } from '../../../types';
import { Quote, Disc } from 'lucide-react';

interface CardProps {
    data: SocialCardData;
}

export const ContentCard: React.FC<CardProps> = ({ data }) => {

    // 1. LYRIC CARD
    if (data.type === 'LYRIC_CARD') {
        return (
            <div className="mt-3 w-full max-w-[400px] aspect-square relative rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center p-8 text-center mx-auto">
                {data.coverArt && <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-125" />}
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex flex-col items-center">
                    <Quote size={32} className="text-white/30 mb-4 fill-white/10" />
                    <p className="text-2xl md:text-3xl font-serif italic font-medium text-white leading-snug drop-shadow-lg mb-6">"{data.quote}"</p>
                    <div className="flex items-center justify-center gap-2 mt-auto">
                        <div className="w-5 h-5 rounded-full bg-zinc-800 overflow-hidden border border-white/20">
                            {data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover" />}
                        </div>
                        <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{data.title}</div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. VERSUS BATTLE
    if (data.type === 'VERSUS_BATTLE') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-center pt-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-red-600 px-2 py-0.5 rounded skew-x-[-10deg]">{data.title}</span>
                </div>
                <div className="flex h-48 relative">
                    <div className="w-1/2 relative overflow-hidden">
                        {data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover" />}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-3">
                            <div className="text-white font-black uppercase text-lg leading-none">{data.artist}</div>
                            <div className="text-emerald-400 font-mono text-xs">{data.bigStat}</div>
                        </div>
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black z-20 flex items-center justify-center -translate-x-1/2">
                        <div className="bg-black border-2 border-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-black italic">VS</div>
                    </div>
                    <div className="w-1/2 relative overflow-hidden bg-zinc-900">
                        {data.opponentImage && <img src={data.opponentImage} className="w-full h-full object-cover" />}
                        <div className="absolute bottom-0 right-0 w-full bg-gradient-to-t from-black to-transparent p-3 text-right">
                            <div className="text-white font-black uppercase text-lg leading-none">{data.opponentName}</div>
                            <div className="text-zinc-400 font-mono text-xs">{data.opponentStat}</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-zinc-900 text-center text-xs text-zinc-400 font-bold uppercase tracking-wider">{data.footer}</div>
            </div>
        );
    }

    // 3. IMAGE GRID
    if (data.type === 'IMAGE_GRID' && data.gridImages) {
        return (
            <div className="mt-3 w-full max-w-[480px] grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {data.gridImages.map((img, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 relative group overflow-hidden">
                        {img ? <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-zinc-800"><Disc size={24} /></div>}
                    </div>
                ))}
            </div>
        );
    }

    // 4. FOLLOWER UPDATE
    if (data.type === 'FOLLOWER_UPDATE') {
        return (
            <div className={`mt-3 w-full max-w-[480px] bg-[#1a1a1a] rounded-2xl relative overflow-hidden flex flex-col shadow-2xl border border-white/5`}>
                <div className="p-4 flex items-center justify-between bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">{data.listItems?.[0]?.image ? <img src={data.listItems[0].image} className="w-full h-full object-cover"/> : null}</div>
                        <div>
                            <div className="font-bold text-white text-sm">{data.artist}</div>
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Social Statistics</div>
                        </div>
                    </div>
                    <div className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded border border-green-500/20">LIVE</div>
                </div>
                <div className="p-6 flex justify-around items-center">
                    <div className="text-center"><div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">New Followers</div><div className="text-2xl font-black text-green-400">{data.listItems?.[0]?.change}</div></div>
                    <div className="w-px h-10 bg-zinc-800"></div>
                    <div className="text-center"><div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Total</div><div className="text-2xl font-black text-white">{data.listItems?.[0]?.value}</div></div>
                </div>
            </div>
        );
    }

    return null;
};
