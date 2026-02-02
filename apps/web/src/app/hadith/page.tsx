'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ScrollText, BookOpen, Star, Loader2, ChevronRight } from 'lucide-react';
import { hadithCollections as localCollections } from '@/data/hadith-collections';
import { supabase, isSupabaseConfigured, type HadithBook } from '@/lib/supabase';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// Format database book to local format
function formatBook(book: HadithBook) {
    return {
        id: book.slug,
        arabicName: book.arabic_title,
        englishName: book.english_title,
        author: book.author_english || book.author_arabic || 'Unknown',
        totalHadiths: book.total_hadiths || 0,
        description: book.description || ''
    };
}

// Major books slugs (Kutub al-Sittah)
const majorBookSlugs = ['bukhari', 'muslim', 'nasai', 'abudawud', 'tirmidhi', 'ibnmajah'];

export default function HadithPage() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [collections, setCollections] = React.useState(localCollections);
    const [isLoading, setIsLoading] = React.useState(true);
    const [usingDatabase, setUsingDatabase] = React.useState(false);

    // Fetch hadith books from database
    React.useEffect(() => {
        async function fetchBooks() {
            if (!isSupabaseConfigured()) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('hadith_books')
                    .select('*')
                    .order('id');

                if (error) throw error;

                if (data && data.length > 0) {
                    setCollections(data.map(formatBook));
                    setUsingDatabase(true);
                }
            } catch (err) {
                console.log('Using local data fallback');
            } finally {
                setIsLoading(false);
            }
        }

        fetchBooks();
    }, []);

    // Filter collections
    const majorBooks = collections.filter(c => majorBookSlugs.includes(c.id));
    const otherCollections = collections.filter(c => !majorBookSlugs.includes(c.id));

    const filteredMajor = majorBooks.filter(c =>
        c.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.arabicName.includes(searchQuery) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredOther = otherCollections.filter(c =>
        c.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.arabicName.includes(searchQuery) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalHadiths = collections.reduce((sum, c) => sum + c.totalHadiths, 0);

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Hero Header */}
            <section className="px-6 mb-12">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Arabic Title First */}
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            الأحاديث النبوية
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            Prophetic Traditions
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl mx-auto mb-8">
                            Authentic sayings and actions of the Prophet Muhammad ﷺ from the most trusted sources
                        </p>

                        {/* Database indicator */}
                        {usingDatabase && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Connected to database
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="flex items-center justify-center gap-8 mb-10">
                            <div className="text-center">
                                <p className="text-3xl font-serif text-[var(--color-text)]">{collections.length}</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Collections</p>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]" />
                            <div className="text-center">
                                <p className="text-3xl font-serif text-[var(--color-text)]">
                                    {totalHadiths.toLocaleString()}
                                </p>
                                <p className="text-sm text-[var(--color-text-muted)]">Total Hadiths</p>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]" />
                            <div className="text-center">
                                <p className="text-3xl font-serif text-[var(--color-text)]">6</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Kutub al-Sittah</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search collections by name or author..."
                                className="input-premium pl-14 pr-12 text-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin mb-4" />
                    <p className="text-[var(--color-text-muted)]">Loading collections...</p>
                </div>
            )}

            {/* Major Books (Kutub al-Sittah) */}
            {!isLoading && filteredMajor.length > 0 && (
                <section className="px-6 mb-16">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <Star className="w-5 h-5 text-[var(--color-accent)]" />
                            <h2 className="font-serif text-2xl text-[var(--color-text)]">The Six Major Books</h2>
                            <span className="text-sm text-[var(--color-text-muted)] font-arabic">الكتب الستة</span>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {filteredMajor.map((collection) => (
                                <motion.div key={collection.id} variants={item}>
                                    <Link href={`/hadith/${collection.id}`} className="group block h-full">
                                        <div className="card-premium p-6 h-full flex flex-col group-hover:shadow-lg transition-all duration-300 border-l-4 border-l-[var(--color-accent)]">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                                                    <ScrollText className="w-6 h-6 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]" />
                                                </div>
                                                <span className="font-arabic text-xl text-[var(--color-text)]">{collection.arabicName}</span>
                                            </div>
                                            <h3 className="font-serif text-lg text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
                                                {collection.englishName}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-muted)] mb-3">{collection.author}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-border)]">
                                                <p className="text-xs text-[var(--color-text-muted)]">
                                                    {collection.totalHadiths.toLocaleString()} Hadiths
                                                </p>
                                                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Other Collections */}
            {!isLoading && filteredOther.length > 0 && (
                <section className="px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                            <h2 className="font-serif text-2xl text-[var(--color-text)]">Other Authentic Collections</h2>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {filteredOther.map((collection) => (
                                <motion.div key={collection.id} variants={item}>
                                    <Link href={`/hadith/${collection.id}`} className="group block h-full">
                                        <div className="card-premium p-5 h-full flex flex-col group-hover:shadow-lg transition-all duration-300">
                                            <div className="flex justify-between items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-warm)] flex items-center justify-center flex-shrink-0">
                                                    <ScrollText className="w-5 h-5 text-[var(--color-text-muted)]" />
                                                </div>
                                                <span className="font-arabic text-lg text-[var(--color-text)] flex-shrink-0 text-right leading-none pt-1">
                                                    {collection.arabicName}
                                                </span>
                                            </div>

                                            <div className="mt-auto">
                                                <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-tight mb-1">
                                                    {collection.englishName}
                                                </h3>
                                                <p className="text-sm text-[var(--color-text-muted)]">
                                                    {collection.totalHadiths.toLocaleString()} Hadiths
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* No Results */}
            {!isLoading && filteredMajor.length === 0 && filteredOther.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 px-6"
                >
                    <div className="w-16 h-16 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-[var(--color-text-muted)]" />
                    </div>
                    <h3 className="font-serif text-xl text-[var(--color-text)] mb-2">No collections found</h3>
                    <p className="text-[var(--color-text-muted)]">
                        Try a different search term
                    </p>
                </motion.div>
            )}
        </div>
    );
}
