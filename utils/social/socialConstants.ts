
export const SYSTEM_ACCOUNTS = [
    { id: 'sys_chartdata', name: 'chart data', handle: '@chartdata', isVerified: true, type: 'NEWS' },
    { id: 'sys_popbase', name: 'Pop Base', handle: '@PopBase', isVerified: true, type: 'NEWS' },
    { id: 'sys_popcrave', name: 'Pop Crave', handle: '@PopCrave', isVerified: true, type: 'NEWS' },
    { id: 'sys_billboard', name: 'Billboard Charts', handle: '@billboardcharts', isVerified: true, type: 'CHART' },
    { id: 'sys_spotify', name: 'Spotify', handle: '@Spotify', isVerified: true, type: 'PLATFORM' },
    { id: 'sys_tth', name: "Today's Top Hits", handle: '@TTH', isVerified: true, type: 'PLATFORM' },
    { id: 'sys_riaa', name: 'RIAA', handle: '@RIAA', isVerified: true, type: 'AWARD' },
    { id: 'sys_youtube', name: 'YouTube Music', handle: '@YouTubeMusic', isVerified: true, type: 'PLATFORM' },
    { id: 'sys_hdd', name: 'Hits Daily Double', handle: '@HITSDD', isVerified: true, type: 'SALES' },
    { id: 'sys_grammys', name: 'Recording Academy / GRAMMYs', handle: '@RecordingAcad', isVerified: true, type: 'AWARD' }, // NEW
];

export const FAN_HANDLES = [
    'pinkvenom_xx', 'barbz4life', 'swiftie_1989', 'kpop_stan_7', 'music_critic_lol', 
    'flopera_updates', 'chart_obsessed', 'main_pop_girl', 'indie_head', 'rap_caviar_fan',
    'y2k_vibes', 'loona_orb', 'blink_united', 'army_bora', 'hive_bey',
    'bad_bunny_pr', 'xo_weeknd', 'drizzy_fan', 'carti_vamp', 'new_jeans_bunnies'
];

export const THEMED_VOCAB: Record<string, string[]> = {
    // EMOTIONAL THEMES
    'heartbreak': [
        "who hurt you??? 😭", "crying in the club rn", "this hits different at 3am", 
        "i'm texting my ex after this", "the lyrics... i can't", "someone check on them", 
        "depression cured (or caused?)", "punching the air rn", "my mascara is running"
    ],
    'love': [
        "planning my wedding to this song", "screaming crying throwing up", "the romance is real", 
        "need a relationship like this", "making me believe in love again", "so soft 🥺", 
        "this is for the lovers", "wedding anthem of the year"
    ],
    'toxic': [
        "the toxicity... i live", "gaslight gatekeep girlboss anthem", "messy and i love it", 
        "villain era soundtrack", "red flags never looked so good", "sending this to my situationship"
    ],
    'party': [
        "club banger certified", "if the DJ doesn't play this I'm leaving", "shaking my ass respectfully", 
        "the beat drop??? hello???", "it's giving project x", "friday night anthem", "hands in the air"
    ],
    'flex': [
        "talk your sh*t king/queen", "bag secured 💰", "rich vibes only", "motivation to get my money up", 
        "the flow is immaculate", "expensive sounds", "boss energy"
    ],
    'diss': [
        "THE SHADE!!!", "ended their career in 3 mins", "someone call the ambulance", 
        "chose violence today", "no sub just dom", "did i hear that name drop???"
    ],
    'street': [
        "for the trenches", "street classic incoming", "real trap sh*t", "hood verified", 
        "turning this up in the whip", "lyrics too real"
    ],
    'summer': [
        "song of the summer calling it now", "windows down volume up", "beach vibes", 
        "sunshine in audio form", "summer 2025 is saved", "tropical perfection"
    ],
    'dark': [
        "this sounds like gotham city", "villain origin story vibes", "production is dark/gritty i luv it", 
        "midnight drive music", "mysterious and dangerous"
    ],
    'christmas': [
        "mariah is shaking", "defrosting season", "festive bop", "playing this under the tree", 
        "merry xmas to us", "holiday classic incoming", "santa approved"
    ],
    'halloween': [
        "spooky szn anthem 🎃", "vampire vibes", "scaring the hoes (affectionate)", 
        "monster mash could never", "october 31st soundtrack"
    ],
    'praise': [
        "MOTHER", "CULTURAL RESET", "ENDED FLOP", "THE RANGE", "VOCALS", "QUEEN OF POP", 
        "IT BOY", "SAVED THE YEAR", "NO SKIPS", "CLASSIC INCOMING", "ATE AND LEFT NO CRUMBS"
    ],
    'hate': [
        "FLOP", "TANKED", "EMBARRASSING", "DELETE THIS", "NOISE", "MID", 
        "RETIRE", "WHO LISTENS TO THIS?", "CARDBOARD", "INDUSTRY PLANT"
    ],
    'viral': [
        "WAIT... WHY IS THIS GOOD", "ON REPEAT", "OBSESSED", "SOTY", "TOP 10 INCOMING"
    ]
};

// NEW: Situational Vocab
export const SITUATIONAL_VOCAB = {
    hiatus: [
        "day 432 asking for the album...", "did they retire???", "missing person report filed for @Artist",
        "we are starving please drop something", "woke up and still no album announcement", 
        "going back to their old songs because we have nothing new", "are they alive?",
        "the drought is real 🌵", "being a fan of this artist is a struggle", "drop the album or i scream"
    ],
    comeback: [
        "THEY ARE BACKKKK", "MUSIC IS SAVED", "THE KING/QUEEN HAS RETURNED", 
        "I USED TO PRAY FOR TIMES LIKE THIS", "WE SURVIVED THE DROUGHT", 
        "EVERYONE WAKE UP NEW MUSIC", "ITS HAPPENING STAY CALM", "THEY LOOK SO GOOD OMG",
        "NATURE IS HEALING", "ALBUM OF THE YEAR INCOMING"
    ],
    streaming_party: [
        "join the stationhead party link below!!", "don't forget to buy on itunes to block others", 
        "keep streaming don't let it loop", "goals for first week: #1 debut", 
        "if you're not streaming what are you doing?", "volume up to 100 let's get that #1",
        "streaming playlist linked below 👇", "buy the digital version too!!"
    ]
};

export const THEME_HASHTAGS: Record<string, string[]> = {
    'heartbreak': ['#SadBoiHours', '#InMyFeelings', '#Broken'],
    'party': ['#ClubBanger', '#WeekendVibes', '#Lit'],
    'christmas': ['#MerryChristmas', '#HolidayMusic', '#Festive'],
    'halloween': ['#SpookySzn', '#Halloween', '#ScaryGood'],
    'flex': ['#Rich', '#Boss', '#Motivation'],
    'summer': ['#SongOfTheSummer', '#SummerVibes'],
    'diss': ['#Drama', '#Beef', '#Exposed']
};

export const NPC_TWEETS = [
    "Just left the studio. Magic happened.",
    "Can't wait for you all to hear this.",
    "Tour life is exhausting but I love you guys.",
    "Coffee and rehearsals.",
    "New era loading...",
    "Thank you for the support on the new track!",
    "Should I drop the tracklist?",
    "Streaming party tonight?",
    "Listening to some old classics today.",
    "Who should I collab with next?"
];
