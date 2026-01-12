
import React from 'react';
import { Trophy, Mic2, User } from 'lucide-react';
import { AwardCeremonyData, Artist } from '../../types';

interface CeremonyVisualsProps {
    phase: 'INTRO' | 'PERFORMANCE' | 'OUTRO';
    data: AwardCeremonyData;
    artist?: Artist;
}

export const CeremonyVisuals: React.FC<CeremonyVisualsProps> = ({ phase, data, artist }) => {
    
    if (phase === 'INTRO') {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500">
                <div className="relative w-40 h-40 mb-8">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
                    <div className="relative z-10 w-full h-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-200 animate-[spin_10s_linear_infinite]">
                        <Trophy size={80} className="text-black drop-shadow-lg" />
                    </div>
                </div>
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 uppercase tracking-tighter text-center drop-shadow-sm mb-4">
                    The Music Awards <br/><span className="text-white text-4xl tracking-widest font-serif italic">{data.year}</span>
                </h1>
                <div className="h-1 w-32 bg-yellow-500 rounded-full"></div>
            </div>
        );
    }

    if (phase === 'PERFORMANCE') {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-700 bg-black relative overflow-hidden">
                {/* STAGE LIGHTS */}
                <div className="absolute top-0 left-1/4 w-32 h-[150%] bg-blue-500/20 blur-3xl rotate-12 origin-top animate-pulse"></div>
                <div className="absolute top-0 right-1/4 w-32 h-[150%] bg-purple-500/20 blur-3xl -rotate-12 origin-top animate-pulse delay-75"></div>
                
                <div className="relative z-10 text-center">
                    <div className="bg-red-600 text-white px-4 py-1 rounded font-black text-xs tracking-widest uppercase mb-6 inline-block animate-bounce">Live</div>
                    
                    <div className="w-64 h-64 rounded-full border-4 border-white/20 p-2 mx-auto mb-8 shadow-[0_0_100px_rgba(255,255,255,0.2)]">
                        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800">
                            {artist?.image ? (
                                <img src={artist.image} className="w-full h-full object-cover animate-pulse" />
                            ) : (
                                <User size={100} className="m-auto mt-20 text-zinc-500"/>
                            )}
                        </div>
                    </div>

                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">{artist?.name}</h2>
                    <div className="text-yellow-500 font-serif italic text-2xl flex items-center justify-center gap-2">
                        <Mic2 size={24}/> Performance
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'OUTRO') {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500">
                <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-4">Broadcast Ended</h1>
                <p className="text-zinc-500">See you next season.</p>
            </div>
        );
    }

    return null;
};
