
import { WorldRecord, Song, SocialPost } from '../types';

/**
 * Memproses semua lagu (player & NPC) untuk mengecek apakah ada rekor dunia yang pecah.
 * Mengembalikan list record yang sudah diupdate dan list social post (tweet) jika ada rekor baru.
 */
export const processWorldRecords = (
    allSongs: Song[],
    currentRecords: WorldRecord[],
    currentWeek: number,
    artistName: string // Player Name
): { updatedRecords: WorldRecord[], recordBreaks: SocialPost[] } => {
    
    const updatedRecords = [...currentRecords];
    const recordBreaks: SocialPost[] = [];

    // Filter lagu yang aktif (dirilis dan punya stats minggu ini > 0)
    const activeSongs = allSongs.filter(s => s.isReleased && (s.weeklyStreams || 0) > 0);

    for (const song of activeSongs) {
        const isPlayer = song.artistId === 'player';
        const currentHolderName = isPlayer ? artistName : song.artistName;

        for (let i = 0; i < updatedRecords.length; i++) {
            const record = updatedRecords[i];
            let currentValue = 0;

            // 1. Tentukan Nilai saat ini berdasarkan Metric & Scope Record
            if (record.category === 'GLOBAL') {
                if (record.metric === 'WEEKLY_STREAMS') currentValue = song.weeklyStreams || 0;
                else if (record.metric === 'WEEKLY_SALES') currentValue = song.weeklySales || 0;
            } 
            else if (record.category === 'REGION') {
                const regionId = record.scopeValue;
                if (song.regionalData && song.regionalData[regionId]) {
                    if (record.metric === 'WEEKLY_STREAMS') currentValue = song.regionalData[regionId].streams;
                    else if (record.metric === 'WEEKLY_SALES') currentValue = song.regionalData[regionId].sales;
                }
            }
            else if (record.category === 'GENRE') {
                if (song.genre === record.scopeValue) {
                    if (record.metric === 'WEEKLY_STREAMS') currentValue = song.weeklyStreams || 0;
                }
            }
            else if (record.category === 'THEME') {
                if (song.theme === record.scopeValue) {
                    if (record.metric === 'WEEKLY_STREAMS') currentValue = song.weeklyStreams || 0;
                }
            }

            // 2. Cek apakah rekor pecah?
            // Kita hanya update jika nilai SEKARANG lebih besar dari nilai TERTINGGI yang tersimpan
            if (currentValue > record.value) {
                // Update Record di database
                updatedRecords[i] = {
                    ...record,
                    value: currentValue,
                    holderId: song.artistId || 'unknown',
                    holderName: currentHolderName,
                    songId: song.id,
                    dateBrokenWeek: currentWeek,
                    isHeldByPlayer: isPlayer
                };

                // Generate Tweet Berita (@chartdata)
                // Hanya buat tweet jika rekor ini signifikan atau dipegang player
                // Supaya feed tidak spamming jika NPC saling balap di angka kecil (walau initial records sudah tinggi)
                
                const isMajorRecord = record.category === 'GLOBAL' || record.category === 'GENRE';
                
                // Prioritas notifikasi: Selalu notif jika Player menang, atau jika rekor Major pecah
                if (isPlayer || isMajorRecord) {
                    const breakdownText = isPlayer 
                        ? `HISTORY MADE! ${artistName} has broken the all-time record for ${record.title}!`
                        : `RECORD BREAKER: ${currentHolderName} shatters the record for ${record.title}.`;
                    
                    const post: SocialPost = {
                        id: `rec_break_${Date.now()}_${i}`,
                        authorId: 'sys_chartdata',
                        authorName: 'chart data',
                        handle: '@chartdata',
                        content: `${breakdownText} New High: ${new Intl.NumberFormat('en-US').format(currentValue)} units. 🏆`,
                        type: 'TEXT',
                        likes: Math.floor(currentValue / 100),
                        retweets: Math.floor(currentValue / 500),
                        timestamp: currentWeek,
                        isVerified: true
                        // Image removed as requested
                    };
                    recordBreaks.push(post);
                }
            }
        }
    }

    return { updatedRecords, recordBreaks };
};
