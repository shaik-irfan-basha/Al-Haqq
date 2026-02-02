/**
 * API Client for Al-Haqq
 */

const API_URL = process.env.API_URL || 'http://localhost:4000';

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
    }

    return data;
}

// Quran API
export const quranAPI = {
    getSurahs: () => fetchAPI<any>('/api/v1/quran/surahs'),
    getSurah: (number: number, lang = 'en') =>
        fetchAPI<any>(`/api/v1/quran/surahs/${number}?lang=${lang}`),
    getAyah: (surah: number, ayah: number, lang = 'en') =>
        fetchAPI<any>(`/api/v1/quran/ayahs/${surah}/${ayah}?lang=${lang}`),
    search: (query: string, lang = 'en', page = 1) =>
        fetchAPI<any>(`/api/v1/quran/search?q=${encodeURIComponent(query)}&lang=${lang}&page=${page}`),
};

// Hadith API
export const hadithAPI = {
    getBooks: () => fetchAPI<any>('/api/v1/hadith/books'),
    getBook: (slug: string) => fetchAPI<any>(`/api/v1/hadith/books/${slug}`),
    getHadith: (book: string, number: number) =>
        fetchAPI<any>(`/api/v1/hadith/${book}/${number}`),
    getHadiths: (book: string, page = 1, limit = 20) =>
        fetchAPI<any>(`/api/v1/hadith/${book}?page=${page}&limit=${limit}`),
    search: (query: string, book?: string, page = 1) => {
        let url = `/api/v1/hadith/search?q=${encodeURIComponent(query)}&page=${page}`;
        if (book) url += `&book=${book}`;
        return fetchAPI<any>(url);
    },
};

// Search API
export const searchAPI = {
    search: (query: string, type: 'all' | 'quran' | 'hadith' = 'all', lang = 'en') =>
        fetchAPI<any>(`/api/v1/search?q=${encodeURIComponent(query)}&type=${type}&lang=${lang}`),
};

// AI Basira API
export const basiraAPI = {
    ask: (question: string, conversationId?: string) =>
        fetchAPI<any>('/api/v1/basira/ask', {
            method: 'POST',
            body: { question, conversationId },
        }),
    getConversation: (id: string) =>
        fetchAPI<any>(`/api/v1/basira/conversations/${id}`),
};

export default {
    quran: quranAPI,
    hadith: hadithAPI,
    search: searchAPI,
    basira: basiraAPI,
};
