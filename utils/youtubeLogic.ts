
import { YouTubeVideo, YouTubeVideoType, RegionStats } from '../types';

// 2️⃣ Video Types & Base View (Rebalanced - Nerfed Audio & Shorts)
const BASE_VIEW_BY_TYPE: Record<YouTubeVideoType, number> = {
  "Official MV": 50000,      // Main driver
  "Lyric Video": 2000,       // MASSIVE NERF (Was 10k). Audio shouldn't outshine MV.
  "Performance": 15000,      // Slight nerf
  "Shorts": 3000             // Nerfed base. Shorts rely purely on viral algo now.
};

// 7️⃣ VIRAL LOGIC
export const checkVirality = (
  thumbnailQuality: number, 
  conceptQuality: number
): boolean => {
  const rng = Math.random() * 30;
  const score = (thumbnailQuality * 0.25) + (conceptQuality * 0.25) + rng;
  return score > 75; // Harder threshold (was 65)
};

export const calculateYouTubeWeek = (
  video: YouTubeVideo,
  currentWeek: number,
  globalPopularity: number, // 0-100 from Region Stats avg
  regionStats: RegionStats[]
): { views: number; revenue: number; viralActive: boolean } => {

  const ageInWeeks = currentWeek - video.uploadWeek;
  
  // 4️⃣ Quality Multiplier
  const qualityMultiplier = 0.5 + 
    (video.productionQuality * 0.005) + 
    (video.conceptQuality * 0.002);
  
  // 5️⃣ Artist Popularity Effect
  // Pop 100 -> 100x multiplier
  const popularityMultiplier = Math.max(1, Math.pow(1.05, globalPopularity));

  // 6️⃣ Freshness & Decay Curve
  let freshness = 1.0;
  
  if (video.type === "Official MV") {
      if (ageInWeeks === 0) freshness = 20.0;
      else if (ageInWeeks <= 4) freshness = 6.0;
      else if (ageInWeeks <= 12) freshness = 1.5;
      else freshness = 0.4;
  } else if (video.type === "Shorts") {
      // Shorts die VERY fast now. Explode or nothing.
      if (ageInWeeks <= 1) freshness = 8.0; 
      else if (ageInWeeks <= 3) freshness = 2.0;
      else freshness = 0.05; // Dead after a month
  } else if (video.type === "Lyric Video") {
      // Audio is stable but low
      if (ageInWeeks <= 4) freshness = 1.5;
      else freshness = 0.5;
  } else {
      // Performance
      if (ageInWeeks <= 4) freshness = 3.0;
      else freshness = 0.6;
  }

  // 8️⃣ Region Interest
  const avgRegionPop = regionStats.reduce((acc, r) => acc + r.popularity, 0) / regionStats.length;
  const regionInterestMultiplier = 1 + (avgRegionPop / 100);

  // BASE CALCULATION
  let weeklyViews = BASE_VIEW_BY_TYPE[video.type] * 
                    qualityMultiplier * 
                    popularityMultiplier * 
                    regionInterestMultiplier * 
                    freshness;

  // 7️⃣ VIRAL LOGIC APPLIED
  let viralActive = video.isViral && (video.viralWeeksLeft > 0);
  if (viralActive) {
      // Shorts get a bigger viral bonus because their base is low
      const viralBonus = video.type === 'Shorts' ? (5 + Math.random() * 5) : (2 + Math.random() * 2);
      weeklyViews *= viralBonus;
  }

  // 9️⃣ VIDEO AGE LIMITER
  if (ageInWeeks > 52 && !viralActive) {
      weeklyViews *= 0.1; // Old videos barely get views
  }

  // Randomness Variance
  weeklyViews *= (0.8 + Math.random() * 0.4);

  // 1️⃣2️⃣ Monetization
  let revenue = 0;
  if (video.monetized) {
      // CPM Logic
      let cpm = 2.0; 
      if (video.type === "Shorts") {
          revenue = (weeklyViews / 1000) * 0.01; // Shorts pay almost nothing ($0.01 CPM)
      } else {
          if (video.productionQuality > 80) cpm += 1.5;
          if (globalPopularity > 80) cpm += 2.0;
          revenue = (weeklyViews / 1000) * cpm;
      }
  }

  return {
      views: Math.floor(weeklyViews),
      revenue: revenue,
      viralActive
  };
};
