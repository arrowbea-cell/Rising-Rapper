
import React from 'react';
import { Trophy } from 'lucide-react';

interface AcceptanceSpeechProps {
    onSpeechSelect: (type: 'HUMBLE' | 'ARROGANT' | 'EMOTIONAL') => void;
}

export const AcceptanceSpeech: React.FC<AcceptanceSpeechProps> = ({ onSpeechSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full relative z-20 animate-in zoom-in duration-300">
            <Trophy size={80} className="text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.6)]" />
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">You Won!</h2>
            <p className="text-zinc-400 mb-8 font-serif italic text-lg">The microphone is yours...</p>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                <button onClick={() => onSpeechSelect('HUMBLE')} className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-lg border border-zinc-700 hover:border-white text-left transition-all group">
                    <div className="font-bold text-sm text-zinc-300 mb-1 group-hover:text-white">Give Humble Speech</div>
                    <div className="text-xs text-zinc-500">"Thank you God and my fans..."</div>
                </button>
                <button onClick={() => onSpeechSelect('ARROGANT')} className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-lg border border-zinc-700 hover:border-red-500 text-left transition-all group">
                    <div className="font-bold text-sm text-zinc-300 mb-1 group-hover:text-red-400">Give Arrogant Speech</div>
                    <div className="text-xs text-zinc-500">"I told you I'm the greatest..."</div>
                </button>
                <button onClick={() => onSpeechSelect('EMOTIONAL')} className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 rounded-lg border border-zinc-700 hover:border-blue-500 text-left transition-all group">
                    <div className="font-bold text-sm text-zinc-300 mb-1 group-hover:text-blue-400">Cry Emotionally</div>
                    <div className="text-xs text-zinc-500">*Sobbing uncontrollably*</div>
                </button>
            </div>
        </div>
    );
};
