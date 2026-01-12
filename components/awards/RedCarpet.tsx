
import React from 'react';
import { Shirt, Star, Sparkles } from 'lucide-react';

interface RedCarpetProps {
    onOutfitSelect: (style: 'CLASSIC' | 'STREET' | 'AVANT_GARDE') => void;
}

export const RedCarpet: React.FC<RedCarpetProps> = ({ onOutfitSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-500 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/camera-iris.png')] opacity-10 pointer-events-none"></div>
            {/* Flashing Lights Effect */}
            <div className="absolute inset-0 bg-white/5 animate-pulse z-0 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-4xl text-center">
                <div className="bg-red-600 text-white font-black text-sm uppercase tracking-[0.3em] inline-block px-4 py-1 mb-6 rounded-sm shadow-lg">Live from the Red Carpet</div>
                <h2 className="text-5xl font-black text-white mb-8 uppercase tracking-tight">Choose Your Look</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                    {/* OPTION 1 */}
                    <button onClick={() => onOutfitSelect('CLASSIC')} className="group bg-zinc-900 border border-zinc-800 hover:border-white/50 p-6 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            <Shirt size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Classic Formal</h3>
                        <p className="text-zinc-400 text-xs">A tailored suit/gown. Safe, elegant, respectful.</p>
                        <div className="mt-4 text-[10px] uppercase font-bold text-green-400">+10 Hype</div>
                    </button>

                    {/* OPTION 2 */}
                    <button onClick={() => onOutfitSelect('STREET')} className="group bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Star size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Street Luxury</h3>
                        <p className="text-zinc-400 text-xs">Designer streetwear. Dripped out. Authentic.</p>
                        <div className="mt-4 text-[10px] uppercase font-bold text-green-400">+20 Hype</div>
                    </button>

                    {/* OPTION 3 */}
                    <button onClick={() => onOutfitSelect('AVANT_GARDE')} className="group bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 p-6 rounded-xl transition-all hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Avant-Garde</h3>
                        <p className="text-zinc-400 text-xs">Bizarre, artistic, shocking. Break the internet.</p>
                        <div className="mt-4 text-[10px] uppercase font-bold text-green-400">+50 Hype</div>
                    </button>
                </div>
            </div>
        </div>
    );
};
