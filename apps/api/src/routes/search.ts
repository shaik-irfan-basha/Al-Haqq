/**
 * Unified Search API Routes
 */

import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { asyncHandler, createError } from '../middleware/error.js';
import { validatePagination } from '@al-haqq/shared';
import type { SearchResult, SearchResponse } from '@al-haqq/shared';

export const searchRouter = Router();

/**
 * GET /api/v1/search
 * Unified search across Quran and Hadith
 */
searchRouter.get('/', asyncHandler(async (req, res) => {
    const query = req.query.q as string;
    const type = req.query.type as 'quran' | 'hadith' | 'all' || 'all';
    const lang = (req.query.lang as string) || 'en';
    const { limit } = validatePagination(1, parseInt(req.query.limit as string) || 20, 50);

    if (!query || query.length < 2) {
        throw createError('Search query must be at least 2 characters', 400, 'INVALID_QUERY');
    }

    const startTime = Date.now();
    const results: SearchResult[] = [];

    // Search Quran translations
    if (type === 'all' || type === 'quran') {
        const { data: quranResults } = await supabase
            .from('quran_translations')
            .select(`
        translation_text,
        ayahs!inner (
          ayah_number,
          arabic_text,
          surahs!inner (
            number,
            english_name
          )
        )
      `)
            .eq('language_code', lang)
            .textSearch('translation_tsv', query)
            .limit(limit);

        for (const item of quranResults || []) {
            const ayah = item.ayahs as any;
            results.push({
                type: 'quran',
                id: ayah.surahs.number * 1000 + ayah.ayah_number,
                reference: `${ayah.surahs.number}:${ayah.ayah_number}`,
                arabicText: ayah.arabic_text,
                translation: item.translation_text,
                relevanceScore: 1, // Would be set by semantic search
            });
        }
    }

    // Search Hadiths
    if (type === 'all' || type === 'hadith') {
        const { data: hadithResults } = await supabase
            .from('hadiths')
            .select(`
        id,
        hadith_number,
        arabic_text,
        english_text,
        hadith_books!inner (
          slug,
          english_title
        )
      `)
            .textSearch('english_tsv', query)
            .limit(limit);

        for (const item of hadithResults || []) {
            const book = item.hadith_books as any;
            results.push({
                type: 'hadith',
                id: item.id,
                reference: `${book.slug}:${item.hadith_number}`,
                arabicText: item.arabic_text,
                translation: item.english_text,
                relevanceScore: 1,
            });
        }
    }

    const took = Date.now() - startTime;

    const response: SearchResponse = {
        results: results.slice(0, limit),
        total: results.length,
        query,
        took,
    };

    res.json({
        success: true,
        data: response,
    });
}));
