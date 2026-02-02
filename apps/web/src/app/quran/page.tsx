'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, BookOpen, AlertCircle } from 'lucide-react';
import { surahs as localSurahs } from '@/data/surahs';
import { supabase, isSupabaseConfigured, type Surah } from '@/lib/supabase';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.02 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// Convert DB format to display format
function formatSurah(s: Surah) {
    return {
        number: s.number,
        arabicName: s.arabic_name,
        englishName: s.english_name,
        transliteration: s.transliteration,
        revelationType: s.revelation_type,
        totalAyahs: s.total_ayahs,
    };
}

export default function QuranPage() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filter, setFilter] = React.useState<'all' | 'meccan' | 'medinan'>('all');
    const [surahs, setSurahs] = React.useState(localSurahs);
    const [isLoading, setIsLoading] = React.useState(true);
    const [usingDatabase, setUsingDatabase] = React.useState(false);

    // Fetch surahs from database
    React.useEffect(() => {
        async function fetchSurahs() {
            if (!isSupabaseConfigured()) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('surahs')
                    .select('*')
                    .order('number');

                if (error) throw error;

                if (data && data.length > 0) {
                    setSurahs(data.map(formatSurah));
                    setUsingDatabase(true);
                }
            } catch (err) {
                console.log('Using local data fallback');
            } finally {
                setIsLoading(false);
            }
        }

        fetchSurahs();
    }, []);

    const filteredSurahs = surahs.filter((surah) => {
        const matchesSearch = searchQuery === '' ||
            surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.arabicName.includes(searchQuery) ||
            surah.number.toString() === searchQuery;

        const matchesFilter = filter === 'all' ||
            (filter === 'meccan' && surah.revelationType === 'Meccan') ||
            (filter === 'medinan' && surah.revelationType === 'Medinan');

        return matchesSearch && matchesFilter;
    });

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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-6">
                            <BookOpen className="w-4 h-4" />
                            The Noble Qur&apos;an
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">القرآن الكريم</h1>
                        <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto mb-8">
                            The complete Qur&apos;an with 114 Surahs, multiple translations, and audio recitation.
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
                                <p className="text-3xl font-serif text-[var(--color-text)]">114</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Surahs</p>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]" />
                            <div className="text-center">
                                <p className="text-3xl font-serif text-[var(--color-text)]">6,236</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Ayahs</p>
                            </div>
                            <div className="h-8 w-px bg-[var(--color-border)]" />
                            <div className="text-center">
                                <p className="text-3xl font-serif text-[var(--color-text)]">30</p>
                                <p className="text-sm text-[var(--color-text-muted)]">Juz</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search & Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search className="w-5 h-5 text-[var(--color-text-muted)]" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or number..."
                                    className="input-premium pl-14 pr-12 text-lg"
                                />
                            </div>
                            <div className="flex gap-1 p-1 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl">
                                {(['all', 'meccan', 'medinan'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                            }`}
                                    >
                                        {f === 'all' ? 'All' : f === 'meccan' ? 'Meccan' : 'Medinan'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* Surah Grid */}
            {!isLoading && (
                <section className="px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {filteredSurahs.map((surah) => (
                                <motion.div key={surah.number} variants={item}>
                                    <Link href={`/quran/${surah.number}`} className="group block">
                                        <div className="card-premium p-5 flex items-center gap-4 group-hover:shadow-lg transition-all duration-300">
                                            {/* Number */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${surah.revelationType === 'Meccan'
                                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                : 'bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]'
                                                }`}>
                                                <span className="font-medium">{surah.number}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                                                    {surah.transliteration}
                                                </h3>
                                                <p className="text-sm text-[var(--color-text-muted)] truncate">
                                                    {surah.englishName} · {surah.totalAyahs} Ayahs
                                                </p>
                                            </div>

                                            {/* Arabic */}
                                            <span className="font-arabic text-xl text-[var(--color-text)] flex-shrink-0">
                                                {surah.arabicName}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* No Results */}
                        {filteredSurahs.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-[var(--color-text-muted)]" />
                                </div>
                                <h3 className="font-serif text-xl text-[var(--color-text)] mb-2">No Surahs found</h3>
                                <p className="text-[var(--color-text-muted)]">
                                    Try a different search term or filter
                                </p>
                            </motion.div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
