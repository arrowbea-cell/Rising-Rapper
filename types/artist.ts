
import { Gender, Genre } from './enums';

export interface Artist {
  name: string;
  country: string;
  gender: Gender;
  genre: Genre;
  budget: number;
  age: number;
  image: string | null;
  uploadBanUntil?: number;
  monthlyListeners: number;
  globalRank?: number;
  startingPopularity?: number;
  artistPickId?: string; 
  isDev?: boolean; // New Developer Flag
}

export type NPCArchetype = 'Mainstream' | 'Rising' | 'Legacy' | 'Indie' | 'K-Idol' | 'One-Hit';

export interface NPCArtist {
  id: string;
  name: string;
  gender: Gender;
  genre: Genre;
  archetype: NPCArchetype;
  
  popularityGlobal: number;
  popularityByRegion: Record<string, number>;
  monthlyListeners: number;
  
  qualitySkill: number;
  workEthic: number;
  happiness: number;

  isHolidaySpecialist?: boolean;
  lastReleaseWeek?: number;
}
