
import { GameDate, AwardCategoryResult } from '../types';

// Helper to convert game week to absolute year relative to start
export const getReleaseYear = (week: number) => 2024 + Math.floor(week / 48);

export const checkAwardTriggers = (date: GameDate, hasActiveNominations: boolean) => {
    // 1. NOMINATIONS: November (Month 11), Week 4
    const isNomination = date.month === 11 && date.week === 4;
    
    // 2. CEREMONY: February (Month 2), Week 4 (Only if noms exist)
    const isCeremony = date.month === 2 && date.week === 4 && hasActiveNominations;

    return { isNomination, isCeremony };
};

export const calculateAwardRewards = (results: AwardCategoryResult[]) => {
    let hypeBonus = 0;
    let moneyBonus = 0;
    let wins = 0;

    results.forEach(res => {
        if (res.winner.isPlayer) {
            hypeBonus += 100;
            moneyBonus += 50000; // Prize money
            wins++;
        }
    });

    return { hypeBonus, moneyBonus, wins };
};
