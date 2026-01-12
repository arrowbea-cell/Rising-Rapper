
import { NPCArtist, Song, Album, Genre } from '../../types';
import { GENRE_COVER_URLS } from '../../constants';
import { getLocalizedTitle } from './titleGenerator';

const getRandomCover = (genre: Genre): string => {
    const urls = GENRE_COVER_URLS[genre] || GENRE_COVER_URLS[Genre.POP];
    return urls[Math.floor(Math.random() * urls.length)];
};

export const simulateNPCWeek = (
  npcs: NPCArtist[],
  activeThemes: string[],
  isHoliday: boolean,
  currentTrends: Record<Genre, number>,
  currentWeek: number
): { newSongs: Song[], newAlbums: Album[] } => {
  const newSongs: Song[] = [];
  const newAlbums: Album[] = [];

  npcs.forEach(npc => {
    let releaseChance = 0.05; 

    if (npc.archetype === 'Rising' || npc.archetype === 'K-Idol') releaseChance += 0.05; 
    if (npc.archetype === 'Legacy') releaseChance -= 0.02; 
    if (npc.workEthic > 80) releaseChance += 0.05;
    if (npc.workEthic < 30) releaseChance -= 0.02;
    if (currentTrends[npc.genre] > 1.2) releaseChance += 0.03;

    if (npc.isHolidaySpecialist && isHoliday) releaseChance += 0.50; 
    if (npc.isHolidaySpecialist && !isHoliday) releaseChance = 0.005; 

    // Check last release to prevent spamming too much, but allow bursts
    const weeksSinceLast = currentWeek - (npc.lastReleaseWeek || 0);
    if (weeksSinceLast < 4) releaseChance *= 0.2;

    if (Math.random() < releaseChance) {
      let theme = activeThemes[Math.floor(Math.random() * activeThemes.length)] || 'love';
      if (npc.isHolidaySpecialist && isHoliday) theme = 'christmas';
      
      // Determine Dominant Region for Language Selection
      const dominantRegion = Object.entries(npc.popularityByRegion)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'USA';

      // Determine if Album or Single
      let albumChance = 0.1;
      if (npc.archetype === 'Mainstream') albumChance = 0.2;
      if (npc.archetype === 'Legacy') albumChance = 0.3;
      
      const isAlbum = Math.random() < albumChance;

      // SNAPSHOT NPC POPULARITY FOR REGION LOCK
      const popularitySnapshot = { ...npc.popularityByRegion };
      
      // GET COVER ART
      const coverArt = getRandomCover(npc.genre);

      if (isAlbum) {
          // CREATE ALBUM
          const albumTitle = getLocalizedTitle(npc.genre, theme, 'Album', dominantRegion);
          const trackCount = Math.floor(Math.random() * 8) + 8; // 8-16 tracks
          const albumTracks: Song[] = [];
          
          for (let i = 0; i < trackCount; i++) {
              const quality = Math.min(100, npc.qualitySkill + (Math.random() * 15 - 5));
              // NPC Tracks are B-Sides by default
              const song: Song = {
                  id: `npc_${npc.id}_alb_${Date.now()}_${i}`,
                  artistId: npc.id,
                  artistName: npc.name,
                  title: i === 0 ? 'Intro' : i === trackCount - 1 ? 'Outro' : `Track ${i+1}`,
                  quality,
                  streams: 0,
                  sales: 0,
                  revenue: 0,
                  isReleased: true,
                  releaseWeek: currentWeek,
                  genre: npc.genre,
                  theme,
                  type: 'Track', // B-SIDE
                  weeklyStreams: 0,
                  weeklySales: 0,
                  streamsThisYear: 0,
                  regionalData: {},
                  hasCharted: false,
                  releasePopularity: popularitySnapshot,
                  coverArt: coverArt // Add cover
              };
              albumTracks.push(song);
              newSongs.push(song);
          }

          const avgQuality = Math.floor(albumTracks.reduce((sum, t) => sum + t.quality, 0) / trackCount);
          
          const newAlbum: Album = {
              id: `npc_album_${npc.id}_${Date.now()}`,
              artistId: npc.id,
              artistName: npc.name,
              title: albumTitle,
              tracks: albumTracks,
              type: 'LP',
              isReleased: true,
              releaseWeek: currentWeek,
              totalStreams: 0,
              totalSales: 0,
              quality: avgQuality,
              theme,
              weeklySales: 0,
              weeklySES: 0,
              coverArt: coverArt // Add cover
          };
          newAlbums.push(newAlbum);

      } else {
          // CREATE SINGLE
          const title = getLocalizedTitle(npc.genre, theme, 'Single', dominantRegion);
          const quality = Math.min(100, npc.qualitySkill + (Math.random() * 10 - 5));
          const newSong: Song = {
            id: `npc_${npc.id}_${Date.now()}`,
            artistId: npc.id,
            artistName: npc.name,
            title: title,
            quality,
            streams: 0,
            sales: 0,
            revenue: 0,
            isReleased: true,
            releaseWeek: currentWeek,
            genre: npc.genre,
            theme,
            type: 'Single', // SINGLE
            weeklyStreams: 0,
            weeklySales: 0,
            streamsThisYear: 0,
            regionalData: {}, 
            hasCharted: false,
            releasePopularity: popularitySnapshot,
            coverArt: coverArt // Add cover
          };
          newSongs.push(newSong);
      }
      
      npc.lastReleaseWeek = currentWeek;
    }
  });

  return { newSongs, newAlbums };
};
