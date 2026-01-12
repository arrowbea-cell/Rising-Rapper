
export const calculateRegionPower = (
    regionId: string,
    currentRegionPop: number, // Popularitas Artis SAAT INI
    snapshotPop: number,      // Popularitas Artis SAAT RILIS (Historical)
    songType: 'Single' | 'Track'
): number => {
    
    // --- REGION LOCK LOGIC ---
    
    if (songType === 'Single') {
        // HYBRID LOCK (50% Sejarah, 50% Fame Sekarang)
        // Single bisa naik performanya jika artis makin terkenal, tapi tetap terikat performa rilis.
        return (snapshotPop * 0.5) + (currentRegionPop * 0.5);
    } else {
        // HARD LOCK (90% Sejarah, 10% Fame Sekarang)
        // B-Side terjebak di masa lalu. Jika dirilis saat kamu artis kecil, lagu ini akan tetap kecil
        // meskipun sekarang kamu superstar global.
        return (snapshotPop * 0.9) + (currentRegionPop * 0.1);
    }
};
