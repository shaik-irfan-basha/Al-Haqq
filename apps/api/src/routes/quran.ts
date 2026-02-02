/**
 * Quran API Routes
 */

import { Router } from 'express';
import { supabase } from '../lib/supabase';
import { asyncHandler, createError } from '../middleware/error';
import { validatePagination, calculatePagination } from '@al-haqq/shared';
import type { APIResponse, SurahSummary, Ayah } from '@al-haqq/shared';

export const quranRouter = Router();

/**
 * GET /api/v1/quran/surahs
 * List all surahs
 */
quranRouter.get('/surahs', asyncHandler(async (_req, res) => {
    const { data, error } = await supabase
        .from('surahs')
        .select('id, number, arabic_name, english_name, transliteration, revelation_type, total_ayahs')
        .order('number');

    if (error) throw createError(error.message, 500, 'DB_ERROR');

    const surahs: SurahSummary[] = data.map(s => ({
        id: s.id,
        number: s.number,
        arabicName: s.arabic_name,
        englishName: s.english_name,
        transliteration: s.transliteration,
        revelationType: s.revelation_type,
        totalAyahs: s.total_ayahs,
    }));

    const response: APIResponse<SurahSummary[]> = {
        success: true,
        data: surahs,
    };

    res.json(response);
}));

/**
 * GET /api/v1/quran/surahs/:number
 * Get surah with ayahs
 */
quranRouter.get('/surahs/:number', asyncHandler(async (req, res) => {
    const surahNumber = parseInt(req.params.number, 10);
    const lang = (req.query.lang as string) || 'en';

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        throw createError('Invalid surah number. Must be between 1 and 114.', 400, 'INVALID_SURAH');
    }

    // Get surah info
    const { data: surah, error: surahError } = await supabase
        .from('surahs')
        .select('*')
        .eq('number', surahNumber)
        .single();

    if (surahError || !surah) {
        throw createError('Surah not found', 404, 'NOT_FOUND');
    }

    // Get ayahs with translations
    const { data: ayahs, error: ayahError } = await supabase
        .from('ayahs')
        .select(`
      id,
      ayah_number,
      arabic_text,
      juz,
      hizb,
      sajda,
      quran_translations!inner (
        language_code,
        translator,
        translation_text
      )
    `)
        .eq('surah_id', surah.id)
        .eq('quran_translations.language_code', lang)
        .order('ayah_number');

    if (ayahError) throw createError(ayahError.message, 500, 'DB_ERROR');

    const formattedAyahs: Ayah[] = (ayahs || []).map(a => ({
        id: a.id,
        number: a.ayah_number,
        arabicText: a.arabic_text,
        juz: a.juz,
        hizb: a.hizb,
        sajda: a.sajda,
        translations: (a.quran_translations || []).map((t: any) => ({
            languageCode: t.language_code,
            translator: t.translator,
            text: t.translation_text,
        })),
    }));

    const response: APIResponse<{
        surah: SurahSummary;
        ayahs: Ayah[];
    }> = {
        success: true,
        data: {
            surah: {
                id: surah.id,
                number: surah.number,
                arabicName: surah.arabic_name,
                englishName: surah.english_name,
                transliteration: surah.transliteration,
                revelationType: surah.revelation_type,
                totalAyahs: surah.total_ayahs,
            },
            ayahs: formattedAyahs,
        },
    };

    res.json(response);
}));

/**
 * GET /api/v1/quran/ayahs/:surah/:ayah
 * Get specific ayah
 */
quranRouter.get('/ayahs/:surah/:ayah', asyncHandler(async (req, res) => {
    const surahNum = parseInt(req.params.surah, 10);
    const ayahNum = parseInt(req.params.ayah, 10);
    const lang = (req.query.lang as string) || 'en';

    // Validate
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
        throw createError('Invalid surah number', 400, 'INVALID_SURAH');
    }

    // Get surah first
    const { data: surah } = await supabase
        .from('surahs')
        .select('id, total_ayahs')
        .eq('number', surahNum)
        .single();

    if (!surah) throw createError('Surah not found', 404, 'NOT_FOUND');

    if (isNaN(ayahNum) || ayahNum < 1 || ayahNum > surah.total_ayahs) {
        throw createError(`Invalid ayah number. Surah ${surahNum} has ${surah.total_ayahs} ayahs.`, 400, 'INVALID_AYAH');
    }

    // Get ayah with translations
    const { data: ayah, error } = await supabase
        .from('ayahs')
        .select(`
      id,
      ayah_number,
      arabic_text,
      juz,
      hizb,
      sajda,
      quran_translations (
        language_code,
        translator,
        translation_text
      )
    `)
        .eq('surah_id', surah.id)
        .eq('ayah_number', ayahNum)
        .single();

    if (error || !ayah) throw createError('Ayah not found', 404, 'NOT_FOUND');

    const response: APIResponse<Ayah> = {
        success: true,
        data: {
            id: ayah.id,
            number: ayah.ayah_number,
            arabicText: ayah.arabic_text,
            juz: ayah.juz,
            hizb: ayah.hizb,
            sajda: ayah.sajda,
            translations: (ayah.quran_translations || []).map((t: any) => ({
                languageCode: t.language_code,
                translator: t.translator,
                text: t.translation_text,
            })),
        },
    };

    res.json(response);
}));

/**
 * GET /api/v1/quran/search
 * Search Quran
 */
quranRouter.get('/search', asyncHandler(async (req, res) => {
    const query = req.query.q as string;
    const lang = (req.query.lang as string) || 'en';
    const { page, limit } = validatePagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 20
    );

    if (!query || query.length < 2) {
        throw createError('Search query must be at least 2 characters', 400, 'INVALID_QUERY');
    }

    // Full-text search on translations
    const { data, error, count } = await supabase
        .from('quran_translations')
        .select(`
      id,
      translation_text,
      language_code,
      translator,
      ayahs!inner (
        id,
        ayah_number,
        arabic_text,
        surahs!inner (
          number,
          english_name
        )
      )
    `, { count: 'exact' })
        .eq('language_code', lang)
        .textSearch('translation_tsv', query)
        .range((page - 1) * limit, page * limit - 1);

    if (error) throw createError(error.message, 500, 'DB_ERROR');

    const results = (data || []).map((item: any) => ({
        reference: `${item.ayahs.surahs.number}:${item.ayahs.ayah_number}`,
        surahName: item.ayahs.surahs.english_name,
        ayahNumber: item.ayahs.ayah_number,
        arabicText: item.ayahs.arabic_text,
        translation: item.translation_text,
        translator: item.translator,
    }));

    const pagination = calculatePagination(count || 0, page, limit);

    res.json({
        success: true,
        data: results,
        pagination: {
            page,
            limit,
            total: count || 0,
            ...pagination,
        },
    });
}));
