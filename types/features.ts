
export type ChartType = 'HOT_100' | 'GLOBAL_200' | 'GLOBAL_ALBUMS' | 'REGIONAL';

export interface ChartEntry {
  rank: number;
  lastWeekRank: number | null;
  songId?: string;
  albumId?: string;
  title: string;
  artistName: string;
  isPlayer: boolean;
  score: number;
  metric1: number;
  metric2: number;
  weeksOnChart: number;
  peakRank: number;
  coverArt?: string;
  movement: 'up' | 'down' | 'stable' | 'new' | 're-entry';
}

export interface TourTier {
  id: string;
  name: string;
  minHype: number;
  costPerLeg: number;
  baseCapacity: number;
  ticketPrice: number;
}

export interface ActiveTour {
  name: string;
  tierId: string;
  regions: string[];
  setlist: string[];
  showQuality: number;
  currentLegIndex: number;
  totalRevenue: number;
  totalAttendees: number;
  history: { regionId: string; revenue: number; attendees: number; week: number }[];
}

export type RecordCategory = 'GLOBAL' | 'REGION' | 'GENRE' | 'THEME';
export type RecordMetric = 'WEEKLY_STREAMS' | 'WEEKLY_SALES' | 'TOTAL_STREAMS';

export interface WorldRecord {
  id: string;
  title: string;
  category: RecordCategory;
  scopeValue: string; 
  metric: RecordMetric;
  holderId: string; 
  holderName: string;
  value: number; 
  songId?: string; 
  albumId?: string; 
  dateBrokenWeek: number;
  isHeldByPlayer: boolean;
  description: string;
  icon?: string;
}

// --- AWARDS SYSTEM ---
export interface AwardNominee {
    id: string; // Song ID, Album ID, or Artist ID
    name: string; // Title or Name
    artistName: string;
    image?: string;
    score: number; // Internal calculation score
    isPlayer: boolean;
}

export interface AwardCategoryResult {
    categoryName: string;
    winner: AwardNominee;
    nominees: AwardNominee[];
}

export interface AwardCeremonyData {
    year: number;
    results: AwardCategoryResult[];
}
