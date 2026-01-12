
import React from 'react';
import { SocialCardData } from '../../../types';
import { Award, BarChart2, Music } from 'lucide-react';

interface CardProps {
    data: SocialCardData;
    year: number;
}

export const ChartCard: React.FC<CardProps> = ({ data, year }) => {

    // 1. CERTIFICATION GRID
    if (data.type === 'CERTIFICATION_GRID') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-black rounded-lg overflow-hidden border border-zinc-800 p-4">
                <div className="text-center mb-4">
                    <h3 className="text-lg font-serif italic text-zinc-300 tracking-wider mb-1">{data.title}</h3>
                    <div className="h-[1px] w-20 bg-zinc-700 mx-auto"></div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    {data.certItems?.map((item, idx) => {
                        const isGold = item.level === 'Gold';
                        const isDiamond = item.level === 'Diamond';
                        const discColor = isDiamond ? 'bg-cyan-200' : isGold ? 'bg-yellow-500' : 'bg-zinc-300';
                        return (
                            <div key={idx} className="flex flex-col items-center">
                                <div className={`w-14 h-14 rounded-full ${discColor} shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center border-4 border-white/10 relative mb-2`}>
                                    <div className="w-4 h-4 rounded-full bg-black/20"></div>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent pointer-events-none"></div>
                                </div>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase">{item.platform}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="text-center border-t border-zinc-900 pt-3">
                    <p className="text-[10px] font-mono text-zinc-500">{data.footer}</p>
                </div>
            </div>
        );
    }

    // 2. COMPARISON 3D
    if (data.type === 'COMPARISON_3D') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-xl overflow-hidden shadow-sm border border-zinc-200 p-6 relative">
                <div className="absolute inset-0 z-0 flex flex-col justify-between p-6 opacity-10 pointer-events-none">
                    <div className="w-full h-px bg-black"></div><div className="w-full h-px bg-black"></div><div className="w-full h-px bg-black"></div><div className="w-full h-px bg-black"></div>
                </div>
                <div className="relative z-10 flex justify-around items-end h-64 pb-6">
                    <div className="flex flex-col items-center w-1/3 group">
                        <div className="text-sm font-bold mb-2">{data.compareLeft?.value}</div>
                        <div className="w-full bg-[#9d8bf4] shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-1000 relative overflow-hidden" style={{ height: `${data.compareLeft?.height}%` }}>
                            {data.compareLeft?.image && <img src={data.compareLeft.image} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />}
                        </div>
                        <div className="mt-3 font-bold text-xs uppercase tracking-wider text-zinc-600">{data.compareLeft?.label}</div>
                    </div>
                    <div className="flex flex-col items-center w-1/3 group">
                        <div className="text-sm font-bold mb-2">{data.compareRight?.value}</div>
                        <div className="w-full bg-[#5a4b9c] shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-1000 relative overflow-hidden" style={{ height: `${data.compareRight?.height}%` }}>
                            {data.compareRight?.image && <img src={data.compareRight.image} className="w-full h-full object-cover opacity-80 mix-blend-multiply" />}
                        </div>
                        <div className="mt-3 font-bold text-xs uppercase tracking-wider text-zinc-600">{data.compareRight?.label}</div>
                    </div>
                </div>
                <div className="text-center text-[10px] text-zinc-400 font-bold uppercase">{data.footer}</div>
            </div>
        );
    }

    // 3. LEADERBOARD COMPLEX
    if (data.type === 'LEADERBOARD_COMPLEX') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#6b7280] text-white rounded-lg overflow-hidden flex font-sans shadow-lg">
                <div className="w-2/5 bg-[#52525b] p-4 flex flex-col items-center justify-center text-center relative border-r border-white/10">
                    <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-4 absolute top-4">Daily Top Albums</div>
                    <div className="w-28 h-28 shadow-2xl mb-4 relative group">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" /> : <div className="bg-zinc-800 w-full h-full"/>}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-black font-black text-lg w-8 h-8 flex items-center justify-center rounded-full shadow-lg">#1</div>
                    </div>
                    <h3 className="font-bold text-sm leading-tight mb-2 mt-2 line-clamp-2">{data.title}</h3>
                    <div className="bg-white/10 px-3 py-1 rounded text-xs font-mono font-bold mb-1">{data.bigStat}</div>
                    <div className="text-green-400 text-xs font-bold">{data.trend}</div>
                </div>
                <div className="flex-1 bg-[#71717a]">
                    <div className="text-right p-2 px-4 text-[10px] font-bold text-white/50">{year} Update</div>
                    <div className="flex flex-col">
                        {data.listItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                <div className={`w-6 text-center font-bold text-xs ${item.movement === 'up' ? 'bg-green-500 text-black' : item.movement === 'down' ? 'bg-red-500 text-white' : 'bg-transparent text-white/50'} rounded-sm mr-3 flex items-center justify-center h-5`}>
                                    {item.movement === 'up' ? '+' : item.movement === 'down' ? '-' : ''}{Math.abs(item.movementValue || 0)}
                                </div>
                                <div className="text-sm font-bold w-6 text-white/80">#{item.rank}</div>
                                <div className="w-8 h-8 bg-zinc-800 mr-3 shrink-0 overflow-hidden rounded-sm">{item.image && <img src={item.image} className="w-full h-full object-cover" />}</div>
                                <div className="flex-1 min-w-0 mr-2"><div className="text-xs font-bold truncate">{item.label}</div></div>
                                <div className="text-right"><div className="text-[10px] font-mono opacity-80">{item.value}</div><div className={`text-[9px] font-bold ${item.change?.includes('-') ? 'text-red-300' : 'text-green-300'}`}>{item.change}</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 4. SIDE IMAGE LIST
    if (data.type === 'SIDE_IMAGE_LIST') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-white text-black rounded-lg overflow-hidden border border-zinc-200 flex">
                <div className="flex-1 p-5 font-sans">
                    <div className="mb-4">
                        <h3 className="font-black text-2xl leading-none uppercase italic">{data.artist}</h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{data.subStat}</p>
                    </div>
                    <div className="space-y-1.5">
                        {data.listItems?.slice(0, 10).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-baseline text-[11px] border-b border-zinc-100 pb-0.5 last:border-0">
                                <span className="font-bold text-zinc-800 truncate pr-2 w-32">{idx + 1}. {item.label}</span>
                                <span className="font-mono text-zinc-500">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-2/5 relative">
                    {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover grayscale contrast-125" /> : <div className="w-full h-full bg-zinc-200" />}
                    <div className="absolute inset-0 bg-red-600 mix-blend-screen opacity-20"></div>
                </div>
            </div>
        );
    }

    // 5. CHART POSITION
    if (data.type === 'CHART_POSITION') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#121212] rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <div className="h-1.5 w-full bg-gradient-to-r from-white via-zinc-400 to-zinc-600"></div>
                <div className="p-5 flex items-center gap-5">
                    <div className="w-24 h-24 bg-zinc-800 shadow-2xl shrink-0 relative border border-white/10 rounded-md overflow-hidden">
                        {data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-zinc-900"><Music className="text-zinc-700"/></div>}
                        <div className="absolute -bottom-2 -right-2 bg-white text-black font-black w-8 h-8 flex items-center justify-center rounded-full text-lg shadow-lg z-10 border-2 border-[#121212]">{data.bigStat?.replace('#', '') || '1'}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">{data.footer}</div>
                        <h2 className="text-xl font-black text-white leading-none mb-1 truncate">{data.title}</h2>
                        <p className="text-zinc-400 text-sm font-medium mb-3">{data.artist}</p>
                        <div className="inline-flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                            <span className="text-xs font-bold text-white">{data.subStat}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 6. SALES CERT
    if (data.type === 'SALES_CERT') {
        const isGold = data.accentColor.includes('Gold') || data.accentColor.includes('yellow');
        const gradient = isGold ? 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-yellow-200 via-yellow-500 to-yellow-700' : 'bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-400 to-gray-600';
        return (
            <div className={`mt-3 w-full max-w-[480px] p-1 rounded-xl bg-gradient-to-b from-white/10 to-black shadow-2xl relative overflow-hidden group`}>
                <div className="bg-[#080808] rounded-lg p-6 relative overflow-hidden border border-white/5">
                    <div className={`absolute -top-20 -right-20 w-64 h-64 ${isGold ? 'bg-yellow-500' : 'bg-blue-400'} opacity-10 blur-[80px] rounded-full pointer-events-none`}></div>
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="flex items-center gap-2 mb-6 opacity-60"><Award size={14} className="text-white" /><span className="text-[9px] font-bold text-white uppercase tracking-[0.3em]">Official Certification</span></div>
                        <div className={`w-36 h-36 rounded-full ${gradient} p-[2px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-6 relative`}>
                            <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center relative overflow-hidden border-4 border-black/20">
                                <div className="absolute inset-0 rounded-full border-[14px] border-white/5 opacity-20"></div>
                                <div className="absolute inset-6 rounded-full border-[1px] border-white/10 opacity-20"></div>
                                <div className="w-14 h-14 bg-cover bg-center rounded-full shadow-inner" style={{ backgroundImage: `url(${data.coverArt})` }}></div>
                            </div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-40 pointer-events-none"></div>
                        </div>
                        <h2 className={`text-4xl font-black ${isGold ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-500' : 'text-white'} tracking-tighter leading-none mb-3 drop-shadow-sm`}>{data.bigStat}</h2>
                        <div className="h-px w-16 bg-white/10 my-3"></div>
                        <h3 className="text-white font-bold text-xl">{data.title}</h3>
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-1">{data.artist}</p>
                    </div>
                </div>
            </div>
        );
    }

    // 7. RANKED LIST
    if (data.type === 'RANKED_LIST') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">{data.title}</h3>
                    <BarChart2 size={16} className="text-zinc-500"/>
                </div>
                {data.coverArt && (
                    <div className="w-full h-32 overflow-hidden relative border-b border-zinc-800">
                        <img src={data.coverArt} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    </div>
                )}
                <div className="p-2">
                    {data.listItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors group">
                            <span className="text-zinc-500 font-mono font-bold w-4 text-center">{idx + 1}</span>
                            <div className="w-8 h-8 bg-zinc-800 rounded overflow-hidden shrink-0">{item.image && <img src={item.image} className="w-full h-full object-cover"/>}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-white truncate">{item.label}</div>
                                {item.subLabel && <div className="text-[10px] text-zinc-500 uppercase">{item.subLabel}</div>}
                            </div>
                            <div className="text-sm font-mono text-white font-bold">{item.value}</div>
                        </div>
                    ))}
                </div>
                <div className="px-4 py-2 bg-zinc-900/30 text-center border-t border-zinc-800"><span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{data.footer}</span></div>
            </div>
        );
    }

    // 8. DATA TABLE
    if (data.type === 'DATA_TABLE') {
        return (
            <div className={`mt-3 w-full max-w-[480px] bg-[#09090b] rounded-xl relative overflow-hidden flex flex-col shadow-2xl border border-white/5`}>
                {data.coverArt && (
                    <div className="w-full h-32 overflow-hidden relative">
                        <img src={data.coverArt} className="w-full h-full object-cover opacity-40 blur-sm scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent"></div>
                        <div className="absolute bottom-4 left-6 z-10"><h2 className="text-2xl font-black text-white leading-none drop-shadow-md">{data.title}</h2><p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">{data.footer}</p></div>
                    </div>
                )}
                <div className="w-full px-6 pb-6 pt-2">
                    <div className="grid grid-cols-[1fr_80px_80px] pb-2 border-b border-white/10 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2"><div>Track</div><div className="text-right">Daily</div><div className="text-right">Total</div></div>
                    <div className="space-y-3">
                        {data.tableRows?.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_80px_80px] items-center">
                                <div className="flex items-center gap-3 overflow-hidden"><span className="text-[10px] font-mono text-zinc-600 w-3">{idx + 1}</span>{row.image && <img src={row.image} className="w-6 h-6 rounded bg-zinc-800 object-cover" />}<span className={`truncate text-xs font-medium text-zinc-300`}>{row.label}</span></div>
                                <div className="text-right font-mono text-xs text-white">{row.col1}</div>
                                <div className="text-right font-mono text-xs text-zinc-500">{row.col2}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 9. TEXT LIST OVERLAY
    if (data.type === 'TEXT_LIST_OVERLAY') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#1a1a1a] rounded-lg overflow-hidden border border-zinc-800 relative">
                <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex gap-4 items-center">
                    <div className="w-16 h-16 bg-zinc-800 rounded shadow-lg overflow-hidden shrink-0">{data.coverArt ? <img src={data.coverArt} className="w-full h-full object-cover"/> : null}</div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Charting Now</div>
                        <div className="font-bold text-white text-lg leading-tight">{data.title}</div>
                        <div className="text-sm text-zinc-400">{data.artist}</div>
                    </div>
                </div>
                <div className="p-4 space-y-2 text-sm text-zinc-300">
                    {data.listItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2"><span className="text-zinc-500 font-mono text-xs w-4">{idx + 1}</span><span>{item.label}</span></div>
                            <span className="font-bold text-white">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 10. DATE STREAM TRACKER
    if (data.type === 'DATE_STREAM_TRACKER') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                <div className="p-4 border-b border-zinc-800 bg-black">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden">{data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover"/>}</div>
                        <div><div className="font-bold text-white text-sm">{data.title}</div><div className="text-xs text-zinc-500">{data.artist}</div></div>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {data.listItems?.map((item, idx) => (
                            <div key={idx} className={`p-2 rounded text-center ${item.isHighlight ? 'bg-green-900/30 border border-green-500/50' : 'bg-zinc-800/50 border border-zinc-700'}`}>
                                <div className="text-[10px] text-zinc-400 mb-1">{item.label}</div>
                                <div className={`text-xs font-bold ${item.isHighlight ? 'text-green-400' : 'text-white'}`}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center"><div className="text-3xl font-black text-white">{data.bigStat}</div><div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{data.subStat}</div></div>
                </div>
            </div>
        );
    }

    // 11. CHART LEADERBOARD TEXT
    if (data.type === 'CHART_LEADERBOARD_TEXT') {
        return (
            <div className="mt-3 w-full max-w-[480px] bg-[#111] rounded-xl overflow-hidden border border-zinc-800">
                <div className="relative h-24 overflow-hidden">
                    {data.coverArt && <img src={data.coverArt} className="w-full h-full object-cover opacity-40 blur-sm"/>}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><h3 className="text-xl font-black text-white uppercase tracking-tight">{data.title}</h3></div>
                </div>
                <div className="p-4 space-y-3">
                    {data.listItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <div className="font-medium text-zinc-300 truncate pr-4"><span className="font-bold text-white mr-2">{idx + 1}.</span>{item.label.split('. ')[1]}</div>
                            <div className="font-mono text-zinc-500 text-xs">{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};
