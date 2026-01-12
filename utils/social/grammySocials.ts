
import { GameState, Artist, NPCArtist, SocialPost, SocialCardData } from '../../types';
import { FAN_HANDLES, SYSTEM_ACCOUNTS } from './socialConstants';

// --- GRAMMY TRENDS SYSTEM ---
export const generateGrammyTrends = (month: number, week: number, artist: Artist) => {
    const trends = [];
    
    // NOMINATION WEEK (Month 11, Week 4)
    if (month === 11 && week === 4) {
        trends.push(
            { category: 'Music · Trending', topic: '#GRAMMYs', stat: '2.4M posts', context: 'Nominations Announced' },
            { category: 'Music · Trending', topic: '#Scammys', stat: '890K posts', context: 'Fan reactions' },
            { category: 'Music · Trending', topic: `${artist.name} LOCK`, stat: '150K posts', context: 'Predictions' },
            { category: 'Awards · Trending', topic: 'Album of the Year', stat: '500K posts', context: 'The Big Four' },
            { category: 'Music · Trending', topic: 'Snubbed', stat: '200K posts', context: 'Trending worldwide' }
        );
    } 
    // PREDICTION SEASON (Month 1 & 2 before Week 4)
    else if ((month === 1) || (month === 2 && week < 4)) {
        trends.push(
            { category: 'Awards · Trending', topic: '#GRAMMYPredictions', stat: '85K posts', context: 'Who will win?' },
            { category: 'Music · Trending', topic: 'Grammy Voting', stat: '40K posts', context: 'Academy Members' },
            { category: 'Fan Cam · Trending', topic: `${artist.name} FOR GRAMMY`, stat: '120K posts', context: 'Campaign' }
        );
    }
    // CEREMONY WEEK (Month 2, Week 4)
    else if (month === 2 && week === 4) {
        trends.push(
            { category: 'Awards · LIVE', topic: '#GRAMMYs', stat: '5.2M posts', context: 'The 67th Annual Grammy Awards', isLive: true },
            { category: 'Fashion · Trending', topic: 'Red Carpet', stat: '1.1M posts', context: 'Best Dressed' },
            { category: 'Music · Trending', topic: `${artist.name} SWEEP`, stat: '300K posts', context: 'Fan hope' },
            { category: 'Performance · Trending', topic: 'Standing Ovation', stat: '120K posts', context: 'Live Updates' },
            { category: 'Awards · Trending', topic: 'ROBBED', stat: '450K posts', context: 'Viral Reaction' }
        );
    } else if (month === 11 && week === 3) {
        trends.push({ category: 'Music · Trending', topic: 'Grammy Predictions', stat: '50K posts', context: 'Pre-show hype' });
    }

    return trends;
};

// --- THE GRAMMY FEED GENERATOR ---
export const generateGrammyFeed = (
    gameState: GameState, 
    artist: Artist, 
    npcs: NPCArtist[], 
    currentWeek: number
): SocialPost[] => {
    const { month, week } = gameState.date;
    const posts: SocialPost[] = [];
    
    // DEFINISI MUSIM:
    const isNominationWeek = month === 11 && week === 4;
    const isCeremonyWeek = month === 2 && week === 4;
    const isPreSeason = month === 11 && week === 3; // Pre-Noms
    const isPredictionSeason = (month === 1) || (month === 2 && week < 4); // Jan-Feb Pre-Show

    // Jika bukan musim Grammy, return kosong (Balik normal)
    if (!isNominationWeek && !isCeremonyWeek && !isPreSeason && !isPredictionSeason) return [];

    // Data Preparation
    const playerSongs = gameState.songs.filter(s => s.artistId === 'player' && s.isReleased);
    const topSong = playerSongs.sort((a,b) => b.streams - a.streams)[0];
    const topAlbum = gameState.albums.filter(a => a.artistId === 'player' && a.isReleased)[0];
    const rival = npcs[0];
    const rival2 = npcs[1];

    const generatePost = (
        variant: SocialCardData['grammyVariant'],
        authorType: 'SYSTEM' | 'FAN' | 'PLAYER' | 'HATER' | 'PREDICTOR',
        text: string,
        details: any
    ): SocialPost => {
        let author;
        if (authorType === 'SYSTEM') author = SYSTEM_ACCOUNTS[Math.floor(Math.random() * SYSTEM_ACCOUNTS.length)];
        else if (authorType === 'PLAYER') author = { name: artist.name, handle: `@${artist.name.replace(/\s/g,'')}`, id: 'player' };
        else if (authorType === 'HATER') author = { name: 'Music Critic 💀', handle: '@HonestTakes', id: `hater_${Date.now()}` };
        else if (authorType === 'PREDICTOR') author = { name: 'Grammy Predicts 🔮', handle: '@AwardPredicts', id: `pred_${Date.now()}` };
        else {
            const h = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
            author = { name: `${h.split('_')[0]}`, handle: `@${h}_${Math.floor(Math.random()*99)}`, id: `fan_${Date.now()}` };
        }

        return {
            id: `grammy_${variant}_${Date.now()}_${Math.random()}`,
            authorId: author.id,
            authorName: author.name,
            handle: author.handle,
            content: text,
            type: 'TEXT',
            likes: Math.floor(Math.random() * 20000) + 500,
            retweets: Math.floor(Math.random() * 5000) + 100,
            timestamp: currentWeek,
            isVerified: authorType === 'SYSTEM' || authorType === 'PLAYER' || authorType === 'PREDICTOR',
            cardData: {
                type: 'GRAMMY_CARD',
                grammyVariant: variant,
                title: details.title || '',
                artist: details.artist || artist.name,
                coverArt: details.coverArt,
                bigStat: details.bigStat,
                subStat: details.subStat,
                accentColor: 'bg-[#bfa068]', // Grammy Gold
                footer: details.footer || 'Recording Academy / GRAMMYs',
                listItems: details.listItems, // For leaderboards
                score: details.score, // For betting/ratings
                // Extra fields for point calculation visuals
                compareLeft: details.compareLeft,
                compareRight: details.compareRight
            }
        };
    };

    const templates = [];

    // --- 1. PREDICTION SEASON (JAN/FEB) - HIGH VOLUME ---
    if (isPredictionSeason) {
        // A. POINT CALCULATION CARD (Fans trying to do math)
        templates.push(() => generatePost('POINT_CALCULATION', 'PREDICTOR', `Based on streaming data and critical reception, here is the final point breakdown for AOTY. It's close. 👀 #GRAMMYs`, {
            title: "FINAL PREDICTION MODEL",
            bigStat: "AOTY",
            listItems: [
                { label: artist.name, value: '88.4 pts' },
                { label: rival.name, value: '86.1 pts' },
                { label: rival2.name, value: '82.5 pts' },
                { label: 'Taylor Swift', value: '80.0 pts' }
            ],
            footer: "Weighted Criteria: 40% Sales, 30% Impact, 30% Jury"
        }));

        // B. PROBABILITY CARD
        templates.push(() => generatePost('PREDICTION_ODDS', 'FAN', `The odds are updating. ${artist.name} is now the frontrunner for Record of the Year.`, {
            title: "WINNER PROBABILITY",
            bigStat: "65%",
            subStat: "CHANCE OF WINNING",
            coverArt: topSong?.coverArt || artist.image,
            footer: "Vegas Odds"
        }));

        // C. WHO WILL WIN / SHOULD WIN
        templates.push(() => generatePost('WHO_SHOULD_WIN', 'FAN', `My final ballot predictions. Do we agree? 👇`, {
            title: "MY PREDICTIONS",
            listItems: [
                { label: "WILL WIN:", value: artist.name },
                { label: "SHOULD WIN:", value: artist.name },
                { label: "SNUBBED:", value: rival2.name }
            ],
            coverArt: artist.image,
            footer: "Fan Ballot"
        }));

        // D. TEXT ONLY HYPE
        templates.push(() => ({
            id: `txt_pred_${Math.random()}`,
            authorId: 'fan_random', authorName: 'Stan', handle: '@stanacc',
            content: `If ${artist.name} loses AOTY to ${rival.name} I am literally deleting my account. The stats don't lie.`,
            type: 'TEXT', likes: 500, retweets: 50, timestamp: currentWeek, isVerified: false
        }));
    }

    // --- 2. NOMINATION / PRE-SEASON ---
    if (isPreSeason || isNominationWeek) {
        // FYC POSTER
        templates.push(() => generatePost('FYC_POSTER', 'PLAYER', `For Your Consideration. #GRAMMYs`, {
            title: "FOR YOUR GRAMMY® CONSIDERATION",
            subStat: "ALBUM OF THE YEAR",
            bigStat: topAlbum?.title.toUpperCase() || "UNTITLED",
            coverArt: topAlbum?.coverArt || artist.image,
            footer: "Vote Now"
        }));

        // OFFICIAL NOM
        if (isNominationWeek) {
            templates.push(() => generatePost('OFFICIAL_NOM', 'SYSTEM', `Congratulations 67th #GRAMMYs Nominee: @${artist.name.replace(/\s/g,'')} - Album of the Year.`, {
                title: "NOMINATION",
                subStat: "ALBUM OF THE YEAR",
                bigStat: topAlbum?.title || "Artist",
                coverArt: artist.image,
                footer: "67th GRAMMY Awards"
            }));
            
            // SNUB ALERT
            templates.push(() => generatePost('SNUB_ALERT', 'FAN', `I can't believe this masterpiece was ignored in Record of the Year. The Scammys strike again.`, {
                title: "ROBBED",
                subStat: "RECORD OF THE YEAR",
                bigStat: "DESERVED BETTER",
                coverArt: topSong?.coverArt,
                footer: "Justice For " + (topSong?.title || "Music")
            }));
        }
    }

    // --- 3. CEREMONY WEEK ---
    if (isCeremonyWeek) {
        // WINNER
        templates.push(() => generatePost('OFFICIAL_WINNER', 'SYSTEM', `Winner: ${artist.name} - Best New Artist. #GRAMMYs`, {
            title: "WINNER",
            subStat: "BEST NEW ARTIST",
            bigStat: "CONGRATULATIONS",
            coverArt: artist.image,
            footer: "67th Annual GRAMMY Awards"
        }));

        // PERFORMANCE
        templates.push(() => generatePost('PERFORMANCE_ANNOUNCE', 'PLAYER', `See you Sunday. 🎤 #GRAMMYs`, {
            title: "LIVE PERFORMANCE",
            bigStat: "SUNDAY 8PM ET",
            coverArt: topSong?.coverArt,
            footer: "CBS / Paramount+"
        }));

        // RED CARPET
        templates.push(() => generatePost('RED_CARPET', 'SYSTEM', `${artist.name} arrives at the 2025 #GRAMMYs red carpet.`, {
            title: "RED CARPET",
            bigStat: "BEST DRESSED",
            coverArt: artist.image,
            footer: "Fashion Police"
        }));
    }

    // --- EXECUTION: FLOOD THE FEED ---
    // During "Seasons", we want MORE tweets.
    // Prediction Season: ~10 tweets
    // Ceremony/Noms: ~15 tweets
    const volume = isCeremonyWeek || isNominationWeek ? 15 : 10;
    
    // Helper to pick random template
    const pickRandom = () => {
        if (templates.length === 0) return null;
        return templates[Math.floor(Math.random() * templates.length)];
    };

    for(let i=0; i<volume; i++) {
        const tmpl = pickRandom();
        if (tmpl) posts.push(tmpl());
    }

    return posts;
};
