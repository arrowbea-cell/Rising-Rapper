import React, { useState } from 'react';
import { GameState, AwardCeremonyData, Artist } from '../types';
import { calculateAwardRewards } from '../utils/awardsLogic';

export const useAwardSystem = (
    artist: Artist | null, 
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
    const [activeAwardData, setActiveAwardData] = useState<AwardCeremonyData | null>(null);
    const [awardMode, setAwardMode] = useState<'NOMINATIONS' | 'CEREMONY'>('NOMINATIONS');

    /**
     * Call this from the game loop when an event triggers
     */
    const triggerAwards = (data: AwardCeremonyData, mode: 'NOMINATIONS' | 'CEREMONY') => {
        setActiveAwardData(data);
        setAwardMode(mode);
    };

    /**
     * Handles closing the modal and applying rewards if it was a Ceremony
     */
    const handleCloseAwards = () => {
        if (awardMode === 'CEREMONY' && activeAwardData && artist) {
            // Apply Bonuses
            const { hypeBonus, moneyBonus, wins } = calculateAwardRewards(activeAwardData.results);

            if (wins > 0) {
                setGameState(prev => ({
                    ...prev,
                    hype: prev.hype + hypeBonus,
                    money: prev.money + moneyBonus,
                    awardsHistory: [...(prev.awardsHistory || []), activeAwardData],
                    activeNominations: null // Clear nominations
                }));
            } else {
                // No wins, just clear
                setGameState(prev => ({
                    ...prev,
                    activeNominations: null
                }));
            }
        }
        
        // Close Modal
        setActiveAwardData(null);
    };

    return {
        activeAwardData,
        awardMode,
        triggerAwards,
        handleCloseAwards
    };
};