
import { NPCArtist, SocialPost } from '../../../types';
import { NPC_TWEETS } from '../socialConstants';

export const generateNPCTweets = (npcs: NPCArtist[], currentWeek: number, countNeeded: number): SocialPost[] => {
    const posts: SocialPost[] = [];
    const activeNPCs = npcs.slice(0, 8); 

    for (let i = 0; i < countNeeded; i++) {
        const npc = activeNPCs[Math.floor(Math.random() * activeNPCs.length)];
        const tweet = NPC_TWEETS[Math.floor(Math.random() * NPC_TWEETS.length)];
        
        posts.push({
            id: `npc_tweet_${i}_${Date.now()}`,
            authorId: npc.id,
            authorName: npc.name,
            handle: `@${npc.name.replace(/\s/g,'').toLowerCase()}`,
            content: tweet,
            type: 'TEXT',
            likes: Math.floor(npc.popularityGlobal * 200),
            retweets: Math.floor(npc.popularityGlobal * 50),
            timestamp: currentWeek,
            isVerified: true,
        });
    }
    return posts;
};
