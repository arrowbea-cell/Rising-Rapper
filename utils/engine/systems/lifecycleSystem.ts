
import { Song } from '../../../types';

const STAGE_FRESH = 4;   // Weeks 0-4: Debut Hype
const STAGE_ACTIVE = 20; // Weeks 5-20: Active Run

export const calculateLifecycleMultiplier = (
    ageInWeeks: number, 
    song: Song, 
    month: number, 
    genreLongevity: number
): { multiplier: number, hypeImpact: number } => {
    
    // --- SEASONAL OVERRIDE ---
    if (song.theme === 'christmas') {
        if (month === 12) return { multiplier: 6.0, hypeImpact: 2.0 };
        if (month === 11) return { multiplier: 2.0, hypeImpact: 1.2 };
        return { multiplier: 0.01, hypeImpact: 0 }; 
    }
    
    if (song.theme === 'halloween') {
        if (month === 10) return { multiplier: 4.0, hypeImpact: 1.5 };
        return { multiplier: 0.02, hypeImpact: 0 }; 
    }

    // --- STANDARD LIFECYCLE ---
    const isSingle = song.type === 'Single';
    const isClassic = song.quality >= 90;
    
    // 1. FRESH PHASE (Debut)
    if (ageInWeeks <= STAGE_FRESH) {
        return { 
            multiplier: isSingle ? 1.5 : 1.2, 
            hypeImpact: isSingle ? 1.5 : 1.0 
        };
    } 
    
    // 2. ACTIVE PHASE (Stabilization)
    if (ageInWeeks <= STAGE_ACTIVE) {
        return { 
            multiplier: 1.0, 
            hypeImpact: 0.8 
        };
    }

    // 3. LEGACY PHASE (Decay)
    let decayRate = genreLongevity; 
    
    // QUALITY AFFECTS DECAY
    // Lagu bagus (Quality 100) bertahan lebih lama (+0.02 retention)
    decayRate += (song.quality / 5000);

    if (!isSingle) decayRate -= 0.05; // B-sides decay faster
    if (isClassic) decayRate += 0.02; // Classics bonus stability

    // Cap decay rate max 0.995 (never truly immortal unless bugged)
    decayRate = Math.min(0.995, decayRate);

    const weeksOver = ageInWeeks - STAGE_ACTIVE;
    const decayMult = Math.pow(decayRate, weeksOver);
    
    return { 
        multiplier: Math.max(0.01, decayMult), 
        hypeImpact: 0.1 
    };
};
