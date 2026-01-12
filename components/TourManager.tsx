import React, { useState } from 'react';
import { GameState, ActiveTour, RegionStats, Song } from '../types';
import { TOUR_TIERS } from '../constants';
import { Map, Plane, DollarSign, Users, Calendar, ArrowRight, CheckCircle, AlertCircle, Music, Star, List, Mic2 } from 'lucide-react';

interface TourManagerProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const TourManager: React.FC<TourManagerProps> = ({ gameState, setGameState }) => {
  const activeTour = gameState.activeTour;

  // Planning State
  const [step, setStep] = useState(1); // 1: Details, 2: Route, 3: Setlist
  const [tourName, setTourName] = useState('');
  const [selectedTierId, setSelectedTierId] = useState<string>(TOUR_TIERS[0].id);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedSetlist, setSelectedSetlist] = useState<string[]>([]);

  const toggleRegion = (id: string) => {
    setSelectedRegions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSetlistSong = (id: string) => {
      setSelectedSetlist(prev => {
          if (prev.includes(id)) return prev.filter(x => x !== id);
          if (prev.length >= 15) return prev; // Max 15
          return [...prev, id];
      });
  };

  const getTier = (id: string) => TOUR_TIERS.find(t => t.id === id) || TOUR_TIERS[0];
  const selectedTier = getTier(selectedTierId);
  const totalCost = selectedTier.costPerLeg * selectedRegions.length;
  const canAfford = gameState.money >= totalCost;
  const hasHype = gameState.hype >= selectedTier.minHype;
  
  // Calculate Setlist Quality
  const releasedSongs = gameState.songs.filter(s => s.isReleased);
  const setlistSongs = releasedSongs.filter(s => selectedSetlist.includes(s.id));
  const avgSetlistQuality = setlistSongs.length > 0 
      ? setlistSongs.reduce((acc, s) => acc + s.quality, 0) / setlistSongs.length 
      : 0;
  
  // Bonus for setlist length (encourages playing more songs)
  const lengthBonus = Math.min(10, selectedSetlist.length) * 2; 
  const showQuality = Math.min(100, Math.floor(avgSetlistQuality + lengthBonus));

  const handleBookTour = () => {
    if (!tourName || selectedRegions.length === 0 || !canAfford || !hasHype || selectedSetlist.length === 0) return;

    const newTour: ActiveTour = {
      name: tourName,
      tierId: selectedTierId,
      regions: selectedRegions,
      setlist: selectedSetlist,
      showQuality: showQuality,
      currentLegIndex: 0,
      totalRevenue: 0,
      totalAttendees: 0,
      history: []
    };

    setGameState(prev => ({
      ...prev,
      money: prev.money - totalCost,
      activeTour: newTour
    }));
  };

  if (activeTour) {
    const tier = getTier(activeTour.tierId);
    const progressPerc = (activeTour.currentLegIndex / activeTour.regions.length) * 100;
    const currentRegionId = activeTour.regions[activeTour.currentLegIndex];
    const currentRegion = gameState.regions.find(r => r.id === currentRegionId);
    const activeSetlist = gameState.songs.filter(s => activeTour.setlist.includes(s.id));

    return (
      <div className="p-8 h-full bg-zinc-950 flex flex-col font-sans">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                <Plane className="text-white" size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white">{activeTour.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                     <span className="text-blue-400 font-bold bg-blue-900/20 px-2 py-0.5 rounded text-sm">{tier.name}</span>
                     <span className="text-yellow-400 font-bold bg-yellow-900/20 px-2 py-0.5 rounded text-sm flex items-center gap-1"><Star size={12} fill="currentColor"/> {activeTour.showQuality} Quality</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Total Gross</div>
                <div className="text-2xl font-mono text-emerald-400">${new Intl.NumberFormat('en-US').format(activeTour.totalRevenue)}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Total Attendees</div>
                <div className="text-2xl font-mono text-white">{new Intl.NumberFormat('en-US').format(activeTour.totalAttendees)}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Progress</div>
                <div className="text-2xl font-mono text-white">{activeTour.currentLegIndex} / {activeTour.regions.length} <span className="text-sm text-zinc-500">Shows</span></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
             {/* LEFT: STATUS */}
             <div className="lg:col-span-2 flex flex-col overflow-y-auto pr-2">
                 {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-4 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressPerc}%` }}></div>
                    </div>
                </div>

                {/* Next Stop */}
                {currentRegion ? (
                    <div className="bg-gradient-to-r from-blue-900/20 to-zinc-900 border border-blue-500/30 p-8 rounded-2xl flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 font-bold mb-2"><Calendar size={18} /> NEXT STOP</div>
                            <div className="text-4xl font-black text-white">{currentRegion.name}</div>
                            <div className="text-zinc-400 mt-1">Current Popularity: {currentRegion.popularity.toFixed(1)}%</div>
                        </div>
                        <div className="text-right">
                            <button disabled className="bg-white/10 text-white px-6 py-3 rounded-full font-bold cursor-default border border-white/5">
                                Traveling...
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-2xl text-center mb-8">
                        <h3 className="text-2xl font-bold text-emerald-400 mb-2">Tour Complete!</h3>
                        <p className="text-zinc-400">Final results processing...</p>
                    </div>
                )}

                {/* History */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Tour Log</h3>
                    <div className="space-y-2">
                        {activeTour.history.slice().reverse().map((log, idx) => {
                            const r = gameState.regions.find(reg => reg.id === log.regionId);
                            return (
                                <div key={idx} className="bg-zinc-900/50 p-4 rounded-lg flex justify-between items-center border border-zinc-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-xs">{log.week}</div>
                                        <div className="font-bold text-white">{r?.name || log.regionId}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-emerald-400 font-mono text-sm">+${new Intl.NumberFormat('en-US').format(log.revenue)}</div>
                                        <div className="text-zinc-500 text-xs">{new Intl.NumberFormat('en-US').format(log.attendees)} fans</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
             </div>

             {/* RIGHT: SETLIST */}
             <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 overflow-y-auto">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><List size={20}/> Setlist</h3>
                 <div className="space-y-2">
                     {activeSetlist.map((song, idx) => (
                         <div key={song.id} className="flex items-center gap-3 text-sm p-2 hover:bg-zinc-800 rounded">
                             <span className="text-zinc-500 font-mono w-4">{idx + 1}</span>
                             <div className="truncate text-zinc-300 font-medium">{song.title}</div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
      </div>
    );
  }

  // PLANNING MODE
  return (
    <div className="p-8 h-full bg-zinc-950 flex flex-col font-sans overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white flex items-center gap-3"><Plane className="text-purple-500" /> Plan World Tour</h2>
          
          {/* Steps Indicator */}
          <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-zinc-800'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-zinc-800'}`} />
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-purple-500' : 'bg-zinc-800'}`} />
          </div>
      </div>
      
      {/* STEP 1: DETAILS */}
      {step === 1 && (
         <div className="max-w-2xl mx-auto w-full space-y-8">
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Step 1: Tour Concept</h3>
                {/* Name */}
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wide">Tour Name</label>
                    <input 
                        type="text" 
                        value={tourName} 
                        onChange={(e) => setTourName(e.target.value)} 
                        placeholder="The World Domination Tour..." 
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-600 outline-none font-bold text-lg"
                    />
                </div>

                {/* Tier Selection */}
                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                    <label className="block text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wide">Venue Scale</label>
                    <div className="grid grid-cols-1 gap-3">
                        {TOUR_TIERS.map(tier => {
                            const locked = gameState.hype < tier.minHype;
                            const isSelected = selectedTierId === tier.id;
                            return (
                                <button 
                                    key={tier.id}
                                    onClick={() => !locked && setSelectedTierId(tier.id)}
                                    className={`flex justify-between items-center p-4 rounded-lg border transition-all ${isSelected ? 'bg-purple-900/20 border-purple-500 ring-1 ring-purple-500' : 'bg-zinc-950 border-zinc-800'} ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'}`}
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-white flex items-center gap-2">
                                            {tier.name}
                                            {locked && <AlertCircle size={14} className="text-red-500" />}
                                        </div>
                                        <div className="text-xs text-zinc-500">Cap: {new Intl.NumberFormat('en-US').format(tier.baseCapacity)} • ${tier.ticketPrice}/tkt</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-mono text-zinc-300">${new Intl.NumberFormat('en-US').format(tier.costPerLeg)} /show</div>
                                        <div className="text-xs text-purple-400">Req: {tier.minHype} Hype</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={() => setStep(2)} 
                    disabled={!tourName}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
                >
                    Next: Route
                </button>
            </div>
         </div>
      )}

      {/* STEP 2: ROUTE */}
      {step === 2 && (
          <div className="max-w-4xl mx-auto w-full space-y-8">
             <h3 className="text-2xl font-bold text-white">Step 2: Select Route</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {gameState.regions.map(r => {
                     const isSelected = selectedRegions.includes(r.id);
                     const pop = r.popularity;
                     return (
                         <button 
                            key={r.id} 
                            onClick={() => toggleRegion(r.id)}
                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${isSelected ? 'bg-purple-900/20 border-purple-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}
                         >
                             <div className="flex justify-between items-center mb-2 relative z-10">
                                 <span className="font-bold text-white">{r.name}</span>
                                 {isSelected && <CheckCircle size={18} className="text-purple-400" />}
                             </div>
                             
                             {/* Popularity Bar */}
                             <div className="relative z-10">
                                 <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                     <span>Popularity</span>
                                     <span>{pop.toFixed(1)}%</span>
                                 </div>
                                 <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500" style={{ width: `${pop}%` }} />
                                 </div>
                             </div>

                             {/* Market Size Badge */}
                             <div className="absolute top-2 right-2 opacity-10 font-black text-4xl group-hover:opacity-20 transition-opacity">
                                 {r.id}
                             </div>
                         </button>
                     )
                 })}
             </div>

             <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                 <div>
                     <div className="text-sm text-zinc-400">Total Shows: <span className="text-white font-bold">{selectedRegions.length}</span></div>
                     <div className="text-sm text-zinc-400">Est. Cost: <span className="text-white font-bold">${new Intl.NumberFormat('en-US').format(totalCost)}</span></div>
                 </div>
                 <div className="flex gap-4">
                     <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white px-4">Back</button>
                     <button 
                        onClick={() => setStep(3)} 
                        disabled={selectedRegions.length === 0}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
                     >
                        Next: Setlist
                     </button>
                 </div>
             </div>
          </div>
      )}

      {/* STEP 3: SETLIST */}
      {step === 3 && (
          <div className="max-w-4xl mx-auto w-full space-y-8 flex-1 flex flex-col min-h-0">
               <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Step 3: Create Setlist</h3>
                   <div className="text-right">
                       <div className="text-sm text-zinc-400">Show Quality</div>
                       <div className="text-2xl font-black text-yellow-400">{showQuality}/100</div>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
                   {/* Available Songs */}
                   <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col min-h-0">
                       <div className="p-4 border-b border-zinc-800 font-bold text-zinc-400 text-sm uppercase">Available Songs</div>
                       <div className="overflow-y-auto p-2 space-y-1 flex-1">
                           {releasedSongs.length === 0 && <div className="p-4 text-center text-zinc-500">No songs released yet.</div>}
                           {releasedSongs.map(song => {
                               const inSetlist = selectedSetlist.includes(song.id);
                               return (
                                   <button 
                                      key={song.id}
                                      onClick={() => toggleSetlistSong(song.id)}
                                      disabled={inSetlist}
                                      className={`w-full text-left p-2 rounded hover:bg-zinc-800 flex justify-between items-center text-sm ${inSetlist ? 'opacity-50' : ''}`}
                                   >
                                       <span className="truncate">{song.title}</span>
                                       <span className="text-xs bg-zinc-800 px-1.5 rounded text-zinc-400">Q:{song.quality}</span>
                                   </button>
                               )
                           })}
                       </div>
                   </div>

                   {/* Current Setlist */}
                   <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col min-h-0 relative">
                       <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                           <span className="font-bold text-white text-sm uppercase">Current Setlist</span>
                           <span className={`text-xs font-bold ${selectedSetlist.length >= 15 ? 'text-red-500' : 'text-zinc-500'}`}>{selectedSetlist.length}/15</span>
                       </div>
                       <div className="overflow-y-auto p-2 space-y-1 flex-1 bg-black/20">
                           {selectedSetlist.length === 0 && <div className="p-10 text-center text-zinc-600 italic">Select songs to add to setlist</div>}
                           {selectedSetlist.map((songId, idx) => {
                               const song = gameState.songs.find(s => s.id === songId);
                               if (!song) return null;
                               return (
                                   <div key={songId} className="flex justify-between items-center p-2 bg-zinc-800/50 rounded border border-zinc-700/50 text-sm group">
                                       <div className="flex gap-3 overflow-hidden">
                                           <span className="text-zinc-500 font-mono w-4 shrink-0">{idx + 1}.</span>
                                           <span className="text-white truncate">{song.title}</span>
                                       </div>
                                       <button onClick={() => toggleSetlistSong(songId)} className="text-zinc-500 hover:text-red-400 px-2">
                                           &times;
                                       </button>
                                   </div>
                               )
                           })}
                       </div>
                   </div>
               </div>

               <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 p-6 rounded-xl border border-purple-500/20 mt-auto">
                   <div className="flex justify-between items-center mb-6">
                       <div>
                           <div className="text-zinc-400 text-sm">Total Upfront Cost</div>
                           <div className={`text-2xl font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${new Intl.NumberFormat('en-US').format(totalCost)}</div>
                       </div>
                       <div className="text-right">
                           <div className="text-zinc-400 text-sm">Est. Weekly Revenue</div>
                           <div className="text-xl font-bold text-emerald-400">~${new Intl.NumberFormat('en-US').format(selectedTier.ticketPrice * selectedTier.baseCapacity * 0.5)}</div>
                       </div>
                   </div>

                   <div className="flex gap-4 justify-end">
                       <button onClick={() => setStep(2)} className="text-zinc-500 hover:text-white px-4">Back</button>
                       <button 
                         onClick={handleBookTour}
                         disabled={!canAfford || !hasHype || selectedSetlist.length === 0}
                         className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                       >
                           {canAfford ? 'Book & Start Tour' : 'Insufficient Funds'} <ArrowRight size={18} />
                       </button>
                   </div>
               </div>
          </div>
      )}
    </div>
  );
};

export default TourManager;