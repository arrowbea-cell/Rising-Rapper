
import { Message } from './brand';

export type PostType = 'TEXT' | 'PROMO' | 'BEEF' | 'FLEX' | 'MEME' | 'REPLY';

export type SocialCardType = 
    | 'SPOTIFY_MILESTONE' | 'CHART_POSITION' | 'SALES_CERT' | 'ALBUM_DEBUT' | 'ALBUM_FAN_SHARE' 
    | 'RANKED_LIST' | 'DATA_TABLE' | 'IMAGE_GRID' | 'FOLLOWER_UPDATE' | 'VIDEO_MILESTONE' | 'BRAND_AD'
    | 'MAGAZINE_COVER' | 'FESTIVAL_LINEUP' | 'REVIEW_CARD' | 'VERSUS_BATTLE' | 'LYRIC_CARD' | 'NEWS_HEADLINE' | 'AWARD_NOM' | 'QUOTE_CARD'
    | 'DATE_STREAM_TRACKER' | 'CHART_LEADERBOARD_TEXT' | 'LINK_CARD' | 'YOUTUBE_POSTER' | 'SPLIT_IMAGE_NEWS' | 'MILESTONE_POSTER' | 'TEXT_LIST_OVERLAY'
    | 'CERTIFICATION_GRID' | 'COMPARISON_3D' | 'SIDE_IMAGE_LIST' | 'LEADERBOARD_COMPLEX' | 'BANNER_NEWS'
    | 'MOST_STREAMED_GRAPHIC' | 'FAN_WRAPPED'
    // NEW TYPE
    | 'GRAMMY_CARD';

export interface SocialCardData {
    type: SocialCardType;
    title: string;
    artist?: string;
    coverArt?: string; 
    bigStat?: string; 
    subStat?: string; 
    trend?: string; 
    
    // For Review Card
    score?: string;
    quote?: string;
    publication?: string;

    // For Versus Battle
    opponentName?: string;
    opponentImage?: string;
    opponentStat?: string;

    // For Magazine
    magazineName?: string;
    headlines?: string[];

    // For Comparison 3D
    compareLeft?: { label: string; value: string; height?: number; image?: string };
    compareRight?: { label: string; value: string; height?: number; image?: string };

    listItems?: { 
        label: string; 
        value: string; 
        image?: string; 
        icon?: string; 
        change?: string; 
        isHighlight?: boolean;
        subLabel?: string;
        rank?: number;
        movement?: 'up' | 'down' | 'stable' | 'new';
        movementValue?: number;
    }[];
    tableHeaders?: string[];
    tableRows?: { 
        label: string; 
        col1: string; 
        col2?: string; 
        col3?: string;
        image?: string;
        isHighlight?: boolean;
        isHeader?: boolean; 
    }[];
    
    // For Cert Grid
    certItems?: { platform: string; level: 'Gold' | 'Platinum' | 'Diamond'; count: number }[];

    // For Grammy Card (The 20 Variants + New Predictions)
    grammyVariant?: 
        | 'FYC_POSTER' | 'OFFICIAL_NOM' | 'OFFICIAL_WINNER' | 'PERFORMANCE_ANNOUNCE' | 'RED_CARPET' 
        | 'VOTING_GUIDE' | 'BETTING_ODDS' | 'NOM_LEADERBOARD' | 'STREAM_IMPACT' | 'CRITICAL_ACCLAIM'
        | 'SNUB_ALERT' | 'SWEEP_PREDICTION' | 'FAN_COLLAGE' | 'COMPARISON_STATS' | 'ROBBED_MEME'
        | 'OUTFIT_RATING' | 'LYRIC_NOM' | 'CREDITS_SHOUTOUT' | 'RECORD_BROKEN' | 'HATER_ZERO_NOMS'
        // NEW PREDICTIONS
        | 'POINT_CALCULATION' | 'PREDICTION_ODDS' | 'WHO_SHOULD_WIN';

    gridImages?: string[]; 
    bottomImages?: string[]; 
    accentColor: string; 
    footer?: string; 
    linkUrl?: string; 
}

export interface SocialPost {
  id: string;
  authorId: string; 
  authorName: string;
  handle: string;
  content: string;
  type: PostType;
  likes: number;
  retweets: number;
  timestamp: number; 
  isVerified?: boolean;
  avatar?: string;
  image?: string;
  cardData?: SocialCardData; 
}

export interface SocialState {
  followers: number;
  following: number;
  posts: SocialPost[];
  messages: Message[]; 
  isVerified: boolean;
  reputation: number; 
}
