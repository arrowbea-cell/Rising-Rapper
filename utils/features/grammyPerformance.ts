
import { GameState, Message, Artist, YouTubeVideo, SocialPost } from '../../types';
import { SYSTEM_ACCOUNTS } from '../social/socialConstants';

/**
 * Checks if the player is eligible for a Grammy performance and sends an invite if so.
 * Runs typically in Month 11 or 12.
 */
export const checkGrammyInvite = (gameState: GameState, artist: Artist, currentWeek: number): Message | null => {
    // Only send invite if:
    // 1. Not already invited
    // 2. High Hype (> 500) OR Nominated (checked loosely via hype here, real checks in Awards)
    // 3. Timing: Month 11, Week 3
    
    if (gameState.grammyPerformanceSongId) return null; // Already accepted
    if (gameState.socialState?.messages.some(m => m.specialAction === 'GRAMMY_PERFORMANCE')) return null; // Pending invite exists

    const isInviteTime = gameState.date.month === 11 && gameState.date.week === 3;
    const isEligible = gameState.hype > 400 || (artist.globalRank || 999) < 20;

    if (isInviteTime && isEligible) {
        const grammyAcct = SYSTEM_ACCOUNTS.find(a => a.id === 'sys_grammys')!;
        
        return {
            id: `msg_grammy_invite_${currentWeek}`,
            senderId: grammyAcct.id,
            senderName: grammyAcct.name,
            handle: grammyAcct.handle,
            content: `Dear ${artist.name},\n\nThe Recording Academy would be honored to have you perform at the 67th Annual GRAMMY Awards. \n\nPlease confirm your attendance and song choice.`,
            timestamp: currentWeek,
            isRead: false,
            specialAction: 'GRAMMY_PERFORMANCE'
        };
    }
    return null;
};

/**
 * Creates the YouTube video after the performance.
 */
export const createGrammyPerformanceVideo = (
    artist: Artist, 
    songId: string, 
    songTitle: string, 
    currentWeek: number
): YouTubeVideo => {
    // 1. Generate "Grammy Style" Thumbnail URL (Conceptually)
    // We use the artist image but assume the UI handles the overlay, 
    // or we pass the raw artist image and let the YouTube component render a "Live" badge.
    const thumb = artist.image; 

    const views = Math.floor(Math.random() * 5000000) + 2000000; // 2M - 7M views instant

    return {
        id: `yt_grammy_${Date.now()}`,
        songId: songId,
        title: `Live at the 67th GRAMMY Awards - ${songTitle}`,
        type: 'Performance',
        productionQuality: 100, // Top tier
        conceptQuality: 90,
        thumbnailQuality: 100,
        uploadWeek: currentWeek,
        isViral: true,
        viralWeeksLeft: 4,
        views: views,
        weeklyViews: views,
        likes: Math.floor(views * 0.05),
        comments: Math.floor(views * 0.002),
        revenue: (views / 1000) * 2.5, // High CPM
        monetized: true,
        thumbnailUrl: thumb || undefined
    };
};

/**
 * Generates the "Lineup Announced" tweets from @RecordingAcad
 */
export const generateGrammyLineupTweets = (
    artist: Artist, 
    isPerforming: boolean, 
    currentWeek: number
): SocialPost[] => {
    if (!isPerforming) return [];

    const grammyAcct = SYSTEM_ACCOUNTS.find(a => a.id === 'sys_grammys')!;
    
    return [
        {
            id: `grammy_lineup_${currentWeek}`,
            authorId: grammyAcct.id,
            authorName: grammyAcct.name,
            handle: grammyAcct.handle,
            content: `OFFICIAL LINEUP ANNOUNCEMENT 🎤\n\nTaking the stage at the #GRAMMYs:\n\n✨ ${artist.name}\n✨ Taylor Swift\n✨ Kendrick Lamar\n✨ SZA\n\nTune in Sunday on CBS.`,
            type: 'TEXT',
            likes: 150000,
            retweets: 45000,
            timestamp: currentWeek,
            isVerified: true
        }
    ];
};
