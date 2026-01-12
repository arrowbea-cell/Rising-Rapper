
export type BrandTier = 'LOCAL' | 'NATIONAL' | 'LUXURY';
export type DealType = 'SPONSORED_POST' | 'CAMPAIGN' | 'AMBASSADOR' | 'GLOBAL_AMBASSADOR';
export type CampaignStyle = 'EDITORIAL' | 'STREET' | 'VIRAL' | 'COMMERCIAL';

export interface Brand {
    id: string;
    name: string;
    handle: string;
    industry: 'FASHION' | 'TECH' | 'FOOD' | 'BEAUTY' | 'UNDERWEAR' | 'JEWELRY';
    tier: BrandTier;
    minHype: number;
    description: string;
    logoColor: string;
    preferredStyle: CampaignStyle; 
    responses: {
        offer: string;
        accepted: string;
        rejected: string;
    };
}

export interface BrandProduct {
    id: string;
    name: string;
    type: 'Signature' | 'Standard' | 'Sample';
    image: string; // URL
    price: number; // Product Price
    sales: number;
    revenueGenerated: number;
}

export interface BrandOffer {
    id: string;
    brandId: string;
    brandName: string;
    industry: string;
    type: DealType;
    payout: number;
    originalPayout: number;
    hypeRequired: number;
    weeksDuration: number; 
    weeksRemaining: number;
    weeksActive: number; 
    description: string;
    expiresInWeeks: number;
    isAccepted: boolean;
    isRejected: boolean;
    isNegotiated: boolean;
    isRenewal: boolean;
    relationshipScore: number; 
    products: BrandProduct[]; 
    campaignResult?: { 
        style: CampaignStyle;
        quality: number; 
        bonusHype: number;
        bonusMoney: number;
        feedback: string;
    };
}

export interface Message {
    id: string;
    senderId: string; 
    senderName: string;
    handle: string;
    content: string;
    timestamp: number;
    isRead: boolean;
    brandOffer?: BrandOffer; 
    specialAction?: 'GRAMMY_PERFORMANCE'; // NEW: Special Event Trigger
}
