'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, BookOpen, ScrollText, Moon, Filter, X, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

type TabType = 'quran' | 'hadith';

interface QuranResult {
    surah_number: number;
    surah_name: string;
    ayah_number: number;
    arabic_text: string;
    translation: string;
    translator: string;
}

interface HadithResult {
    book_slug: string;
    book_name: string;
    hadith_number: number;
    chapter_number: number;
    arabic_text: string;
    english_text: string;
    grade: string;
}

export default function SearchPage() {
    const [query, setQuery] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<TabType>('quran');
    const [isSearching, setIsSearching] = React.useState(false);
    const [quranResults, setQuranResults] = React.useState<QuranResult[]>([]);
    const [hadithResults, setHadithResults] = React.useState<HadithResult[]>([]);
    const [hasSearched, setHasSearched] = React.useState(false);

    // Debounced search
    React.useEffect(() => {
        if (!query.trim()) {
            setQuranResults([]);
            setHadithResults([]);
            setHasSearched(false);
            return;
        }

        const timer = setTimeout(() => {
            performSearch();
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, activeTab]);

    const performSearch = async () => {
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);

        if (!isSupabaseConfigured()) {
            // Show sample results when no database
            if (activeTab === 'quran') {
                setQuranResults([{
                    surah_number: 1,
                    surah_name: 'Al-Fatiha',
                    ayah_number: 1,
                    arabic_text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                    translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
                    translator: 'Sample'
                }]);
            } else {
                setHadithResults([{
                    book_slug: 'bukhari',
                    book_name: 'Sahih al-Bukhari',
                    hadith_number: 1,
                    chapter_number: 1,
                    arabic_text: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                    english_text: 'The reward of deeds depends upon the intentions.',
                    grade: 'Sahih'
                }]);
            }
            setIsSearching(false);
            return;
        }

        try {
            if (activeTab === 'quran') {
                // Search Quran
                const { data: ayahData } = await supabase
                    .from('ayahs')
                    .select(`
                        id,
                        ayah_number,
                        arabic_text,
                        surah:surahs (number, english_name)
                    `)
                    .or(`arabic_text.ilike.%${query}%`)
                    .limit(20);

                // Also search translations
                const { data: translationData } = await supabase
                    .from('quran_translations')
                    .select(`
                        translation_text,
                        translator,
                        ayah:ayahs (
                            ayah_number,
                            arabic_text,
                            surah:surahs (number, english_name)
                        )
                    `)
                    .ilike('translation_text', `%${query}%`)
                    .limit(20);

                const results: QuranResult[] = [];

                // Add ayah matches
                ayahData?.forEach((item: any) => {
                    results.push({
                        surah_number: item.surah?.number || 0,
                        surah_name: item.surah?.english_name || '',
                        ayah_number: item.ayah_number,
                        arabic_text: item.arabic_text,
                        translation: '',
                        translator: ''
                    });
                });

                // Add translation matches
                translationData?.forEach((item: any) => {
                    if (item.ayah && !results.find(r =>
                        r.surah_number === item.ayah.surah?.number &&
                        r.ayah_number === item.ayah.ayah_number
                    )) {
                        results.push({
                            surah_number: item.ayah.surah?.number || 0,
                            surah_name: item.ayah.surah?.english_name || '',
                            ayah_number: item.ayah.ayah_number,
                            arabic_text: item.ayah.arabic_text,
                            translation: item.translation_text,
                            translator: item.translator
                        });
                    }
                });

                setQuranResults(results.slice(0, 30));
            } else {
                // Search Hadith
                const { data } = await supabase
                    .from('hadiths')
                    .select(`
                        id,
                        hadith_number,
                        arabic_text,
                        english_text,
                        grade,
                        chapter:hadith_chapters (chapter_number),
                        book:hadith_books (slug, english_title)
                    `)
                    .or(`arabic_text.ilike.%${query}%,english_text.ilike.%${query}%`)
                    .limit(30);

                const results: HadithResult[] = data?.map((item: any) => ({
                    book_slug: item.book?.slug || '',
                    book_name: item.book?.english_title || '',
                    hadith_number: item.hadith_number,
                    chapter_number: item.chapter?.chapter_number || 0,
                    arabic_text: item.arabic_text,
                    english_text: item.english_text,
                    grade: item.grade
                })) || [];

                setHadithResults(results);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const highlightText = (text: string, query: string): React.ReactNode => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={i} className="bg-[var(--color-accent)]/30 text-[var(--color-text)] rounded px-0.5">{part}</mark>
            ) : part
        );
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-arabic text-4xl md:text-5xl text-[var(--color-text)] mb-3" dir="rtl">
                            البحث
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            Search
                        </h2>
                        <p className="text-[var(--color-text-muted)]">
                            Search the Quran and Hadith collections
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Bar */}
            <section className="px-6 mb-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            {isSearching ? (
                                <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin" />
                            ) : (
                                <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Arabic text or translations..."
                            className="input-premium pl-14 pr-12 text-lg"
                            dir="auto"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute inset-y-0 right-4 flex items-center"
                            >
                                <X className="w-5 h-5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]" />
                            </button>
                        )}
                    </motion.div>

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex justify-center mt-6"
                    >
                        <div className="inline-flex p-1 rounded-xl bg-[var(--color-bg-warm)]">
                            <button
                                onClick={() => setActiveTab('quran')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'quran'
                                    ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                    }`}
                            >
                                <BookOpen className="w-4 h-4" />
                                Quran
                            </button>
                            <button
                                onClick={() => setActiveTab('hadith')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'hadith'
                                    ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text)]'
                                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                                    }`}
                            >
                                <ScrollText className="w-4 h-4" />
                                Hadith
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Results */}
            <section className="px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Empty State */}
                    {!hasSearched && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-[var(--color-text-muted)]" />
                            </div>
                            <p className="text-[var(--color-text-muted)]">
                                Type to search the {activeTab === 'quran' ? 'Quran' : 'Hadith'}
                            </p>
                        </div>
                    )}

                    {/* Quran Results */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'quran' && hasSearched && (
                            <motion.div
                                key="quran"
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {quranResults.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {quranResults.length} results found
                                        </p>
                                        {quranResults.map((result, index) => (
                                            <motion.div
                                                key={`${result.surah_number}-${result.ayah_number}`}
                                                layout
                                            >
                                                <Link
                                                    href={`/quran/${result.surah_number}#ayah-${result.ayah_number}`}
                                                    className="block"
                                                >
                                                    <div className="card-premium p-5 hover:shadow-lg transition-all">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="badge badge-primary">
                                                                {result.surah_name} {result.surah_number}:{result.ayah_number}
                                                            </span>
                                                        </div>
                                                        <p className="font-arabic text-xl text-[var(--color-text)] text-right mb-3 leading-relaxed" dir="rtl">
                                                            {highlightText(result.arabic_text, query)}
                                                        </p>
                                                        {result.translation && (
                                                            <p className="text-[var(--color-text-secondary)] text-sm">
                                                                {highlightText(result.translation, query)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-[var(--color-text-muted)]">
                                            No Quran results found for &quot;{query}&quot;
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Hadith Results */}
                        {activeTab === 'hadith' && hasSearched && (
                            <motion.div
                                key="hadith"
                                initial={false}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {hadithResults.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {hadithResults.length} results found
                                        </p>
                                        {hadithResults.map((result, index) => (
                                            <motion.div
                                                key={`${result.book_slug}-${result.hadith_number}`}
                                                layout
                                            >
                                                <Link
                                                    href={`/hadith/${result.book_slug}/${result.chapter_number}`}
                                                    className="block"
                                                >
                                                    <div className="card-premium p-5 hover:shadow-lg transition-all">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="badge badge-gold">
                                                                {result.book_name}
                                                            </span>
                                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                                Hadith #{result.hadith_number}
                                                            </span>
                                                            {result.grade && (
                                                                <span className="badge badge-success">
                                                                    {result.grade}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="font-arabic text-xl text-[var(--color-text)] text-right mb-3 leading-relaxed" dir="rtl">
                                                            {highlightText(result.arabic_text.substring(0, 200) + '...', query)}
                                                        </p>
                                                        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">
                                                            {highlightText(result.english_text.substring(0, 200) + '...', query)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <p className="text-[var(--color-text-muted)]">
                                            No Hadith results found for &quot;{query}&quot;
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
