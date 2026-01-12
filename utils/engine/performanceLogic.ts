
import { Song, RegionStats, Genre, NPCArtist, Album, ChartEntry } from '../../types';
import { GENRE_DETAILS, THEMES, BASE_SINGLE_SALES, BASE_ALBUM_SALES } from '../../constants';

// IMPORT SISTEM YANG SUDAH DIPECAH
import { calculateLifecycleMultiplier } from './systems/lifecycleSystem';
import { calculateTrendImpact } from './systems/trendSystem';
import { calculateRegionPower } from './systems/regionSystem';
import { calculateVariance } from './systems/varianceSystem';

// --- HELPERS ---

const getPromoMultiplier = (strategyId?: string) => {
    switch (strategyId) {
        case 'organic': return 1.0;
        case 'social': return 1.15;
        case 'playlist': return 1.4;
        case 'guerrilla': return 1.7;
        default: return 1.0;
    }
};

const getFanbaseMultiplier = (monthlyListeners: number) => {
    if (monthlyListeners < 1000000) return 0.8; 
    if (monthlyListeners < 10000000) return 1.0; 
    if (monthlyListeners < 50000000) return 1.25; 
    return 1.6; 
};

// ==================================================================================
// MAIN SONG CALCULATOR (ORCHESTRATOR)
// ==================================================================================

export const calculateSongPerformance = (
  song: Song,
  regions: RegionStats[],
  trends: Record<Genre, number>,
  themeFatigue: Record<string, number>,
  activeThemes: string[],
  month: number,
  playerHype: number,
  currentWeek: number, 
  fanbaseSize: number, 
  npcData?: NPCArtist
): Song => {
  const ageInWeeks = currentWeek - (song.releaseWeek || 0);
  
  // Data Dasar
  const genreStats = GENRE_DETAILS[song.genre] || GENRE_DETAILS['Pop'];
  const themeStats = THEMES.find(t => t.id === song.theme);
  
  // Biases Statis
  const genreStreamBias = genreStats.streamBias || 1.0;
  const themeStreamBias = themeStats ? themeStats.streamBias : 1.0;
  const genreSalesBias = genreStats.salesBias || 1.0;

  // --------------------------------------------------------
  // 1. PANGGIL SISTEM-SISTEM TERPISAH
  // --------------------------------------------------------
  
  // System 1: Lifecycle (Umur & Musim)
  const { multiplier: stageMult, hypeImpact } = calculateLifecycleMultiplier(ageInWeeks, song, month, genreStats.longevity);
  
  // System 2: Trend Lock (Single vs B-Side Market)
  const trendMult = calculateTrendImpact(song, trends, activeThemes);
  
  // System 3: Variance (Chaos Engine) - NOW WITH QUALITY
  const variance = calculateVariance(song.type, song.quality);
  
  // System Extra: Fatigue & Viral
  const fatigue = themeFatigue[song.theme] || 0;
  const fatiguePenalty = fatigue > 70 ? 0.6 : 1.0; 

  let viralMult = 1.0;
  if (song.isViral && (song.viralWeeksLeft || 0) > 0) {
      viralMult = 2.5;
  }

  // Quality Scaling (0.5x to 1.5x) - Masih dipakai untuk multiplier dasar
  const qualityMult = 0.5 + (song.quality / 100);

  // Promo (Singles Only)
  const promoMult = song.type === 'Single' ? getPromoMultiplier(song.strategyId) : 1.0;
  
  // Fanbase Multiplier (Untuk Sales)
  const fanbaseMult = getFanbaseMultiplier(fanbaseSize);

  // --------------------------------------------------------
  // 2. LOOP SETIAP REGION (Region Lock + Regional Luck)
  // --------------------------------------------------------
  
  let totalWeeklyStreams = 0;
  let totalWeeklySales = 0;
  const regionalData: Record<string, { streams: number; sales: number }> = {};

  regions.forEach(region => {
      // Ambil data popularitas
      const livePop = npcData ? (npcData.popularityByRegion[region.id] || 0) : region.popularity;
      const snapshotPop = song.releasePopularity ? (song.releasePopularity[region.id] || 0) : 0;
      
      // System 4: Region Lock Calculation
      const effectivePop = calculateRegionPower(region.id, livePop, snapshotPop, song.type);
      
      // --- NEW: REGIONAL LUCK / TASTEMAKER SYSTEM ---
      // Determine if this specific song resonates with this specific region.
      // This is deterministic based on IDs so it stays consistent week-to-week.
      let regionalLuck = 1.0;
      
      // Create a pseudo-random seed from Song ID and Region ID
      const seedString = song.id + region.id;
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
          hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
          hash |= 0;
      }
      const normalizedHash = Math.abs(hash % 100); // 0 - 99

      if (song.quality > 80) {
          // Good songs adhere to logic but can have breakouts
          if (normalizedHash > 85) regionalLuck = 2.5; // HUGE REGIONAL HIT
          else if (normalizedHash > 60) regionalLuck = 1.5; // Solid performance
          else if (normalizedHash < 10) regionalLuck = 0.5; // Flop in this specific region
      } else {
          // Bad songs are more random
          if (normalizedHash > 95) regionalLuck = 2.0; // Random viral moment
          else if (normalizedHash < 40) regionalLuck = 0.5; // Nobody likes it here
      }

      // Strong Regions for Genre always get a small boost base
      if (genreStats.strongRegions.includes(region.id)) {
          regionalLuck *= 1.2;
      }

      // --- PERHITUNGAN STREAMS ---
      const marketCapacity = region.marketSize * 1500;
      
      // Hype hanya berdampak besar pada Single
      const hypeVolume = song.type === 'Single' ? (playerHype * 100 * hypeImpact) : 0;

      const baseVolume = (effectivePop * marketCapacity) + hypeVolume;

      let streams = Math.floor(
          baseVolume * 
          stageMult * 
          trendMult * 
          genreStreamBias * 
          themeStreamBias * 
          regionalLuck * // NEW FACTOR
          fatiguePenalty * 
          qualityMult * 
          viralMult * 
          variance 
      );
      
      if (streams < 0) streams = 0;

      // --- PERHITUNGAN SALES (Hanya Single) ---
      let sales = 0;
      if (song.type === 'Single') {
          let salesLifecycle = 1.0;
          
          if (ageInWeeks === 0) {
              salesLifecycle = 2.5; 
          } else {
              const minFloor = 0.01 + ((song.quality / 100) * 0.04); 
              salesLifecycle = Math.max(minFloor, Math.pow(0.9, ageInWeeks));
          }
          
          const baseSales = BASE_SINGLE_SALES[region.id] || 500;
          
          let rawSales = baseSales * 
              (effectivePop / 20) * 
              qualityMult * 
              fanbaseMult * 
              promoMult * 
              salesLifecycle * 
              regionalLuck * // Luck affects sales too
              genreSalesBias * 
              (0.8 + Math.random() * 0.4);
          
          sales = Math.max(song.quality > 50 ? 1 : 0, Math.floor(rawSales));
      }

      regionalData[region.id] = { streams, sales };
      totalWeeklyStreams += streams;
      totalWeeklySales += sales;
  });

  return {
    ...song,
    weeklyStreams: totalWeeklyStreams,
    weeklySales: totalWeeklySales,
    streams: song.streams + totalWeeklyStreams,
    sales: song.sales + totalWeeklySales,
    streamsThisYear: (song.streamsThisYear || 0) + totalWeeklyStreams, 
    peakWeeklyStreams: Math.max((song.peakWeeklyStreams || 0), totalWeeklyStreams), 
    regionalData
  };
};

// ==================================================================================
// ALBUM SALES CALCULATOR
// ==================================================================================

export const calculateAlbumSales = (
    album: Album,
    regions: RegionStats[],
    playerHype: number,
    fanbaseSize: number,
    activeCharts: Record<string, ChartEntry[]>, 
    currentWeek: number
): { sales: number, ses: number, regionalSales: Record<string, number> } => {
    
    const ageInWeeks = currentWeek - (album.releaseWeek || 0);
    const fanbaseMult = getFanbaseMultiplier(fanbaseSize);
    const promoMult = getPromoMultiplier(album.strategyId); 
    const qualityMult = 0.5 + (album.quality / 100); 

    let typeMult = 1.0;
    if (album.type === 'EP') typeMult = 0.6; 
    else if (album.type === 'Double Album') typeMult = 1.3; 
    else if (album.type === 'Repackage') typeMult = 0.5; 
    
    let leadSingleMult = 1.0;
    const hot100 = activeCharts['HOT_100'] || [];
    const tracks = album.tracks || [];
    const trackIds = tracks.map(t => t.id);
    
    const chartingSingles = hot100.filter(entry => trackIds.includes(entry.songId || ''));
    if (chartingSingles.length > 0) {
        const bestRank = Math.min(...chartingSingles.map(c => c.rank));
        leadSingleMult += (0.5 * (101 - bestRank) / 100); 
    }

    let lifecycleMult = 1.0;
    if (ageInWeeks === 0) {
        lifecycleMult = 3.0; 
    } else if (ageInWeeks > 8) {
        const longTailFloor = 0.05 + ((album.quality / 100) * 0.10);
        lifecycleMult = Math.max(longTailFloor, Math.pow(0.95, ageInWeeks - 8));
    } else {
        lifecycleMult = Math.pow(0.9, ageInWeeks);
    }

    let totalSales = 0;
    const regionalSales: Record<string, number> = {};

    regions.forEach(region => {
        const baseSales = BASE_ALBUM_SALES[region.id] || 2000;
        let popMult = 0.1 + (region.popularity / 20); 

        // Apply Regional Luck for Album (Determinstic)
        let regionalLuck = 1.0;
        const seedString = album.id + region.id;
        let hash = 0;
        for (let i = 0; i < seedString.length; i++) hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
        const normalizedHash = Math.abs(hash % 100);
        
        if (album.quality > 85 && normalizedHash > 80) regionalLuck = 1.5; // Critical Acclaim locally
        else if (normalizedHash < 15) regionalLuck = 0.7; // Ignored locally

        let regionSales = baseSales * 
                          popMult * 
                          fanbaseMult * 
                          qualityMult * 
                          typeMult * 
                          leadSingleMult * 
                          promoMult * 
                          lifecycleMult * 
                          regionalLuck; // Added
        
        regionSales *= (0.85 + Math.random() * 0.3);

        const finalizedSales = Math.max(album.quality > 50 ? 1 : 0, Math.floor(regionSales));
        
        regionalSales[region.id] = finalizedSales;
        totalSales += finalizedSales;
    });

    return {
        sales: totalSales,
        ses: 0, 
        regionalSales
    };
};
