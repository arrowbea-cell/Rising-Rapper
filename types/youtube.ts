
export type YouTubeVideoType = 'Official MV' | 'Lyric Video' | 'Performance' | 'Shorts';

export interface YouTubeVideo {
  id: string;
  songId?: string;
  title: string;
  type: YouTubeVideoType;
  productionQuality: number;
  conceptQuality: number;
  thumbnailQuality: number;
  uploadWeek: number;
  isViral: boolean;
  viralWeeksLeft: number;
  views: number;
  weeklyViews: number;
  likes: number;
  comments: number;
  revenue: number;
  monetized: boolean;
  thumbnailUrl?: string;
}
