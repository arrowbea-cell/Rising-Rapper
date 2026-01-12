
import { GameState, Artist, AwardCategoryResult, AwardCeremonyData, AwardNominee, Song, Album, Genre } from '../types';
import { calculateGenreBasedScore } from './awardsScoring';
import { getReleaseYear } from './awardsHelpers';

export const generateAwards = (gameState: GameState, playerArtist: Artist): AwardCeremonyData => {
    // Logic runs in November of the ACTIVE year to generate nominations for that year
    const targetYear = gameState.date.year; 

    // 1. Gather Content (From current year)
    const eligiblePlayerSongs = gameState.songs.filter(s => s.isReleased && s.releaseWeek && getReleaseYear(s.releaseWeek) === targetYear);
    const eligibleNpcSongs = gameState.npcSongs.filter(s => s.isReleased && s.releaseWeek && getReleaseYear(s.releaseWeek) === targetYear);
    const allSongs = [...eligiblePlayerSongs, ...eligibleNpcSongs];

    const eligiblePlayerAlbums = gameState.albums.filter(a => a.isReleased && a.releaseWeek && getReleaseYear(a.releaseWeek) === targetYear);
    const eligibleNpcAlbums = gameState.npcAlbums.filter(a => a.isReleased && a.releaseWeek && getReleaseYear(a.releaseWeek) === targetYear);
    const allAlbums = [...eligiblePlayerAlbums, ...eligibleNpcAlbums];

    // Helper: Resolve Artist Genre & Hype
    const getArtistDetails = (id: string) => {
        if (id === 'player') return { genre: playerArtist.genre, hype: gameState.hype };
        const npc = gameState.npcArtists.find(n => n.id === id);
        return npc ? { genre: npc.genre, hype: npc.popularityGlobal * 10 } : { genre: Genre.POP, hype: 0 };
    };

    // Helper: Select Top Candidates (GENERAL FIELD uses Balanced Scoring)
    const getTopGeneral = (items: (Song | Album)[], count: number) => {
        return items.map(item => {
            const streams = 'totalStreams' in item ? item.totalStreams : item.streams;
            // General Field = Balance of Popularity and Quality
            // BIG FOUR awards lean slightly towards impact/popularity compared to genre fields
            const popScore = (streams / 2500000); 
            const qualityScore = item.quality * 2.0; 
            const totalScore = qualityScore + popScore + (Math.random() * 15); 
            
            return {
                id: item.id,
                name: item.title,
                artistName: item.artistName,
                image: item.coverArt,
                score: totalScore,
                isPlayer: item.artistId === 'player'
            };
        }).sort((a,b) => b.score - a.score).slice(0, count);
    };

    const results: AwardCategoryResult[] = [];

    // --- BIG FOUR CATEGORIES (General Field) ---

    // 1. RECORD OF THE YEAR (Performance/Production focus)
    const recordNominees = getTopGeneral(allSongs, 5);
    if (recordNominees.length > 0) results.push({ categoryName: 'Record of the Year', nominees: recordNominees, winner: recordNominees[0] });

    // 2. ALBUM OF THE YEAR
    const albumNominees = getTopGeneral(allAlbums, 5);
    if (albumNominees.length > 0) results.push({ categoryName: 'Album of the Year', nominees: albumNominees, winner: albumNominees[0] });

    // 3. SONG OF THE YEAR (Songwriting focus - usually same pool but varying winners in real life)
    const songNominees = getTopGeneral(allSongs, 5);
    // Shuffle slightly to maybe have different winner than Record
    if (songNominees.length > 0) {
        // Give slight RNG boost to lower ranked nominees to simulate "Lyrics over Beat" preference
        const shuffled = [...songNominees].sort((a, b) => (b.score + Math.random() * 50) - (a.score + Math.random() * 50));
        results.push({ categoryName: 'Song of the Year', nominees: songNominees, winner: shuffled[0] });
    }

    // 4. BEST NEW ARTIST
    const newArtistCandidates = [
        { ...playerArtist, id: 'player', isPlayer: true, pop: gameState.regions.reduce((acc,r)=>acc+r.popularity,0)/gameState.regions.length, hype: gameState.hype },
        ...gameState.npcArtists.filter(n => n.archetype === 'Rising' || n.archetype === 'Indie').map(n => ({ ...n, isPlayer: false, pop: n.popularityGlobal, hype: n.popularityGlobal * 10 }))
    ];
    
    // Player is only eligible if they started recently (Year 2024 or 2025)
    const isPlayerNew = (gameState.date.year <= 2026); 
    
    const bnaNominees: AwardNominee[] = newArtistCandidates
        .filter(c => c.isPlayer ? isPlayerNew : true)
        .map(candidate => {
            const streamScore = candidate.monthlyListeners / 1000000; 
            const popScore = candidate.pop * 2; 
            const totalScore = streamScore + popScore + (Math.random() * 50);
            const image = 'image' in candidate ? (candidate as Artist).image : undefined;
            return {
                id: candidate.id || 'player',
                name: candidate.name,
                artistName: candidate.name,
                image: image || undefined,
                score: totalScore,
                isPlayer: candidate.isPlayer
            };
        }).sort((a,b) => b.score - a.score).slice(0, 5);

    if (bnaNominees.length > 0) results.push({ categoryName: 'Best New Artist', nominees: bnaNominees, winner: bnaNominees[0] });


    // --- SPECIFIC GENRE CATEGORIES ---
    
    const genresToAward: { id: Genre, label: string }[] = [
        { id: Genre.POP, label: 'Pop' },
        { id: Genre.HIP_HOP, label: 'Rap' },
        { id: Genre.RNB, label: 'R&B' },
        { id: Genre.ROCK, label: 'Rock' }
    ];

    genresToAward.forEach(g => {
        // 1. Filter Albums strictly by Genre
        const genreAlbums = allAlbums.filter(a => {
            const details = getArtistDetails(a.artistId || '');
            return details.genre === g.id;
        });
        
        // 2. Score Albums using GENRE SPECIFIC LOGIC (isAlbum = true)
        const rankedAlbums = genreAlbums.map(a => {
            const details = getArtistDetails(a.artistId || '');
            const score = calculateGenreBasedScore(a, g.id, details.hype, true);
            return {
                id: a.id,
                name: a.title,
                artistName: a.artistName,
                image: a.coverArt,
                score: score,
                isPlayer: a.artistId === 'player'
            };
        }).sort((a,b) => b.score - a.score).slice(0, 5);

        if (rankedAlbums.length > 0) {
            results.push({ categoryName: `Best ${g.label} Album`, nominees: rankedAlbums, winner: rankedAlbums[0] });
        }

        // 3. Filter Songs strictly by Genre
        const genreSongs = allSongs.filter(s => s.genre === g.id); // Song has explicit genre field

        // 4. Score Songs using GENRE SPECIFIC LOGIC (isAlbum = false)
        const rankedSongs = genreSongs.map(s => {
            const details = getArtistDetails(s.artistId || '');
            const score = calculateGenreBasedScore(s, g.id, details.hype, false);
            return {
                id: s.id,
                name: s.title,
                artistName: s.artistName,
                image: s.coverArt,
                score: score,
                isPlayer: s.artistId === 'player'
            };
        }).sort((a,b) => b.score - a.score).slice(0, 5);

        if (rankedSongs.length > 0) {
            const catTitle = g.id === Genre.HIP_HOP ? 'Best Rap Performance' : `Best ${g.label} Solo Performance`;
            results.push({ categoryName: catTitle, nominees: rankedSongs, winner: rankedSongs[0] });
        }
    });

    return {
        year: targetYear,
        results
    };
};
