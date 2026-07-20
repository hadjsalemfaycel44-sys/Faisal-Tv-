// ==================== STREAMING SERVER CONFIG ====================
const HOST = "http://longsat.xyz:80";
const USER = "delfraissy";
const PASS = "aout0023";

// ==================== CHANNELS DATABASE ====================
const CHANNELS_DATABASE = {
    channels: [
        // Sports - beIN
        { id: 1, name: "beIN MAX 1 4K", category: "sports", subcategory: "bein", quality: "4K", icon: "📺" },
        { id: 2, name: "beIN MAX 1 HD", category: "sports", subcategory: "bein", quality: "HD", icon: "📺" },
        { id: 3, name: "beIN MAX 2 4K", category: "sports", subcategory: "bein", quality: "4K", icon: "📺" },
        { id: 4, name: "beIN MAX 2 HD", category: "sports", subcategory: "bein", quality: "HD", icon: "📺" },
        { id: 5, name: "beIN MAX 3 FHD", category: "sports", subcategory: "bein", quality: "FHD", icon: "📺" },
        
        // Sports - SSC
        { id: 6, name: "SSC 1 HD", category: "sports", subcategory: "ssc", quality: "HD", icon: "⚽" },
        { id: 7, name: "SSC 2 HD", category: "sports", subcategory: "ssc", quality: "HD", icon: "⚽" },
        { id: 8, name: "SSC 3 HD", category: "sports", subcategory: "ssc", quality: "HD", icon: "⚽" },
        
        // Sports - Arabic
        { id: 9, name: "الرياضية السعودية", category: "sports", subcategory: "aloroba", quality: "HD", icon: "🏟️" },
        { id: 10, name: "الرياضية الأولى", category: "sports", subcategory: "aloroba", quality: "HD", icon: "🏟️" },
        
        // Sports - Premier League
        { id: 11, name: "Premier League HD", category: "sports", subcategory: "premier", quality: "HD", icon: "🎯" },
        { id: 12, name: "Premier League FHD", category: "sports", subcategory: "premier", quality: "FHD", icon: "🎯" },
        
        // Sports - La Liga
        { id: 13, name: "La Liga HD", category: "sports", subcategory: "la-liga", quality: "HD", icon: "⚽" },
        { id: 14, name: "La Liga FHD", category: "sports", subcategory: "la-liga", quality: "FHD", icon: "⚽" },
        
        // Sports - Serie A
        { id: 15, name: "Serie A HD", category: "sports", subcategory: "serie-a", quality: "HD", icon: "🇮🇹" },
        { id: 16, name: "Serie A FHD", category: "sports", subcategory: "serie-a", quality: "FHD", icon: "🇮🇹" },
        
        // Sports - Ligue 1
        { id: 17, name: "Ligue 1 HD", category: "sports", subcategory: "ligue1", quality: "HD", icon: "🇫🇷" },
        { id: 18, name: "Ligue 1 FHD", category: "sports", subcategory: "ligue1", quality: "FHD", icon: "🇫🇷" },
        
        // Movies
        { id: 19, name: "أفلام أكشن", category: "movies", subcategory: "action", quality: "FHD", icon: "🎬" },
        { id: 20, name: "أفلام دراما", category: "movies", subcategory: "drama", quality: "FHD", icon: "🎭" },
        { id: 21, name: "أفلام رعب", category: "movies", subcategory: "horror", quality: "FHD", icon: "👻" },
        { id: 22, name: "أفلام رومانسية", category: "movies", subcategory: "romance", quality: "FHD", icon: "💕" },
        { id: 23, name: "أفلام كوميديا", category: "movies", subcategory: "comedy", quality: "FHD", icon: "😂" },
        
        // Series
        { id: 24, name: "مسلسلات عربية", category: "series", subcategory: "arabic", quality: "HD", icon: "📽️" },
        { id: 25, name: "مسلسلات تركية", category: "series", subcategory: "turkish", quality: "HD", icon: "📽️" },
        { id: 26, name: "مسلسلات أجنبية", category: "series", subcategory: "foreign", quality: "HD", icon: "📽️" },
        
        // News
        { id: 27, name: "قناة الأخبار", category: "news", subcategory: "general", quality: "HD", icon: "📰" },
        { id: 28, name: "أخبار الرياضة", category: "news", subcategory: "sports-news", quality: "HD", icon: "📡" },
        { id: 29, name: "الأخبار العاجلة", category: "news", subcategory: "breaking", quality: "HD", icon: "🚨" },
        
        // Religion
        { id: 30, name: "القرآن الكريم", category: "religion", subcategory: "quran", quality: "HD", icon: "📖" },
        { id: 31, name: "الدين والعلم", category: "religion", subcategory: "islamic", quality: "HD", icon: "🕌" },
        { id: 32, name: "دروس دينية", category: "religion", subcategory: "lessons", quality: "HD", icon: "📚" },
        
        // Documentary
        { id: 33, name: "وثائقية الحيوان", category: "documentary", subcategory: "animals", quality: "FHD", icon: "🦁" },
        { id: 34, name: "وثائقية التاريخ", category: "documentary", subcategory: "history", quality: "FHD", icon: "🏛️" },
        { id: 35, name: "وثائقيات الطبيعة", category: "documentary", subcategory: "nature", quality: "FHD", icon: "🌿" },
        
        // Wrestling
        { id: 36, name: "WWE", category: "wrestling", subcategory: "wwe", quality: "HD", icon: "🤼" },
        { id: 37, name: "AEW", category: "wrestling", subcategory: "aew", quality: "HD", icon: "🤼" },
        { id: 38, name: "Impact Wrestling", category: "wrestling", subcategory: "impact", quality: "HD", icon: "💥" },
        
        // Cartoons
        { id: 39, name: "رسوم متحركة أطفال", category: "cartoons", subcategory: "kids", quality: "HD", icon: "🎨" },
        { id: 40, name: "رسوم متحركة عامة", category: "cartoons", subcategory: "general", quality: "HD", icon: "🎨" },
        { id: 41, name: "أنمي", category: "cartoons", subcategory: "anime", quality: "HD", icon: "🎌" },
        
        // Kids
        { id: 42, name: "قناة براعم", category: "kids", subcategory: "general", quality: "HD", icon: "👶" },
        { id: 43, name: "قناة الأطفال", category: "kids", subcategory: "general", quality: "HD", icon: "🧸" },
        { id: 44, name: "الكرتون المفضل", category: "kids", subcategory: "general", quality: "HD", icon: "🎪" },
        
        // Comedy
        { id: 45, name: "كوميديا عربية", category: "comedy", subcategory: "arabic", quality: "HD", icon: "😄" },
        { id: 46, name: "كوميديا عالمية", category: "comedy", subcategory: "international", quality: "HD", icon: "😆" },
        { id: 47, name: "برامج كوميدية", category: "comedy", subcategory: "shows", quality: "HD", icon: "🎭" }
    ]
};

// ==================== BUILD STREAM URL ====================
function buildStreamUrl(channelId) {
    return `${HOST}/live/${USER}/${PASS}/${channelId}/index.m3u8`;
}
