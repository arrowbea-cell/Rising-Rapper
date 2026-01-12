
import { Genre, GenreStats, ThemeStats } from '../types';

export const GENRE_DETAILS: Record<Genre, GenreStats> = {
  [Genre.POP]: { id: Genre.POP, name: 'Pop', streamBias: 1.2, salesBias: 0.8, viralBias: 60, longevity: 0.96, hypeGain: 20, strongRegions: ['USA', 'EU', 'UK', 'JPN'], description: 'Universal appeal. Good streams, balanced sales.' },
  [Genre.HIP_HOP]: { id: Genre.HIP_HOP, name: 'Hip-Hop', streamBias: 1.5, salesBias: 0.4, viralBias: 80, longevity: 0.92, hypeGain: 30, strongRegions: ['USA', 'CAN', 'UK'], description: 'Streaming monster, high hype, fast decay.' },
  [Genre.RNB]: { id: Genre.RNB, name: 'R&B', streamBias: 1.1, salesBias: 0.9, viralBias: 30, longevity: 0.98, hypeGain: 15, strongRegions: ['USA', 'UK', 'JPN'], description: 'Stable, long-term streams. Niche but loyal.' },
  [Genre.EDM]: { id: Genre.EDM, name: 'EDM', streamBias: 1.3, salesBias: 0.5, viralBias: 70, longevity: 0.94, hypeGain: 20, strongRegions: ['EU', 'OCE', 'CAN'], description: 'Huge in Europe/Clubs. High viral potential.' },
  [Genre.KPOP]: { id: Genre.KPOP, name: 'K-Pop', streamBias: 1.2, salesBias: 4.5, viralBias: 75, longevity: 0.95, hypeGain: 40, strongRegions: ['KOR', 'JPN', 'USA', 'LATAM'], description: 'Insane physical sales (Pure Sales) and community.' },
  [Genre.LATIN]: { id: Genre.LATIN, name: 'Latin', streamBias: 1.4, salesBias: 0.6, viralBias: 90, longevity: 0.95, hypeGain: 25, strongRegions: ['LATAM', 'USA', 'EU'], description: 'Global viral powerhouse. High streaming.' },
  [Genre.ROCK]: { id: Genre.ROCK, name: 'Rock', streamBias: 0.8, salesBias: 2.5, viralBias: 20, longevity: 0.99, hypeGain: 10, strongRegions: ['USA', 'UK', 'EU', 'JPN'], description: 'High physical sales and longevity.' },
  [Genre.AFROBEATS]: { id: Genre.AFROBEATS, name: 'Afrobeats', streamBias: 1.25, salesBias: 0.5, viralBias: 65, longevity: 0.96, hypeGain: 20, strongRegions: ['AFR', 'UK', 'USA'], description: 'Rising global star. Strong community.' }
};

export const INITIAL_TRENDS: Record<Genre, number> = {
  [Genre.POP]: 1.1, [Genre.HIP_HOP]: 1.2, [Genre.RNB]: 0.9, [Genre.EDM]: 0.8,
  [Genre.KPOP]: 1.3, [Genre.LATIN]: 1.0, [Genre.ROCK]: 0.7, [Genre.AFROBEATS]: 1.1
};

export const THEMES: ThemeStats[] = [
  { id: 'heartbreak', name: 'Heartbreak', type: 'Standard', streamBias: 1.3, salesBias: 1.1, viralBias: 0.9, longevity: 1.4, hypeGain: 0.9, description: 'Sad songs for sad times.' },
  { id: 'love', name: 'Love & Romance', type: 'Standard', streamBias: 1.2, salesBias: 1.2, viralBias: 1.0, longevity: 1.2, hypeGain: 1.1, description: 'For weddings and lovers.' },
  { id: 'toxic', name: 'Toxic / Petty', type: 'Standard', streamBias: 1.4, salesBias: 1.0, viralBias: 1.3, longevity: 1.1, hypeGain: 1.2, description: 'Messy relationships sell.' },
  { id: 'party', name: 'Party / Club', type: 'Standard', streamBias: 1.4, salesBias: 0.9, viralBias: 1.4, longevity: 0.8, hypeGain: 1.3, description: 'High energy, short life.' },
  { id: 'flex', name: 'Confidence / Flex', type: 'Standard', streamBias: 1.3, salesBias: 1.0, viralBias: 1.2, longevity: 0.9, hypeGain: 1.4, description: 'Ego boosting anthems.' },
  { id: 'luxury', name: 'Luxury / Wealth', type: 'Standard', streamBias: 1.1, salesBias: 1.3, viralBias: 1.0, longevity: 1.0, hypeGain: 1.3, description: 'Cars, jewelry, high life.' },
  { id: 'street', name: 'Street / Hood', type: 'Standard', streamBias: 1.2, salesBias: 0.8, viralBias: 1.1, longevity: 1.2, hypeGain: 1.5, description: 'Authentic street stories.' },
  { id: 'summer', name: 'Summer Vibes', type: 'Standard', streamBias: 1.5, salesBias: 1.1, viralBias: 1.5, longevity: 0.9, hypeGain: 1.4, description: 'Feel good sunshine hits.' },
  { id: 'dark', name: 'Dark / Moody', type: 'Standard', streamBias: 1.1, salesBias: 1.0, viralBias: 0.8, longevity: 1.5, hypeGain: 0.8, description: 'Deep, atmospheric, edgy.' },
  { id: 'nostalgia', name: 'Nostalgia / Retro', type: 'Standard', streamBias: 1.1, salesBias: 1.4, viralBias: 1.1, longevity: 1.8, hypeGain: 1.0, description: 'Sounds like the good old days.' },
  { id: 'conscious', name: 'Conscious / Message', type: 'Standard', streamBias: 1.0, salesBias: 1.3, viralBias: 0.7, longevity: 2.0, hypeGain: 0.9, description: 'Politics and deep meaning.' },
  { id: 'inspo', name: 'Inspirational', type: 'Standard', streamBias: 1.0, salesBias: 1.2, viralBias: 0.7, longevity: 1.6, hypeGain: 0.9, description: 'Hopeful and uplifting.' },
  { id: 'diss', name: 'Diss Track / Beef', type: 'Standard', streamBias: 1.8, salesBias: 0.6, viralBias: 2.0, longevity: 0.4, hypeGain: 2.5, description: 'Attacking an enemy. EXPLOSIVE.' },
  { id: 'halloween', name: 'Halloween / Spooky', type: 'Holiday', streamBias: 2.0, salesBias: 1.5, viralBias: 1.4, longevity: 0.5, hypeGain: 1.3, description: 'SPOOKY SEASON META.' },
  { id: 'christmas', name: 'Christmas', type: 'Holiday', streamBias: 2.5, salesBias: 3.0, viralBias: 1.2, longevity: 0.6, hypeGain: 1.0, description: 'THE ULTIMATE CASH COW.' },
];

export const THEME_SEASON_MAPPING: Record<number, string[]> = {
  1: ['heartbreak', 'dark', 'flex', 'conscious'],
  2: ['love', 'heartbreak', 'dark', 'conscious'],
  3: ['inspo', 'love', 'flex', 'street'],
  4: ['love', 'inspo', 'flex', 'luxury'],
  5: ['summer', 'party', 'love', 'latin'],
  6: ['summer', 'party', 'flex', 'diss'],
  7: ['summer', 'party', 'flex', 'luxury'],
  8: ['summer', 'party', 'love', 'nostalgia'],
  9: ['party', 'inspo', 'heartbreak', 'nostalgia'],
  10: ['halloween', 'dark', 'heartbreak', 'toxic'],
  11: ['heartbreak', 'inspo', 'love', 'toxic'],
  12: ['christmas', 'love', 'party', 'nostalgia'],
};

export const GENRE_THEME_COMPATIBILITY: Record<string, number> = {
  'Pop-heartbreak': 1.3, 'Pop-christmas': 1.3, 'Pop-party': 1.2, 'Pop-nostalgia': 1.4,
  'Hip-Hop-flex': 1.4, 'Hip-Hop-party': 1.2, 'Hip-Hop-street': 1.5, 'Hip-Hop-diss': 2.0, 'Hip-Hop-luxury': 1.4,
  'R&B-heartbreak': 1.3, 'R&B-love': 1.4, 'R&B-toxic': 1.6, 'R&B-luxury': 1.3,
  'EDM-party': 1.5, 'EDM-summer': 1.4, 'EDM-halloween': 1.3,
  'K-Pop-heartbreak': 1.3, 'K-Pop-party': 1.2, 'K-Pop-christmas': 1.2, 'K-Pop-love': 1.3,
  'Latin-party': 1.4, 'Latin-summer': 1.5, 'Latin-toxic': 1.3,
  'Rock-dark': 1.4, 'Rock-halloween': 1.4, 'Rock-nostalgia': 1.5, 'Rock-conscious': 1.3,
  'Afrobeats-summer': 1.4, 'Afrobeats-party': 1.3, 'Afrobeats-love': 1.3,
};
