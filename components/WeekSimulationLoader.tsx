
import React, { useState, useEffect } from 'react';
import { Loader2, Music, DollarSign, TrendingUp, Globe, Users, Activity } from 'lucide-react';

interface WeekSimulationLoaderProps {
  week: number;
}

const LOADING_PHASES = [
  { text: "Aggregating Global Streams...", icon: Music, color: "text-blue-400" },
  { text: "Calculating Artist Royalties...", icon: DollarSign, color: "text-green-400" },
  { text: "Analyzing Viral Trends...", icon: TrendingUp, color: "text-purple-400" },
  { text: "Updating Regional Charts...", icon: Globe, color: "text-indigo-400" },
  { text: "Processing Fan Interactions...", icon: Users, color: "text-pink-400" },
  { text: "Finalizing Week Data...", icon: Activity, color: "text-white" }
];

const WeekSimulationLoader: React.FC<WeekSimulationLoaderProps> = ({ week }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress Bar Animation (approx 1.5s total duration)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Non-linear progression for realism
        const increment = Math.random() * 15;
        return Math.min(100, prev + increment);
      });
    }, 100);

    // Text Phase Cycling
    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % LOADING_PHASES.length);
    }, 250); // Change text rapidly

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  const CurrentIcon = LOADING_PHASES[phaseIndex].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-sans overflow-hidden cursor-wait">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        
        {/* Main Spinner & Icon */}
        <div className="relative mb-10">
            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full animate-pulse" />
            <div className="w-24 h-24 border-4 border-zinc-800 rounded-full relative flex items-center justify-center bg-black">
                <div className="absolute inset-0 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                <CurrentIcon size={32} className={`${LOADING_PHASES[phaseIndex].color} transition-colors duration-200`} />
            </div>
        </div>

        {/* Week Title */}
        <h2 className="text-5xl font-black text-white tracking-tighter mb-2 animate-in slide-in-from-bottom-4 fade-in duration-500">
            WEEK <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{week + 1}</span>
        </h2>
        
        {/* Simulating Badge */}
        <div className="mb-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">System Simulating</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-4 relative">
            <div 
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-200 ease-out relative"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent opacity-50" />
            </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="h-6 flex items-center justify-center overflow-hidden w-full">
            <p className="text-sm font-mono text-zinc-400 animate-pulse text-center w-full">
                {`> ${LOADING_PHASES[phaseIndex].text}`}
            </p>
        </div>

      </div>

      {/* Decorative Footer */}
      <div className="absolute bottom-8 text-[10px] text-zinc-700 font-mono uppercase tracking-widest opacity-50">
          Rapper Rise Engine v1.2 • Processing World State
      </div>
    </div>
  );
};

export default WeekSimulationLoader;
