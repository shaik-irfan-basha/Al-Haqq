'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Pause, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { namesOfAllah } from '@/lib/data-names';

export default function NamesPage() {
    const [search, setSearch] = useState('');
    const [playing, setPlaying] = useState<number | null>(null);

    const names = namesOfAllah;

    const filteredNames = names.filter(n =>
        n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
        n.meaning.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg)]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Link href="/tools" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4 inline-block">
                            ← Back to Tools
                        </Link>
                        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-2">
                            Asma-ul-Husna
                        </h1>
                        <p className="text-[var(--color-text-muted)]">
                            The 99 Beautiful Names of Allah
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search names..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                        />
                    </div>
                </div>

                {/* Names Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNames.map((name, index) => (
                        <motion.div
                            key={name.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="group relative bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-primary)]/30 transition-all hover:shadow-xl hover:shadow-[var(--color-primary)]/5"
                        >
                            <div className="absolute top-4 right-4 text-xs font-mono text-[var(--color-text-muted)] opacity-50">
                                #{name.number}
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <div className="text-4xl font-amiri mb-4 text-[var(--color-text)] group-hover:scale-110 transition-transform duration-300">
                                    {name.arabic}
                                </div>
                                <h3 className="font-serif text-lg text-[var(--color-text)] mb-1">
                                    {name.transliteration}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {name.meaning}
                                </p>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-[var(--color-bg-card)] via-[var(--color-bg-card)] to-transparent rounded-b-2xl flex justify-center gap-2">
                                <button className="p-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:text-[var(--color-primary)] transition-colors">
                                    <Play className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] hover:text-[var(--color-primary)] transition-colors">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
