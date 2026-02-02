/**
 * Al-Haqq Database Types
 * Auto-generated types for Supabase tables
 */

export interface Database {
    public: {
        Tables: {
            // ==================
            // QURAN TABLES
            // ==================
            surahs: {
                Row: {
                    id: number;
                    number: number;
                    arabic_name: string;
                    english_name: string;
                    transliteration: string | null;
                    revelation_type: 'Meccan' | 'Medinan';
                    total_ayahs: number;
                    juz_start: number | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['surahs']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['surahs']['Insert']>;
            };

            ayahs: {
                Row: {
                    id: number;
                    surah_id: number;
                    ayah_number: number;
                    arabic_text: string;
                    juz: number | null;
                    hizb: number | null;
                    manzil: number | null;
                    ruku: number | null;
                    sajda: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ayahs']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['ayahs']['Insert']>;
            };

            quran_translations: {
                Row: {
                    id: number;
                    ayah_id: number;
                    language_code: string;
                    translator: string | null;
                    translation_text: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['quran_translations']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['quran_translations']['Insert']>;
            };

            quran_words: {
                Row: {
                    id: number;
                    ayah_id: number;
                    position: number;
                    arabic_word: string;
                    transliteration: string | null;
                    translation: string | null;
                    root: string | null;
                };
                Insert: Omit<Database['public']['Tables']['quran_words']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['quran_words']['Insert']>;
            };

            // ==================
            // HADITH TABLES
            // ==================
            hadith_books: {
                Row: {
                    id: number;
                    slug: string;
                    arabic_title: string;
                    english_title: string;
                    author_arabic: string | null;
                    author_english: string | null;
                    total_hadiths: number | null;
                    description: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['hadith_books']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['hadith_books']['Insert']>;
            };

            hadith_chapters: {
                Row: {
                    id: number;
                    book_id: number;
                    chapter_number: number;
                    arabic_title: string | null;
                    english_title: string | null;
                };
                Insert: Omit<Database['public']['Tables']['hadith_chapters']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['hadith_chapters']['Insert']>;
            };

            hadiths: {
                Row: {
                    id: number;
                    book_id: number;
                    chapter_id: number | null;
                    hadith_number: number;
                    arabic_text: string;
                    english_narrator: string | null;
                    english_text: string;
                    grade: string | null;
                    reference: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['hadiths']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['hadiths']['Insert']>;
            };

            // ==================
            // VECTOR EMBEDDINGS
            // ==================
            content_embeddings: {
                Row: {
                    id: number;
                    content_type: 'ayah' | 'hadith';
                    content_id: number;
                    language: string;
                    embedding: number[];
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['content_embeddings']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['content_embeddings']['Insert']>;
            };

            // ==================
            // TAFSIR
            // ==================
            tafsir_sources: {
                Row: {
                    id: number;
                    name: string;
                    author: string | null;
                    language_code: string;
                };
                Insert: Omit<Database['public']['Tables']['tafsir_sources']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['tafsir_sources']['Insert']>;
            };

            tafsir_entries: {
                Row: {
                    id: number;
                    source_id: number;
                    ayah_id: number;
                    text: string;
                };
                Insert: Omit<Database['public']['Tables']['tafsir_entries']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['tafsir_entries']['Insert']>;
            };

            // ==================
            // DUAS
            // ==================
            duas: {
                Row: {
                    id: number;
                    arabic_text: string;
                    transliteration: string | null;
                    translation: string;
                    category: string | null;
                    source: string | null;
                    audio_url: string | null;
                };
                Insert: Omit<Database['public']['Tables']['duas']['Row'], 'id'>;
                Update: Partial<Database['public']['Tables']['duas']['Insert']>;
            };

            // ==================
            // AI CONVERSATIONS
            // ==================
            ai_conversations: {
                Row: {
                    id: string;
                    user_id: string | null;
                    title: string | null;
                    started_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'started_at'>;
                Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>;
            };

            ai_messages: {
                Row: {
                    id: number;
                    conversation_id: string;
                    role: 'user' | 'assistant';
                    content: string;
                    sources: Record<string, unknown> | null;
                    tokens_used: number | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['ai_messages']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['ai_messages']['Insert']>;
            };
        };
    };
}

// Convenience types
export type Surah = Database['public']['Tables']['surahs']['Row'];
export type Ayah = Database['public']['Tables']['ayahs']['Row'];
export type QuranTranslation = Database['public']['Tables']['quran_translations']['Row'];
export type QuranWord = Database['public']['Tables']['quran_words']['Row'];
export type HadithBook = Database['public']['Tables']['hadith_books']['Row'];
export type HadithChapter = Database['public']['Tables']['hadith_chapters']['Row'];
export type Hadith = Database['public']['Tables']['hadiths']['Row'];
export type Dua = Database['public']['Tables']['duas']['Row'];
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];
export type AIMessage = Database['public']['Tables']['ai_messages']['Row'];
