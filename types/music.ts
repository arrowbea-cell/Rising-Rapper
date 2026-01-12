
import { Genre } from './enums';

export interface GenreStats {
  id: Genre;
  name: string;
  streamBias: number;
  salesBias: number;
  viralBias: number;
  longevity: number;
  hypeGain: number;
  strongRegions: string[];
  description: string;
}

export interface ThemeStats {
  id: string;
  name: string;
  type: 'Standard' | 'Holiday';
  streamBias: number;
  salesBias: number;
  viralBias: number;
  longevity: number;
  hypeGain: number;
  description: string;
}

export interface Song {
  id: string;
  artistId?: string;
  artistName: string;
  title: string;
  quality: number;
  streams: number;
  sales: number;
  revenue: number;
  isReleased: boolean;
  releaseWeek?: number;
  coverArt?: string;
  genre: Genre;
  theme: string;
  type: 'Single' | 'Track';
  strategyId?: string;
  weeklyStreams?: number;
  weeklySales?: number;
  peakWeeklyStreams?: number;
  streamsThisYear?: number;
  regionalData?: Record<string, { streams: number; sales: number }>;
  releasePopularity?: Record<string, number>; 
  isViral?: boolean;
  viralWeeksLeft?: number;
  hasCharted?: boolean;
  features?: string[];
  pendingPayolaStreams?: number; // New field for delayed payola
}

export interface Album {
  id: string;
  artistId?: string;
  artistName: string;
  title: string;
  coverArt?: string;
  tracks: Song[];
  type: 'EP' | 'LP' | 'Mixtape' | 'Double Album' | 'Repackage';
  isReleased: boolean;
  releaseWeek?: number;
  totalStreams: number;
  totalSales: number;
  quality: number;
  strategyId?: string;
  cohesionBonus?: boolean;
  originalAlbumId?: string;
  theme?: string;
  weeklySales?: number;
  weeklySES?: number;
}

export interface SongHistoryPoint {
  week: number;
  year: number;
  rank: number;
  streams: number;
}
