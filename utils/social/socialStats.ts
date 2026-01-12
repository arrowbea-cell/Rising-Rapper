
import { SocialState } from '../../types';

export const INITIAL_SOCIAL_STATE: SocialState = {
    followers: 50,
    following: 12,
    posts: [],
    messages: [],
    isVerified: true, 
    reputation: 50
};

export const calculateFollowerGrowth = (
    currentFollowers: number,
    hype: number,
    weeklyStreams: number,
    reputation: number,
    isVerified: boolean
): number => {
    const hypeGrowth = hype * (10 + Math.random() * 10);
    const streamGrowth = Math.sqrt(weeklyStreams) * 0.8;
    let repMult = 1.0;
    if (reputation < 30) repMult = 1.8; 
    else if (reputation > 70) repMult = 1.2; 
    
    let growth = (hypeGrowth + streamGrowth) * repMult;
    
    if (currentFollowers > 1000000) growth *= 0.4;
    if (currentFollowers > 10000000) growth *= 0.1;
    if (currentFollowers > 50000000) growth *= 0.05;

    if (isVerified) growth *= 1.2;
    
    return Math.floor(growth * (0.8 + Math.random() * 0.4));
};
