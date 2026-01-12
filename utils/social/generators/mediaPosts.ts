
import { GameState, Artist, NPCArtist, SocialPost, Song, Album, SocialCardData } from '../../../types';
import { SYSTEM_ACCOUNTS, FAN_HANDLES } from '../socialConstants';

const formatCompact = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
const formatFull = (num: number) => new Intl.NumberFormat('en-US').format(num);

// Helper to determine the next big milestone
const getNextMilestone = (current: number) => {
    let target = 0;
    if (current < 1_000_000) target = 1_000_000; // Aim for 1M
    else if (current < 10_000_000) target = Math.ceil((current + 1) / 1_000_000) * 1_000_000; // Aim for next million
    else if (current < 100_000_000) target = Math.ceil((current + 1) / 10_000_000) * 10_000_000; // Aim for 10M, 20M...
    else if (current < 1_000_000_000) target = Math.ceil((current + 1) / 100_000_000) * 100_000_000; // Aim for 100M, 200M...
    else target = Math.ceil((current + 1) / 1_000_000_000) * 1_000_000_000; // Aim for 1B, 2B, 3B...

    return { target, gap: target - current };
};

export const generateRichFanPosts = (gameState: GameState, artist: Artist, currentWeek: number, npcs: NPCArtist[], countNeeded: number): SocialPost[] => {
    const posts: SocialPost[] = [];
    const topNPCs = [...npcs].sort((a,b) => b.popularityGlobal - a.popularityGlobal).slice(0, 5);
    
    // --- CHANGED LOGIC: HEAVY BIAS TOWARDS PLAYER ---
    const MAGAZINE_NAMES = ['VOGUE', 'ROLLING STONE', 'GQ', 'TIME', 'ELLE', 'COMPLEX', 'BILLBOARD', 'VARIETY', 'NYLON', 'PAPER'];
    const REVIEW_OUTLETS = ['Pitchfork', 'Fantano', 'Rolling Stone', 'NME', 'The Guardian', 'Variety', 'Stereogum'];

    for (let i = 0; i < countNeeded; i++) {
        // Roll for Subject
        const isPlayerFocus = Math.random() < 0.8; // 80% Player Focus
        
        let subjectWrapper;
        if (isPlayerFocus) {
            subjectWrapper = { type: 'PLAYER', data: artist };
        } else {
            const randomNPC = topNPCs[Math.floor(Math.random() * topNPCs.length)];
            subjectWrapper = { type: 'NPC', data: randomNPC };
        }

        const isPlayer = subjectWrapper.type === 'PLAYER';
        const subjectData = isPlayer ? (subjectWrapper.data as unknown as Artist) : (subjectWrapper.data as unknown as NPCArtist);
        
        let subjectSongs: Song[] = [];
        let subjectAlbums: Album[] = [];

        if (isPlayer) {
            subjectSongs = gameState.songs.filter(s => s.artistId === 'player' && s.isReleased);
            subjectAlbums = gameState.albums.filter(a => a.artistId === 'player' && a.isReleased);
        } else {
            const npc = subjectWrapper.data as NPCArtist;
            subjectSongs = gameState.npcSongs.filter(s => s.artistId === npc.id);
            subjectAlbums = gameState.npcAlbums.filter(a => a.artistId === npc.id);
        }

        const subjectName = subjectData.name;
        const subjectImage = isPlayer ? (subjectData as Artist).image : undefined; 

        const fanHandle = `@${subjectName.replace(/\s/g,'')}Updates`;
        const fanName = `${subjectName} Charts`;

        // INCREASED CARD TYPES TO 35 to include new types
        const cardType = Math.floor(Math.random() * 35); 

        // 0. NEW: MOST STREAMED ARTIST GRAPHIC
        if (cardType === 28) {
            // Usually happens for big artists
            if ((isPlayer && gameState.yearlyStreams > 50000000) || (!isPlayer && (subjectWrapper.data as NPCArtist).popularityGlobal > 80)) {
                posts.push({
                    id: `most_streamed_graphic_${i}_${Date.now()}`,
                    authorId: 'sys_chartdata',
                    authorName: 'chart data',
                    handle: '@chartdata',
                    content: `Most Streamed Artists on Spotify in 2025: #${isPlayer ? (artist.globalRank || 1) : Math.floor(Math.random()*10+1)} ${subjectName}.`,
                    type: 'TEXT',
                    likes: Math.floor(Math.random() * 12000),
                    retweets: Math.floor(Math.random() * 3000),
                    timestamp: currentWeek,
                    isVerified: true,
                    cardData: {
                        type: 'MOST_STREAMED_GRAPHIC',
                        title: 'Most Streamed Artist',
                        artist: subjectName,
                        coverArt: subjectImage,
                        bigStat: '15.2 Billion Streams', // Placeholder or real logic
                        accentColor: 'bg-black',
                        footer: 'Spotify Data'
                    }
                });
                continue;
            }
        }

        // --- NEW TYPES (Based on Images provided) ---

        // 1. CERTIFICATION GRID (China Music Data)
        if (cardType === 23 && subjectAlbums.length > 0) {
            const album = subjectAlbums[0]; // Use latest
            const certItems = [];
            // Fake varying certifications across platforms
            certItems.push({ platform: 'Spotify', level: Math.random() > 0.5 ? 'Diamond' : 'Platinum', count: 1 });
            certItems.push({ platform: 'Apple Music', level: 'Platinum', count: 1 });
            certItems.push({ platform: 'QQ Music', level: 'Gold', count: 1 });
            certItems.push({ platform: 'Melon', level: 'Gold', count: 1 });
            // Add a few more randoms
            for(let k=0; k<4; k++) certItems.push({ platform: ['Tidal', 'Deezer', 'Amazon', 'YouTube'][k], level: Math.random() > 0.7 ? 'Platinum' : 'Gold', count: 1 });

            posts.push({
                id: `cert_grid_${i}_${Date.now()}`,
                authorId: 'sys_chartdata', 
                authorName: 'Global Music Data',
                handle: '@GlobalData',
                content: `All of ${subjectName}'s certifications for "${album.title}" in 2025 🌎`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 8000),
                retweets: Math.floor(Math.random() * 2000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'CERTIFICATION_GRID',
                    title: `${subjectName}'s Certifications`,
                    artist: subjectName,
                    certItems: certItems,
                    accentColor: 'bg-black',
                    footer: 'x/globalmusicdata'
                }
            });
            continue;
        }

        // 2. COMPARISON CHART (Sour vs Guts)
        if (cardType === 24 && subjectAlbums.length >= 2) {
            const alb1 = subjectAlbums[0];
            const alb2 = subjectAlbums[1];
            // Normalize heights for visualization
            const max = Math.max(alb1.totalStreams, alb2.totalStreams);
            const h1 = Math.max(20, Math.floor((alb1.totalStreams / max) * 100));
            const h2 = Math.max(20, Math.floor((alb2.totalStreams / max) * 100));

            posts.push({
                id: `compare_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `${alb1.title} vs ${alb2.title} Total Streams Comparison Chart:`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 5000),
                retweets: Math.floor(Math.random() * 1000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'COMPARISON_3D',
                    title: 'Comparison',
                    artist: subjectName,
                    compareLeft: { label: alb1.title, value: formatCompact(alb1.totalStreams), height: h1, image: alb1.coverArt },
                    compareRight: { label: alb2.title, value: formatCompact(alb2.totalStreams), height: h2, image: alb2.coverArt },
                    accentColor: 'bg-white',
                    footer: 'Data Source: Spotify'
                }
            });
            continue;
        }

        // 3. SIDE IMAGE LIST (Dua Lipa Predictions)
        if (cardType === 25 && subjectSongs.length > 0) {
            // Predict end of year streams
            const listItems = subjectSongs.slice(0, 8).map(s => ({
                label: s.title.toUpperCase(),
                value: formatCompact(Math.floor(s.streams * 1.5)) // Prediction is higher
            }));

            posts.push({
                id: `side_list_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `| @${subjectName.replace(/\s/g,'')} — @Spotify Year End Predictions`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 6000),
                retweets: Math.floor(Math.random() * 1200),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'SIDE_IMAGE_LIST',
                    title: 'Predictions',
                    artist: subjectName,
                    coverArt: subjectImage,
                    subStat: 'Year-End 2026 Streams',
                    listItems: listItems,
                    accentColor: 'bg-white'
                }
            });
            continue;
        }

        // 4. LEADERBOARD COMPLEX (Daily Top Female Albums)
        if (cardType === 26) {
            // Generate a fake daily chart
            const chartData = [...subjectAlbums, ...gameState.npcAlbums]
                .sort((a,b) => Math.random() - 0.5) // Randomize daily
                .slice(0, 10)
                .map((alb, idx) => ({
                    label: alb.title,
                    value: `+${formatCompact(Math.floor(Math.random() * 500000 + 100000))}`,
                    change: `${(Math.random() * 2 - 1).toFixed(2)}%`,
                    rank: idx + 1,
                    image: alb.coverArt,
                    movement: Math.random() > 0.5 ? 'up' : 'down' as any,
                    movementValue: Math.floor(Math.random() * 3 + 1)
                }));
            
            // Ensure subject is in it for relevance
            if (subjectAlbums.length > 0 && !chartData.find(c => c.label === subjectAlbums[0].title)) {
                chartData[0] = {
                    label: subjectAlbums[0].title,
                    value: `+${formatCompact(Math.floor(Math.random() * 1000000 + 500000))}`,
                    change: '+1.5%',
                    rank: 1,
                    image: subjectAlbums[0].coverArt,
                    movement: 'stable' as any,
                    movementValue: 0
                };
            }

            // CRITICAL FIX: Check if chartData has entries to prevent undefined access
            if (chartData.length === 0) {
                continue;
            }

            posts.push({
                id: `lb_complex_${i}_${Date.now()}`,
                authorId: 'sys_chartdata',
                authorName: 'chart data',
                handle: '@chartdata',
                content: `Daily Top Albums Global on Spotify:`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 9000),
                retweets: Math.floor(Math.random() * 2500),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'LEADERBOARD_COMPLEX',
                    title: chartData[0].label, // #1 Album
                    artist: subjectName, 
                    coverArt: chartData[0].image,
                    bigStat: '#1',
                    subStat: 'Top Album',
                    trend: chartData[0].value,
                    listItems: chartData,
                    accentColor: 'bg-zinc-800'
                }
            });
            continue;
        }

        // 5. BANNER NEWS (Pop Core)
        if (cardType === 27) {
            const headline = isPlayer 
                ? `MOST STREAMED ARTIST OF 2025:` 
                : `MOST STREAMED ${subjectData.genre.toUpperCase()} ARTIST:`;
            
            posts.push({
                id: `banner_${i}_${Date.now()}`,
                authorId: 'sys_popcrave',
                authorName: 'Pop Core',
                handle: '@TheePopCore',
                content: `${headline} ${subjectName}`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 15000),
                retweets: Math.floor(Math.random() * 4000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'BANNER_NEWS',
                    title: subjectName,
                    artist: subjectName,
                    coverArt: subjectImage,
                    subStat: 'SPOTIFY DATA',
                    accentColor: 'bg-red-900'
                }
            });
            continue;
        }

        // ... (Existing types below) ...

        // 1. DATE STREAM TRACKER (Jisoo style)
        if (cardType === 19 && subjectSongs.length > 0) {
            // Pick a song with decent streams to make the tracking look realistic
            const relevantSongs = subjectSongs.filter(s => s.streams > 10000);
            const song = relevantSongs.length > 0 
                ? relevantSongs[Math.floor(Math.random() * relevantSongs.length)] 
                : subjectSongs[Math.floor(Math.random() * subjectSongs.length)];

            const daily = (song.weeklyStreams || 0) / 7;
            const items = [];
            
            // Generate last 4 days (Simulated fluctuation)
            for(let d=0; d<4; d++) {
                const fluctuation = 0.8 + Math.random() * 0.4; // 80% - 120% of avg daily
                const dayVal = Math.floor(daily * fluctuation);
                
                // Add increase indicator for the last day
                const isIncrease = d === 3 && dayVal > (daily * 0.9);
                const icon = isIncrease ? '🔥' : '';
                
                items.push({
                    label: `${20 + d}/12`, // Fake date format, keeps it simple
                    value: `${formatFull(dayVal)} ${icon}`,
                    isHighlight: d === 3 // Last one highlight
                });
            }

            // Calculate GAP
            const { target, gap } = getNextMilestone(song.streams);
            const targetFormatted = formatCompact(target); // e.g. "2B" or "600M"
            
            // Estimate days left (simple projection)
            const daysLeft = daily > 0 ? Math.ceil(gap / daily) : 999;
            const daysText = daysLeft < 365 ? `(~${daysLeft} days)` : '';

            posts.push({
                id: `track_dates_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `${subjectName}'s "${song.title}" streams on Spotify:\n\nTOTAL: ${formatFull(song.streams)}\n\nGAP TO ${targetFormatted}: ${formatFull(gap)} ${daysText}`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 5000),
                retweets: Math.floor(Math.random() * 1000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'DATE_STREAM_TRACKER',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    listItems: items,
                    bigStat: formatFull(song.streams),
                    subStat: 'TOTAL STREAMS',
                    accentColor: 'bg-black',
                    footer: `Road to ${targetFormatted}`
                }
            });
            continue;
        }

        // 2. CHART LEADERBOARD TEXT (Female Rap Charts style)
        if (cardType === 20) {
            const genre = subjectData.genre;
            const listItems = [];
            // Mix player and NPCs
            const mixedAlbums = [...subjectAlbums, ...gameState.npcAlbums].sort((a,b) => b.totalStreams - a.totalStreams).slice(0, 10);
            
            mixedAlbums.forEach((alb, idx) => {
                listItems.push({
                    label: `${idx + 1}. ${alb.title}`,
                    value: `${formatCompact(alb.totalStreams)}`,
                    subLabel: alb.artistName
                });
            });

            if (mixedAlbums.length > 0) {
                posts.push({
                    id: `leaderboard_${i}_${Date.now()}`,
                    authorId: 'sys_chartdata', 
                    authorName: `${genre} Charts`,
                    handle: `@charts${genre.toLowerCase().replace(/[^a-z]/g,'')}`,
                    content: `Most Streamed ${genre} Albums (All-Time):`,
                    type: 'TEXT',
                    likes: Math.floor(Math.random() * 8000),
                    retweets: Math.floor(Math.random() * 2000),
                    timestamp: currentWeek,
                    isVerified: false,
                    cardData: {
                        type: 'CHART_LEADERBOARD_TEXT',
                        title: `Top ${genre} Albums`,
                        artist: subjectName, // Used for bg image if available
                        coverArt: subjectImage || mixedAlbums[0].coverArt,
                        listItems: listItems,
                        accentColor: 'bg-black',
                        footer: 'Spotify'
                    }
                });
                continue;
            }
        }

        // 3. LINK CARD (Lisa Rockstar style)
        if (cardType === 21 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            posts.push({
                id: `link_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `"${song.title}" by ${subjectName} has earned its BEST DAY on Spotify in over 10 MONTHS!`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 3000),
                retweets: Math.floor(Math.random() * 500),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'LINK_CARD',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    linkUrl: 'open.spotify.com',
                    accentColor: 'bg-black',
                    footer: 'Spotify'
                }
            });
            continue;
        }

        // 4. YOUTUBE POSTER (Babymonster style)
        if (cardType === 22 && gameState.youtubeVideos && gameState.youtubeVideos.length > 0) {
            const video = gameState.youtubeVideos[Math.floor(Math.random() * gameState.youtubeVideos.length)];
            const artistName = gameState.songs.find(s => s.id === video.songId)?.artistName || subjectName;
            
            posts.push({
                id: `yt_poster_${i}_${Date.now()}`,
                authorId: 'sys_youtube',
                authorName: 'YouTube Music',
                handle: '@YouTubeMusic',
                content: `${artistName} - "${video.title}" hits ${formatCompact(video.views)} views!`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 10000),
                retweets: Math.floor(Math.random() * 2000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'YOUTUBE_POSTER',
                    title: formatCompact(video.views),
                    subStat: 'VIEWS ON YOUTUBE',
                    artist: artistName,
                    coverArt: video.thumbnailUrl || subjectImage,
                    footer: video.title,
                    accentColor: 'bg-red-600'
                }
            });
            continue;
        }

        // 1. CHART DATA SPLIT IMAGE (Image 5 style)
        if (cardType === 14 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            const milestone = [100000000, 500000000, 1000000000][Math.floor(Math.random()*3)];
            
            posts.push({
                id: `split_${i}_${Date.now()}`,
                authorId: 'sys_chartdata',
                authorName: 'chart data',
                handle: '@chartdata',
                content: `.${fanHandle.replace('Updates','')} "${song.title}" has now earned over ${formatCompact(milestone)} streams worldwide.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 15000),
                retweets: Math.floor(Math.random() * 4000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'SPLIT_IMAGE_NEWS',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    opponentImage: subjectImage, // Uses "opponentImage" field for the 2nd image
                    accentColor: 'bg-black',
                    footer: 'Chart Data'
                }
            });
            continue;
        }

        // 2. MILESTONE POSTER (Image 2 & 7 style)
        if (cardType === 15 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            const type = Math.random() > 0.5 ? 'SPOTIFY' : 'YOUTUBE';
            const views = type === 'SPOTIFY' ? '1 BILLION' : '100M';
            const action = type === 'SPOTIFY' ? 'streams on Spotify' : 'views on YouTube';
            
            posts.push({
                id: `poster_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `"${song.title}" by ${subjectName} has now surpassed ${views} ${action}! 🎉\n\n#${subjectName.replace(/\s/g,'')} #${song.title.replace(/\s/g,'')}`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 20000),
                retweets: Math.floor(Math.random() * 5000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'MILESTONE_POSTER',
                    title: views,
                    subStat: type === 'SPOTIFY' ? 'STREAMS ON SPOTIFY' : 'VIEWS ON YOUTUBE',
                    artist: subjectName,
                    coverArt: subjectImage || song.coverArt, // Poster often uses artist photo
                    accentColor: type === 'SPOTIFY' ? 'text-green-500' : 'text-red-500',
                    footer: song.title.toUpperCase()
                }
            });
            continue;
        }

        // 3. ITUNES CHART LIST (Image 3 style)
        if (cardType === 16 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            const countries = ['Azerbaijan', 'Philippines', 'Thailand', 'Australia', 'New Zealand', 'Taiwan', 'Chile', 'Belgium', 'United States', 'Spain', 'United Kingdom', 'France'];
            
            const randomRanks = countries.map(c => ({
                label: c,
                value: `#${Math.floor(Math.random() * 150) + 1}`,
                icon: '🌍'
            })).sort(() => Math.random() - 0.5).slice(0, 8); // Take 8 randoms

            // Sort by rank value for realism
            randomRanks.sort((a,b) => parseInt(a.value.replace('#','')) - parseInt(b.value.replace('#','')));

            posts.push({
                id: `itunes_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `${subjectName}'s "${song.title}" is charting on iTunes in ${Math.floor(Math.random() * 20 + 10)} countries worldwide:`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 3000),
                retweets: Math.floor(Math.random() * 500),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'TEXT_LIST_OVERLAY',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    listItems: randomRanks,
                    accentColor: 'bg-black',
                    footer: 'iTunes Charts'
                }
            });
            continue;
        }

        // 4. DAILY STREAM TRACKING (Image 1 style) - Keeping original DATA_TABLE logic too as it is robust
        if (cardType === 17 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            const daily = (song.weeklyStreams || 0) / 7;
            
            const days = [];
            for(let d=3; d>=0; d--) {
                const dayVal = Math.floor(daily * (0.9 + Math.random() * 0.2));
                days.push({
                    label: `Day ${4-d}`,
                    col1: formatFull(dayVal),
                    isHighlight: d === 0
                });
            }

            const { target, gap } = getNextMilestone(song.streams);

            posts.push({
                id: `dailytrack_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `${subjectName}'s "${song.title}" streams on Spotify (Last 4 Days):`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 4000),
                retweets: Math.floor(Math.random() * 800),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'DATA_TABLE',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    tableHeaders: ['Date', 'Streams', ''],
                    tableRows: days.map(d => ({
                        label: d.label,
                        col1: d.col1,
                        col2: '',
                        isHighlight: d.isHighlight
                    })),
                    accentColor: 'bg-zinc-900',
                    footer: `Gap to ${formatCompact(target)}: ${formatFull(gap)}`
                }
            });
            continue;
        }

        // 5. TOP ALBUMS LIST (Image 4 style)
        if (cardType === 18) {
            const genre = subjectData.genre;
            const rankItems = [];
            
            // Generate some fake/real entries
            for(let r=1; r<=5; r++) {
                const isTarget = r === 1; // Make subject #1
                const name = isTarget ? (subjectAlbums[0]?.title || "Latest Album") : `Album ${r}`;
                const art = isTarget ? subjectName : `Artist ${r}`;
                rankItems.push({
                    label: `${r}. ${name} (${art})`,
                    value: formatCompact(Math.floor(Math.random() * 50000000 + 10000000)),
                    image: isTarget ? (subjectAlbums[0]?.coverArt || subjectImage) : undefined,
                    isHighlight: isTarget
                });
            }

            posts.push({
                id: `top_alb_${i}_${Date.now()}`,
                authorId: 'sys_chartdata', // Or a genre specific handle
                authorName: `${genre} Charts`,
                handle: `@charts${genre.toLowerCase().replace(/[^a-z]/g,'')}`,
                content: `Most Streamed ${genre} Albums in ${new Date().toLocaleString('default', { month: 'long' })} (Spotify):`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 8000),
                retweets: Math.floor(Math.random() * 2000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'RANKED_LIST', 
                    title: `Top ${genre} Albums`,
                    artist: subjectName,
                    listItems: rankItems,
                    accentColor: 'bg-black',
                    footer: 'Spotify Data',
                    coverArt: subjectImage 
                }
            });
            continue;
        }

        if (cardType === 6 && subjectImage) {
            const mag = MAGAZINE_NAMES[Math.floor(Math.random() * MAGAZINE_NAMES.length)];
            posts.push({
                id: `mag_${i}_${Date.now()}`,
                authorId: 'sys_popbase',
                authorName: 'Pop Base',
                handle: '@PopBase',
                content: `STUNNING: ${subjectName} covers the new issue of ${mag} Magazine.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 20000),
                retweets: Math.floor(Math.random() * 5000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'MAGAZINE_COVER',
                    title: subjectName,
                    artist: subjectName,
                    coverArt: subjectImage, 
                    magazineName: mag,
                    headlines: ['The Interview', 'New Era', 'World Tour'],
                    accentColor: 'bg-black',
                    footer: mag
                }
            });
            continue;
        }

        if (cardType === 8 && subjectAlbums.length > 0) {
            const album = subjectAlbums[0];
            const score = (Math.random() * 5 + 5).toFixed(1);
            const outlet = REVIEW_OUTLETS[Math.floor(Math.random() * REVIEW_OUTLETS.length)];
            posts.push({
                id: `rev_${i}_${Date.now()}`,
                authorId: 'sys_chartdata',
                authorName: 'chart data',
                handle: '@chartdata',
                content: `${outlet} reviews ${subjectName}'s "${album.title}":`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 8000),
                retweets: Math.floor(Math.random() * 2000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'REVIEW_CARD',
                    title: album.title,
                    artist: subjectName,
                    coverArt: album.coverArt,
                    score: score,
                    publication: outlet,
                    quote: "A defining moment in their discography that challenges modern conventions.",
                    accentColor: 'bg-white',
                    footer: 'Review'
                }
            });
            continue;
        }

        if (cardType === 9 && isPlayer) {
            const opponent = npcs[0]; 
            posts.push({
                id: `vs_${i}_${Date.now()}`,
                authorId: `fan_vs_${i}`,
                authorName: 'Rap Debates',
                handle: '@RapDebates',
                content: `Who is having a better year? Like for ${subjectName}, RT for ${opponent.name}.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 5000),
                retweets: Math.floor(Math.random() * 5000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'VERSUS_BATTLE',
                    title: 'ARTIST OF THE YEAR',
                    artist: subjectName,
                    coverArt: subjectImage,
                    bigStat: `#${(subjectData as Artist).globalRank || 5}`,
                    opponentName: opponent.name,
                    opponentStat: `#${Math.floor(opponent.popularityGlobal/2)}`,
                    accentColor: 'bg-red-500',
                    footer: 'Vote Now'
                }
            });
            continue;
        }

        if (cardType === 10 && subjectSongs.length > 0) {
            const song = subjectSongs[Math.floor(Math.random() * subjectSongs.length)];
            posts.push({
                id: `lyric_${i}_${Date.now()}`,
                authorId: fanHandle,
                authorName: fanName,
                handle: fanHandle,
                content: `This lyric from "${song.title}" hits so hard...`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 4000),
                retweets: Math.floor(Math.random() * 1000),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'LYRIC_CARD',
                    title: song.title,
                    artist: subjectName,
                    coverArt: song.coverArt,
                    quote: "I've been running from the silence, but it's louder than the noise...",
                    accentColor: 'bg-black',
                    footer: 'Lyrics'
                }
            });
            continue;
        }

        if (cardType === 11) {
            const newsTypes = [
                { title: 'SPOTTED IN STUDIO', sub: 'New Music Soon?' },
                { title: 'SOLD OUT TOUR', sub: 'Record Time' },
                { title: 'FASHION WEEK ICON', sub: 'Viral Look' },
                { title: 'CHARITY DONATION', sub: 'Giving Back' }
            ];
            const news = newsTypes[Math.floor(Math.random() * newsTypes.length)];
            
            posts.push({
                id: `news_${i}_${Date.now()}`,
                authorId: 'sys_popcrave',
                authorName: 'Pop Crave',
                handle: '@PopCrave',
                content: `TRENDING: ${subjectName} is taking over the internet today.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 12000),
                retweets: Math.floor(Math.random() * 3000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'NEWS_HEADLINE',
                    title: news.title,
                    artist: subjectName,
                    coverArt: subjectImage,
                    subStat: news.sub,
                    accentColor: 'bg-red-600',
                    footer: 'Exclusive'
                }
            });
            continue;
        }

        if (cardType === 13) {
            posts.push({
                id: `quote_${i}_${Date.now()}`,
                authorId: 'sys_popbase',
                authorName: 'Pop Base',
                handle: '@PopBase',
                content: `${subjectName} opens up in new interview.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 10000),
                retweets: Math.floor(Math.random() * 2000),
                timestamp: currentWeek,
                isVerified: true,
                cardData: {
                    type: 'QUOTE_CARD',
                    title: 'Interview',
                    artist: subjectName,
                    coverArt: subjectImage,
                    quote: "I make music for the people who feel everything too deeply. That's my purpose.",
                    accentColor: 'bg-zinc-800',
                    footer: 'Complex',
                    linkUrl: 'read.more'
                }
            });
            continue;
        }

        if (cardType <= 1 && subjectAlbums.length > 0) {
            const album = subjectAlbums[Math.floor(Math.random() * subjectAlbums.length)];
            const tracks = subjectSongs.filter(s => album.tracks.map(t=>t.id).includes(s.id));
            
            if (tracks.length > 0) {
                const tableRows: NonNullable<SocialCardData['tableRows']> = tracks.slice(0, 5).map((t) => ({
                    label: t.title,
                    col1: formatFull(Math.floor((t.weeklyStreams || 0) / 7)),
                    col2: formatCompact(t.streams),
                    image: t.coverArt
                }));

                posts.push({
                    id: `rich_tracklist_${i}_${Date.now()}`,
                    authorId: `fan_stats_${i}`,
                    authorName: fanName,
                    handle: fanHandle,
                    content: `Streaming update for "${album.title}":`,
                    type: 'TEXT',
                    likes: Math.floor(Math.random() * 5000),
                    retweets: Math.floor(Math.random() * 1000),
                    timestamp: currentWeek,
                    isVerified: false,
                    cardData: {
                        type: 'DATA_TABLE',
                        title: album.title,
                        artist: subjectName,
                        coverArt: album.coverArt,
                        tableHeaders: ['Track', 'Daily', 'Total'],
                        tableRows: tableRows,
                        accentColor: isPlayer ? 'bg-pink-500' : 'bg-zinc-500',
                        footer: 'Spotify Data'
                    }
                });
            }
        }

        else if (cardType <= 2) {
            const followers = isPlayer ? (gameState.socialState?.followers || 0) : (subjectWrapper.data as NPCArtist).monthlyListeners / 3;
            const gain = Math.floor(followers * 0.01 * (0.5 + Math.random()));
            
            posts.push({
                id: `rich_follow_${i}_${Date.now()}`,
                authorId: `fan_access_${i}`,
                authorName: `${subjectName} Access`,
                handle: `@${subjectName.replace(/\s/g,'')}Access`,
                content: `Social Media Update (24h):`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 4000),
                retweets: Math.floor(Math.random() * 800),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'FOLLOWER_UPDATE',
                    title: 'Follower Gain',
                    artist: subjectName,
                    listItems: [{
                        label: subjectName,
                        value: formatFull(followers),
                        change: `+${formatFull(gain)}`,
                        image: subjectImage,
                        isHighlight: true
                    }],
                    accentColor: 'bg-[#181818]',
                    footer: 'Daily Update'
                }
            });
        }

        else if (cardType <= 3 && subjectSongs.length > 0) {
            const topSongs = [...subjectSongs].sort((a,b) => b.streams - a.streams).slice(0, 5);
            
            const listItems = topSongs.map(s => ({
                label: s.title,
                value: formatFull(s.streams), 
                image: s.coverArt,
                icon: '🎵'
            }));

            posts.push({
                id: `rich_topsongs_${i}_${Date.now()}`,
                authorId: `fan_chart_${i}`,
                authorName: `${subjectName} Data`,
                handle: `@${subjectName.replace(/\s/g,'')}Data`,
                content: `Most streamed songs by ${subjectName} (All-Time):`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 6000),
                retweets: Math.floor(Math.random() * 1500),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'RANKED_LIST',
                    title: 'Top Songs',
                    artist: subjectName,
                    listItems: listItems,
                    accentColor: 'bg-black',
                    footer: 'Spotify Data'
                }
            });
        }

        else if (cardType <= 5 && subjectSongs.length > 0) {
            const targetSong = subjectSongs.filter(s => s.weeklyStreams && s.weeklyStreams > 1000).sort(() => 0.5 - Math.random())[0];
            
            if (targetSong) {
                const daily = Math.floor((targetSong.weeklyStreams || 0) / 7);
                const percentage = (Math.random() * 15).toFixed(2);
                const isPositive = Math.random() > 0.3;
                
                posts.push({
                    id: `rich_daily_${i}_${Date.now()}`,
                    authorId: `fan_stats_${i}`,
                    authorName: fanName,
                    handle: fanHandle,
                    content: `Spotify Daily Data:\n\n"${targetSong.title}" received ${formatFull(daily)} streams yesterday.`,
                    type: 'TEXT',
                    likes: Math.floor(Math.random() * 8000),
                    retweets: Math.floor(Math.random() * 2000),
                    timestamp: currentWeek,
                    isVerified: false,
                    cardData: {
                        type: 'SPOTIFY_MILESTONE',
                        title: targetSong.title,
                        artist: subjectName,
                        coverArt: targetSong.coverArt,
                        bigStat: formatFull(daily),
                        subStat: 'Daily Streams',
                        trend: `${isPositive ? '+' : '-'}${percentage}%`,
                        accentColor: isPlayer ? 'bg-[#3b82f6]' : 'bg-[#1ed760]', 
                        footer: 'Spotify Charts'
                    }
                });
            }
        }
    }

    return posts;
};
