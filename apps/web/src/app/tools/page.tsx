'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Calculator, ScrollText, Sparkles, BookOpen, Clock, Heart, MoveRight,
    Coins, Fingerprint, Calendar, MapPin, CheckSquare, Moon, Compass,
    Mic, Volume2, Shield, Feather, BookMarked, GraduationCap, X, Star
} from 'lucide-react';
import Link from 'next/link';

// Categorized Tools for Better Organization
const categories = [
    {
        id: 'worship',
        name: 'Daily Worship',
        icon: Clock,
        items: [
            {
                id: 'prayer-times',
                title: 'Prayer Times',
                description: 'Accurate global prayer times with Adhan notifications',
                icon: Clock,
                color: 'from-cyan-500 to-blue-500',
                href: '/prayer-times',
                status: 'essential'
            },
            {
                id: 'qibla',
                title: 'Qibla Finder',
                description: 'AR-enabled Qibla direction from anywhere',
                icon: Compass,
                color: 'from-violet-500 to-purple-500',
                href: '/qibla',
                status: 'essential'
            },
            {
                id: 'tasbih',
                title: 'Digital Tasbih',
                description: 'Adhkar counter with goals and vibration feedback',
                icon: Fingerprint,
                color: 'from-emerald-500 to-teal-500',
                href: '/tools/tasbih',
                status: 'essential'
            }
        ]
    },
    {
        id: 'tracking',
        name: 'Tracking & Goals',
        icon: CheckSquare,
        items: [
            {
                id: 'prayer-tracker',
                title: 'Prayer Tracker',
                description: 'Log daily Fard and Sunnah prayers, track Qaza',
                icon: CheckSquare,
                color: 'from-green-500 to-emerald-500',
                href: '/tools/prayer-tracker',
                status: 'popular'
            },
            {
                id: 'fasting',
                title: 'Fasting Tracker',
                description: 'Ramadan and voluntary fasting log',
                icon: Moon,
                color: 'from-purple-500 to-indigo-500',
                href: '/tools/fasting',
                status: 'popular'
            },
            {
                id: 'khatam',
                title: 'Khatam Tracker',
                description: 'Track your Quran reading progress and completion',
                icon: BookMarked,
                color: 'from-rose-500 to-pink-500',
                href: '/tools/khatam',
                status: 'coming-soon'
            }
        ]
    },
    {
        id: 'finance',
        name: 'Islamic Finance',
        icon: Coins,
        items: [
            {
                id: 'zakat',
                title: 'Zakat Calculator',
                description: 'Calculate Zakat on assets, gold, and savings',
                icon: Coins,
                color: 'from-amber-500 to-yellow-500',
                href: '/tools/zakat',
                status: 'essential'
            },
            {
                id: 'inheritance',
                title: 'Inheritance (Mirth)',
                description: 'Calculate Islamic inheritance shares',
                icon: Calculator,
                color: 'from-gray-500 to-slate-500',
                href: '/tools/inheritance',
                status: 'coming-soon'
            }
        ]
    },
    {
        id: 'knowledge',
        name: 'Learning & Knowledge',
        icon: GraduationCap,
        items: [
            {
                id: 'quiz',
                title: 'Islamic Quiz',
                description: 'Test your knowledge across various Islamic topics',
                icon: Sparkles,
                color: 'from-purple-500 to-pink-500',
                href: '/tools/quiz',
                status: 'new'
            },
            {
                id: 'names',
                title: '99 Names of Allah',
                description: 'Learn Asma-ul-Husna with audio and meanings',
                icon: Heart,
                color: 'from-rose-500 to-red-500',
                href: '/resources/names-of-allah',
                status: 'essential'
            },
            {
                id: 'calendar',
                title: 'Islamic Calendar',
                description: 'Hijri dates and important Islamic events',
                icon: Calendar,
                color: 'from-indigo-500 to-violet-500',
                href: '/tools/calendar',
                status: 'essential'
            }
        ]
    },
    {
        id: 'lifestyle',
        name: 'Muslim Lifestyle',
        icon: MapPin,
        items: [
            {
                id: 'mosques',
                title: 'Mosque Finder',
                description: 'Locate nearby Masjids and prayer rooms',
                icon: MapPin,
                color: 'from-teal-500 to-cyan-500',
                href: '/tools/mosques',
                status: 'active'
            },
            {
                id: 'duas',
                title: 'Hisnul Muslim',
                description: 'Daily authentic duas and supplications',
                icon: Shield,
                color: 'from-blue-500 to-indigo-500',
                href: '/duas',
                status: 'essential'
            }
        ]
    }
];

export default function ToolsPage() {
    const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

    const filteredCategories = selectedCategory === 'all'
        ? categories
        : categories.filter(c => c.id === selectedCategory);

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg)]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-12"
                >
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">
                        Islamic Tools Suite
                    </h1>
                    <p className="text-xl text-[var(--color-text-muted)] leading-relaxed">
                        A comprehensive ecosystem of digital tools to support your daily Islamic life.
                        From accurate calculations to spiritual tracking.
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2 mb-12"
                >
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-[var(--color-primary)] text-white'
                                : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                            }`}
                    >
                        All Tools
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory === cat.id
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </motion.div>

                {/* Tools Grid by Category */}
                <div className="space-y-16">
                    {filteredCategories.map((category, catIndex) => (
                        <motion.section
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <category.icon className="w-6 h-6 text-[var(--color-primary)]" />
                                <h2 className="font-serif text-2xl text-[var(--color-text)]">{category.name}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((tool, index) => (
                                    <Link href={tool.href} key={tool.id} className="block group">
                                        <div className="h-full card-premium p-8 hover:border-[var(--color-primary)]/30 transition-all relative overflow-hidden group-hover:-translate-y-1">
                                            {/* Status Badge */}
                                            {tool.status === 'new' && (
                                                <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-500/20">
                                                    New
                                                </span>
                                            )}
                                            {tool.status === 'popular' && (
                                                <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20 flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> Popular
                                                </span>
                                            )}
                                            {tool.status === 'coming-soon' && (
                                                <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] text-xs font-medium border border-[var(--color-border)]">
                                                    Soon
                                                </span>
                                            )}

                                            {/* Icon */}
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                                <tool.icon className="w-7 h-7" />
                                            </div>

                                            <h3 className="text-xl font-serif text-[var(--color-text)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                                {tool.title}
                                            </h3>
                                            <p className="text-[var(--color-text-muted)] leading-relaxed mb-6 line-clamp-2">
                                                {tool.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                                Launch Tool <MoveRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>

            </div>
        </div>
    );
}
