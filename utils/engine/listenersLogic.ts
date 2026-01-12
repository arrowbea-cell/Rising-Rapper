
import { Song, RegionStats, Genre, NPCArtist } from '../../types';

export const calculateMonthlyListeners = (
    prevListeners: number,
    songs: Song[],
    regions: RegionStats[],
    trends: Record<Genre, number>,
    isHoliday: boolean,
    isHalloween: boolean,
    isPlayer: boolean,
    npc?: NPCArtist
): number => {
    let rawListeners = 0;
    let activeSongCount = 0;
    
    songs.forEach(song => {
        if (!song.isReleased) return;
        if ((song.weeklyStreams || 0) < 100) return; 
        
        activeSongCount++;
        const typeMult = song.type === 'Track' ? 0.4 : 1.0; 
        
        const monthlyStreamEst = (song.weeklyStreams || 0) * 4;
        
        const alc = Math.sqrt(monthlyStreamEst) * 1.6 * typeMult; 
        rawListeners += alc;
    });

    if (rawListeners === 0) return Math.floor(prevListeners * 0.98); 

    let dedupMultiplier = 0.85 + (activeSongCount * 0.015);
    dedupMultiplier = Math.max(0.65, Math.min(0.98, dedupMultiplier));
    
    const catalogPenalty = Math.max(0.65, 1.0 - (activeSongCount * 0.025)); 
    
    let uniqueListeners = rawListeners * (isPlayer ? catalogPenalty : catalogPenalty * 1.2);

    const hasViral = songs.some(s => s.weeklyStreams && s.weeklyStreams > 1000000);
    if (hasViral) uniqueListeners *= 1.4; 

    let regionScore = 0;
    if (isPlayer) {
        regionScore = regions.reduce((acc, r) => acc + r.popularity, 0) / regions.length;
    } else if (npc) {
        regionScore = npc.popularityGlobal;
    }
    const regionMultiplier = 0.9 + (regionScore / 80); 
    uniqueListeners *= regionMultiplier;

    const momentumWeight = isPlayer ? 0.7 : 0.85; 
    
    const calculatedListeners = uniqueListeners * 400; 

    let finalListeners = (prevListeners * momentumWeight) + (calculatedListeners * (1 - momentumWeight));

    if (isHoliday) finalListeners *= 1.1; 
    
    finalListeners = Math.max(finalListeners, prevListeners * 0.95); 
    
    return Math.floor(finalListeners);
}
