/**
 * Source Retriever for AI Basira
 * Retrieves relevant Quran and Hadith sources
 */

import type { Source } from './types.js';

export interface RetrieverConfig {
    supabaseUrl: string;
    supabaseKey: string;
}

export class SourceRetriever {
    private supabaseUrl: string;
    private supabaseKey: string;

    constructor(config: RetrieverConfig) {
        this.supabaseUrl = config.supabaseUrl;
        this.supabaseKey = config.supabaseKey;
    }

    /**
     * Search for relevant Quran verses
     */
    async searchQuran(query: string, limit = 5): Promise<Source[]> {
        const response = await fetch(
            `${this.supabaseUrl}/rest/v1/quran_translations?translation_tsv=fts.${encodeURIComponent(query)}&select=translation_text,ayahs(ayah_number,arabic_text,surahs(number,english_name))&limit=${limit}`,
            {
                headers: {
                    apikey: this.supabaseKey,
                    Authorization: `Bearer ${this.supabaseKey}`,
                },
            }
        );

        if (!response.ok) return [];

        const data = await response.json();

        return data.map((item: any) => ({
            type: 'quran' as const,
            reference: `Quran ${item.ayahs.surahs.number}:${item.ayahs.ayah_number} (${item.ayahs.surahs.english_name})`,
            arabicText: item.ayahs.arabic_text,
            translation: item.translation_text,
        }));
    }

    /**
     * Search for relevant Hadith
     */
    async searchHadith(query: string, limit = 5): Promise<Source[]> {
        const response = await fetch(
            `${this.supabaseUrl}/rest/v1/hadiths?english_tsv=fts.${encodeURIComponent(query)}&select=hadith_number,arabic_text,english_text,grade,hadith_books(slug,english_title)&limit=${limit}`,
            {
                headers: {
                    apikey: this.supabaseKey,
                    Authorization: `Bearer ${this.supabaseKey}`,
                },
            }
        );

        if (!response.ok) return [];

        const data = await response.json();

        return data.map((item: any) => ({
            type: 'hadith' as const,
            reference: `${item.hadith_books.english_title}, Hadith ${item.hadith_number}${item.grade ? ` (${item.grade})` : ''}`,
            arabicText: item.arabic_text,
            translation: item.english_text,
        }));
    }

    /**
     * Search both Quran and Hadith
     */
    async search(query: string, limit = 10): Promise<Source[]> {
        const [quranSources, hadithSources] = await Promise.all([
            this.searchQuran(query, Math.ceil(limit / 2)),
            this.searchHadith(query, Math.ceil(limit / 2)),
        ]);

        return [...quranSources, ...hadithSources];
    }
}
