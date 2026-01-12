
import React from 'react';
import { GameState, Artist } from '../types';
import { Music, Twitter, Facebook, User } from 'lucide-react';

interface GrammysHistoryProps {
  gameState: GameState;
  artist: Artist;
}

// --- CUSTOM REALISTIC TROPHY COMPONENT ---
const GrammyTrophyIcon = ({ size = 48, className = "" }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="200" y2="240" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="20%" stopColor="#F59E0B" />
                <stop offset="40%" stopColor="#FCD34D" />
                <stop offset="60%" stopColor="#B45309" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FCD34D" />
            </linearGradient>
            <linearGradient id="blackBase" x1="100" y1="150" x2="100" y2="220" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#333" />
                <stop offset="50%" stopColor="#000" />
                <stop offset="100%" stopColor="#111" />
            </linearGradient>
        </defs>

        {/* 1. Black Base (Trapezoid) */}
        <path d="M50 220 L150 220 L130 160 L70 160 Z" fill="url(#blackBase)" stroke="#222" strokeWidth="2" />
        
        {/* 2. Gold Box/Plinth */}
        <rect x="60" y="130" width="80" height="30" fill="url(#goldGradient)" rx="2" />
        <rect x="60" y="130" width="80" height="30" fill="black" fillOpacity="0.1" rx="2" />

        {/* 3. The Horn (Body) */}
        <path 
            d="M90 130 C90 130 90 110 70 100 C50 90 40 60 70 40 C100 20 140 40 160 80 C170 100 150 120 130 110" 
            stroke="url(#goldGradient)" 
            strokeWidth="12" 
            strokeLinecap="round"
            fill="none"
        />
        
        {/* 4. The Horn (Bell/Mouth) - Distinctive Shape */}
        <path 
            d="M130 110 C150 100 180 80 170 50 C160 20 120 10 90 30" 
            fill="url(#goldGradient)" 
        />
        <ellipse cx="130" cy="70" rx="35" ry="30" transform="rotate(-30 130 70)" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="130" cy="70" rx="25" ry="20" transform="rotate(-30 130 70)" fill="#78350f" /> 

        {/* 5. Support Arm */}
        <path d="M100 130 L100 110" stroke="url(#goldGradient)" strokeWidth="6" />
        
        {/* Shine */}
        <circle cx="110" cy="60" r="5" fill="white" fillOpacity="0.4" />
    </svg>
);

const GrammysHistory: React.FC<GrammysHistoryProps> = ({ gameState, artist }) => {
  const history = gameState.awardsHistory || [];

  // Calculate Stats
  let totalWins = 0;
  let totalNominations = 0;
  const playerAwardsList: Array<{
      year: number;
      category: string;
      title: string;
      image?: string;
      result: 'WINNER' | 'NOMINATION';
  }> = [];

  history.forEach(ceremony => {
      ceremony.results.forEach(cat => {
          // Check if player won
          if (cat.winner.isPlayer) {
              totalWins++;
              playerAwardsList.push({
                  year: ceremony.year,
                  category: cat.categoryName,
                  title: cat.winner.name,
                  image: cat.winner.image,
                  result: 'WINNER'
              });
          }
          
          // Check nominations (Winner is also a nominee, so check the nominees list)
          cat.nominees.forEach(nom => {
              if (nom.isPlayer) {
                  totalNominations++;
                  // Only add to list if they didn't win (to avoid duplicates in display if we want distinct rows)
                  if (!cat.winner.isPlayer) {
                       playerAwardsList.push({
                          year: ceremony.year,
                          category: cat.categoryName,
                          title: nom.name,
                          image: nom.image,
                          result: 'NOMINATION'
                      });
                  }
              }
          });
      });
  });

  // Sort by year descending
  playerAwardsList.sort((a, b) => b.year - a.year);

  return (
    <div className="h-full bg-white text-black font-sans overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden">
            {artist.image ? (
                <img src={artist.image} className="w-full h-full object-cover object-top" alt={artist.name} />
            ) : (
                <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                    <User size={100} className="text-zinc-400" />
                </div>
            )}
            {/* Gradient Fade at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-20">
            {/* ARTIST NAME & SOCIALS */}
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">ARTIST</span>
                <div className="flex gap-4 text-zinc-400">
                    <Twitter className="hover:text-black cursor-pointer transition-colors" />
                    <Facebook className="hover:text-black cursor-pointer transition-colors" />
                </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-12">{artist.name}</h1>

            {/* STATS ROW */}
            <div className="flex gap-16 mb-16">
                <div>
                    <div className="text-sm font-bold text-[#bfa068] uppercase tracking-widest mb-1">WINS*</div>
                    <div className="text-6xl font-light text-[#bfa068]">{totalWins}</div>
                </div>
                <div>
                    <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">NOMINATIONS*</div>
                    <div className="text-6xl font-light text-zinc-500">{totalNominations}</div>
                </div>
            </div>

            {/* LIST SECTION */}
            <div>
                {playerAwardsList.length === 0 ? (
                    <div className="text-zinc-400 text-lg border-t border-zinc-200 pt-8">No Grammy history yet.</div>
                ) : (
                    playerAwardsList.map((award, idx) => (
                        <div key={idx} className="border-t border-zinc-200 py-8 flex gap-6 items-start group hover:bg-zinc-50 transition-colors -mx-4 px-4">
                            {/* THUMBNAIL (Winner gets Trophy, Nom gets Art) */}
                            <div className="w-24 h-24 bg-zinc-100 shrink-0 relative overflow-hidden flex items-center justify-center">
                                {award.result === 'WINNER' ? (
                                    <GrammyTrophyIcon size={80} className="drop-shadow-lg" />
                                ) : (
                                    award.image ? <img src={award.image} className="w-full h-full object-cover" /> : <Music size={40} className="text-zinc-300"/>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="text-sm text-[#bfa068] uppercase tracking-widest font-bold mb-1">
                                    {award.result}
                                </div>
                                <div className="text-xl font-bold text-zinc-800 mb-1">
                                    {award.category}
                                </div>
                                <div className="text-xl text-black font-medium">
                                    {award.title}
                                </div>
                            </div>

                            <div className="text-zinc-400 text-sm font-serif italic pt-1">
                                {award.year} Awards
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default GrammysHistory;
