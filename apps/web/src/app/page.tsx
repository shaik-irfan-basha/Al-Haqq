'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ScrollText, Sparkles, ArrowRight, Search, Heart, Clock } from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
};

import { featuredVerses } from '@/data/featured-verses';
import PrayerTimesWidget from '@/features/prayer-times/components/PrayerTimesWidget';
import QuickToolsWidget from '@/features/tools/components/QuickToolsWidget';
import HadithOfTheDay from '@/features/hadith/components/HadithOfTheDay';
import ParticlesBackground from '@/components/ui/ParticlesBackground';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';

export default function HomePage() {
    const [dailyVerse, setDailyVerse] = React.useState<typeof featuredVerses[0] | null>(null);

    React.useEffect(() => {
        // Pick based on day of year
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

        setDailyVerse(featuredVerses[dayOfYear % featuredVerses.length]);
    }, []);

    return (
        <div className="min-h-screen overflow-hidden">


            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-32 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <ParticlesBackground />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.03 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-[120px]"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.04 }}
                        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-accent)] rounded-full blur-[100px]"
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pb-24">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm mb-8"
                        >
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
                            />
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                The Ultimate Islamic Knowledge Platform
                            </span>
                        </motion.div>

                        <div className="min-h-[120px] flex items-center justify-center py-4">
                            <TypewriterEffect
                                words={[
                                    { text: "Clear.", className: "text-gradient mr-3" },
                                    { text: "Authentic.", className: "text-gradient mr-3" },
                                    { text: "Timeless.", className: "text-gradient" },
                                ]}
                                className="text-4xl md:text-5xl lg:text-7xl font-medium leading-tight"
                                cursorClassName="bg-[var(--color-accent)] h-10 md:h-14 lg:h-20"
                            />
                        </div>
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Discover the divine wisdom of Islam through verified sources,
                        beautiful presentation, and sacred simplicity.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="max-w-xl mx-auto"
                    >
                        <Link href="/search" className="block relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                            </div>
                            <div className="w-full pl-14 pr-6 py-5 text-lg rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-lg text-left text-[var(--color-text-muted)] group-hover:border-[var(--color-primary)] transition-colors cursor-text">
                                Search the Qur&apos;an or Hadith...
                            </div>
                            <kbd className="absolute right-5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-warm)] rounded-lg border border-[var(--color-border)]">
                                ⌘K
                            </kbd>
                        </Link>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 mt-8"
                    >
                        {['Al-Fatihah', 'Ayat al-Kursi', 'Surah Yaseen', 'Surah Al-Mulk'].map((name) => (
                            <Link
                                key={name}
                                href={`/search?q=${encodeURIComponent(name)}`}
                                className="px-4 py-2 rounded-full text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-warm)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                            >
                                {name}
                            </Link>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Explore</span>
                        <div className="w-px h-10 bg-gradient-to-b from-[var(--color-border)] to-transparent" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Daily Wisdom Section */}
            <section className="py-32 md:py-40 px-6 bg-[var(--color-bg-warm)]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 md:mb-24">
                        <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Daily Wisdom</h2>
                        <p className="text-lg text-[var(--color-text-secondary)]">Inspirations from the Divine Revelation and Prophetic Tradition</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                        {/* Verse of the Day */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="card-premium p-12 md:p-16 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]"
                        >
                            <div className="absolute top-0 left-0 w-40 h-40 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />

                            <div className="relative z-10 w-full">
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-10">
                                    <BookOpen className="w-4 h-4" />
                                    Verse of the Day
                                </div>

                                <p className="font-arabic text-4xl md:text-5xl text-[var(--color-text)] leading-[2.2] mb-10" dir="rtl">
                                    فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
                                </p>

                                <p className="font-serif text-2xl text-[var(--color-text-secondary)] italic mb-8 leading-relaxed">
                                    &quot;So which of the favors of your Lord would you deny?&quot;
                                </p>


                                <p className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
                                    Surah Ar-Rahman · 55:13
                                </p>
                            </div>
                        </motion.div>

                        {/* Hadith of the Day Component */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="h-full"
                        >
                            <HadithOfTheDay />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Access Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-4">Quick Access</h2>
                        <p className="text-[var(--color-text-secondary)]">Your daily Islamic essentials</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PrayerTimesWidget />
                        <QuickToolsWidget />
                    </div>
                </div>
            </section>

            {/* Main Navigation Grid */}
            <section className="py-24 md:py-36 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Explore Al-Haqq</h2>
                        <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto">Begin your journey through the sacred texts</p>
                    </motion.div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                        {/* Quran Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            whileHover={{ y: -8 }}
                        >
                            <Link href="/quran" className="group block h-full">
                                <div className="relative h-[480px] rounded-[var(--radius-xl)] overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[#0a2920] p-12 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(14,59,46,0.3)]">
                                    {/* Pattern */}
                                    <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                                        <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] border border-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                                    </div>

                                    <div className="relative z-10">
                                        <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md border border-white/10">
                                            Divine Revelation
                                        </span>
                                        <h3 className="font-serif text-5xl md:text-6xl text-white mb-4">The Noble Qur&apos;an</h3>
                                        <p className="text-white/80 text-xl max-w-md font-light leading-relaxed">
                                            Read all 114 Surahs with translations, tafseer, and recitation.
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-8 mt-auto">
                                        <span className="text-white/60 text-sm font-medium tracking-wide">114 Surahs · 6,236 Ayahs</span>
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--color-primary)] transition-all duration-300"
                                        >
                                            <ArrowRight className="w-6 h-6" />
                                        </motion.span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Hadith Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            whileHover={{ y: -8 }}
                        >
                            <Link href="/hadith" className="group block h-full">
                                <div className="relative h-[480px] rounded-[var(--radius-xl)] overflow-hidden bg-[var(--color-bg-card)] p-12 flex flex-col justify-between shadow-xl transition-all duration-500 hover:shadow-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/20">
                                    <div className="relative z-10">
                                        <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider mb-6">
                                            Prophetic Tradition
                                        </span>
                                        <h3 className="font-serif text-5xl md:text-6xl text-[var(--color-text)] mb-4">Hadith Collections</h3>
                                        <p className="text-[var(--color-text-secondary)] text-xl max-w-md font-light leading-relaxed">
                                            Access authentic narrations from Bukhari, Muslim, and more.
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between border-t border-[var(--color-border)] pt-8 mt-auto">
                                        <span className="text-[var(--color-text-muted)] text-sm font-medium tracking-wide">17 Collections · 60,000+ Hadiths</span>
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            className="w-14 h-14 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center text-[var(--color-text)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300"
                                        >
                                            <ArrowRight className="w-6 h-6" />
                                        </motion.span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Basira */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ y: -5 }}
                            className="lg:col-span-1"
                        >
                            <Link href="/basira" className="group block h-full">
                                <div className="card-premium p-10 h-full flex items-center gap-8 min-h-[240px]">
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 border border-cyan-500/20"
                                    >
                                        <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-3xl text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">Basira AI</h3>
                                        <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">Ask questions about Islam and get instant, referenced answers.</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-transparent transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Resources */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="lg:col-span-1"
                        >
                            <Link href="/resources" className="group block h-full">
                                <div className="card-premium p-10 h-full flex items-center gap-8 min-h-[240px]">
                                    <motion.div
                                        whileHover={{ rotate: -10, scale: 1.1 }}
                                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0 border border-rose-500/20"
                                    >
                                        <Heart className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                                    </motion.div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-3xl text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">Resources</h3>
                                        <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">Stories of Prophets, Seerah, Hajj Guide, Prayer Times, and more.</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-transparent transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-[var(--color-bg-warm)]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="font-serif text-5xl md:text-6xl text-[var(--color-text)] mb-8">Begin Your Journey</h2>
                    <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
                        Al-Haqq is designed to bring you closer to the truth. Explore the Qur&apos;an and Sunnah with clarity and authenticity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/quran" className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg">
                                Start Reading
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/about" className="btn-secondary inline-flex items-center gap-3 px-8 py-4 text-lg">
                                Learn About Al-Haqq
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
