
export const calculateVariance = (songType: 'Single' | 'Track', quality: number): number => {
    
    // --- VARIANCE SYSTEM (CHAOS ENGINE) ---
    // Sekarang dipengaruhi oleh QUALITY.
    
    const qFactor = quality / 100; // 0.0 - 1.0

    if (songType === 'Single') {
        // Single: Konsisten & Stabil.
        // Quality tinggi membuat performa lebih stabil (mengurangi risiko flop random).
        
        // Min Variance: Quality 0 = 0.7x | Quality 100 = 1.0x
        const minVar = 0.7 + (qFactor * 0.3); 
        // Max Variance: Quality 0 = 1.1x | Quality 100 = 1.3x
        const maxVar = 1.1 + (qFactor * 0.2);
        
        return minVar + (Math.random() * (maxVar - minVar));
    } else {
        // B-Side: "BISA APA AJA" (Chaos).
        // Quality sangat mempengaruhi peluang Sleeper Hit.
        
        const rng = Math.random();
        
        // Chance Sleeper Hit:
        // Base 2%. 
        // Jika Quality > 80, chance naik drastis. Quality 100 bisa sampai 20% chance viral.
        let sleeperChance = 0.02;
        if (quality > 80) sleeperChance += ((quality - 80) / 100); // +0.2 max
        
        // Chance Flop Total:
        // Base 40%.
        // Jika Quality tinggi, chance flop turun sampai 10%.
        const flopChance = Math.max(0.1, 0.4 - (qFactor * 0.3));

        if (rng < sleeperChance) {
            // SLEEPER HIT (Viral B-Side)
            // Range: 2.0x - 5.0x (Quality boosts the spike too)
            return 2.0 + (Math.random() * 2.0) + (qFactor * 1.0); 
        } else if (rng < (sleeperChance + flopChance)) {
            // FLOP TOTAL
            // Lagu skip.
            return 0.1 + (Math.random() * 0.3);
        } else {
            // STANDARD B-SIDE
            // Performa biasa aja, tapi quality nambah dikit.
            return 0.4 + (Math.random() * 0.4) + (qFactor * 0.4);
        }
    }
};
