
import React, { useState } from 'react';
import { Artist, Gender, Genre } from '../types';
import { COUNTRIES, GENDERS, GENRES, BUDGET_OPTIONS } from '../constants';
import { Upload, User, Globe, DollarSign, TrendingUp, PlayCircle } from 'lucide-react';

interface CreateArtistProps {
  onCreate: (artist: Artist) => void;
  onLoadSave: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
  hasAutoSave: boolean;
}

const CreateArtist: React.FC<CreateArtistProps> = ({ onCreate, onLoadSave, onContinue, hasAutoSave }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [genre, setGenre] = useState<Genre>(Genre.HIP_HOP);
  const [budgetTier, setBudgetTier] = useState(BUDGET_OPTIONS[0]); 
  const [image, setImage] = useState<string | null>(null);
  const [startingPop, setStartingPop] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter an artist name.");
      return;
    }

    const newArtist: Artist = {
      name,
      country,
      gender,
      genre,
      budget: budgetTier.value,
      age: 18,
      image,
      monthlyListeners: 0,
      globalRank: 9999,
      startingPopularity: startingPop,
      isDev: false
    };

    onCreate(newArtist);
  };

  const getPopLabel = (val: number) => {
      if (val === 0) return "Unknown";
      if (val <= 20) return "Local Buzz";
      if (val <= 40) return "Underground";
      if (val <= 60) return "Rising Star";
      return "Mainstream";
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#020617_60%)] pointer-events-none" />
        
        <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 relative z-10">
            {/* LEFT PANEL: IDENTITY */}
            <div className={`flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl animate-in slide-in-from-left duration-700`}>
                <div className="mb-8">
                    <h1 className={`text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 mb-2`}>
                        NEW ARTIST
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-wide text-sm uppercase">
                        Create your legacy
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-6">
                        <label className={`w-24 h-24 shrink-0 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-500 cursor-pointer flex items-center justify-center overflow-hidden transition-all group relative`}>
                            {image ? (
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-zinc-600 group-hover:text-white transition-colors" size={32} />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Stage Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className={`w-full bg-transparent border-b border-zinc-700 focus:border-white py-2 text-2xl font-black text-white placeholder-zinc-700 outline-none transition-colors`} 
                                placeholder="ENTER NAME"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Genre</label>
                            <select value={genre} onChange={(e) => setGenre(e.target.value as Genre)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:border-purple-500">
                                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Origin</label>
                            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:border-purple-500">
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Starting Fame</span>
                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50 uppercase">
                                {getPopLabel(startingPop)}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="80" 
                            step="20" 
                            value={startingPop} 
                            onChange={(e) => setStartingPop(parseInt(e.target.value))} 
                            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
                        />
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className={`w-full bg-white text-black hover:scale-[1.02] font-black text-lg py-4 rounded-xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase tracking-widest flex items-center justify-center gap-2 group mt-4`}
                    >
                        Initialize Artist
                        <TrendingUp size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-80 flex flex-col gap-4 animate-in slide-in-from-right duration-700 delay-200">
                {hasAutoSave && (
                    <button 
                        onClick={onContinue}
                        className="bg-gradient-to-br from-purple-900/50 to-black border border-purple-500/50 p-6 rounded-2xl text-left hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-purple-500 rounded-lg text-white"><PlayCircle size={24} fill="currentColor" /></div>
                                <span className="text-[10px] font-bold bg-purple-950 text-purple-300 px-2 py-1 rounded">RESUME</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Continue Career</h3>
                        </div>
                    </button>
                )}

                <label className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl text-left hover:bg-zinc-800 hover:border-white/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-white transition-colors"><Upload size={20} /></div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Load File</h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Import .JSON Save</p>
                        </div>
                    </div>
                    <input type="file" accept=".json" onChange={onLoadSave} className="hidden" />
                </label>
            </div>
        </div>
    </div>
  );
};

export default CreateArtist;
