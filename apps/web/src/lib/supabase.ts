/**
 * Supabase Client for Al-Haqq
 * Direct database access for Quran, Hadith, and other content
 */

import { createClient as createClientOriginal, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create supabase client only if credentials are provided
let supabaseInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
    if (!supabaseUrl || !supabaseKey) {
        return null;
    }
    if (!supabaseInstance) {
        supabaseInstance = createClientOriginal(supabaseUrl, supabaseKey);
    }
    return supabaseInstance;
}

// Create a chainable mock builder for when Supabase isn't configured
const createMockChain = (): any => {
    const mock: any = {
        select: () => createMockChain(),
        eq: () => createMockChain(),
        neq: () => createMockChain(),
        gt: () => createMockChain(),
        lt: () => createMockChain(),
        gte: () => createMockChain(),
        lte: () => createMockChain(),
        like: () => createMockChain(),
        ilike: () => createMockChain(),
        is: () => createMockChain(),
        in: () => createMockChain(),
        or: () => createMockChain(),
        and: () => createMockChain(),
        not: () => createMockChain(),
        filter: () => createMockChain(),
        match: () => createMockChain(),
        textSearch: () => createMockChain(),
        order: () => createMockChain(),
        limit: () => createMockChain(),
        range: () => createMockChain(),
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        then: (resolve: any) => Promise.resolve({ data: [], error: null, count: 0 }).then(resolve),
    };
    return mock;
};

// Export a proxy that safely returns null operations when Supabase isn't configured
export const supabase = {
    from: (table: string) => {
        const client = createClient();
        if (!client) {
            return createMockChain();
        }
        return client.from(table);
    }
};

// ============================================
// Database Types
// ============================================

export interface Surah {
    id: number;
    number: number;
    arabic_name: string;
    english_name: string;
    transliteration: string;
    revelation_type: 'Meccan' | 'Medinan';
    total_ayahs: number;
    juz_start?: number;
}

export interface Ayah {
    id: number;
    surah_id: number;
    ayah_number: number;
    arabic_text: string;
    juz?: number;
    hizb?: number;
    sajda?: boolean;
}

export interface QuranTranslation {
    id: number;
    ayah_id: number;
    language_code: string;
    translator: string;
    translation_text: string;
}

export interface HadithBook {
    id: number;
    slug: string;
    arabic_title: string;
    english_title: string;
    author_arabic?: string;
    author_english?: string;
    total_hadiths?: number;
    description?: string;
}

export interface HadithChapter {
    id: number;
    book_id: number;
    chapter_number: number;
    arabic_title?: string;
    english_title?: string;
}

export interface Hadith {
    id: number;
    book_id: number;
    chapter_id?: number;
    hadith_number: number;
    arabic_text: string;
    english_narrator?: string;
    english_text: string;
    grade?: string;
    reference?: string;
}

export interface Dua {
    id: number;
    arabic_text: string;
    transliteration?: string;
    translation: string;
    category?: string;
    source?: string;
    audio_url?: string;
}

// ============================================
// Helper to check if Supabase is configured
// ============================================

export function isSupabaseConfigured(): boolean {
    return Boolean(supabaseUrl && supabaseKey);
}
