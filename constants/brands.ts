
import { Brand } from '../types';

export const BRANDS: Brand[] = [
    // UNDERWEAR
    {
        id: 'brand_calvins',
        name: 'Kalvin Klone',
        handle: '@KalvinKlone',
        industry: 'UNDERWEAR',
        tier: 'NATIONAL',
        minHype: 200,
        description: 'Iconic minimalism. The waistband everyone wants to show.',
        logoColor: 'bg-zinc-900',
        preferredStyle: 'EDITORIAL',
        responses: {
            offer: "We like your aesthetic. Interested in joining our #MyKalvins campaign?",
            accepted: "Welcome to the family. Let's break the internet.",
            rejected: "Understood. Maybe next season."
        }
    },
    {
        id: 'brand_vs',
        name: 'Victorias Unknown',
        handle: '@VictoriasUnknown',
        industry: 'UNDERWEAR',
        tier: 'LUXURY',
        minHype: 600,
        description: 'Angelic vibes only. High fashion lingerie.',
        logoColor: 'bg-pink-600',
        preferredStyle: 'EDITORIAL',
        responses: {
            offer: "You have the look of an Angel. We want you for our next runway show.",
            accepted: "Get your wings ready. Contract sent.",
            rejected: "A shame. You would have looked stunning."
        }
    },
    
    // JEWELRY
    {
        id: 'brand_ice',
        name: 'Icebox District',
        handle: '@IceboxDistrict',
        industry: 'JEWELRY',
        tier: 'NATIONAL',
        minHype: 300,
        description: 'Custom chains for the hottest rappers.',
        logoColor: 'bg-blue-600',
        preferredStyle: 'STREET',
        responses: {
            offer: "Your neck looks empty. Let's fix that. Collab?",
            accepted: "Icy. We'll send the piece over.",
            rejected: "More ice for us then."
        }
    },
    {
        id: 'brand_tiffany',
        name: 'Tiff & Co.',
        handle: '@TiffAndCo',
        industry: 'JEWELRY',
        tier: 'LUXURY',
        minHype: 800,
        description: 'Timeless elegance. The blue box.',
        logoColor: 'bg-teal-400',
        preferredStyle: 'EDITORIAL',
        responses: {
            offer: "We require a face of elegance for our new Diamond collection. Are you available?",
            accepted: "Exquisite choice. Welcome to Tiff & Co.",
            rejected: "We will find another muse."
        }
    },

    // FASHION
    {
        id: 'brand_supreme',
        name: 'Sublime',
        handle: '@SublimeNYC',
        industry: 'FASHION',
        tier: 'NATIONAL',
        minHype: 400,
        description: 'Hypebeast culture. Red box logo.',
        logoColor: 'bg-red-600',
        preferredStyle: 'STREET',
        responses: {
            offer: "Yo. Box logo tee promo. You down?",
            accepted: "Sick. Sending the care package.",
            rejected: "L."
        }
    },
    {
        id: 'brand_gucci',
        name: 'Gucci',
        handle: '@gucci',
        industry: 'FASHION',
        tier: 'LUXURY',
        minHype: 900,
        description: 'Italian luxury. The double G.',
        logoColor: 'bg-green-700',
        preferredStyle: 'EDITORIAL',
        responses: {
            offer: "We are casting for our Global Campaign. Your profile fits our vision.",
            accepted: "Magnifico. The contract is en route.",
            rejected: "Arrivederci."
        }
    },

    // TECH / OTHERS
    {
        id: 'brand_beats',
        name: 'Beats by Dre',
        handle: '@beatsbydre',
        industry: 'TECH',
        tier: 'NATIONAL',
        minHype: 350,
        description: 'The sound of the studio.',
        logoColor: 'bg-red-500',
        preferredStyle: 'COMMERCIAL',
        responses: {
            offer: "Hear what you want. Join the movement.",
            accepted: "Loud and clear. Let's work.",
            rejected: "Copy that."
        }
    },
    {
        id: 'brand_sprite',
        name: 'Sprite',
        handle: '@Sprite',
        industry: 'FOOD',
        tier: 'NATIONAL',
        minHype: 150,
        description: 'Obey your thirst. Hip-hop staple.',
        logoColor: 'bg-green-500',
        preferredStyle: 'COMMERCIAL',
        responses: {
            offer: "Wanna thirst trap? Just kidding. But seriously, want a sponsorship?",
            accepted: "Refreshing choice.",
            rejected: "Stay thirsty."
        }
    }
];
