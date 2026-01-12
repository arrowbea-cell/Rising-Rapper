
import { Song, Genre } from '../../../types';

export const calculateTrendImpact = (
    song: Song, 
    currentTrends: Record<Genre, number>,
    activeThemes: string[]
): number => {
    const isSingle = song.type === 'Single';
    const currentTrendValue = currentTrends[song.genre] || 1.0;

    // --- TREND LOCK LOGIC ---
    // Singles: Mengikuti ombak pasar (Dynamic).
    // B-Sides: Terkunci di masa lalu (Locked).
    
    let effectiveTrend = 1.0;
    
    if (isSingle) {
        // Single menikmati boost penuh dari trend genre saat ini
        effectiveTrend = currentTrendValue;
    } else {
        // B-Side Lock: Hanya terpengaruh 10% oleh trend saat ini. 
        // Sisanya flat 1.0. Lagu lama tidak tiba-tiba naik cuma karena genrenya lagi hits.
        effectiveTrend = 1.0 + ((currentTrendValue - 1.0) * 0.1);
    }

    // Theme Bonus (Selalu aktif jika tema sesuai musim)
    if (activeThemes.includes(song.theme)) {
        effectiveTrend *= 1.3;
    }

    return effectiveTrend;
};
