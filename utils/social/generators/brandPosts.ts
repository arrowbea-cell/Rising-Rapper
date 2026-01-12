
import { BrandOffer, SocialPost } from '../../../types';
import { BRANDS } from '../../../constants';

export const generateBrandAd = (offer: BrandOffer, currentWeek: number, artist: any): SocialPost => {
    const brand = BRANDS.find(b => b.id === offer.brandId)!;
    const product = offer.products[offer.products.length - 1]; // Latest product

    const adCopy = [
        `Introducing the new collection. ${brand.handle} x ${artist.name}.`,
        `Elegance defined. Experience the new drop.`,
        `Don't miss out. The collaboration of the year is here.`,
        `Available now. Link in bio. #Ad`,
        `Style redefined. ${brand.handle} with ${artist.name}.`,
        `The wait is over. Shop the new ${product.name} now.`
    ];

    return {
        id: `ad_${offer.id}_${Date.now()}_${Math.random()}`,
        authorId: `brand_${brand.id}`, 
        authorName: brand.name,
        handle: brand.handle,
        content: adCopy[Math.floor(Math.random() * adCopy.length)],
        type: 'PROMO',
        likes: Math.floor(artist.monthlyListeners * 0.001),
        retweets: Math.floor(artist.monthlyListeners * 0.0002),
        timestamp: currentWeek,
        isVerified: true,
        cardData: {
            type: 'BRAND_AD',
            title: product.name,
            artist: artist.name,
            coverArt: product.image, // Product Image
            bottomImages: artist.image ? [artist.image] : [], // Artist Image for collage
            bigStat: 'SHOP NOW',
            subStat: 'Limited Time',
            accentColor: brand.logoColor,
            footer: 'Sponsored',
            linkUrl: `shop.${brand.name.toLowerCase().replace(/\s/g,'')}.com`
        }
    };
};

export const generateBrandPost = (offer: BrandOffer, currentWeek: number, artistName: string): SocialPost => {
    const brand = BRANDS.find(b => b.id === offer.brandId)!;
    
    let content = "";
    if (offer.campaignResult) {
        if (offer.campaignResult.quality > 80) content = `Just dropped the new campaign with ${brand.handle}. This one is special. 📸✨`;
        else content = `Excited to partner with ${brand.handle}. #Ad`;
    }
    else if (offer.isRenewal) content = `Happy to announce I'm extending my partnership with ${brand.handle}. More to come.`;
    else if (offer.type === 'GLOBAL_AMBASSADOR') content = `Global. ${brand.handle} x ${artistName}. The new face of the brand.`;
    else if (offer.type === 'AMBASSADOR') content = `Official Ambassador for ${brand.handle}. 🤝`;
    else content = `Partnering up with ${brand.handle}.`;

    return {
        id: `post_brand_${Date.now()}`,
        authorId: 'player', 
        authorName: artistName,
        handle: `@${artistName.replace(/\s/g,'').toLowerCase()}`,
        content: content,
        type: 'PROMO',
        likes: Math.floor(offer.payout / 10), 
        retweets: Math.floor(offer.payout / 50),
        timestamp: currentWeek,
        isVerified: true,
        avatar: undefined 
    };
};
