'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BookOpen, ScrollText, Moon, Clock, Compass, MapPin, Search,
    Bookmark, FileText, Heart, ChevronRight, Star, BookMarked, Users, Navigation,
    GraduationCap, Mic, Volume2, Video, Globe, Library
} from 'lucide-react';

const categories = [
    {
        title: "Sacred Texts",
        items: [
            {
                id: 'quran',
                href: '/quran',
                icon: BookOpen,
                arabicTitle: 'القرآن الكريم',
                title: 'Noble Quran',
                description: 'Complete Quran with Tafsir & Audio',
                color: 'primary'
            },
            {
                id: 'hadith',
                href: '/hadith',
                icon: ScrollText,
                arabicTitle: 'الحديث النبوي',
                title: 'Hadith Collections',
                description: 'Bukhari, Muslim & 6 major books',
                color: 'gold'
            },
            {
                id: 'seerah',
                href: '/resources/seerah',
                icon: Moon,
                arabicTitle: 'السيرة النبوية',
                title: 'Prophetic Seerah',
                description: 'Interactive timeline of the Prophet ﷺ',
                color: 'primary'
            }
        ]
    },
    {
        title: "Knowledge & Stories",
        items: [
            {
                id: 'prophets',
                href: '/resources/prophets',
                icon: Users,
                arabicTitle: 'قصص الأنبياء',
                title: 'Stories of Prophets',
                description: 'Biographies of 25 Prophets in Islam',
                color: 'gold'
            },
            {
                id: 'names',
                href: '/resources/names-of-allah',
                icon: Heart,
                arabicTitle: 'أسماء الله الحسنى',
                title: '99 Names of Allah',
                description: 'Meanings and benefits of Asma-ul-Husna',
                color: 'primary'
            },
            {
                id: 'janazah',
                href: '/resources/janazah',
                icon: BookMarked,
                arabicTitle: 'أحكام الجنائز',
                title: 'Janazah Guide',
                description: 'Funeral prayer and burial procedures',
                color: 'gold'
            }
        ]
    },
    {
        title: "Essential Guides",
        items: [
            {
                id: 'hajj',
                href: '/resources/hajj',
                icon: Navigation,
                arabicTitle: 'دليل الحج',
                title: 'Hajj Guide',
                description: 'Comprehensive annual pilgrimage guide',
                color: 'gold'
            },
            {
                id: 'umrah',
                href: '/resources/umrah',
                icon: Navigation,
                arabicTitle: 'دليل العمرة',
                title: 'Umrah Guide',
                description: 'Step-by-step minor pilgrimage guide',
                color: 'primary'
            },
            {
                id: 'tajweed',
                href: '/resources/tajweed',
                icon: Mic,
                arabicTitle: 'أحكام التجويد',
                title: 'Tajweed Rules',
                description: 'Learn to recite Quran correctly',
                color: 'gold'
            }
        ]
    },
    {
        title: "Daily Essentials",
        items: [
            {
                id: 'duas',
                href: '/duas',
                icon: Heart,
                arabicTitle: 'الدعاء والأذكار',
                title: 'Duas & Adhkar',
                description: 'Fortress of the Muslim supplications',
                color: 'primary'
            },
            {
                id: 'prayer-times',
                href: '/prayer-times',
                icon: Clock,
                arabicTitle: 'أوقات الصلاة',
                title: 'Prayer Times',
                description: 'Accurate times for your location',
                color: 'gold'
            },
            {
                id: 'qibla',
                href: '/qibla',
                icon: Compass,
                arabicTitle: 'اتجاه القبلة',
                title: 'Qibla Finder',
                description: 'Kaaba direction from anywhere',
                color: 'primary'
            }
        ]
    },
    {
        title: "Personal Library",
        items: [
            {
                id: 'bookmarks',
                href: '/bookmarks',
                icon: Bookmark,
                arabicTitle: 'المحفوظات',
                title: 'My Bookmarks',
                description: 'Saved verses and hadiths',
                color: 'gold'
            },
            {
                id: 'notes',
                href: '/notes',
                icon: FileText,
                arabicTitle: 'الملاحظات',
                title: 'Study Notes',
                description: 'Personal reflections and notes',
                color: 'primary'
            }
        ]
    }
];

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

export default function ResourcesPage() {
    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg)]">
            {/* Header */}
            <section className="px-6 mb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            المكتبة الإسلامية
                        </h1>
                        <h2 className="font-serif text-3xl text-[var(--color-text)] mb-4">
                            Resources & Knowledge Hub
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
                            A curated collection of authentic Islamic resources. From the Holy Quran to daily supplications,
                            access the tools you need for your spiritual journey.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Resources Content */}
            <section className="px-6">
                <div className="max-w-7xl mx-auto space-y-20">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <h3 className="font-serif text-2xl text-[var(--color-text)]">{category.title}</h3>
                                <div className="h-px flex-1 bg-[var(--color-border)]" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((resource) => (
                                    <Link href={resource.href} key={resource.id} className="group block h-full">
                                        <div className="card-premium p-6 h-full flex flex-col group-hover:shadow-xl hover:border-[var(--color-primary)]/30 transition-all duration-300">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${resource.color === 'gold'
                                                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]'
                                                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                    } group-hover:scale-110 transition-transform duration-300`}>
                                                    <resource.icon className="w-7 h-7" />
                                                </div>
                                                <span className="font-arabic text-xl text-[var(--color-text-muted)] opacity-50 group-hover:opacity-100 transition-opacity">
                                                    {resource.arabicTitle}
                                                </span>
                                            </div>

                                            <div className="mt-auto">
                                                <h4 className="font-serif text-xl text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {resource.title}
                                                </h4>
                                                <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-2">
                                                    {resource.description}
                                                </p>

                                                <div className="flex items-center text-sm font-medium text-[var(--color-primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                                    Explore <ChevronRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 mt-24 mb-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="card-premium p-8 md:p-12 text-center bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-bg-card)] border-[var(--color-primary)]/10"
                    >
                        <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-text)] mb-4">
                            Start Your Journey of Knowledge
                        </h3>
                        <p className="text-[var(--color-text-muted)] mb-8 max-w-lg mx-auto">
                            &quot;Seek knowledge from the cradle to the grave.&quot;
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/quran" className="btn-primary">
                                Read Quran
                            </Link>
                            <Link href="/basira" className="btn-secondary bg-white/50 backdrop-blur-sm">
                                Ask Basira AI
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
