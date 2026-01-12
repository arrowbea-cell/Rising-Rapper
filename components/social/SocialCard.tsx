
import React from 'react';
import { SocialCardData } from '../../types';
import { GrammyCard } from './cards/GrammyCard';
import { PlatformCard } from './cards/PlatformCards';
import { ChartCard } from './cards/ChartCards';
import { NewsCard } from './cards/NewsCards';
import { ContentCard } from './cards/ContentCards';

interface SocialCardProps {
    data: SocialCardData;
    year: number;
}

export const SocialCard: React.FC<SocialCardProps> = ({ data, year }) => {
    
    // 1. GRAMMY Season Cards
    if (data.type === 'GRAMMY_CARD') {
        return <GrammyCard data={data} year={year} />;
    }

    // 2. Platform / Streaming Milestones & Wraps
    if (['FAN_WRAPPED', 'MOST_STREAMED_GRAPHIC', 'SPOTIFY_MILESTONE', 'VIDEO_MILESTONE', 'YOUTUBE_POSTER', 'LINK_CARD'].includes(data.type)) {
        return <PlatformCard data={data} />;
    }

    // 3. Chart Data, Certifications & Leaderboards
    if (['CERTIFICATION_GRID', 'COMPARISON_3D', 'LEADERBOARD_COMPLEX', 'SIDE_IMAGE_LIST', 'CHART_POSITION', 'SALES_CERT', 'RANKED_LIST', 'DATA_TABLE', 'TEXT_LIST_OVERLAY', 'DATE_STREAM_TRACKER', 'CHART_LEADERBOARD_TEXT'].includes(data.type)) {
        return <ChartCard data={data} year={year} />;
    }

    // 4. News, Journalism & Ads
    if (['NEWS_HEADLINE', 'MAGAZINE_COVER', 'REVIEW_CARD', 'QUOTE_CARD', 'BANNER_NEWS', 'SPLIT_IMAGE_NEWS', 'BRAND_AD'].includes(data.type)) {
        return <NewsCard data={data} />;
    }

    // 5. Creative Content (Lyrics, Versus, etc.)
    if (['LYRIC_CARD', 'VERSUS_BATTLE', 'MILESTONE_POSTER', 'IMAGE_GRID', 'FOLLOWER_UPDATE'].includes(data.type)) {
        return <ContentCard data={data} />;
    }

    return null;
};
