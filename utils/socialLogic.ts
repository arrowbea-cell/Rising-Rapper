
import { GameState, SocialPost, NPCArtist, Artist, Song, SocialCardData } from '../types';
import { INITIAL_SOCIAL_STATE } from './social/socialStats';
import { generateYouTubeMilestones, generateDeepSystemPosts } from './social/generators/systemPosts';
import { generateRichFanPosts } from './social/generators/mediaPosts';
import { generateNPCTweets } from './social/generators/npcPosts';
import { generateBulkFanChatter } from './social/generators/fanPosts';
import { generateGrammyFeed } from './social/grammySocials'; 
import { generateGrammyLineupTweets } from './features/grammyPerformance'; // NEW IMPORT

export { INITIAL_SOCIAL_STATE } from './social/socialStats';
export { calculateFollowerGrowth } from './social/socialStats';

const TWEET_VOLUME_TARGET = 100; // Total tweets per week

export const generateWeeklySocialFeed = (
    gameState: GameState,
    artist: Artist,
    npcs: NPCArtist[],
    currentWeek: number
): SocialPost[] => {
    const TARGET_SYSTEM = 50;  
    const TARGET_RICH = 140; 
    const TARGET_NPC = 5;      
    const TARGET_FAN = 20; 

    const allPosts: SocialPost[] = [];

    // 1. GRAMMY INJECTION (Highest Priority)
    const grammyPosts = generateGrammyFeed(gameState, artist, npcs, currentWeek);
    if (grammyPosts.length > 0) {
        allPosts.push(...grammyPosts);
    }

    // 1.5 GRAMMY LINEUP (If performing)
    if (gameState.date.month === 2 && gameState.date.week === 1) {
        const lineupTweets = generateGrammyLineupTweets(artist, !!gameState.grammyPerformanceSongId, currentWeek);
        allPosts.push(...lineupTweets);
    }

    const ytMilestones = generateYouTubeMilestones(gameState, currentWeek);
    allPosts.push(...ytMilestones);

    allPosts.push(...generateDeepSystemPosts(gameState, artist, currentWeek, TARGET_SYSTEM));
    allPosts.push(...generateRichFanPosts(gameState, artist, currentWeek, npcs, TARGET_RICH));
    allPosts.push(...generateNPCTweets(npcs, currentWeek, TARGET_NPC));

    const currentCount = allPosts.length;
    const remaining = Math.max(TARGET_FAN, TWEET_VOLUME_TARGET - currentCount);
    
    allPosts.push(...generateBulkFanChatter(gameState, artist, npcs, currentWeek, remaining));

    return allPosts.sort(() => 0.5 - Math.random());
};

export const handlePlayerPost = (
    type: 'PROMO' | 'BEEF' | 'FLEX' | 'MEME' | 'STANDARD',
    artist: Artist,
    gameState: GameState,
    customContent?: string,
    customImage?: string,
    attachedSong?: Song
): { post: SocialPost, hypeChange: number, repChange: number, moneyChange: number, notification?: string } => {
    const social = gameState.socialState || INITIAL_SOCIAL_STATE;
    const currentWeek = gameState.date.week + ((gameState.date.month - 1) * 4) + ((gameState.date.year - 2024) * 48);
    let content = customContent || "Hello world";
    
    let cardData: SocialCardData | undefined = undefined;
    if (attachedSong) {
        cardData = {
            type: 'ALBUM_FAN_SHARE', // Reusing fan share layout
            title: attachedSong.title,
            artist: artist.name,
            coverArt: attachedSong.coverArt,
            bigStat: 'NOW PLAYING',
            subStat: 'New Release',
            accentColor: 'bg-zinc-800',
            footer: 'Rapper Rise Music'
        };
    }

    const post: SocialPost = {
        id: `post_player_${Date.now()}`,
        authorId: 'player',
        authorName: artist.name,
        handle: `@${artist.name.replace(/\s/g, '').toLowerCase()}`,
        content,
        type: type as any,
        likes: Math.floor(social.followers * 0.1),
        retweets: Math.floor(social.followers * 0.02),
        timestamp: currentWeek,
        isVerified: social.isVerified,
        avatar: artist.image || undefined,
        image: customImage,
        cardData
    };

    return { post, hypeChange: 10, repChange: 0, moneyChange: 0 };
};
