
import { TourTier, RegionStats } from '../types';

export const RELEASE_STRATEGIES = [
  { id: 'organic', name: 'Organic Drop', cost: 0, hypeBonus: 0, streamMult: 1.0, viralBonus: 0, description: 'Just upload it. No promo.' },
  { id: 'social', name: 'Social Media Tease', cost: 500, hypeBonus: 10, streamMult: 1.2, viralBonus: 10, description: 'Post snippets on TikTok/IG.' },
  { id: 'playlist', name: 'Playlist Pitching', cost: 2000, hypeBonus: 25, streamMult: 1.5, viralBonus: 5, description: 'Pay curators for placement.' },
  { id: 'guerrilla', name: 'Guerrilla Marketing', cost: 5000, hypeBonus: 50, streamMult: 2.0, viralBonus: 25, description: 'Stunts and street teams.' },
];

export const PRODUCTION_TIERS = [
  { id: 'bedroom', name: 'Bedroom Setup', cost: 0, qualityMin: 10, qualityMax: 40 },
  { id: 'local', name: 'Local Studio', cost: 500, qualityMin: 30, qualityMax: 60 },
  { id: 'pro', name: 'Professional Studio', cost: 5000, qualityMin: 60, qualityMax: 100 },
];

export const TOUR_TIERS: TourTier[] = [
  { id: 'club', name: 'Club Run', minHype: 0, costPerLeg: 200, baseCapacity: 300, ticketPrice: 15 },
  { id: 'theater', name: 'Theater Tour', minHype: 200, costPerLeg: 2000, baseCapacity: 2000, ticketPrice: 40 },
  { id: 'arena', name: 'Arena Tour', minHype: 800, costPerLeg: 50000, baseCapacity: 15000, ticketPrice: 85 },
  { id: 'stadium', name: 'Stadium Tour', minHype: 2500, costPerLeg: 250000, baseCapacity: 60000, ticketPrice: 120 },
];

export const INITIAL_REGIONS: RegionStats[] = [
  { id: 'USA', name: 'USA', popularity: 0, marketSize: 20.0 }, 
  { id: 'CAN', name: 'Canada', popularity: 0, marketSize: 4.0 }, 
  { id: 'LATAM', name: 'Latin America', popularity: 0, marketSize: 12.0 }, 
  { id: 'UK', name: 'United Kingdom', popularity: 0, marketSize: 8.0 }, 
  { id: 'EU', name: 'Europe', popularity: 0, marketSize: 14.0 }, 
  { id: 'AFR', name: 'Africa', popularity: 0, marketSize: 4.5 }, 
  { id: 'KOR', name: 'South Korea', popularity: 0, marketSize: 6.0 }, 
  { id: 'JPN', name: 'Japan', popularity: 0, marketSize: 9.0 }, 
  { id: 'OCE', name: 'Oceania', popularity: 0, marketSize: 2.0 }, 
];

// --- NEW SALES SYSTEM CONSTANTS ---

export const BASE_ALBUM_SALES: Record<string, number> = {
    'USA': 5000,
    'LATAM': 3500,
    'EU': 4500,
    'UK': 4000,
    'CAN': 3000,
    'JPN': 8000,
    'KOR': 6500,
    'OCE': 2500,
    'AFR': 2000
};

export const BASE_SINGLE_SALES: Record<string, number> = {
    'USA': 1000,
    'LATAM': 500,
    'EU': 800,
    'UK': 900,
    'CAN': 600,
    'JPN': 1200,
    'KOR': 800,
    'OCE': 500,
    'AFR': 400
};

export const CHART_REGION_WEIGHTS: Record<string, number> = {
    'USA': 1.3,
    'JPN': 1.2,
    'KOR': 1.1,
    'UK': 1.1,
    'EU': 1.0,
    'CAN': 0.9,
    'LATAM': 0.9,
    'OCE': 0.8,
    'AFR': 0.7
};
