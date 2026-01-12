
import { Genre } from '../../types';

// --- NATIVE SCRIPT TITLE GENERATOR ---
export const TITLE_TEMPLATES: Record<string, Record<string, string[]>> = {
  // SPANISH (LATIN GENRE / LATAM REGION)
  'SPANISH': {
    'love': ['Amor Eterno', 'Te Quiero', 'Besos Mojados', 'Mi Vida', 'Tu y Yo', 'Pasión', 'Contigo', 'Enamorada', 'Corazón Mío'],
    'heartbreak': ['Corazón Roto', 'Adiós Amor', 'Sola', 'Triste Realidad', 'Lágrimas', 'Sin Ti', 'Dolor', 'Ya No Estás', 'Olvídame'],
    'party': ['Fiesta Latina', 'Bailando', 'La Noche', 'Hasta Abajo', 'Ritmo', 'Descontrol', 'Reggaeton Lento', 'Vamos', 'Danza Kuduro'],
    'flex': ['El Jefe', 'Dinero', 'Diamantes', 'Campeón', 'La Fama', 'Millonario', 'Oro', 'Rey', 'Ganador'],
    'summer': ['Verano', 'Sol y Playa', 'Caliente', 'Isla Bonita', 'Ola', 'Calor', 'Costa', 'Brisa'],
    'default': ['Vida', 'Sueños', 'Mundo', 'Sol', 'Luna', 'Fuego', 'Música', 'Alma']
  },
  
  // KOREAN (K-POP GENRE / KOR REGION) - HANGUL
  'KOREAN': {
    'love': ['사랑해 (I Love You)', '나의 별 (My Star)', '첫사랑 (First Love)', '너와 나 (You & I)', '약속 (Promise)', '설렘 (Flutter)', '영원히 (Forever)', '내꺼하자 (Be Mine)'],
    'heartbreak': ['거짓말 (Lies)', '눈물 (Tears)', '가지마 (Don\'t Go)', '기억해 (Remember)', '이별 (Farewell)', '보고싶다 (I Miss You)', '하루하루 (Day by Day)'],
    'party': ['불타오르네 (Fire)', '대박 (Daebak)', '춤 (Dance)', '오늘 밤 (Tonight)', '건배 (Cheers)', '신나 (Excited)', '파티 (Party)'],
    'flex': ['내가 최고 (I Am The Best)', '왕관 (Crown)', '성공 (Success)', '돈 (Money)', '보스 (Boss)', '주인공 (Protagonist)', '레전드 (Legend)'],
    'summer': ['여름밤 (Summer Night)', '파도 (Wave)', '아이스크림 (Ice Cream)', '휴가 (Vacation)', '바다 (Sea)', '태양 (Sun)'],
    'default': ['꿈 (Dream)', '우주 (Universe)', '시간 (Time)', '빛 (Light)', '하늘 (Sky)', '시작 (Start)']
  },

  // JAPANESE (JPN REGION) - KANJI/KANA
  'JAPANESE': {
    'love': ['永遠の愛 (Eternal Love)', '君の名は (Your Name)', '恋心 (Love)', '運命 (Destiny)', '愛してる (I Love You)', '桜 (Sakura)', '月が綺麗 (Moon is Beautiful)'],
    'heartbreak': ['最後の嘘 (Last Lie)', 'さよなら (Goodbye)', '涙 (Tears)', '悲しみ (Sadness)', '孤独 (Loneliness)', '雨 (Rain)', '記憶 (Memories)'],
    'party': ['東京の夜 (Tokyo Night)', '祭り (Festival)', '踊れ (Dance!)', '花火 (Fireworks)', '夢中 (Crazy)', '金曜日 (Friday)'],
    'flex': ['王者 (King)', '勝利 (Victory)', '最強 (Strongest)', '伝説 (Legend)', '無敵 (Invincible)', '頂点 (Apex)', '栄光 (Glory)'],
    'summer': ['夏の日 (Summer Day)', '向日葵 (Sunflower)', '海 (Ocean)', '太陽 (Sun)', '青空 (Blue Sky)'],
    'default': ['夢 (Dream)', '希望 (Hope)', '未来 (Future)', '世界 (World)', '光 (Light)', '物語 (Story)']
  },

  // ENGLISH / GLOBAL
  'ENGLISH': {
    'love': ['Eternal Love', 'Be Mine', 'Sweetest Thing', 'Adore You', 'Only You', 'Crazy in Love', 'Thinking of You'],
    'heartbreak': ['Broken Dreams', 'Walk Away', 'Tears Dry', 'Cold Heart', 'Someone Like You', 'Without You', 'Bad Blood'],
    'party': ['Friday Night', 'Dance Floor', 'Wild One', 'Let\'s Go', 'Club Life', 'All Night', 'Celebration'],
    'flex': ['Top of the World', 'Money Talks', 'All I Do Is Win', 'Legend', 'Hall of Fame', 'Big Spender', 'Goat'],
    'luxury': ['Lamborghini', 'Gold Chains', 'Penthouse', 'VVS', 'Designer', 'Private Jet'],
    'street': ['The Block', 'Hood Tales', 'Streets Watching', 'Hustle', 'Grind', 'No Snitch'],
    'dark': ['Shadows', 'Midnight', 'Nightmare', 'Demons', 'Darkness', 'Void'],
    'christmas': ['Snowfall', 'Winter Wish', 'Santa Baby', 'Christmas Eve', 'Holiday Joy', 'Mistletoe'],
    'halloween': ['Spooky Szn', 'Ghost Town', 'Thriller Night', 'Witchcraft', 'Haunted', 'Monster'],
    'summer': ['Summer Vibes', 'Sunshine', 'Pool Party', 'Heatwave', 'Ocean Drive', 'Sunset'],
    'default': ['Memories', 'Changes', 'Moments', 'Journey', 'Reflections', 'Visions']
  }
};

export const getLocalizedTitle = (genre: Genre, theme: string, type: 'Single' | 'Album', dominantRegion: string): string => {
    let langKey = 'ENGLISH';

    // 1. Check strict Genres
    if (genre === Genre.KPOP) langKey = 'KOREAN';
    else if (genre === Genre.LATIN) langKey = 'SPANISH';
    
    // 2. Check Region Dominance (Overrides Genre if generic Pop/Rock/HipHop)
    else if (dominantRegion === 'JPN') langKey = 'JAPANESE';
    else if (dominantRegion === 'KOR') langKey = 'KOREAN'; // Fallback if K-artist makes Pop
    else if (dominantRegion === 'LATAM') langKey = 'SPANISH'; // Fallback if Latin artist makes Pop

    // Determine category based on theme
    let category = 'default';
    if (['love', 'inspo'].includes(theme)) category = 'love';
    else if (['heartbreak', 'toxic', 'conscious'].includes(theme)) category = 'heartbreak';
    else if (['party', 'edm'].includes(theme)) category = 'party';
    else if (['flex', 'luxury', 'diss', 'street'].includes(theme)) category = 'flex';
    else if (['summer'].includes(theme)) category = 'summer';
    else if (['christmas'].includes(theme)) category = 'christmas';
    else if (['halloween', 'dark'].includes(theme)) category = 'halloween';

    // Fallback to English if category missing in native lang (e.g. Christmas in Japanese might default to English or specific list)
    let wordBank = TITLE_TEMPLATES[langKey][category];
    if (!wordBank) {
        // Fallback to default of that language, or English
        wordBank = TITLE_TEMPLATES[langKey]['default'] || TITLE_TEMPLATES['ENGLISH']['default'];
    }

    const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    
    // Variations
    if (Math.random() > 0.7) {
         if (langKey === 'SPANISH') return `${randomWord} (Remix)`;
         if (langKey === 'KOREAN') return `${randomWord} (Pt. 2)`;
         if (langKey === 'JAPANESE') return `${randomWord} - Mix`;
         return `${randomWord} (Remix)`;
    }
    
    if (type === 'Album') {
         if (langKey === 'SPANISH') return `Un Verano Sin ${randomWord}`;
         if (langKey === 'KOREAN') return `The ${randomWord} Chapter`;
         if (langKey === 'JAPANESE') return `${randomWord} の世界 (World of ${randomWord})`;
         return `The ${randomWord} Album`;
    }

    return randomWord;
};
