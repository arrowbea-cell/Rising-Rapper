
import React from 'react';
import { AwardCategoryResult } from '../../types';
import { Music, User, BarChart3 } from 'lucide-react';

interface CategoryPresentationProps {
    phase: 'CATEGORY_INTRO' | 'NOMINEES' | 'POINTS' | 'DRUMROLL' | 'WINNER';
    category: AwardCategoryResult;
    nomineeIndex: number;
}

export const CategoryPresentation: React.FC<CategoryPresentationProps> = ({ phase, category, nomineeIndex }) => {

    if (phase === 'CATEGORY_INTRO') {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in slide-in-from-right duration-500">
                <div className="text-yellow-500 font-black tracking-[0.5em] uppercase text-sm mb-4">Category</div>
                <h2 className="text-5xl md:text-7xl font-black text-white text-center leading-none uppercase drop-shadow-2xl border-y-2 border-yellow-500/30 py-8 w-full bg-black/50 backdrop-blur-sm">
                    {category.categoryName}
                </h2>
            </div>
        );
    }

    if (phase === 'NOMINEES') {
        const safeIndex = Math.min(nomineeIndex, category.nominees.length - 1);
        const nominee = category.nominees[safeIndex];
        
        return (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                    {/* Left: Image */}
                    <div key={nominee.id} className="aspect-square w-full max-w-md mx-auto bg-zinc-900 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] border border-yellow-500/30 relative group animate-in slide-in-from-left fade-in duration-300">
                        {nominee.image ? (
                            <img src={nominee.image} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><Music size={64} className="text-zinc-700"/></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                            <div className="bg-yellow-500 text-black font-black text-xs px-2 py-1 rounded uppercase tracking-wider mb-1">Nominee</div>
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="text-center md:text-left animate-in slide-in-from-right fade-in duration-300">
                        <h3 className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-4 uppercase">{nominee.name}</h3>
                        <p className="text-2xl text-yellow-500 font-serif italic">{nominee.artistName}</p>
                        {nominee.isPlayer && (
                            <div className="mt-6 inline-block border border-purple-500 text-purple-400 px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm bg-purple-900/20">
                                This is You
                            </div>
                        )}
                    </div>
                </div>
                
                {/* List Progress */}
                <div className="flex gap-2 mt-12">
                    {category.nominees.map((_, i) => (
                        <div key={i} className={`h-1.5 w-12 rounded-full transition-colors duration-300 ${i === safeIndex ? 'bg-yellow-500' : 'bg-zinc-800'}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (phase === 'POINTS') {
        return (
            <div className="w-full max-w-3xl mx-auto h-full flex flex-col justify-center">
                <h3 className="text-3xl font-black text-center mb-8 uppercase text-white tracking-widest flex items-center justify-center gap-3">
                    <BarChart3 className="text-yellow-500" /> Points Breakdown
                </h3>
                <div className="space-y-4">
                    {category.nominees.map((nom, idx) => {
                        const isWinner = nom.id === category.winner.id;
                        const percent = Math.max(10, (nom.score / category.winner.score) * 100);
                        
                        return (
                            <div key={nom.id} className="relative">
                                <div className="flex justify-between text-sm font-bold text-zinc-400 mb-1 px-1">
                                    <span>{nom.artistName} - {nom.name}</span>
                                    <span className="font-mono text-yellow-500 opacity-0 animate-in fade-in duration-500" style={{ animationDelay: `${idx * 100 + 500}ms` }}>
                                        {Math.floor(nom.score)} pts
                                    </span>
                                </div>
                                <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className={`h-full ${isWinner ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-zinc-700'} rounded-full transition-all duration-[1000ms] ease-out w-0 animate-grow-width`}
                                        style={{ width: `${percent}%`, animationFillMode: 'forwards', animationDelay: `${idx * 50}ms` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <style>{`
                    @keyframes grow-width {
                        from { width: 0%; }
                    }
                `}</style>
            </div>
        );
    }

    // --- NEW SPLIT SCREEN VIEW FOR DRUMROLL ---
    if (phase === 'DRUMROLL') {
        return (
            <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 justify-center relative">
                <div className="absolute top-10 left-0 w-full text-center z-20">
                    <div className="bg-red-600 text-white px-6 py-2 rounded-sm font-black text-sm tracking-[0.3em] inline-block animate-pulse shadow-lg border border-red-500">
                        AND THE WINNER IS...
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 h-[70vh]">
                    {category.nominees.slice(0, 5).map((nom, i) => (
                        <div 
                            key={nom.id} 
                            className={`relative bg-zinc-900 border-2 border-zinc-800 rounded-lg overflow-hidden ${category.nominees.length === 5 && i >= 3 ? 'col-span-1.5' : 'col-span-1'} ${category.nominees.length < 5 ? 'col-span-1' : ''}`}
                        >
                            {/* Live Feed Effect */}
                            {nom.image ? (
                                <img src={nom.image} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><User size={48} className="text-zinc-600"/></div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 border-4 border-transparent animate-pulse-border"></div>
                            
                            <div className="absolute bottom-0 left-0 w-full bg-black/80 p-3 border-t border-white/10">
                                <div className="text-white font-bold truncate leading-none mb-1">{nom.artistName}</div>
                                <div className="text-xs text-zinc-400 truncate">{nom.name}</div>
                            </div>

                            {nom.isPlayer && (
                                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-black px-2 py-1 rounded">YOU</div>
                            )}
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes pulse-border {
                        0% { border-color: rgba(255,255,255,0.1); }
                        50% { border-color: rgba(234,179,8,0.5); }
                        100% { border-color: rgba(255,255,255,0.1); }
                    }
                    .animate-pulse-border {
                        animation: pulse-border 1s infinite;
                    }
                `}</style>
            </div>
        );
    }

    if (phase === 'WINNER') {
        return (
            <div className="flex flex-col items-center justify-center h-full relative z-10 animate-in zoom-in duration-300">
                <div className="text-yellow-500 font-black tracking-[0.5em] uppercase text-lg mb-6 animate-pulse">The Grammy Goes To</div>
                
                <div className="relative w-64 h-64 mb-8 group">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-yellow-400 shadow-2xl bg-black">
                        {category.winner.image ? (
                            <img src={category.winner.image} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><User size={80} className="text-yellow-600"/></div>
                        )}
                    </div>
                    {category.winner.isPlayer && (
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-2 rounded-full font-black border-2 border-white shadow-xl animate-bounce whitespace-nowrap">
                            YOU WON!
                        </div>
                    )}
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white text-center leading-none mb-4 drop-shadow-2xl">
                    {category.winner.name}
                </h1>
                <p className="text-3xl text-zinc-300 font-serif italic">{category.winner.artistName}</p>
            </div>
        );
    }

    return null;
};
