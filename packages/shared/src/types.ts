/**
 * Shared Types for Al-Haqq Platform
 */

// ==================
// API Response Types
// ==================

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: APIError;
    pagination?: PaginationInfo;
}

export interface APIError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// ==================
// Quran Types
// ==================

export interface SurahSummary {
    id: number;
    number: number;
    arabicName: string;
    englishName: string;
    transliteration: string;
    revelationType: 'Meccan' | 'Medinan';
    totalAyahs: number;
}

export interface Surah extends SurahSummary {
    ayahs: Ayah[];
}

export interface Ayah {
    id: number;
    number: number;
    arabicText: string;
    translations: Translation[];
    juz?: number;
    hizb?: number;
    sajda?: boolean;
}

export interface Translation {
    languageCode: string;
    translator: string;
    text: string;
}

export interface QuranWord {
    position: number;
    arabic: string;
    transliteration?: string;
    translation?: string;
    root?: string;
}

// ==================
// Hadith Types
// ==================

export interface HadithBookSummary {
    id: number;
    slug: string;
    arabicTitle: string;
    englishTitle: string;
    authorArabic?: string;
    authorEnglish?: string;
    totalHadiths?: number;
}

export interface HadithBook extends HadithBookSummary {
    chapters: HadithChapter[];
}

export interface HadithChapter {
    id: number;
    number: number;
    arabicTitle?: string;
    englishTitle?: string;
}

export interface Hadith {
    id: number;
    bookSlug: string;
    number: number;
    arabicText: string;
    englishNarrator?: string;
    englishText: string;
    grade?: string;
    reference: string;
    chapter?: HadithChapter;
}

// ==================
// AI Basira Types
// ==================

export interface BasiraQuery {
    question: string;
    language?: string;
    conversationId?: string;
}

export interface BasiraResponse {
    answer: string;
    sources: BasiraSource[];
    conversationId: string;
    tokensUsed?: number;
}

export interface BasiraSource {
    type: 'quran' | 'hadith';
    reference: string;
    arabicText: string;
    translation: string;
    similarity?: number;
    relevanceScore?: number;
}

export interface BasiraConversation {
    id: string;
    title?: string;
    messages: BasiraMessage[];
    startedAt: string;
}

export interface BasiraMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    sources?: BasiraSource[];
    createdAt: string;
}

// ==================
// Search Types
// ==================

export interface SearchQuery {
    query: string;
    type?: 'quran' | 'hadith' | 'all';
    language?: string;
    book?: string; // For hadith filtering
    page?: number;
    limit?: number;
}

export interface SearchResult {
    type: 'quran' | 'hadith';
    id: number;
    reference: string;
    arabicText: string;
    translation: string;
    relevanceScore: number;
    highlights?: string[];
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    took: number; // milliseconds
}
