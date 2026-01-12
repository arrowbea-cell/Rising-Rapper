
import { Song, Album, ChartEntry, ChartType, RegionStats } from '../../types';
import { CHART_REGION_WEIGHTS } from '../../constants';

const calculateScore = (song: Song, chartType: ChartType): number => {
    // 1. BILLBOARD HOT 100 FORMULA
    // Rule: (Stream / 1000 * 0.65) + (Sales * 12 * 0.35)
    // Scope: USA Only
    if (chartType === 'HOT_100') {
        const usData = song.regionalData?.['USA'];
        const usStreams = usData ? usData.streams : (song.weeklyStreams * 0.2);
        const usSales = usData ? usData.sales : (song.weeklySales * 0.2);

        const streamingScore = (usStreams / 1000) * 0.65;
        const salesScore = (usSales * 12) * 0.35;
        
        return Math.floor(streamingScore + salesScore);
    }

    // 2. GLOBAL SINGLE CHART
    // Rule: Weighted Sum of Region Hot 100 Points
    if (chartType === 'GLOBAL_200') {
        let globalPoints = 0;
        if (song.regionalData) {
            Object.entries(song.regionalData).forEach(([regionId, data]) => {
                const weight = CHART_REGION_WEIGHTS[regionId] || 0.7;
                
                // Calculate Hot 100 Point for this region
                const regStreamPoint = (data.streams / 1000) * 0.65;
                const regSalePoint = (data.sales * 12) * 0.35;
                const regionTotal = regStreamPoint + regSalePoint;

                globalPoints += (regionTotal * weight);
            });
        }
        return Math.floor(globalPoints);
    }

    // 3. REGIONAL CHARTS
    if (song.regionalData && song.regionalData[chartType]) {
        const data = song.regionalData[chartType];
        // Using standard formula for region charts too
        const regStreamPoint = (data.streams / 1000) * 0.65;
        const regSalePoint = (data.sales * 12) * 0.35;
        return Math.floor(regStreamPoint + regSalePoint);
    }

    return 0;
};

const getMovement = (currentRank: number, prevEntry?: ChartEntry, hasCharted?: boolean): ChartEntry['movement'] => {
    if (!prevEntry) {
        return hasCharted ? 're-entry' : 'new';
    }
    if (currentRank < prevEntry.rank) return 'up';
    if (currentRank > prevEntry.rank) return 'down';
    return 'stable';
};

const getFillerChartEntries = (needed: number, offset: number, type: 'Song' | 'Album'): any[] => {
    const fakeEntries = [];
    const baseScore = type === 'Album' ? 500 : 50; // Adjusted for new point scale
    
    const fakeArtists = ["The Void", "Unknown", "Collective", "Background Noise", "System", "Neon Lights", "Echo Chamber"];
    const fakeTitles = ["Untitled", "Lost Frequency", "Static", "White Noise", "Ambient 1", "Drift", "Sleep", "Focus"];
    
    for (let i = 0; i < needed; i++) {
        const score = Math.floor(baseScore * Math.pow(0.95, i + offset));
        fakeEntries.push({
            fakeId: `filler_${type}_${Date.now()}_${i}`,
            title: `${fakeTitles[i % fakeTitles.length]} ${i}`,
            artistName: fakeArtists[i % fakeArtists.length],
            score: score,
            metric1: score * 1000, 
            metric2: 0, 
            weeksOnChart: Math.floor(Math.random() * 50),
            peakRank: i + 1 + offset,
            isPlayer: false,
            movement: Math.random() > 0.5 ? 'down' : 'up'
        });
    }
    return fakeEntries;
}

export const generateCharts = (
    allSongs: Song[],
    allAlbums: Album[],
    prevCharts: Record<string, ChartEntry[]>,
    regions: RegionStats[]
): Record<string, ChartEntry[]> => {
    const newCharts: Record<string, ChartEntry[]> = {};

    // --- SONG CHARTS ---
    const createSongChart = (key: string, filterRegion: string | null): ChartEntry[] => {
        const entries: { song: Song; score: number; streams: number; sales: number }[] = [];

        allSongs.forEach(song => {
            if (!song.isReleased) return;
            
            // Only process songs with points > 0
            const score = calculateScore(song, key as ChartType);
            if (score <= 0) return;

            let streams = 0;
            let sales = 0;

            if (key === 'GLOBAL_200') {
                streams = song.weeklyStreams || 0;
                sales = song.weeklySales || 0;
            } else if (filterRegion && song.regionalData && song.regionalData[filterRegion]) {
                streams = song.regionalData[filterRegion].streams;
                sales = song.regionalData[filterRegion].sales;
            } else if (key === 'HOT_100') {
                streams = song.regionalData?.['USA']?.streams || 0;
                sales = song.regionalData?.['USA']?.sales || 0;
            }

            entries.push({ song, score, streams, sales });
        });

        entries.sort((a, b) => b.score - a.score);

        return entries.slice(0, 100).map((e, idx) => {
            const rank = idx + 1;
            const prevEntry = prevCharts[key]?.find(p => p.songId === e.song.id);
            const movement = getMovement(rank, prevEntry, e.song.hasCharted);
            
            e.song.hasCharted = true;

            return {
                rank,
                lastWeekRank: prevEntry?.rank || null,
                songId: e.song.id,
                title: e.song.title,
                artistName: e.song.artistName,
                isPlayer: e.song.artistId === 'player',
                score: e.score,
                metric1: e.streams,
                metric2: e.sales,
                weeksOnChart: (prevEntry?.weeksOnChart || 0) + 1,
                peakRank: prevEntry ? Math.min(rank, prevEntry.peakRank) : rank,
                movement,
                coverArt: e.song.coverArt
            };
        });
    };

    newCharts['HOT_100'] = createSongChart('HOT_100', null);
    newCharts['GLOBAL_200'] = createSongChart('GLOBAL_200', 'GLOBAL');

    regions.forEach(r => {
        newCharts[r.id] = createSongChart(r.id, r.id);
    });

    // --- ALBUM CHARTS ---
    // Formula: Album Chart Point = Sales / 100
    const albumEntries: any[] = [];
    
    // Global Logic: Sum of Region Points * Weight
    allAlbums.filter(a => a.isReleased).forEach(album => {
        // Calculate Global Points
        let globalPoints = 0;
        
        // We need regional sales breakdown from album to do weighted sum
        // Assuming album has regional breakdown stored in 'weeklySales' is overly simple
        // App.tsx calculates total sales. 
        // For Global Chart, we approximate using total sales if breakdown missing, 
        // OR better: iterate regions if data exists.
        // Limitation: App.tsx updates total sales but might not persist regional breakdown in Album interface efficiently.
        // FIX: Just use Total Sales / 100 for global ranking to keep it simple as user requested in section 6.
        // "Album Chart Point = Album Sales Mingguan / 100" -> This applies to Region Chart.
        // "Global Point = Sum (Region Chart Point * Weight)"
        
        // Since we don't persist per-region sales on the Album object permanently in this refactor 
        // (calculateAlbumSales returns it, but App.tsx merges it to total),
        // we will simulate the weighted distribution for the chart logic based on total sales.
        
        // Estimate distribution to calc points
        let calculatedScore = 0;
        regions.forEach(r => {
             // Estimate share (simplified for chart display only)
             const share = r.marketSize / 100; // Crude approx
             const regSales = Math.floor(album.weeklySales! * share);
             const regPoint = regSales / 100;
             const weight = CHART_REGION_WEIGHTS[r.id] || 1.0;
             calculatedScore += (regPoint * weight);
        });

        if (calculatedScore > 1) { 
            albumEntries.push({ album, score: Math.floor(calculatedScore) });
        }
    });

    albumEntries.sort((a, b) => b.score - a.score);
    
    const realAlbumChart = albumEntries.map((e, idx) => {
        const rank = idx + 1;
        const prevEntry = prevCharts['GLOBAL_ALBUMS']?.find(p => p.albumId === e.album.id);
        const movement = getMovement(rank, prevEntry, true);

        return {
            rank,
            lastWeekRank: prevEntry?.rank || null,
            albumId: e.album.id,
            title: e.album.title,
            artistName: e.album.artistName,
            isPlayer: e.album.artistId === 'player',
            score: e.score,
            metric1: e.score, // Points
            metric2: e.album.weeklySales || 0, // Sales
            weeksOnChart: (prevEntry?.weeksOnChart || 0) + 1,
            peakRank: prevEntry ? Math.min(rank, prevEntry.peakRank) : rank,
            movement,
            coverArt: e.album.coverArt
        };
    });

    if (realAlbumChart.length < 200) {
        const needed = 200 - realAlbumChart.length;
        const filler = getFillerChartEntries(needed, realAlbumChart.length, 'Album').map((f, i) => ({
            rank: realAlbumChart.length + i + 1,
            lastWeekRank: null,
            albumId: f.fakeId,
            title: f.title,
            artistName: f.artistName,
            isPlayer: false,
            score: f.score,
            metric1: f.score,
            metric2: f.metric2,
            weeksOnChart: f.weeksOnChart,
            peakRank: f.peakRank,
            movement: 'stable',
            coverArt: undefined
        }));
        newCharts['GLOBAL_ALBUMS'] = [...realAlbumChart, ...filler] as ChartEntry[];
    } else {
        newCharts['GLOBAL_ALBUMS'] = realAlbumChart.slice(0, 200);
    }

    // Regional Album Charts
    regions.forEach(r => {
        const regionalAlbumEntries: any[] = [];
        const totalMarketSize = regions.reduce((acc, reg) => acc + reg.marketSize, 0);
        const regionShare = r.marketSize / totalMarketSize;

        allAlbums.filter(a => a.isReleased).forEach(album => {
             // Estimate regional sales since we don't fully persist it
             const seed = (album.id.charCodeAt(0) + r.id.charCodeAt(0)) % 100;
             const variance = 0.5 + (seed / 100); 
             const regionalSales = Math.floor((album.weeklySales || 0) * regionShare * variance);
             const points = Math.floor(regionalSales / 100);

             if (points > 0) {
                 regionalAlbumEntries.push({ album, score: points, sales: regionalSales });
             }
        });

        regionalAlbumEntries.sort((a,b) => b.score - a.score);

        const realRegAlbumChart = regionalAlbumEntries.map((e, idx) => {
            const rank = idx + 1;
            const chartKey = `${r.id}_ALBUMS`;
            const prevEntry = prevCharts[chartKey]?.find(p => p.albumId === e.album.id);
            const movement = getMovement(rank, prevEntry, true);

            return {
                rank,
                lastWeekRank: prevEntry?.rank || null,
                albumId: e.album.id,
                title: e.album.title,
                artistName: e.album.artistName,
                isPlayer: e.album.artistId === 'player',
                score: e.score,
                metric1: e.score, 
                metric2: e.sales, 
                weeksOnChart: (prevEntry?.weeksOnChart || 0) + 1,
                peakRank: prevEntry ? Math.min(rank, prevEntry.peakRank) : rank,
                movement,
                coverArt: e.album.coverArt
            };
        });
        
        if (realRegAlbumChart.length < 50) {
             const needed = 50 - realRegAlbumChart.length;
             const filler = getFillerChartEntries(needed, realRegAlbumChart.length, 'Album').map((f, i) => ({
                rank: realRegAlbumChart.length + i + 1,
                lastWeekRank: null,
                albumId: f.fakeId,
                title: f.title,
                artistName: f.artistName,
                isPlayer: false,
                score: f.score,
                metric1: f.score,
                metric2: f.metric2,
                weeksOnChart: f.weeksOnChart,
                peakRank: f.peakRank,
                movement: 'stable',
                coverArt: undefined
            }));
            newCharts[`${r.id}_ALBUMS`] = [...realRegAlbumChart, ...filler] as ChartEntry[];
        } else {
            newCharts[`${r.id}_ALBUMS`] = realRegAlbumChart.slice(0, 50);
        }
    });

    return newCharts;
};
