
import React, { useState, useEffect } from 'react';
import { AwardCeremonyData, GameState } from '../types';
import { createGrammyPerformanceVideo } from '../utils/features/grammyPerformance';
import { Trophy, SkipForward, Mic2, MessageCircle } from 'lucide-react';

// Import New Sub-Components
import { RedCarpet } from './awards/RedCarpet';
import { AcceptanceSpeech } from './awards/AcceptanceSpeech';
import { CeremonyVisuals } from './awards/CeremonyVisuals';
import { CategoryPresentation } from './awards/CategoryPresentation';
import { PerformanceDirector } from './awards/PerformanceDirector';

interface AwardCeremonyProps {
    data: AwardCeremonyData;
    mode: 'NOMINATIONS' | 'CEREMONY';
    onClose: () => void;
    isPerforming?: boolean;
    performanceSongId?: string | null;
    artist?: any;
    currentWeek?: number;
    setGameState?: any;
}

type Phase = 'RED_CARPET' | 'INTRO' | 'HOST_MONOLOGUE' | 'PERFORMANCE_DIRECTOR' | 'PERFORMANCE' | 'CATEGORY_INTRO' | 'NOMINEES' | 'POINTS' | 'DRUMROLL' | 'WINNER' | 'SPEECH' | 'OUTRO';

// --- NEW COMPONENT: LIVE TICKER ---
const LiveTicker: React.FC<{ phase: Phase, artistName: string, winnerName?: string }> = ({ phase, artistName, winnerName }) => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const getComments = () => {
            const generic = ["#GRAMMYs", "Watching live from Tokyo! 🇯🇵", "The stage looks insane", "Who is hosting?", "Commercials already??"];
            
            if (phase === 'RED_CARPET') return [`${artistName} LOOKS EXPENSIVE 💸`, "Best dressed goes to...", "Fashion police are watching", "Red carpet looks dry this year", "OMG THAT OUTFIT"];
            if (phase === 'PERFORMANCE') return [`MIC IS ON!!! 🎤`, `${artistName} ATE THAT`, "Vocals on point", "Production value 📈", "Literal chills", "Tour dates when???"];
            if (phase === 'DRUMROLL') return ["My heart is beating so fast", "Please be them", "If this is rigged I'm deleting Twitter", "Here we go...", "Commercial break incoming?"];
            if (phase === 'WINNER') {
                if (winnerName === artistName) return ["YESSSS!!!!", "DESERVED", "FINALLY", "THEY DID IT", "Crying rn 😭", "TALENT WON"];
                return ["ROBBED", "RIGGED AWARD", "Are you serious?", "Deserved though", "Whatever", "Next category please"];
            }
            if (phase === 'SPEECH') return ["So humble 🥺", "Talk your sh*t!", "Wrap it up music is playing", "Such a genuine moment", "Legend status"];
            
            return generic;
        };

        const base = getComments();
        // Duplicate for smooth loop
        setMessages([...base, ...base, ...base]);
    }, [phase, artistName, winnerName]);

    if (phase === 'INTRO' || phase === 'OUTRO' || phase === 'PERFORMANCE_DIRECTOR') return null;

    return (
        <div className="absolute bottom-0 left-0 w-full bg-black/80 border-t border-white/10 py-2 z-50 overflow-hidden pointer-events-none">
            <div className="flex items-center gap-4 whitespace-nowrap animate-ticker">
                <div className="flex items-center gap-2 text-blue-400 font-bold px-4 border-r border-white/10 shrink-0">
                    <MessageCircle size={14} /> LIVE FEED
                </div>
                {messages.map((msg, i) => (
                    <span key={i} className="text-sm font-medium text-zinc-300 mx-6 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> {msg}
                    </span>
                ))}
            </div>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

const AwardCeremony: React.FC<AwardCeremonyProps> = ({ data, mode, onClose, isPerforming, performanceSongId, artist, currentWeek, setGameState }) => {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>(mode === 'CEREMONY' ? 'RED_CARPET' : 'INTRO');
    const [nomineeIndex, setNomineeIndex] = useState(0); 
    
    const [perfStyle, setPerfStyle] = useState<'VOCAL' | 'SPECTACLE' | 'CONTROVERSIAL' | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [subtitle, setSubtitle] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); 

    const currentCategory = data.results[currentCategoryIndex];
    const isNominationMode = mode === 'NOMINATIONS';

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // --- HANDLERS ---
    const handleOutfitSelect = (style: 'CLASSIC' | 'STREET' | 'AVANT_GARDE') => {
        let hypeBoost = 0;
        let comment = "";
        if (style === 'CLASSIC') { hypeBoost = 10; comment = "Looking sharp and timeless."; }
        else if (style === 'STREET') { hypeBoost = 20; comment = "Authentic vibe. The fans love it."; }
        else { hypeBoost = 50; comment = "A bold statement! Viral moment."; }

        if (setGameState) {
            setGameState((prev: GameState) => ({ ...prev, hype: prev.hype + hypeBoost }));
        }
        setSubtitle(comment);
        setTimeout(() => setPhase('INTRO'), 2000);
    };

    const handlePerformanceStyle = (style: 'VOCAL' | 'SPECTACLE' | 'CONTROVERSIAL') => {
        setPerfStyle(style);
        if (setGameState) {
            setGameState((prev: GameState) => {
                let hypeGain = 0;
                let repChange = 0;
                if (style === 'VOCAL') repChange = 5;
                if (style === 'SPECTACLE') { hypeGain = 50; repChange = 2; }
                if (style === 'CONTROVERSIAL') { hypeGain = 150; repChange = -10; }
                return {
                    ...prev,
                    hype: prev.hype + hypeGain,
                    socialState: prev.socialState ? { ...prev.socialState, reputation: Math.max(0, Math.min(100, prev.socialState.reputation + repChange)) } : undefined
                };
            });
        }
        setSubtitle(style === 'CONTROVERSIAL' ? "The censors are panicking..." : "The stage is set.");
        setTimeout(() => setPhase('PERFORMANCE'), 1500);
    };

    const handleSpeechSelect = (type: 'HUMBLE' | 'ARROGANT' | 'EMOTIONAL') => {
        let repChange = 0;
        let hypeChange = 0;
        let speechText = "";
        if (type === 'HUMBLE') { repChange = 5; speechText = "I couldn't have done this without my fans and God. Thank you!"; }
        else if (type === 'ARROGANT') { repChange = -5; hypeChange = 30; speechText = "I told you all I'm the greatest. This is just the beginning."; }
        else { repChange = 2; speechText = "*Crying* This means so much to me... thank you..."; }

        if (setGameState) {
            setGameState((prev: GameState) => {
                const social = prev.socialState;
                return { 
                    ...prev, 
                    hype: prev.hype + hypeChange,
                    socialState: social ? { ...social, reputation: Math.min(100, Math.max(0, social.reputation + repChange)) } : social
                };
            });
        }
        setSubtitle(`"${speechText}"`);
        setTimeout(() => {
            setShowConfetti(false);
            nextCategory();
        }, 3000);
    };

    // --- SEQUENCER ---
    useEffect(() => {
        let isMounted = true;

        const runSequence = async () => {
            if (isProcessing) return;
            if (phase === 'RED_CARPET' || phase === 'SPEECH' || phase === 'PERFORMANCE_DIRECTOR') return;

            setIsProcessing(true);

            try {
                switch (phase) {
                    case 'INTRO':
                        setSubtitle(`Welcome to the ${data.year} Awards.`);
                        await wait(2500); 
                        if (isMounted) setPhase(mode === 'NOMINATIONS' ? 'CATEGORY_INTRO' : 'HOST_MONOLOGUE');
                        break;

                    case 'HOST_MONOLOGUE':
                        const jokes = [
                            "Everyone look under your seats... it's... absolutely nothing!",
                            `I see ${artist.name} is here. Please don't write a song about me.`,
                            "We have a great show tonight. Let's get started.",
                            "Music brings us together... mostly to argue on Twitter."
                        ];
                        setSubtitle(jokes[Math.floor(Math.random() * jokes.length)]);
                        await wait(3500);
                        if (isMounted) {
                            if (isPerforming && performanceSongId) {
                                setPhase('PERFORMANCE_DIRECTOR');
                            } else {
                                setPhase('CATEGORY_INTRO');
                            }
                        }
                        break;

                    case 'PERFORMANCE':
                        const vibe = perfStyle === 'CONTROVERSIAL' ? "Shocking" : perfStyle === 'VOCAL' ? "Soulful" : "High Energy";
                        setSubtitle(`${vibe} Live Performance by ${artist.name}`);
                        
                        if (setGameState && artist && performanceSongId && currentWeek) {
                            const songName = data.results.find(c => c.nominees.find(n => n.id === performanceSongId))?.nominees.find(n => n.id === performanceSongId)?.name || "New Track";
                            setGameState((prev: GameState) => {
                                if (prev.youtubeVideos?.find(v => v.id.startsWith('yt_grammy_'))) return prev;
                                const newVideo = createGrammyPerformanceVideo(artist, performanceSongId, songName, currentWeek);
                                return {
                                    ...prev,
                                    youtubeVideos: [newVideo, ...(prev.youtubeVideos || [])],
                                    grammyPerformanceSongId: null,
                                    hype: prev.hype + 50
                                }
                            });
                        }
                        await wait(4000); 
                        if (isMounted) setPhase('CATEGORY_INTRO');
                        break;

                    case 'CATEGORY_INTRO':
                        if (!currentCategory) {
                            if (isMounted) setPhase('OUTRO');
                            return;
                        }
                        setSubtitle(currentCategory.categoryName);
                        await wait(2000);
                        if (isMounted) {
                            setNomineeIndex(0);
                            setPhase('NOMINEES');
                        }
                        break;

                    case 'NOMINEES':
                        if (nomineeIndex < currentCategory.nominees.length) {
                            const nom = currentCategory.nominees[nomineeIndex];
                            setSubtitle(`${nom.artistName} - ${nom.name}`);
                            await wait(1000); 
                            if (isMounted) setNomineeIndex(prev => prev + 1);
                        } else {
                            if (isNominationMode) {
                                if (isMounted) nextCategory();
                            } else {
                                if (isMounted) setPhase('DRUMROLL');
                            }
                        }
                        break;

                    case 'DRUMROLL':
                        setSubtitle("And the winner is...");
                        await wait(4000);
                        if (isMounted) setPhase('WINNER');
                        break;

                    case 'WINNER':
                        const winner = currentCategory.winner;
                        setSubtitle(`Winner: ${winner.artistName}!`);
                        if (winner.isPlayer) {
                            setShowConfetti(true);
                            await wait(2000);
                            if (isMounted) setPhase('SPEECH'); 
                        } else {
                            await wait(3500);
                            if (isMounted) nextCategory();
                        }
                        break;

                    case 'OUTRO':
                        setSubtitle("Broadcast Ended.");
                        await wait(2000);
                        if (isMounted) onClose();
                        break;
                }
            } catch (e) {
                console.error(e);
                if(isMounted) handleSkip();
            } finally {
                if (isMounted) setIsProcessing(false);
            }
        };

        runSequence();
        return () => { isMounted = false; };
    }, [phase, nomineeIndex, currentCategoryIndex]);

    const nextCategory = () => {
        if (currentCategoryIndex < data.results.length - 1) {
            setCurrentCategoryIndex(prev => prev + 1);
            setPhase('CATEGORY_INTRO');
        } else {
            setPhase('OUTRO');
        }
    };

    const handleSkip = () => {
        setIsProcessing(false);
        if (phase === 'RED_CARPET') handleOutfitSelect('CLASSIC');
        else if (phase === 'HOST_MONOLOGUE') setPhase(isPerforming ? 'PERFORMANCE_DIRECTOR' : 'CATEGORY_INTRO');
        else if (phase === 'PERFORMANCE_DIRECTOR') handlePerformanceStyle('SPECTACLE');
        else if (phase === 'NOMINEES') setNomineeIndex(currentCategory.nominees.length);
        else if (phase === 'DRUMROLL') setPhase('WINNER');
        else if (phase === 'WINNER' || phase === 'SPEECH') { setShowConfetti(false); nextCategory(); }
        else onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white font-sans overflow-hidden">
            {/* Dynamic Stage Lighting Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none animate-pulse"></div>
            <div className="absolute top-0 left-1/4 w-32 h-[150%] bg-white/5 blur-[100px] rotate-12 origin-top animate-spotlight-left pointer-events-none"></div>
            <div className="absolute top-0 right-1/4 w-32 h-[150%] bg-white/5 blur-[100px] -rotate-12 origin-top animate-spotlight-right pointer-events-none"></div>
            
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    {[...Array(100)].map((_, i) => (
                        <div key={i} className="absolute w-2 h-4 bg-yellow-500 rounded animate-[spin_3s_linear_infinite]" style={{ top: '-10%', left: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 3 + 2}s`, animationDelay: `${Math.random() * 2}s` }} />
                    ))}
                </div>
            )}

            <div className="relative z-20 h-full flex flex-col">
                <div className="p-6 flex justify-between items-start">
                    <div className="flex items-center gap-3 opacity-50">
                        <Trophy size={20} className="text-yellow-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Live Broadcast</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    {/* Hide Skip during interactive screens */}
                    {(phase !== 'SPEECH' && phase !== 'RED_CARPET' && phase !== 'PERFORMANCE_DIRECTOR') && (
                        <button onClick={handleSkip} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-2 transition-colors border border-white/10">
                            Skip <SkipForward size={14} fill="currentColor" />
                        </button>
                    )}
                </div>

                <div className="flex-1 relative p-8 flex flex-col">
                    {phase === 'RED_CARPET' && <RedCarpet onOutfitSelect={handleOutfitSelect} />}
                    
                    {phase === 'HOST_MONOLOGUE' && (
                        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
                            <div className="w-32 h-32 bg-zinc-800 rounded-full border-4 border-white/20 mb-6 flex items-center justify-center overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                                <Mic2 size={48} className="text-zinc-400 relative z-10"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            </div>
                            <h2 className="text-4xl font-black text-white text-center mb-4 uppercase tracking-tighter">The Host</h2>
                            <p className="text-xl text-yellow-500 font-serif italic max-w-2xl text-center">"{subtitle}"</p>
                        </div>
                    )}

                    {phase === 'PERFORMANCE_DIRECTOR' && (
                        <PerformanceDirector 
                            songTitle={data.results.find(c => c.nominees.find(n => n.id === performanceSongId))?.nominees.find(n => n.id === performanceSongId)?.name || "Song"} 
                            onStyleSelect={handlePerformanceStyle}
                        />
                    )}

                    {(phase === 'INTRO' || phase === 'PERFORMANCE' || phase === 'OUTRO') && <CeremonyVisuals phase={phase} data={data} artist={artist} />}

                    {(phase === 'CATEGORY_INTRO' || phase === 'NOMINEES' || phase === 'POINTS' || phase === 'DRUMROLL' || phase === 'WINNER') && currentCategory && (
                        <CategoryPresentation phase={phase} category={currentCategory} nomineeIndex={nomineeIndex} />
                    )}

                    {phase === 'SPEECH' && <AcceptanceSpeech onSpeechSelect={handleSpeechSelect} />}
                </div>

                {/* TV BANNER - Hide during interactive screens */}
                {phase !== 'RED_CARPET' && phase !== 'SPEECH' && phase !== 'PERFORMANCE_DIRECTOR' && phase !== 'HOST_MONOLOGUE' && (
                    <div className="bg-gradient-to-t from-black via-black to-transparent pt-20 pb-16 px-8 text-center relative z-30">
                        <div className="inline-block bg-black/80 backdrop-blur-xl border-y-2 border-yellow-500/50 px-12 py-4 shadow-2xl">
                            <p className="text-lg md:text-xl text-yellow-100 font-medium tracking-wide font-serif italic animate-in fade-in slide-in-from-bottom duration-300 key={subtitle}">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                )}

                {/* LIVE SOCIAL TICKER - ALWAYS ON EXCEPT FOR SPECIFIC SCREENS */}
                <LiveTicker phase={phase} artistName={artist.name} winnerName={currentCategory?.winner.artistName} />
            </div>

            <style>{`
                @keyframes spotlight-left {
                    0%, 100% { transform: rotate(12deg) translateX(0); opacity: 0.3; }
                    50% { transform: rotate(25deg) translateX(50px); opacity: 0.6; }
                }
                @keyframes spotlight-right {
                    0%, 100% { transform: rotate(-12deg) translateX(0); opacity: 0.3; }
                    50% { transform: rotate(-25deg) translateX(-50px); opacity: 0.6; }
                }
                .animate-spotlight-left { animation: spotlight-left 8s ease-in-out infinite; }
                .animate-spotlight-right { animation: spotlight-right 8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default AwardCeremony;
