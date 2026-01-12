
import { Song, Album, Genre } from '../types';

// --- GENRE SCORING SYSTEM ---
export const calculateGenreBasedScore = (
    item: Song | Album, 
    genre: Genre, 
    artistHype: number,
    isAlbum: boolean
): number => {
    // Normalize basic stats
    // Note: For songs released this year, .streams is effectively their yearly performance
    const streams = 'totalStreams' in item ? item.totalStreams : item.streams; 
    const sales = 'totalSales' in item ? item.totalSales : item.sales;
    const quality = item.quality;
    const rng = Math.random() * 10; // Reduced RNG for more consistency

    let score = 0;

    switch (genre) {
        case Genre.POP:
        case Genre.EDM:
        case Genre.LATIN:
        case Genre.KPOP:
            // POP FORMULA:
            if (!isAlbum) {
                // PERFORMANCE (SONG): Hits Matter Most
                // 70% Commercial Success, 30% Quality
                // "Best Pop Solo Performance" goes to the radio smash.
                score = (streams / 1500000) * 2.0 + (quality * 0.8);
            } else {
                // ALBUM: Balance
                // "Best Pop Vocal Album" requires production value too.
                score = (sales / 30000) * 1.2 + (quality * 1.5);
            }
            break;

        case Genre.HIP_HOP:
        case Genre.AFROBEATS:
            // RAP FORMULA:
            if (!isAlbum) {
                // PERFORMANCE (SONG): Hype & Virality
                // "Best Rap Performance" often goes to the most culturally relevant track.
                // High Hype weighting.
                score = (streams / 2500000) + (quality * 0.8) + (artistHype * 0.15);
            } else {
                // ALBUM: Credibility
                // "Best Rap Album" respects the art form/classic status.
                score = (sales / 40000) + (quality * 1.8) + (artistHype * 0.05);
            }
            break;

        case Genre.RNB:
        case Genre.ROCK:
            // CRITICAL FORMULA:
            if (!isAlbum) {
                // PERFORMANCE (SONG): Vocals & Composition
                // Sales don't matter as much. Quality is King.
                score = (streams / 5000000) * 0.4 + (quality * 3.5);
            } else {
                // ALBUM: Masterpiece Status
                score = (sales / 50000) * 0.5 + (quality * 4.0);
            }
            break;

        default:
            // Balanced Default
            score = (streams / 3000000) + (quality * 1.5);
            break;
    }

    return score + rng;
};
