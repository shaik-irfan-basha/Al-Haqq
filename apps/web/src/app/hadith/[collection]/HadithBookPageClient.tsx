'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ScrollText, Search, ChevronRight, Loader2, BookOpen } from 'lucide-react';
import React from 'react';
import { hadithCollections as localCollections } from '@/data/hadith-collections';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Chapter {
    id: number;
    chapter_number: number;
    arabic_title: string;
    english_title: string;
    hadith_count?: number;
}

interface BookInfo {
    id: string;
    arabicName: string;
    englishName: string;
    author: string;
    totalHadiths: number;
    description?: string;
}

export default function HadithBookPageClient({ params }: { params: { collection: string } }) {
    const localCollection = localCollections.find(c => c.id === params.collection);

    if (!localCollection) {
        notFound();
    }

    const [book, setBook] = React.useState<BookInfo>(localCollection);
    const [chapters, setChapters] = React.useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [usingDatabase, setUsingDatabase] = React.useState(false);

    // Fetch book and chapters from database
    React.useEffect(() => {
        async function fetchData() {
            if (!isSupabaseConfigured()) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch book info
                const { data: bookData } = await supabase
                    .from('hadith_books')
                    .select('*')
                    .eq('slug', params.collection)
                    .single();

                if (bookData) {
                    setBook({
                        id: bookData.slug,
                        arabicName: bookData.arabic_title,
                        englishName: bookData.english_title,
                        author: bookData.author_english || bookData.author_arabic || 'Unknown',
                        totalHadiths: bookData.total_hadiths || 0,
                        description: bookData.description || ''
                    });

                    // Fetch chapters
                    const { data: chaptersData } = await supabase
                        .from('hadith_chapters')
                        .select('*')
                        .eq('book_id', bookData.id)
                        .order('chapter_number');

                    if (chaptersData && chaptersData.length > 0) {
                        // Get hadith count per chapter
                        const chaptersWithCount = await Promise.all(
                            chaptersData.map(async (chapter) => {
                                const { count } = await supabase
                                    .from('hadiths')
                                    .select('*', { count: 'exact', head: true })
                                    .eq('chapter_id', chapter.id);

                                return {
                                    ...chapter,
                                    hadith_count: count || 0
                                };
                            })
                        );
                        setChapters(chaptersWithCount);
                        setUsingDatabase(true);
                    }
                }
            } catch (err) {
                console.log('Using sample data fallback');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [params.collection]);

    // Filter chapters based on search
    const filteredChapters = chapters.filter(ch =>
        !searchQuery ||
        ch.english_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.arabic_title?.includes(searchQuery) ||
        ch.chapter_number.toString() === searchQuery
    );

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <Link href="/hadith" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        All Collections
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] text-sm font-medium mb-4">
                            <ScrollText className="w-4 h-4" />
                            Hadith Collection
                            {usingDatabase && (
                                <span className="w-2 h-2 rounded-full bg-green-500 ml-2" title="From database" />
                            )}
                        </div>

                        {/* Arabic Name - Primary */}
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            {book.arabicName}
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            {book.englishName}
                        </h2>
                        <p className="text-[var(--color-text-muted)]">
                            {book.author} · {book.totalHadiths.toLocaleString()} Hadiths · {chapters.length} Chapters
                        </p>
                        {book.description && (
                            <p className="text-sm text-[var(--color-text-muted)] max-w-xl mx-auto mt-4">
                                {book.description}
                            </p>
                        )}
                    </motion.div>

                    {/* Search */}
                    {chapters.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="max-w-xl mx-auto mt-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search chapters..."
                                    className="input-premium pl-12"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin mb-4" />
                    <p className="text-[var(--color-text-muted)]">Loading chapters...</p>
                </div>
            )}


            {/* Chapters List */}
            {!isLoading && (
                <section className="px-6">
                    <div className="max-w-4xl mx-auto">
                        {filteredChapters.length > 0 ? (
                            <div className="space-y-3">
                                {filteredChapters.map((chapter, index) => (
                                    <motion.div
                                        key={chapter.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.2) }}
                                    >
                                        <Link
                                            href={`/hadith/${params.collection}/${chapter.chapter_number}`}
                                            className="group block"
                                        >
                                            <div className="card-premium p-5 flex items-center gap-4 group-hover:border-[var(--color-primary)]/50 transition-colors">
                                                {/* Chapter Number */}
                                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]">
                                                        {chapter.chapter_number}
                                                    </span>
                                                </div>

                                                {/* Chapter Info */}
                                                <div className="flex-1 min-w-0">
                                                    {chapter.arabic_title && (
                                                        <p className="font-arabic text-lg text-[var(--color-text)] mb-1 truncate" dir="rtl">
                                                            {chapter.arabic_title}
                                                        </p>
                                                    )}
                                                    <p className="text-[var(--color-text-secondary)] truncate">
                                                        {chapter.english_title || `Chapter ${chapter.chapter_number}`}
                                                    </p>
                                                </div>

                                                {/* Hadith Count */}
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm text-[var(--color-text-muted)]">
                                                        {chapter.hadith_count || 0} hadiths
                                                    </p>
                                                </div>

                                                <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        ) : chapters.length === 0 ? (
                            <div className="text-center py-16 card-premium bg-[var(--color-bg-warm)]/30 border-[var(--color-border)]">
                                <BookOpen className="w-16 h-16 text-[var(--color-text-muted)]/50 mx-auto mb-6" />
                                <h3 className="font-serif text-xl text-[var(--color-text)] mb-3">
                                    Browse Collection
                                </h3>
                                <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                                    This collection might not have traditional chapters or is waiting to be synced. You can still browse all available hadiths.
                                </p>
                                <Link
                                    href={`/hadith/${params.collection}/1`}
                                    className="btn-primary"
                                >
                                    Start Reading
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-[var(--color-text-muted)]">
                                    No chapters match your search
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
