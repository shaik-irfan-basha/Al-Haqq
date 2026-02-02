/**
 * Hadith API Routes
 */

import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { asyncHandler, createError } from '../middleware/error.js';
import { validatePagination, calculatePagination } from '@al-haqq/shared';
import type { APIResponse, HadithBookSummary, Hadith } from '@al-haqq/shared';

export const hadithRouter = Router();

/**
 * GET /api/v1/hadith/books
 * List all hadith collections
 */
hadithRouter.get('/books', asyncHandler(async (_req, res) => {
    const { data, error } = await supabase
        .from('hadith_books')
        .select('id, slug, arabic_title, english_title, author_arabic, author_english, total_hadiths')
        .order('id');

    if (error) throw createError(error.message, 500, 'DB_ERROR');

    const books: HadithBookSummary[] = data.map(b => ({
        id: b.id,
        slug: b.slug,
        arabicTitle: b.arabic_title,
        englishTitle: b.english_title,
        authorArabic: b.author_arabic,
        authorEnglish: b.author_english,
        totalHadiths: b.total_hadiths,
    }));

    const response: APIResponse<HadithBookSummary[]> = {
        success: true,
        data: books,
    };

    res.json(response);
}));

/**
 * GET /api/v1/hadith/books/:slug
 * Get book details with chapters
 */
hadithRouter.get('/books/:slug', asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const { data: book, error: bookError } = await supabase
        .from('hadith_books')
        .select('*')
        .eq('slug', slug)
        .single();

    if (bookError || !book) {
        throw createError('Hadith collection not found', 404, 'NOT_FOUND');
    }

    // Get chapters
    const { data: chapters } = await supabase
        .from('hadith_chapters')
        .select('id, chapter_number, arabic_title, english_title')
        .eq('book_id', book.id)
        .order('chapter_number');

    const response: APIResponse<{
        book: HadithBookSummary;
        chapters: Array<{
            id: number;
            number: number;
            arabicTitle: string | null;
            englishTitle: string | null;
        }>;
    }> = {
        success: true,
        data: {
            book: {
                id: book.id,
                slug: book.slug,
                arabicTitle: book.arabic_title,
                englishTitle: book.english_title,
                authorArabic: book.author_arabic,
                authorEnglish: book.author_english,
                totalHadiths: book.total_hadiths,
            },
            chapters: (chapters || []).map(c => ({
                id: c.id,
                number: c.chapter_number,
                arabicTitle: c.arabic_title,
                englishTitle: c.english_title,
            })),
        },
    };

    res.json(response);
}));

/**
 * GET /api/v1/hadith/:book/:number
 * Get specific hadith
 */
hadithRouter.get('/:book/:number', asyncHandler(async (req, res) => {
    const { book: slug, number } = req.params;
    const hadithNum = parseInt(number, 10);

    if (isNaN(hadithNum) || hadithNum < 1) {
        throw createError('Invalid hadith number', 400, 'INVALID_NUMBER');
    }

    // Get book
    const { data: book } = await supabase
        .from('hadith_books')
        .select('id, slug, english_title')
        .eq('slug', slug)
        .single();

    if (!book) throw createError('Hadith collection not found', 404, 'NOT_FOUND');

    // Get hadith
    const { data: hadith, error } = await supabase
        .from('hadiths')
        .select(`
      id,
      hadith_number,
      arabic_text,
      english_narrator,
      english_text,
      grade,
      reference,
      hadith_chapters (
        id,
        chapter_number,
        arabic_title,
        english_title
      )
    `)
        .eq('book_id', book.id)
        .eq('hadith_number', hadithNum)
        .single();

    if (error || !hadith) {
        throw createError('Hadith not found', 404, 'NOT_FOUND');
    }

    const response: APIResponse<Hadith> = {
        success: true,
        data: {
            id: hadith.id,
            bookSlug: book.slug,
            number: hadith.hadith_number,
            arabicText: hadith.arabic_text,
            englishNarrator: hadith.english_narrator,
            englishText: hadith.english_text,
            grade: hadith.grade,
            reference: hadith.reference,
            chapter: hadith.hadith_chapters ? {
                id: hadith.hadith_chapters.id,
                number: hadith.hadith_chapters.chapter_number,
                arabicTitle: hadith.hadith_chapters.arabic_title,
                englishTitle: hadith.hadith_chapters.english_title,
            } : undefined,
        },
    };

    res.json(response);
}));

/**
 * GET /api/v1/hadith/:book
 * List hadiths in a book with pagination
 */
hadithRouter.get('/:book', asyncHandler(async (req, res) => {
    const { book: slug } = req.params;
    const { page, limit } = validatePagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 20
    );

    // Get book
    const { data: book } = await supabase
        .from('hadith_books')
        .select('id')
        .eq('slug', slug)
        .single();

    if (!book) throw createError('Hadith collection not found', 404, 'NOT_FOUND');

    // Get hadiths with pagination
    const { data, error, count } = await supabase
        .from('hadiths')
        .select('id, hadith_number, arabic_text, english_narrator, english_text, grade', { count: 'exact' })
        .eq('book_id', book.id)
        .order('hadith_number')
        .range((page - 1) * limit, page * limit - 1);

    if (error) throw createError(error.message, 500, 'DB_ERROR');

    const pagination = calculatePagination(count || 0, page, limit);

    res.json({
        success: true,
        data: (data || []).map(h => ({
            id: h.id,
            number: h.hadith_number,
            arabicText: h.arabic_text,
            englishNarrator: h.english_narrator,
            englishText: h.english_text,
            grade: h.grade,
        })),
        pagination: {
            page,
            limit,
            total: count || 0,
            ...pagination,
        },
    });
}));

/**
 * GET /api/v1/hadith/search
 * Search hadiths
 */
hadithRouter.get('/search', asyncHandler(async (req, res) => {
    const query = req.query.q as string;
    const bookSlug = req.query.book as string;
    const { page, limit } = validatePagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 20
    );

    if (!query || query.length < 2) {
        throw createError('Search query must be at least 2 characters', 400, 'INVALID_QUERY');
    }

    let queryBuilder = supabase
        .from('hadiths')
        .select(`
      id,
      hadith_number,
      arabic_text,
      english_text,
      english_narrator,
      grade,
      hadith_books!inner (
        slug,
        english_title
      )
    `, { count: 'exact' })
        .textSearch('english_tsv', query);

    // Filter by book if specified
    if (bookSlug) {
        queryBuilder = queryBuilder.eq('hadith_books.slug', bookSlug);
    }

    const { data, error, count } = await queryBuilder
        .range((page - 1) * limit, page * limit - 1);

    if (error) throw createError(error.message, 500, 'DB_ERROR');

    const results = (data || []).map((h: any) => ({
        reference: `${h.hadith_books.slug}:${h.hadith_number}`,
        bookName: h.hadith_books.english_title,
        number: h.hadith_number,
        arabicText: h.arabic_text,
        englishText: h.english_text,
        narrator: h.english_narrator,
        grade: h.grade,
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
