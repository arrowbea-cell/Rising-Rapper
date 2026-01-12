
import { GameState, Artist, NPCArtist, SocialPost, Song, Album } from '../../../types';
import { FAN_HANDLES, THEMED_VOCAB, THEME_HASHTAGS, SITUATIONAL_VOCAB } from '../socialConstants';

export const generateBulkFanChatter = (gameState: GameState, artist: Artist, npcs: NPCArtist[], currentWeek: number, countNeeded: number): SocialPost[] => {
    const posts: SocialPost[] = [];
    const subjects = [artist, ...npcs.slice(0, 5)];

    // --- CHECK PLAYER STATUS (HIATUS vs COMEBACK) ---
    const playerReleases = gameState.songs.filter(s => s.artistId === 'player' && s.isReleased).sort((a,b) => (b.releaseWeek || 0) - (a.releaseWeek || 0));
    const lastRelease = playerReleases[0];
    const weeksSinceRelease = lastRelease && lastRelease.releaseWeek ? currentWeek - lastRelease.releaseWeek : 999;
    const isPlayerComeback = lastRelease && lastRelease.releaseWeek === currentWeek;
    
    // Determine player fame level for intensity
    const isFamous = (artist.globalRank || 999) < 100 || gameState.hype > 300;
    const isDecember = gameState.date.month === 12;

    // --- GENERATE SPECIAL TWEETS FIRST ---
    let specialTweetCount = 0;
    
    // 0. SPOTIFY WRAPPED (Month 12 Only)
    // High chance to appear in December if player has released music
    if (isDecember && playerReleases.length > 0) {
        // Generate a few wrapped posts
        const wrappedCount = isFamous ? 3 : 1; 
        
        for (let j=0; j<wrappedCount; j++) {
            if (specialTweetCount >= countNeeded) break;
            
            const handleBase = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
            
            // Random Stats for the fan
            const topPercent = Math.random() > 0.8 ? "0.005%" : Math.random() > 0.5 ? "0.5%" : "1%";
            const minutes = Math.floor(Math.random() * 50000) + 10000;
            
            // Generate Top 5 Songs for this fan (Randomly pick from player discography)
            const fanTopSongs = [...playerReleases]
                .sort(() => 0.5 - Math.random())
                .slice(0, 5)
                .map((s, idx) => ({
                    label: s.title,
                    value: '#'+(idx+1),
                    image: s.coverArt,
                    subLabel: s.artistName
                }));

            const captions = [
                `I listened to ${artist.name} for ${minutes.toLocaleString()} minutes this year. Help.`,
                `Top ${topPercent} listener! Who else is in the elite club?`,
                `My wrapped is literally just ${artist.name}.`,
                `I am not ashamed. ${artist.name} carried my 20${gameState.date.year}.`,
                `Okay but look at my top artist... taste.`
            ];

            posts.push({
                id: `fan_wrapped_${j}_${Date.now()}`,
                authorId: `fan_wrap_${j}`,
                authorName: handleBase.split('_')[0],
                handle: `@${handleBase}${Math.floor(Math.random() * 999)}`,
                content: captions[Math.floor(Math.random() * captions.length)],
                type: 'TEXT',
                likes: Math.floor(Math.random() * 200),
                retweets: Math.floor(Math.random() * 50),
                timestamp: currentWeek,
                isVerified: false,
                cardData: {
                    type: 'FAN_WRAPPED',
                    title: `20${gameState.date.year} Wrapped`,
                    artist: artist.name,
                    coverArt: artist.image || undefined, // Artist Image
                    bigStat: `Top ${topPercent}`,
                    subStat: `${minutes.toLocaleString()} Minutes`,
                    listItems: fanTopSongs,
                    accentColor: 'bg-[#1ed760]', // Spotify Green
                    footer: 'Spotify'
                }
            });
            specialTweetCount++;
        }
    }

    // 1. COMEBACK / RELEASE WEEK (High Priority)
    if (isPlayerComeback) {
        // How many special tweets to inject? More if famous.
        const hypeTweets = isFamous ? 8 : 3; 
        
        for (let j=0; j<hypeTweets; j++) {
            if (specialTweetCount >= countNeeded) break;
            
            const handleBase = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
            const isStreamParty = Math.random() > 0.5;
            const vocabList = isStreamParty ? SITUATIONAL_VOCAB.streaming_party : SITUATIONAL_VOCAB.comeback;
            let content = vocabList[Math.floor(Math.random() * vocabList.length)];
            
            // Personalize
            if (content.includes("@Artist")) content = content.replace("@Artist", `@${artist.name.replace(/\s/g,'')}`);
            if (Math.random() > 0.5) content = `${artist.name.toUpperCase()} ${content}`;

            posts.push({
                id: `fan_comeback_${j}_${Date.now()}`,
                authorId: `fan_c_${j}`,
                authorName: handleBase.split('_')[0],
                handle: `@${handleBase}${Math.floor(Math.random() * 999)}`,
                content: content.toLowerCase(), // Stan twitter usually lower or ALL CAPS
                type: 'TEXT',
                likes: Math.floor(Math.random() * (isFamous ? 5000 : 500)),
                retweets: Math.floor(Math.random() * (isFamous ? 1000 : 50)),
                timestamp: currentWeek,
                isVerified: false,
                avatar: Math.random() < 0.3 ? artist.image || undefined : undefined // Fans using artist pfp
            });
            specialTweetCount++;
        }
    } 
    // 2. HIATUS / DROUGHT (Medium Priority)
    else if (weeksSinceRelease > 12) {
        // Chance to tweet about missing the artist increases with time
        const hiatusChance = Math.min(0.8, (weeksSinceRelease - 12) * 0.05); // Caps at 80% chance to insert *some* hiatus tweets
        
        if (Math.random() < hiatusChance) {
            const hiatusTweets = Math.floor(Math.random() * 3) + 1;
            
            for (let j=0; j<hiatusTweets; j++) {
                if (specialTweetCount >= countNeeded) break;

                const handleBase = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
                let content = SITUATIONAL_VOCAB.hiatus[Math.floor(Math.random() * SITUATIONAL_VOCAB.hiatus.length)];
                
                if (content.includes("@Artist")) content = content.replace("@Artist", `@${artist.name.replace(/\s/g,'').toLowerCase()}`);

                posts.push({
                    id: `fan_hiatus_${j}_${Date.now()}`,
                    authorId: `fan_h_${j}`,
                    authorName: handleBase.split('_')[0],
                    handle: `@${handleBase}${Math.floor(Math.random() * 999)}`,
                    content: content,
                    type: 'TEXT',
                    likes: Math.floor(Math.random() * 200),
                    retweets: Math.floor(Math.random() * 20),
                    timestamp: currentWeek,
                    isVerified: false
                });
                specialTweetCount++;
            }
        }
    }

    // --- FILLER CHATTER (Remaining slots) ---
    for (let i = specialTweetCount; i < countNeeded; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const isPlayer = subject.name === artist.name;
        const handleBase = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];
        const handle = `@${handleBase}${Math.floor(Math.random() * 999)}`;
        
        let recentSong: Song | undefined;
        let recentAlbum: Album | undefined;

        if (isPlayer) {
            recentSong = gameState.songs.find(s => s.isReleased && s.releaseWeek && (currentWeek - s.releaseWeek <= 4));
            recentAlbum = gameState.albums.find(a => a.isReleased && a.releaseWeek && (currentWeek - a.releaseWeek <= 4));
        } else {
            const npcId = (subject as NPCArtist).id;
            recentSong = gameState.npcSongs.find(s => s.artistId === npcId && s.releaseWeek && (currentWeek - s.releaseWeek <= 4));
            recentAlbum = gameState.npcAlbums.find(a => a.artistId === npcId && a.releaseWeek && (currentWeek - a.releaseWeek <= 4));
        }

        let phrase = "";
        let themeUsed = "";

        if (recentSong || recentAlbum) {
            const theme = (recentSong?.theme || recentAlbum?.theme || 'default');
            themeUsed = theme;
            
            if (Math.random() < 0.7 && THEMED_VOCAB[theme]) {
                const phrases = THEMED_VOCAB[theme];
                phrase = phrases[Math.floor(Math.random() * phrases.length)];
            } else {
                const sentiment = Math.random() > 0.3 ? 'praise' : 'hate'; 
                const phrases = THEMED_VOCAB[sentiment];
                phrase = phrases[Math.floor(Math.random() * phrases.length)];
            }
        } else {
            const month = gameState.date.month;
            if (month === 12) {
                const phrases = THEMED_VOCAB['christmas'];
                phrase = phrases[Math.floor(Math.random() * phrases.length)];
                themeUsed = 'christmas';
            } else if (month === 10 && Math.random() > 0.5) {
                const phrases = THEMED_VOCAB['halloween'];
                phrase = phrases[Math.floor(Math.random() * phrases.length)];
                themeUsed = 'halloween';
            } else {
                const sentiment = Math.random() > 0.5 ? 'praise' : 'viral'; 
                const phrases = THEMED_VOCAB[sentiment] || THEMED_VOCAB['praise']; 
                phrase = phrases[Math.floor(Math.random() * phrases.length)];
            }
        }

        let content = phrase.toLowerCase();
        if (Math.random() > 0.5) {
            content = `${subject.name.toLowerCase()}: ${content}`;
        }
        if (themeUsed && THEME_HASHTAGS[themeUsed] && Math.random() > 0.6) {
            const tag = THEME_HASHTAGS[themeUsed][Math.floor(Math.random() * THEME_HASHTAGS[themeUsed].length)];
            content += ` ${tag}`;
        }

        posts.push({
            id: `fan_chat_${i}_${Date.now()}`,
            authorId: `fan_gen_${i}`,
            authorName: handleBase.split('_')[0],
            handle: handle,
            content: content,
            type: 'TEXT',
            likes: Math.floor(Math.random() * 500),
            retweets: Math.floor(Math.random() * 50),
            timestamp: currentWeek,
            isVerified: false,
            avatar: Math.random() < 0.2 && isPlayer ? artist.image || undefined : undefined
        });
    }
    return posts;
};
