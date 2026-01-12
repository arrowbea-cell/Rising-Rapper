
import { Genre } from '../types';

// --- ART ASSETS (High Quality Placeholders) ---
export const GENRE_COVER_URLS: Record<Genre, string[]> = {
    [Genre.POP]: [
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504509546545-e000b4a62953?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.HIP_HOP]: [
        "https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.RNB]: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.EDM]: [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.KPOP]: [
        "https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1627663205036-7c9c065f498c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.LATIN]: [
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563841930606-67e26ce484db?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519751138087-5bf797052601?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.ROCK]: [
        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1459749411177-0473ef71607b?q=80&w=800&auto=format&fit=crop"
    ],
    [Genre.AFROBEATS]: [
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=800&auto=format&fit=crop"
    ]
};

// --- BRAND PRODUCT ASSETS ---
export const BRAND_PRODUCT_IMAGES: Record<string, string[]> = {
    'FASHION': [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800", // Sneaker Red
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800", // Sneaker various
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", // Jacket
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800"  // T-Shirt
    ],
    'TECH': [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800", // Headphones
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800", // Watch
        "https://images.unsplash.com/photo-1588872657578-a3d2af14e5da?q=80&w=800"  // Laptop/Tablet
    ],
    'FOOD': [
        "https://images.unsplash.com/photo-1626202158863-7e2da027732a?q=80&w=800", // Soda Can
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800", // Burger
        "https://images.unsplash.com/photo-1554522652-37eb8966c9df?q=80&w=800"  // Chips
    ],
    'BEAUTY': [
        "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800", // Makeup
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800", // Perfume
    ],
    'JEWELRY': [
        "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800", // Gold Chain
        "https://images.unsplash.com/photo-1617038224538-276365d638b8?q=80&w=800", // Diamond Watch
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800"  // Necklace
    ],
    'UNDERWEAR': [
        "https://images.unsplash.com/photo-1583744053982-f54249a46a4e?q=80&w=800" // Generic Apparel
    ]
};
