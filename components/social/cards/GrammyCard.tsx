
import React from 'react';
import { SocialCardData } from '../../../types';
import { Award, Mic2, Star, TrendingUp, X, Check, BarChart3, AlertCircle, Calculator, HelpCircle } from 'lucide-react';

interface CardProps {
    data: SocialCardData;
    year: number;
}

export const GrammyCard: React.FC<CardProps> = ({ data, year }) => {
    if (data.type !== 'GRAMMY_CARD') return null;

    const variant = data.grammyVariant;
    
    // --- 1. PREDICTION: POINT CALCULATION (Spreadsheet Style) ---
    // "Predictionnya kayak gambar nanti mereka coba itung point siapa bakal menang"
    if (variant === 'POINT_CALCULATION') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-lg overflow-hidden border border-zinc-300 shadow-xl font-sans">
                <div className="bg-[#bfa068] p-3 flex justify-between items-center text-white">
                    <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2"><Calculator size={14}/> Prediction Model v2.1</span>
                    <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">{year} Awards</span>
                </div>
                <div className="p-4">
                    <div className="text-center mb-4">
                        <h3 className="font-black text-2xl uppercase tracking-tighter">{data.bigStat}</h3>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Weighted Score Analysis</p>
                    </div>
                    <div className="space-y-2">
                        {data.listItems?.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-2 rounded bg-zinc-50 border border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i===0 ? 'bg-green-500' : 'bg-zinc-400'}`}>{i+1}</div>
                                    <span className="font-bold text-sm">{item.label}</span>
                                </div>
                                <span className={`font-mono font-bold ${i===0 ? 'text-green-600' : 'text-zinc-500'}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-100 p-2 text-center text-[9px] text-zinc-400 font-bold uppercase border-t border-zinc-200">
                    *Estimates only. Not official Academy data.
                </div>
            </div>
        );
    }

    // --- 2. PREDICTION: ODDS / PROBABILITY ---
    if (variant === 'PREDICTION_ODDS') {
        return (
            <div className="mt-3 w-full max-w-[480px] aspect-video relative rounded-lg overflow-hidden shadow-lg border border-zinc-800 bg-zinc-900 group">
                {data.coverArt ? <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover opacity-60" /> : null}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                
                <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">Frontrunner</span>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center p-6 z-10">
                    <div className="text-zinc-300 font-bold uppercase tracking-[0.2em] text-xs mb-1">{data.subStat}</div>
                    <div className="text-6xl font-black text-white tracking-tighter leading-none mb-2">{data.bigStat}</div>
                    <div className="w-16 h-1 bg-green-500 mb-4"></div>
                    <div className="text-white font-bold text-xl">{data.artist}</div>
                </div>
            </div>
        );
    }

    // --- 3. PREDICTION: WHO SHOULD WIN (Fan Ballot) ---
    if (variant === 'WHO_SHOULD_WIN') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#1a1a1a] border border-white/10 rounded-lg p-5 text-white">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/20">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <div className="bg-purple-600 w-full h-full"></div>}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">My Ballot</div>
                        <div className="font-bold text-sm">Album of the Year</div>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.listItems?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-black/40 p-2 rounded border border-white/5">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest w-24">{item.label}</span>
                            <span className={`text-sm font-bold truncate flex-1 text-right ${item.label.includes('SNUB') ? 'text-red-400' : 'text-white'}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- EXISTING VARIANTS (Gold/Black Official) ---
    
    // 1. GOLD/BLACK (Official)
    if (['OFFICIAL_NOM', 'OFFICIAL_WINNER', 'RECORD_BROKEN', 'NOM_LEADERBOARD'].includes(variant || '')) {
        const isWinner = variant === 'OFFICIAL_WINNER';
        return (
            <div className={`mt-3 w-full max-w-[480px] aspect-square relative rounded-sm overflow-hidden shadow-2xl border ${isWinner ? 'border-[#bfa068]' : 'border-[#bfa068]/30'} group cursor-pointer font-serif bg-black`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#bfa068]/20 via-black to-black opacity-90"></div>
                {/* Gramophone Watermark */}
                <div className="absolute -right-10 -bottom-10 opacity-10"><Award size={200} className="text-[#bfa068]" /></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center z-10">
                    <div className="mb-4"><Award size={40} className="text-[#bfa068]" fill={isWinner ? "currentColor" : "none"}/></div>
                    <div className="text-[#bfa068] text-xs font-bold tracking-[0.3em] uppercase mb-2">{data.title}</div>
                    <div className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 drop-shadow-xl">{data.bigStat}</div>
                    <div className="h-px w-20 bg-[#bfa068] mb-4"></div>
                    <div className="text-zinc-300 text-lg font-serif italic">{data.subStat}</div>
                    
                    {variant === 'NOM_LEADERBOARD' && data.listItems && (
                        <div className="mt-6 w-full bg-white/5 p-4 rounded border border-white/10">
                            {data.listItems.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                                    <span className="text-white font-bold">{item.label}</span>
                                    <span className="text-[#bfa068] font-mono">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-zinc-500 font-sans tracking-widest">{data.footer}</div>
            </div>
        );
    }

    // 2. FYC POSTER (Clean, Ad-like)
    if (['FYC_POSTER', 'VOTING_GUIDE'].includes(variant || '')) {
        return (
            <div className="mt-3 w-full max-w-[480px] aspect-[4/5] relative rounded-sm overflow-hidden shadow-2xl border border-zinc-800 bg-[#1a1a1a]">
                {data.coverArt ? <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover opacity-60" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80"></div>
                <div className="absolute top-8 left-0 w-full text-center">
                    <div className="text-white font-bold tracking-[0.2em] text-xs uppercase border-y border-white/20 py-2 mx-10">{data.title}</div>
                </div>
                <div className="absolute bottom-10 left-0 w-full text-center p-6">
                    <div className="text-[#bfa068] font-serif italic text-2xl mb-2">{data.subStat}</div>
                    <div className="text-white font-black text-5xl uppercase tracking-tighter leading-none mb-4">{data.bigStat}</div>
                    <div className="text-zinc-400 text-[10px] uppercase tracking-widest">{data.footer}</div>
                </div>
            </div>
        );
    }

    // 3. HATER / SNUB / MEME (High Contrast, Bold)
    if (['HATER_ZERO_NOMS', 'SNUB_ALERT', 'ROBBED_MEME'].includes(variant || '')) {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-red-950/20 border border-red-900/50 rounded-lg p-6 relative overflow-hidden text-center">
                {/* Diagonal Stripe */}
                <div className="absolute top-0 right-0 -mr-8 mt-4 w-32 h-8 bg-red-600 rotate-45 flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {variant === 'HATER_ZERO_NOMS' ? 'FLOP' : 'ROBBED'}
                </div>
                
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-red-600 overflow-hidden relative">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover grayscale contrast-125" /> : <X size={40} className="m-auto mt-6 text-red-600"/>}
                        <div className="absolute inset-0 bg-red-900/30"></div>
                    </div>
                </div>
                
                <h2 className="text-3xl font-black text-white italic uppercase mb-2">{data.bigStat}</h2>
                <p className="text-red-400 font-bold uppercase tracking-widest text-xs border-t border-red-900/50 pt-3">{data.subStat}</p>
                <p className="text-zinc-500 text-[10px] mt-2">{data.footer}</p>
            </div>
        );
    }

    // 4. CHART / DATA (Betting Odds, Stream Impact)
    if (['BETTING_ODDS', 'STREAM_IMPACT', 'COMPARISON_STATS'].includes(variant || '')) {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-lg overflow-hidden border border-zinc-300">
                <div className="bg-black text-white p-3 flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-widest">{data.title}</span>
                    <BarChart3 size={16} className="text-[#bfa068]" />
                </div>
                <div className="p-6">
                    {variant === 'STREAM_IMPACT' && (
                        <div className="text-center">
                            <TrendingUp size={48} className="text-green-600 mx-auto mb-2" />
                            <div className="text-5xl font-black text-green-600">{data.bigStat}</div>
                            <div className="text-zinc-500 font-bold uppercase tracking-wide mt-1">{data.subStat}</div>
                        </div>
                    )}
                    
                    {variant === 'BETTING_ODDS' && data.listItems && (
                        <div className="space-y-3">
                            {data.listItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="font-bold text-lg">{item.label}</span>
                                    <span className={`font-mono font-bold px-2 py-1 rounded ${i===0 ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {variant === 'COMPARISON_STATS' && (
                        <div className="flex justify-between items-center">
                            <div className="text-center">
                                <div className="text-sm text-zinc-500">{data.compareLeft?.label}</div>
                                <div className="text-xl font-black">{data.compareLeft?.value}</div>
                            </div>
                            <div className="text-zinc-300 font-black italic">VS</div>
                            <div className="text-center">
                                <div className="text-sm text-zinc-500">{data.compareRight?.label}</div>
                                <div className="text-xl font-black">{data.compareRight?.value}</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-zinc-100 p-2 text-center text-[9px] text-zinc-500 font-bold uppercase">{data.footer}</div>
            </div>
        );
    }

    // 5. GENERIC VISUAL (Red Carpet, Performance, Lyric)
    return (
        <div className="mt-3 w-full max-w-[480px] aspect-video relative rounded-lg overflow-hidden shadow-lg border border-white/10 group cursor-pointer">
            {data.coverArt ? <img src={data.coverArt} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 bg-zinc-800"/>}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div className="absolute top-3 left-3 bg-white text-black px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                {data.title}
            </div>
            
            <div className="absolute bottom-3 left-3 right-3">
                <div className="text-white font-black text-2xl uppercase leading-none drop-shadow-lg">{data.bigStat}</div>
                {data.subStat && <div className="text-zinc-300 text-xs font-bold mt-1 bg-black/50 inline-block px-1">{data.subStat}</div>}
            </div>
            
            <div className="absolute bottom-3 right-3 opacity-80">
                {variant === 'PERFORMANCE_ANNOUNCE' && <Mic2 className="text-white" />}
                {variant === 'OUTFIT_RATING' && <Star className="text-yellow-400 fill-current" />}
            </div>
        </div>
    );
};
