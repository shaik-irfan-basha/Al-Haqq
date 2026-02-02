'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ScrollText, Sparkles, Grid3X3, Coins, Fingerprint, Heart, Clock, Compass, MoveRight } from 'lucide-react';

const TOOLS_MENU = [
    { name: 'Prayer Tracker', href: '/tools/prayer-tracker', icon: Clock, desc: 'Track daily prayers & streaks' },
    { name: 'Fasting Tracker', href: '/tools/fasting', icon: BookOpen, desc: 'Log Ramadan & Sunnah fasts' },
    { name: 'Zakat Calculator', href: '/tools/zakat', icon: Coins, desc: 'Calculate wealth purification' },
    { name: 'Tasbih Counter', href: '/tools/tasbih', icon: Fingerprint, desc: 'Digital dhikr companion' },
    { name: 'Islamic Quiz', href: '/tools/quiz', icon: Sparkles, desc: 'Test your knowledge' },
    { name: 'Qibla Finder', href: '/qibla', icon: Compass, desc: 'Locate the Kaaba' },
];

const RESOURCES_MENU = [
    { name: 'Stories of Prophets', href: '/resources/prophets', icon: BookOpen, desc: 'Lives of 25 Prophets' },
    { name: 'Prophetic Seerah', href: '/resources/seerah', icon: ScrollText, desc: 'Timeline of the Prophet ﷺ' },
    { name: 'Hajj Guide', href: '/resources/hajj', icon: Grid3X3, desc: 'Step-by-step Pilgrimage' },
    { name: 'Umrah Guide', href: '/resources/umrah', icon: Grid3X3, desc: 'Guide to Minor Pilgrimage' },
    { name: '99 Names', href: '/resources/names-of-allah', icon: Heart, desc: 'Esma-ul-Husna meanings' },
    { name: 'Duas', href: '/duas', icon: Sparkles, desc: 'Authentic supplications' },
];

export default function MegaMenu({ activeTab, onClose }: { activeTab: string | null, onClose: () => void }) {
    if (!activeTab) return null;

    const items = activeTab === 'Tools' ? TOOLS_MENU :
        activeTab === 'Resources' ? RESOURCES_MENU : [];

    if (items.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[640px] glass rounded-2xl shadow-2xl p-6 z-[60]"
            onMouseLeave={onClose}
        >
            <div className="grid grid-cols-2 gap-4">
                {items.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--color-bg-warm)] transition-colors"
                    >
                        <div className="p-2 rounded-lg bg-[var(--color-primary)]/5 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-serif font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
                                {item.name}
                                <MoveRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </h4>
                            <p className="text-sm text-[var(--color-text-muted)] leading-snug mt-1">
                                {item.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}
