
import { GameState, Artist, SocialPost } from '../../../types';
import { SYSTEM_ACCOUNTS } from '../socialConstants';

const formatCompact = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);

export const generateYouTubeMilestones = (gameState: GameState, currentWeek: number): SocialPost[] => {
    const posts: SocialPost[] = [];
    
    // Milestones for early growth (Before 100M)
    const earlyThresholds = [
        10000, 25000, 50000, 
        100000, 250000, 500000, 
        1000000, 2000000, 5000000, 
        10000000, 25000000, 50000000
    ];
    
    gameState.youtubeVideos?.forEach(video => {
        const currentViews = video.views;
        const prevViews = Math.max(0, currentViews - (video.weeklyViews || 0));
        
        let milestoneHit = 0;

        // Logic 1: Check Early Thresholds (< 100M)
        if (currentViews < 100000000) {
            const crossed = earlyThresholds.find(t => prevViews < t && currentViews >= t);
            if (crossed) milestoneHit = crossed;
        } 
        // Logic 2: Check High Volume Thresholds (Every 100M)
        else {
            // Calculate which "100M block" the views are in.
            // e.g. 199M -> 1. 201M -> 2.
            const prevStep = Math.floor(prevViews / 100000000);
            const currStep = Math.floor(currentViews / 100000000);

            // If we jumped to a new 100M block
            if (currStep > prevStep) {
                milestoneHit = currStep * 100000000;
            }
        }

        const artistName = gameState.songs.find(s => s.id === video.songId)?.artistName || 'Artist';

        if (milestoneHit > 0) {
            const milestoneText = new Intl.NumberFormat('en-US', { notation: "compact" }).format(milestoneHit);
            
            posts.push({
                id: `yt_milestone_${video.id}_${milestoneHit}_${Date.now()}`,
                authorId: 'sys_chartdata', 
                authorName: 'chart data',
                handle: '@chartdata',
                content: `MILESTONE: ${artistName}'s "${video.title}" has surpassed ${milestoneText} views on YouTube.`,
                type: 'TEXT',
                likes: Math.floor(milestoneHit * 0.005), // Adjusted engagement scaling
                retweets: Math.floor(milestoneHit * 0.001),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'VIDEO_MILESTONE',
                    title: video.title,
                    artist: artistName,
                    coverArt: video.thumbnailUrl,
                    bigStat: `${milestoneText}`,
                    subStat: 'VIEWS',
                    accentColor: 'bg-red-900', 
                    footer: 'YouTube Data'
                }
            });
        }

        // New Video Premiere Post
        if (video.uploadWeek === currentWeek) {
             posts.push({
                id: `yt_new_${video.id}_${Date.now()}`,
                authorId: 'sys_youtube', 
                authorName: 'YouTube Music',
                handle: '@YouTubeMusic',
                content: `OUT NOW: ${artistName} drops the official video for "${video.title}". Watch now!`,
                type: 'PROMO',
                likes: Math.floor(gameState.hype * 10),
                retweets: Math.floor(gameState.hype * 2),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'VIDEO_MILESTONE', 
                    title: video.title,
                    artist: artistName,
                    coverArt: video.thumbnailUrl,
                    bigStat: "OUT NOW",
                    subStat: "PREMIERE",
                    accentColor: 'bg-red-900',
                    footer: 'YouTube Premiere'
                }
            });
        }
    });
    
    return posts;
};

export const generateDeepSystemPosts = (gameState: GameState, artist: Artist, currentWeek: number, countNeeded: number): SocialPost[] => {
    const posts: SocialPost[] = [];
    const hot100 = gameState.activeCharts['HOT_100'] || [];
    
    let generatedCount = 0;

    const billboard = SYSTEM_ACCOUNTS.find(a => a.id === 'sys_billboard')!;
    const debuts = hot100.filter(e => e.movement === 'new').sort((a,b) => a.rank - b.rank).slice(0, 3);
    
    debuts.forEach(entry => {
        if (generatedCount >= countNeeded) return;
        posts.push({
            id: `sys_bb_debut_${entry.rank}_${Date.now()}`,
            authorId: billboard.id,
            authorName: billboard.name,
            handle: billboard.handle,
            content: `Debuts on this week's #Hot100: #${entry.rank} "${entry.title}", ${entry.artistName}.`,
            type: 'TEXT',
            likes: Math.floor(entry.score * 5),
            retweets: Math.floor(entry.score * 1.5),
            timestamp: currentWeek,
            isVerified: true,
            cardData: {
                type: 'CHART_POSITION',
                title: entry.title,
                artist: entry.artistName,
                coverArt: entry.coverArt,
                bigStat: `#${entry.rank}`,
                subStat: 'Hot 100 Debut',
                accentColor: 'bg-[#121212]', 
                footer: 'Billboard Hot 100'
            }
        });
        generatedCount++;
    });

    const riaa = SYSTEM_ACCOUNTS.find(a => a.id === 'sys_riaa')!;
    const allSongs = [...gameState.songs, ...gameState.npcSongs];
    
    const certifiedSongs = allSongs.filter(s => {
        const units = (s.sales || 0) + ((s.streams || 0) / 150);
        return units >= 500000;
    }).sort(() => 0.5 - Math.random()).slice(0, 3); 

    certifiedSongs.forEach(song => {
        if (generatedCount >= countNeeded) return;
        const units = (song.sales || 0) + ((song.streams || 0) / 150);
        let certLevel = 'Gold';
        let icon = '📀';
        if (units >= 10000000) { certLevel = 'Diamond'; icon = '💎'; }
        else if (units >= 2000000) { certLevel = `${Math.floor(units/1000000)}x Platinum`; icon = '💿'; }
        else if (units >= 1000000) { certLevel = 'Platinum'; icon = '💿'; }

        if (Math.random() > 0.3) {
            posts.push({
                id: `sys_riaa_${song.id}_${Date.now()}`,
                authorId: riaa.id,
                authorName: riaa.name,
                handle: riaa.handle,
                content: `US Certifications (@RIAA):\n\n${song.artistName}, "${song.title}" ${certLevel} (${formatCompact(Math.floor(units))} units). ${icon}`,
                type: 'TEXT',
                likes: Math.floor(units / 50),
                retweets: Math.floor(units / 200),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'SALES_CERT', 
                    title: song.title,
                    artist: song.artistName,
                    coverArt: song.coverArt,
                    bigStat: certLevel.toUpperCase(),
                    subStat: 'RIAA Certified',
                    accentColor: certLevel.includes('Gold') ? 'bg-[#C5A059]' : 'bg-[#E5E4E2]', 
                    footer: 'RIAA'
                }
            });
            generatedCount++;
        }
    });

    return posts;
};
