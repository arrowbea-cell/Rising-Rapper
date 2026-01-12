
import { WorldRecord, Genre } from '../types';
import { INITIAL_NPCS } from './npcs';
import { GENRES } from './general';
import { GENRE_DETAILS, THEMES } from './music';
import { INITIAL_REGIONS } from './mechanics';

export const generateAllRecords = (): WorldRecord[] => {
    const records: WorldRecord[] = [];

    // HELPER: Get random NPC for holder
    const getHolder = (preferredGenre?: Genre, regionId?: string) => {
        let candidates = INITIAL_NPCS;
        if (preferredGenre) {
            candidates = candidates.filter(n => n.genre === preferredGenre);
        }
        if (regionId) {
            candidates = candidates.filter(n => (n.popularityByRegion[regionId] || 0) > 60);
        }
        if (candidates.length === 0) candidates = INITIAL_NPCS.filter(n => n.popularityGlobal > 70);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    const globalMetricBase = 80000000;
    
    records.push(
        { id: 'rec_gl_str_wk', title: 'Most Streams in a Week', category: 'GLOBAL', scopeValue: 'ALL', metric: 'WEEKLY_STREAMS', holderId: 'npc_nova', holderName: 'Nova Kyte', value: 150000000, dateBrokenWeek: 1, isHeldByPlayer: false, description: 'The absolute peak of global streaming consumption.', icon: 'Globe' },
        { id: 'rec_gl_sal_wk', title: 'Best Selling Week (Pure)', category: 'GLOBAL', scopeValue: 'ALL', metric: 'WEEKLY_SALES', holderId: 'npc_kgroup', holderName: 'STARLIGHT', value: 1200000, dateBrokenWeek: 1, isHeldByPlayer: false, description: 'Physical and digital sales dominance.', icon: 'ShoppingBag' },
    );

    GENRES.forEach(g => {
        const holder = getHolder(g);
        const genreName = GENRE_DETAILS[g].name;
        records.push({
            id: `rec_gl_${g}`,
            title: `King/Queen of ${genreName}`,
            category: 'GENRE',
            scopeValue: g,
            metric: 'WEEKLY_STREAMS',
            holderId: holder.id,
            holderName: holder.name,
            value: Math.floor(globalMetricBase * (GENRE_DETAILS[g].streamBias || 1.0) * (0.8 + Math.random() * 0.4)),
            dateBrokenWeek: 1,
            isHeldByPlayer: false,
            description: `Highest weekly streams for a ${genreName} track globally.`,
            icon: 'Music'
        });
    });

    THEMES.forEach(t => {
        const holder = getHolder(); 
        let val = Math.floor(globalMetricBase * (t.streamBias || 1.0) * (0.7 + Math.random() * 0.5));
        if (t.id === 'christmas') val = 200000000; 
        
        records.push({
            id: `rec_gl_th_${t.id}`,
            title: `Best ${t.name} Song`,
            category: 'THEME',
            scopeValue: t.id,
            metric: 'WEEKLY_STREAMS',
            holderId: holder.id,
            holderName: holder.name,
            value: val,
            dateBrokenWeek: 1,
            isHeldByPlayer: false,
            description: `The world's favorite song about ${t.name}.`,
            icon: 'Zap'
        });
    });

    records.push(
        { id: 'rec_gl_debut', title: 'Biggest Debut Week', category: 'GLOBAL', scopeValue: 'ALL', metric: 'WEEKLY_STREAMS', holderId: 'npc_blaze', holderName: 'Lil Blaze', value: 110000000, dateBrokenWeek: 1, isHeldByPlayer: false, description: 'Most streams in the first week of release.', icon: 'Flame' },
        { id: 'rec_gl_viral', title: 'Most Viral Song', category: 'GLOBAL', scopeValue: 'ALL', metric: 'WEEKLY_STREAMS', holderId: 'npc_indie', holderName: 'Echo', value: 95000000, dateBrokenWeek: 1, isHeldByPlayer: false, description: 'An unexpected hit that took over the world.', icon: 'TrendingUp' },
        { id: 'rec_gl_collab', title: 'Best Collaboration', category: 'GLOBAL', scopeValue: 'ALL', metric: 'WEEKLY_STREAMS', holderId: 'npc_latin', holderName: 'Rio', value: 130000000, dateBrokenWeek: 1, isHeldByPlayer: false, description: 'Two stars aligning perfectly.', icon: 'Users' },
    );

    INITIAL_REGIONS.forEach(region => {
        const marketMult = region.marketSize / 20.0; 
        const regionBase = 50000000 * marketMult; 

        const mainHolder = getHolder(undefined, region.id);
        records.push({
            id: `rec_${region.id}_king`,
            title: `Ruler of ${region.name}`,
            category: 'REGION',
            scopeValue: region.id,
            metric: 'WEEKLY_STREAMS',
            holderId: mainHolder.id,
            holderName: mainHolder.name,
            value: Math.floor(regionBase * 1.2),
            dateBrokenWeek: 1,
            isHeldByPlayer: false,
            description: `Most weekly streams in ${region.name}.`,
            icon: 'Crown'
        });

        const salesHolder = getHolder(undefined, region.id);
        records.push({
            id: `rec_${region.id}_sales`,
            title: `${region.name} Best Seller`,
            category: 'REGION',
            scopeValue: region.id,
            metric: 'WEEKLY_SALES',
            holderId: salesHolder.id,
            holderName: salesHolder.name,
            value: Math.floor((regionBase / 150) * 2.0),
            dateBrokenWeek: 1,
            isHeldByPlayer: false,
            description: `Most pure sales in ${region.name}.`,
            icon: 'ShoppingBag'
        });

        const tiers = [
            { name: 'Local Hit', mult: 0.4 },
            { name: 'Chart Topper', mult: 0.7 },
            { name: 'National Anthem', mult: 1.0 },
            { name: 'Legendary Status', mult: 1.5 },
            { name: 'Impossible Peak', mult: 2.0 }
        ];

        tiers.forEach((tier, idx) => {
             const tHolder = getHolder(undefined, region.id);
             records.push({
                id: `rec_${region.id}_tier_${idx}`,
                title: `${tier.name} (${region.id})`,
                category: 'REGION',
                scopeValue: region.id,
                metric: 'WEEKLY_STREAMS',
                holderId: tHolder.id,
                holderName: tHolder.name,
                value: Math.floor(regionBase * tier.mult),
                dateBrokenWeek: 1,
                isHeldByPlayer: false,
                description: `Achieve ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(Math.floor(regionBase * tier.mult))} streams in ${region.name}.`,
                icon: 'TrendingUp'
            });
        });

        const salesTiers = [
            { name: 'Gold Certification', mult: 0.5 },
            { name: 'Platinum Certification', mult: 1.0 },
            { name: 'Diamond Certification', mult: 2.5 },
        ];
        
        salesTiers.forEach((tier, idx) => {
             const tHolder = getHolder(undefined, region.id);
             records.push({
                id: `rec_${region.id}_sales_tier_${idx}`,
                title: `${tier.name} (${region.id})`,
                category: 'REGION',
                scopeValue: region.id,
                metric: 'WEEKLY_SALES',
                holderId: tHolder.id,
                holderName: tHolder.name,
                value: Math.floor((regionBase / 150) * tier.mult),
                dateBrokenWeek: 1,
                isHeldByPlayer: false,
                description: `Achieve ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(Math.floor((regionBase / 150) * tier.mult))} sales in ${region.name}.`,
                icon: 'Award'
            });
        });
        
        const vibes = [
            "Club Banger", "Radio Favorite", "Street Classic", "Viral Moment", "Cult Classic"
        ];
        vibes.forEach((vibe, idx) => {
             const tHolder = getHolder(undefined, region.id);
             records.push({
                id: `rec_${region.id}_vibe_${idx}`,
                title: `${vibe} of ${region.name}`,
                category: 'REGION',
                scopeValue: region.id,
                metric: 'WEEKLY_STREAMS',
                holderId: tHolder.id,
                holderName: tHolder.name,
                value: Math.floor(regionBase * (0.6 + (idx * 0.1))), 
                dateBrokenWeek: 1,
                isHeldByPlayer: false,
                description: `Become the ${vibe} in ${region.name}.`,
                icon: 'Star'
            });
        });

    });

    return records;
};

export const INITIAL_RECORDS: WorldRecord[] = generateAllRecords();
