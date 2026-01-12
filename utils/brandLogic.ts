
import { GameState, BrandOffer, Message, DealType, SocialPost, Brand, CampaignStyle, BrandProduct, NPCArtist } from '../types';
import { BRANDS, BRAND_PRODUCT_IMAGES } from '../constants';
import { generateBrandAd, generateBrandPost } from './social/generators/brandPosts';

export { generateBrandPost }; 

// --- HELPER: GET CONTRACT DURATION ---
const getContractDuration = (type: DealType): number => {
    switch (type) {
        case 'GLOBAL_AMBASSADOR': return 96; // 2 Years (4 weeks/month * 24)
        case 'AMBASSADOR': return 48; // 1 Year
        case 'CAMPAIGN': return 24; // 6 Months
        default: return 4; // Sponsored Post / Short term
    }
};

// --- HELPER: GET PAYOUT SCALE ---
const getPayout = (base: number, duration: number, reputation: number): number => {
    // Base * Duration * Reputation Multiplier
    const repMult = 1 + (reputation / 80); // Improved rep scaling (was 100)
    return Math.floor(base * duration * repMult);
};

// --- HELPER: GENERATE RANDOM PRODUCT ---
const generateProduct = (brand: Brand, isSignature: boolean, artistName: string): BrandProduct => {
    const images = BRAND_PRODUCT_IMAGES[brand.industry] || BRAND_PRODUCT_IMAGES['FASHION'];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    let name = `The ${brand.name} Collection`;
    let price = 50;

    // Price Logic based on Tier
    const tierMult = brand.tier === 'LUXURY' ? 10 : brand.tier === 'NATIONAL' ? 2 : 1;
    
    if (isSignature) {
        name = `${brand.name} x ${artistName} Signature`;
        price = 100 * tierMult;
    } else {
        const adjectives = ['New', 'Classic', 'Limited', 'Essential', 'Pro'];
        const nouns = ['Series', 'Drop', 'Edition', 'Pack'];
        name = `${brand.name} ${adjectives[Math.floor(Math.random()*adjectives.length)]} ${nouns[Math.floor(Math.random()*nouns.length)]}`;
        price = 60 * tierMult;
    }

    // Adjust price for Industry
    if (brand.industry === 'FOOD') price = 5 * tierMult; // Food is cheap
    if (brand.industry === 'TECH') price = 300 * tierMult; // Tech is expensive
    if (brand.industry === 'JEWELRY') price = 500 * tierMult; // Jewelry is very expensive

    return {
        id: `prod_${brand.id}_${Date.now()}`,
        name: name,
        type: isSignature ? 'Signature' : 'Standard',
        image: randomImage,
        price: Math.floor(price),
        sales: 0,
        revenueGenerated: 0
    };
};

// --- NEW: EXECUTE CAMPAIGN STRATEGY ---
export const executeCampaign = (offer: BrandOffer, chosenStyle: CampaignStyle, artistName: string): BrandOffer => {
    const brand = BRANDS.find(b => b.id === offer.brandId);
    if (!brand) return offer;

    let matchScore = 0;
    let feedback = "";
    
    // Logic: Matrix of compatibility
    if (chosenStyle === brand.preferredStyle) {
        matchScore = 100; // Perfect
        feedback = "The brand LOVED the creative direction. It aligns perfectly with their vision.";
    } else {
        // Partial Matches
        if (brand.industry === 'FASHION' || brand.industry === 'UNDERWEAR' || brand.industry === 'JEWELRY') {
            if (chosenStyle === 'EDITORIAL' || chosenStyle === 'STREET') matchScore = 80; // Okay
            else if (chosenStyle === 'COMMERCIAL') matchScore = 60; // Boring
            else matchScore = 20; // VIRAL/MEME is risky for high fashion
        } else if (brand.industry === 'FOOD' || brand.industry === 'TECH') {
            if (chosenStyle === 'VIRAL' || chosenStyle === 'COMMERCIAL') matchScore = 85;
            else matchScore = 50; // Too serious/artsy
        } else {
            matchScore = 60;
        }
    }

    // Penalties for Brand Tier Mismatches
    if (brand.tier === 'LUXURY' && chosenStyle === 'VIRAL') {
        matchScore = 10;
        feedback = "The brand is horrified. This is too 'cheap' for their image.";
    }
    if (brand.tier === 'LUXURY' && chosenStyle === 'COMMERCIAL') {
        matchScore = 50;
        feedback = "A bit too generic for a luxury house, but acceptable.";
    }

    // RNG Variance
    matchScore = Math.min(100, Math.max(0, matchScore + (Math.random() * 20 - 5))); // Biased slightly positive

    // Calculate Bonuses
    let bonusMoney = 0;
    let bonusHype = 0;

    if (matchScore >= 85) {
        bonusMoney = offer.payout * 0.3; // 30% Bonus (Increased)
        bonusHype = 75;
        feedback = "PERFECT CAMPAIGN! The brand is thrilled and sent a huge bonus.";
    } else if (matchScore >= 65) {
        bonusMoney = offer.payout * 0.1; // 10% Bonus
        bonusHype = 30;
        feedback = "Solid campaign. The brand is satisfied.";
    } else if (matchScore < 30) {
        bonusHype = -10; 
        feedback = "The campaign flopped. The brand is reconsidering the partnership.";
    }

    // Generate Initial Product if not exists
    const initialProducts = offer.products || [];
    if (initialProducts.length === 0) {
        initialProducts.push(generateProduct(brand, false, artistName));
    }

    return {
        ...offer,
        weeksActive: 0,
        relationshipScore: Math.floor(matchScore),
        products: initialProducts,
        campaignResult: {
            style: chosenStyle,
            quality: Math.floor(matchScore),
            bonusHype,
            bonusMoney: Math.floor(bonusMoney),
            feedback
        }
    };
};

// --- NEW: GENERATE QUARTERLY REPORT ---
const generateQuarterlyReport = (offer: BrandOffer, currentWeek: number): Message => {
    const brand = BRANDS.find(b => b.id === offer.brandId)!;
    
    // Simulate Stats (Slightly buffed)
    const salesGrowth = Math.floor(Math.random() * 40) - 2; // -2% to +38%
    const stockGrowth = Math.floor(Math.random() * 15);
    const sentiment = salesGrowth > 0 ? "Excellent" : "Stable";
    
    // Update relationship based on sales
    let relChange = 0;
    if (salesGrowth > 15) relChange = 10;
    else if (salesGrowth > 0) relChange = 5;
    else relChange = 0;

    return {
        id: `msg_report_${offer.id}_${currentWeek}`,
        senderId: brand.id,
        senderName: brand.name,
        handle: brand.handle,
        content: `📈 QUARTERLY REPORT\n\nSales Growth: ${salesGrowth > 0 ? '+' : ''}${salesGrowth}%\nStock Value: ${stockGrowth > 0 ? '+' : ''}${stockGrowth}%\nPartner Sentiment: ${sentiment}\n\nOur team is happy with the progress. Let's keep pushing for Q${(Math.floor((currentWeek % 52) / 12)) + 1}.`,
        timestamp: currentWeek,
        isRead: false,
    };
};

// --- NEW: GENERATE BRAND EVENTS (Fashion Week, Launch Parties) ---
export const checkBrandEvents = (
    activeDeals: BrandOffer[],
    npcs: NPCArtist[],
    currentWeek: number,
    artistName: string
): { eventPosts: SocialPost[], hypeGain: number } => {
    const eventPosts: SocialPost[] = [];
    let hypeGain = 0;

    activeDeals.forEach(deal => {
        // 5% chance per week for an event
        if (Math.random() < 0.05) {
            const brand = BRANDS.find(b => b.id === deal.brandId);
            if (!brand) return;

            const guest = npcs[Math.floor(Math.random() * npcs.length)];
            const eventTypes = [
                `at the ${brand.name} Fashion Week show in Paris`,
                `at the exclusive ${brand.name} launch party`,
                `sitting front row for ${brand.name}`,
                `leaving the ${brand.name} after-party`
            ];
            const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];

            // PopBase or ChartData tweets about it
            eventPosts.push({
                id: `evt_${deal.id}_${currentWeek}`,
                authorId: 'sys_popbase',
                authorName: 'Pop Base',
                handle: '@PopBase',
                content: `📸 | ${artistName} and ${guest.name} spotted ${event} tonight.`,
                type: 'TEXT',
                likes: Math.floor(Math.random() * 50000) + 10000,
                retweets: Math.floor(Math.random() * 5000) + 1000,
                timestamp: currentWeek,
                isVerified: true
            });

            hypeGain += 30;
        }
    });

    return { eventPosts, hypeGain };
};

// --- NEW: CHECK SCANDALS (Contract Termination) ---
export const checkBrandScandals = (
    activeDeals: BrandOffer[],
    reputation: number,
    currentWeek: number
): { remainingDeals: BrandOffer[], terminationMessages: Message[] } => {
    const remainingDeals: BrandOffer[] = [];
    const terminationMessages: Message[] = [];

    activeDeals.forEach(deal => {
        const brand = BRANDS.find(b => b.id === deal.brandId);
        if (!brand) {
            remainingDeals.push(deal);
            return;
        }

        // If reputation is too low, chance to drop
        // Threshold: 20 Rep (Lenient). Chance: 5% per week if under 20.
        if (reputation < 20 && Math.random() < 0.05) {
            terminationMessages.push({
                id: `term_${deal.id}_${currentWeek}`,
                senderId: brand.id,
                senderName: brand.name,
                handle: brand.handle,
                content: `Due to recent public controversies and a misalignment with our core values, ${brand.name} has decided to terminate our partnership effective immediately.`,
                timestamp: currentWeek,
                isRead: false
            });
            // Deal is NOT added to remainingDeals (it is removed)
        } else {
            remainingDeals.push(deal);
        }
    });

    return { remainingDeals, terminationMessages };
};

// 1. CHECK NEW OFFERS (BUFFED PAYOUTS)
export const checkBrandOffers = (
    gameState: GameState, 
    currentWeek: number
): { newMessages: Message[], newOffers: BrandOffer[] } => {
    
    const newMessages: Message[] = [];
    const newOffers: BrandOffer[] = [];
    const activeDeals = gameState.activeDeals || [];
    const playerHype = gameState.hype;
    const playerRep = gameState.socialState?.reputation || 50;

    const activeIndustries = new Set(activeDeals.map(d => d.industry));
    const pendingOfferIndustries = new Set(
        gameState.socialState?.messages
            .filter(m => m.brandOffer && !m.brandOffer.isAccepted && !m.brandOffer.isRejected)
            .map(m => BRANDS.find(b => b.id === m.brandOffer!.brandId)?.industry)
    );

    const availableBrands = BRANDS.filter(b => 
        !activeDeals.find(d => d.brandId === b.id) && 
        !activeIndustries.has(b.industry) && 
        !pendingOfferIndustries.has(b.industry) 
    );

    availableBrands.forEach(brand => {
        if (playerHype >= brand.minHype) {
            const chance = 0.02 + ((playerRep / 100) * 0.015); // Slightly higher chance
            
            if (Math.random() < chance) {
                let type: DealType = 'CAMPAIGN'; 
                let baseMonthlyPay = 3500; // Increased Base

                const excessHype = playerHype - brand.minHype;

                if (excessHype > 800 && brand.tier === 'LUXURY') {
                    type = 'GLOBAL_AMBASSADOR'; 
                    baseMonthlyPay = 75000; // Massive Buff
                } else if (excessHype > 400) {
                    type = 'AMBASSADOR'; 
                    baseMonthlyPay = 15000; // Buff
                } else {
                    type = 'CAMPAIGN'; 
                    baseMonthlyPay = 3500; 
                }

                const weeks = getContractDuration(type);
                const totalPayout = getPayout(baseMonthlyPay / 4, weeks, playerRep); 

                const offer: BrandOffer = {
                    id: `offer_${brand.id}_${currentWeek}`,
                    brandId: brand.id,
                    brandName: brand.name,
                    industry: brand.industry,
                    type,
                    payout: totalPayout,
                    originalPayout: totalPayout,
                    hypeRequired: brand.minHype,
                    weeksDuration: weeks,
                    weeksRemaining: weeks,
                    weeksActive: 0,
                    description: `${weeks} week contract as ${type.replace('_', ' ')}.`,
                    expiresInWeeks: 4, 
                    isAccepted: false,
                    isRejected: false,
                    isNegotiated: false,
                    isRenewal: false,
                    relationshipScore: 50, // Start neutral
                    products: []
                };

                const message: Message = {
                    id: `msg_${brand.id}_${currentWeek}`,
                    senderId: brand.id,
                    senderName: brand.name,
                    handle: brand.handle,
                    content: brand.responses.offer,
                    timestamp: currentWeek,
                    isRead: false,
                    brandOffer: offer
                };

                newOffers.push(offer);
                newMessages.push(message);
            }
        }
    });

    return { newMessages, newOffers };
};

// 2. NEGOTIATION LOGIC (Easier)
export const negotiateBrandDeal = (offer: BrandOffer, reputation: number): { success: boolean, newOffer: BrandOffer | null, responseText: string } => {
    // Easier success formula
    const successChance = 0.5 + (reputation / 200); 
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
        const increase = 1.25 + (Math.random() * 0.20); // 25-45% increase!
        const newPayout = Math.floor(offer.payout * increase);
        
        return {
            success: true,
            newOffer: {
                ...offer,
                payout: newPayout,
                isNegotiated: true,
                description: offer.description + ` (Negotiated +${Math.floor((increase-1)*100)}%)`
            },
            responseText: `We value your partnership. We've updated the contract to $${new Intl.NumberFormat('en-US').format(newPayout)}. Let's sign.`
        };
    } else {
        return {
            success: false,
            newOffer: null,
            responseText: "We find these terms unacceptable. We are withdrawing our offer entirely. Good luck."
        };
    }
};

// 3. WEEKLY DEAL CHECK (Expiration, Renewals, EVENTS)
export const processActiveDeals = (
    gameState: GameState,
    currentWeek: number,
    artist: any // Need artist data for images/names
): { activeDeals: BrandOffer[], newMessages: Message[], newPosts: SocialPost[], moneyGain: number } => {
    
    const activeDeals: BrandOffer[] = [];
    const newMessages: Message[] = [];
    const newPosts: SocialPost[] = [];
    const expiredDeals: BrandOffer[] = [];
    let moneyGain = 0;

    if (gameState.activeDeals) {
        gameState.activeDeals.forEach(deal => {
            let updatedDeal = { 
                ...deal, 
                weeksRemaining: deal.weeksRemaining - 1,
                weeksActive: (deal.weeksActive || 0) + 1
            };
            const brand = BRANDS.find(b => b.id === deal.brandId);
            
            if (!brand) return;

            // --- PRODUCT SALES SIMULATION (Buffed) ---
            if (updatedDeal.products) {
                updatedDeal.products = updatedDeal.products.map(prod => {
                    const baseSales = updatedDeal.relationshipScore * (gameState.hype / 90); // Slightly better scaling
                    const salesRng = Math.floor(baseSales * (0.9 + Math.random() * 0.5));
                    const revenue = salesRng * prod.price;
                    
                    return {
                        ...prod,
                        sales: prod.sales + salesRng,
                        revenueGenerated: prod.revenueGenerated + revenue
                    };
                });
            }

            // --- A. QUARTERLY REPORT (Every 12 weeks) ---
            if (updatedDeal.weeksActive > 0 && updatedDeal.weeksActive % 12 === 0) {
                const reportMsg = generateQuarterlyReport(updatedDeal, currentWeek);
                newMessages.push(reportMsg);
                
                // Bonus if relationship is decent
                if (updatedDeal.relationshipScore > 70) {
                    const bonus = Math.floor(updatedDeal.payout * 0.10); // 10% Bonus
                    moneyGain += bonus;
                    newMessages.push({
                        id: `msg_bonus_${deal.id}_${currentWeek}`,
                        senderId: brand.id, senderName: brand.name, handle: brand.handle,
                        content: `You've been killing it! Here is a quarterly performance bonus of $${bonus.toLocaleString()}.`,
                        timestamp: currentWeek, isRead: false
                    });
                }
            }

            // --- B. BRAND AD CAMPAIGN (Increased) ---
            // 45% chance per week
            if (Math.random() < 0.45 && updatedDeal.products.length > 0) {
                const adPost = generateBrandAd(updatedDeal, currentWeek, artist);
                newPosts.push(adPost);
                updatedDeal.relationshipScore = Math.min(100, updatedDeal.relationshipScore + 2);
            }

            // --- C. NEW: VIRAL PRODUCT SPIKE (Random) ---
            if (Math.random() < 0.02 && updatedDeal.products.length > 0) {
                const viralMoney = Math.floor(updatedDeal.payout * 0.25);
                moneyGain += viralMoney;
                newMessages.push({
                    id: `msg_viral_${deal.id}_${currentWeek}`,
                    senderId: brand.id, senderName: brand.name, handle: brand.handle,
                    content: `Your latest collection just went viral! Sales are spiking. Sending you a cut of the profits ($${viralMoney.toLocaleString()}).`,
                    timestamp: currentWeek, isRead: false
                });
            }

            // --- D. NEW PRODUCT / SAMPLE DROP (Random) ---
            if (Math.random() < 0.05) {
                // If high relationship, maybe a SIGNATURE product
                const isSignature = updatedDeal.relationshipScore > 85 && Math.random() < 0.3;
                const newProd = generateProduct(brand, isSignature, artist.name);
                
                if (isSignature) {
                    newProd.name = `${brand.name} x ${artist.name}`;
                    newProd.type = 'Signature';
                    updatedDeal.relationshipScore = Math.min(100, updatedDeal.relationshipScore + 10);
                    newMessages.push({
                        id: `msg_sig_${deal.id}_${currentWeek}`,
                        senderId: brand.id, senderName: brand.name, handle: brand.handle,
                        content: `We are ready to launch your signature line: "${newProd.name}". Samples are on the way. Post about it!`,
                        timestamp: currentWeek, isRead: false
                    });
                } else {
                    newProd.type = 'Sample';
                    newMessages.push({
                        id: `msg_sample_${deal.id}_${currentWeek}`,
                        senderId: brand.id, senderName: brand.name, handle: brand.handle,
                        content: `Hey! Sending you our new "${newProd.name}". Let us know what you think on X!`,
                        timestamp: currentWeek, isRead: false
                    });
                }
                
                updatedDeal.products.push(newProd);
            }

            if (updatedDeal.weeksRemaining > 0) {
                activeDeals.push(updatedDeal);
            } else {
                expiredDeals.push(updatedDeal);
            }
        });
    }

    // Handle Expired Deals (Check for Renewal)
    expiredDeals.forEach(deal => {
        const brand = BRANDS.find(b => b.id === deal.brandId);
        if (!brand) return;

        // RENEWAL CHECK - Based on Hype AND Relationship
        if (gameState.hype >= (brand.minHype * 0.9) && deal.relationshipScore > 40) {
            // Renewal Boost
            const raise = 1.3 + (deal.relationshipScore / 400); // Higher raise
            const newPayout = Math.floor(deal.originalPayout * raise);
            
            const renewalOffer: BrandOffer = {
                ...deal,
                id: `renewal_${brand.id}_${currentWeek}`,
                payout: newPayout,
                originalPayout: newPayout,
                weeksDuration: deal.weeksDuration, 
                weeksRemaining: deal.weeksDuration,
                weeksActive: 0, 
                description: `Contract Renewal: ${deal.weeksDuration} weeks. (+${Math.floor((raise-1)*100)}% Raise)`,
                expiresInWeeks: 4,
                isAccepted: false,
                isRejected: false,
                isNegotiated: false,
                isRenewal: true
            };

            const message: Message = {
                id: `msg_renew_${brand.id}_${currentWeek}`,
                senderId: brand.id,
                senderName: brand.name,
                handle: brand.handle,
                content: `Our partnership has been incredible. We'd like to renew your contract for another term with a raise.`,
                timestamp: currentWeek,
                isRead: false,
                brandOffer: renewalOffer
            };
            newMessages.push(message);
        } else {
            const message: Message = {
                id: `msg_end_${brand.id}_${currentWeek}`,
                senderId: brand.id,
                senderName: brand.name,
                handle: brand.handle,
                content: `Our contract has concluded. Thank you for representing ${brand.name}. We wish you the best.`,
                timestamp: currentWeek,
                isRead: false
            };
            newMessages.push(message);
        }
    });

    return { activeDeals, newMessages, newPosts, moneyGain };
};

export const promoteBrandProduct = (
    deal: BrandOffer, 
    artistName: string, 
    followers: number,
    currentWeek: number // CHANGED: Added currentWeek parameter
): { post: SocialPost, hypeChange: number, repChange: number, relationshipBoost: number } => {
    const brand = BRANDS.find(b => b.id === deal.brandId)!;
    const product = deal.products[deal.products.length - 1]; // Latest product

    // Logic: If promoting a Sample, big boost. If spamming old product, small boost.
    const isSample = product.type === 'Sample';
    const isSignature = product.type === 'Signature';

    let content = "";
    if (isSignature) content = `My official collaboration with ${brand.handle} is finally here. Go get the ${product.name} now. 🚀`;
    else if (isSample) content = `Just got the new ${product.name} from ${brand.handle}. This is quality. Thanks for the gift! 🎁`;
    else content = `Always keeping it fresh with ${brand.handle}. #${brand.name}`;

    const relationshipBoost = isSignature ? 15 : isSample ? 8 : 3;
    
    // Convert Sample to Standard after promo (consumed)
    if (isSample) product.type = 'Standard';

    return {
        post: {
            id: `promo_${deal.id}_${Date.now()}`,
            authorId: 'player',
            authorName: artistName,
            handle: `@${artistName.replace(/\s/g,'').toLowerCase()}`,
            content,
            type: 'PROMO',
            likes: Math.floor(followers * 0.05),
            retweets: Math.floor(followers * 0.01),
            timestamp: currentWeek, // CHANGED: Use passed currentWeek instead of Date.now()
            isVerified: true,
            cardData: {
                type: 'BRAND_AD',
                title: product.name,
                artist: artistName,
                coverArt: product.image,
                bottomImages: [], 
                bigStat: isSignature ? 'MY DROP' : 'CHECK IT',
                subStat: brand.name,
                accentColor: brand.logoColor,
                footer: isSignature ? 'Signature Collection' : 'Partner',
                linkUrl: `shop.${brand.name.toLowerCase().replace(/\s/g,'')}.com`
            }
        },
        hypeChange: isSignature ? 25 : 8,
        repChange: 2,
        relationshipBoost
    };
};
