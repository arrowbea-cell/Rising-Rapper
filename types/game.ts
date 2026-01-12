
import { Genre } from './enums';
import { Song, Album, SongHistoryPoint } from './music';
import { Artist, NPCArtist } from './artist';
import { SocialState } from './social';
import { BrandOffer } from './brand';
import { YouTubeVideo } from './youtube';
import { ChartEntry, ActiveTour, WorldRecord, AwardCeremonyData } from './features';

export interface BudgetOption {
  label: string;
  value: number;
}

export interface RegionStats {
  id: string;
  name: string;
  popularity: number;
  marketSize: number;
}

export interface GameDate {
  week: number;
  month: number;
  year: number;
}

export interface GameState {
  money: number;
  hype: number;
  totalStreams: number;
  totalSales: number;
  weeklyStreams: number;
  weeklySales: number;
  yearlyStreams: number;
  yearlySales: number;

  date: GameDate;
  songs: Song[];
  albums: Album[];
  regions: RegionStats[];
  trends: Record<Genre, number>;
  themeFatigue: Record<string, number>;
  
  npcArtists: NPCArtist[];
  activeCharts: Record<string, ChartEntry[]>;
  npcSongs: Song[]; 
  npcAlbums: Album[];
  
  playerChartHistory: Record<string, Record<string, SongHistoryPoint[]>>;
  
  activeTour: ActiveTour | null;
  youtubeVideos?: YouTubeVideo[];
  youtubeLastUpdatedWeek?: number;

  socialState?: SocialState;
  
  worldRecords: WorldRecord[];
  
  // Active Deals Tracking
  activeDeals?: BrandOffer[];

  // Awards System
  activeNominations?: AwardCeremonyData | null; // Persist pending awards here
  awardsHistory?: AwardCeremonyData[];
  
  // Events
  grammyPerformanceSongId?: string | null; // If set, player is scheduled to perform
}
