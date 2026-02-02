/**
 * Shared Utilities for Al-Haqq Platform
 */

import { RTL_LANGUAGES } from './constants.js';

/**
 * Check if a language is RTL (Right-to-Left)
 */
export function isRTL(languageCode: string): boolean {
    return RTL_LANGUAGES.includes(languageCode as any) || languageCode === 'ar';
}

/**
 * Format Quran reference (e.g., "2:255" for Ayatul Kursi)
 */
export function formatQuranRef(surah: number, ayah: number): string {
    return `${surah}:${ayah}`;
}

/**
 * Parse Quran reference string to numbers
 */
export function parseQuranRef(ref: string): { surah: number; ayah: number } | null {
    const match = ref.match(/^(\d+):(\d+)$/);
    if (!match) return null;
    return {
        surah: parseInt(match[1], 10),
        ayah: parseInt(match[2], 10),
    };
}

/**
 * Format Hadith reference (e.g., "bukhari:1" for first hadith in Bukhari)
 */
export function formatHadithRef(book: string, number: number): string {
    return `${book}:${number}`;
}

/**
 * Parse Hadith reference string
 */
export function parseHadithRef(ref: string): { book: string; number: number } | null {
    const match = ref.match(/^([a-z_]+):(\d+)$/i);
    if (!match) return null;
    return {
        book: match[1].toLowerCase(),
        number: parseInt(match[2], 10),
    };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Remove diacritics from Arabic text (for search normalization)
 */
export function removeArabicDiacritics(text: string): string {
    // Arabic diacritical marks range
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

/**
 * Normalize Arabic text for search
 */
export function normalizeArabic(text: string): string {
    let normalized = removeArabicDiacritics(text);

    // Normalize hamza variants
    normalized = normalized.replace(/[أإآ]/g, 'ا');
    normalized = normalized.replace(/ى/g, 'ي');
    normalized = normalized.replace(/ة/g, 'ه');

    return normalized;
}

/**
 * Calculate pagination info
 */
export function calculatePagination(
    total: number,
    page: number,
    limit: number
): {
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    offset: number;
} {
    const totalPages = Math.ceil(total / limit);
    return {
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        offset: (page - 1) * limit,
    };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
    page?: number,
    limit?: number,
    maxLimit = 100
): { page: number; limit: number } {
    return {
        page: Math.max(1, page || 1),
        limit: Math.min(maxLimit, Math.max(1, limit || 20)),
    };
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(
    json: string,
    fallback: T
): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

/**
 * Generate a simple hash for caching
 */
export function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}
