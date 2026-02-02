/**
 * Shared Constants for Al-Haqq Platform
 */

// ==================
// Language Configuration
// ==================

export const SUPPORTED_LANGUAGES = {
    // MVP Languages
    en: { name: 'English', nativeName: 'English', rtl: false, priority: 1 },
    ur: { name: 'Urdu', nativeName: 'اردو', rtl: true, priority: 2 },
    te: { name: 'Telugu', nativeName: 'తెలుగు', rtl: false, priority: 3 },
    // Post-MVP Languages
    hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false, priority: 4 },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', rtl: false, priority: 5 },
    ml: { name: 'Malayalam', nativeName: 'മലയാളം', rtl: false, priority: 6 },
    bn: { name: 'Bengali', nativeName: 'বাংলা', rtl: false, priority: 7 },
    zh: { name: 'Chinese', nativeName: '中文', rtl: false, priority: 8 },
} as const;

export const MVP_LANGUAGES = ['en', 'ur', 'te'] as const;

export const RTL_LANGUAGES = ['ar', 'ur', 'fa', 'he'] as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// ==================
// Quran Constants
// ==================

export const QURAN_CONSTANTS = {
    TOTAL_SURAHS: 114,
    TOTAL_AYAHS: 6236,
    TOTAL_JUZ: 30,
    TOTAL_HIZB: 60,
    TOTAL_MANZIL: 7,
    TOTAL_RUKU: 556,
} as const;

// Surah groups for navigation
export const SURAH_GROUPS = {
    FATIHA: [1],
    BAQARAH_AL_IMRAN: [2, 3],
    LONG_SURAHS: [2, 3, 4, 5, 6, 7, 8, 9],
    LAST_TEN: [105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
    QULS: [109, 112, 113, 114],
} as const;

// ==================
// Hadith Constants
// ==================

export const HADITH_COLLECTIONS = {
    bukhari: { name: 'Sahih al-Bukhari', shortName: 'Bukhari', isSahih: true },
    muslim: { name: 'Sahih Muslim', shortName: 'Muslim', isSahih: true },
    abudawud: { name: 'Sunan Abu Dawud', shortName: 'Abu Dawud', isSahih: false },
    tirmidhi: { name: 'Jami at-Tirmidhi', shortName: 'Tirmidhi', isSahih: false },
    nasai: { name: 'Sunan an-Nasai', shortName: 'Nasai', isSahih: false },
    ibnmajah: { name: 'Sunan Ibn Majah', shortName: 'Ibn Majah', isSahih: false },
    malik: { name: 'Muwatta Malik', shortName: 'Muwatta', isSahih: false },
    ahmed: { name: 'Musnad Ahmad', shortName: 'Ahmad', isSahih: false },
    darimi: { name: 'Sunan ad-Darimi', shortName: 'Darimi', isSahih: false },
    nawawi40: { name: "An-Nawawi's Forty", shortName: 'Nawawi 40', isSahih: false },
    qudsi40: { name: 'Forty Hadith Qudsi', shortName: 'Qudsi 40', isSahih: false },
    riyad_assalihin: { name: 'Riyad as-Salihin', shortName: 'Riyad', isSahih: false },
    bulugh_almaram: { name: 'Bulugh al-Maram', shortName: 'Bulugh', isSahih: false },
    mishkat_almasabih: { name: 'Mishkat al-Masabih', shortName: 'Mishkat', isSahih: false },
    aladab_almufrad: { name: 'Al-Adab al-Mufrad', shortName: 'Adab', isSahih: false },
    shamail_muhammadiyah: { name: 'Shama\'il Muhammadiyah', shortName: 'Shamail', isSahih: false },
    shahwaliullah40: { name: 'Shah Waliullah Forty', shortName: 'Waliullah 40', isSahih: false },
} as const;

export const HADITH_GRADES = {
    sahih: { name: 'Sahih', meaning: 'Authentic', level: 1 },
    hasan: { name: 'Hasan', meaning: 'Good', level: 2 },
    daif: { name: "Da'if", meaning: 'Weak', level: 3 },
    maudu: { name: "Maudu'", meaning: 'Fabricated', level: 4 },
} as const;

// ==================
// API Constants
// ==================

export const API_DEFAULTS = {
    PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    SEARCH_LIMIT: 50,
    AI_MAX_TOKENS: 2000,
    AI_TEMPERATURE: 0.3,
} as const;

export const API_ENDPOINTS = {
    // Quran
    SURAHS: '/api/v1/quran/surahs',
    AYAHS: '/api/v1/quran/ayahs',
    QURAN_SEARCH: '/api/v1/quran/search',
    // Hadith
    HADITH_BOOKS: '/api/v1/hadith/books',
    HADITHS: '/api/v1/hadith',
    HADITH_SEARCH: '/api/v1/hadith/search',
    // AI
    BASIRA_ASK: '/api/v1/basira/ask',
    BASIRA_CONVERSATIONS: '/api/v1/basira/conversations',
    // Search
    UNIFIED_SEARCH: '/api/v1/search',
} as const;

// ==================
// AI Basira Constants
// ==================

export const BASIRA_CONFIG = {
    MODEL: 'gemini-2.0-flash',
    EMBEDDING_MODEL: 'text-embedding-004',
    MAX_CONTEXT_SOURCES: 10,
    MAX_CONVERSATION_HISTORY: 20,
    TEMPERATURE: 0.3,
    TOP_K_RETRIEVAL: 20,
    RERANK_TOP_K: 5,
} as const;

// Topics Basira will NOT answer
export const BASIRA_BLOCKED_TOPICS = [
    'fatwa',
    'religious ruling',
    'halal certification',
    'personal spiritual advice',
    'sectarian disputes',
    'political interpretation',
    'medical advice',
    'legal advice',
] as const;
