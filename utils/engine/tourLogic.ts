
import { ActiveTour, RegionStats } from '../../types';
import { TOUR_TIERS } from '../../constants';

export const processTourWeek = (
    tour: ActiveTour,
    regions: RegionStats[],
    currentWeek: number
): { tour: ActiveTour | null, weekRevenue: number, popGains: Record<string, number>, hypeGain: number } => {
    // Check if tour is finished
    if (tour.currentLegIndex >= tour.regions.length) {
        return { tour: null, weekRevenue: 0, popGains: {}, hypeGain: 0 };
    }

    const currentRegionId = tour.regions[tour.currentLegIndex];
    const region = regions.find(r => r.id === currentRegionId);
    if (!region) {
        return { 
            tour: { ...tour, currentLegIndex: tour.currentLegIndex + 1 }, 
            weekRevenue: 0, 
            popGains: {},
            hypeGain: 0
        };
    }

    const tier = TOUR_TIERS.find(t => t.id === tour.tierId) || TOUR_TIERS[0];
    
    // 1. Calculate Attendance
    const popRatio = Math.max(5, region.popularity) / 100;
    const marketMult = region.marketSize / 10; 
    
    const qualityMult = (tour.showQuality || 50) / 100; 
    
    let attendance = tier.baseCapacity * popRatio * marketMult * (0.8 + Math.random() * 0.4);
    
    if (qualityMult > 0.8) attendance *= 1.2;
    
    attendance = Math.min(attendance, tier.baseCapacity); 
    attendance = Math.max(50, attendance);

    // 2. Calculate Revenue
    const revenue = Math.floor(attendance * tier.ticketPrice);
    
    // 3. Calculate Gains
    let popGain = (attendance / tier.baseCapacity) * 3.5; 
    popGain *= (0.5 + qualityMult); 
    
    const hypeGain = (attendance / 100) * qualityMult;

    const historyEntry = {
        regionId: currentRegionId,
        revenue,
        attendees: Math.floor(attendance),
        week: currentWeek
    };

    const updatedTour = {
        ...tour,
        currentLegIndex: tour.currentLegIndex + 1,
        totalRevenue: tour.totalRevenue + revenue,
        totalAttendees: tour.totalAttendees + Math.floor(attendance),
        history: [...tour.history, historyEntry]
    };

    const isFinished = updatedTour.currentLegIndex >= updatedTour.regions.length;

    return {
        tour: isFinished ? null : updatedTour, 
        weekRevenue: revenue,
        popGains: { [currentRegionId]: popGain },
        hypeGain
    };
}
