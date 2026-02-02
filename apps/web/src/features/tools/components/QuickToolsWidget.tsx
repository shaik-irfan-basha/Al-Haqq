'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calculator, Compass, Calendar, MapPin,
    BookMarked, BookOpen, Sparkles, Hash
} from 'lucide-react';

const quickTools = [
    { id: 'zakat', href: '/tools/zakat', icon: Calculator, label: 'Zakat', color: 'emerald' },
    { id: 'qibla', href: '/qibla', icon: Compass, label: 'Qibla', color: 'blue' },
    { id: 'calendar', href: '/tools/calendar', icon: Calendar, label: 'Calendar', color: 'purple' },
    { id: 'mosques', href: '/tools/mosques', icon: MapPin, label: 'Mosques', color: 'rose' },
    { id: 'tajweed', href: '/resources/tajweed', icon: BookMarked, label: 'Tajweed', color: 'amber' },
    { id: 'seerah', href: '/resources/seerah', icon: BookOpen, label: 'Seerah', color: 'teal' },
    { id: 'basira', href: '/basira', icon: Sparkles, label: 'Ask AI', color: 'cyan' },
    { id: 'tasbih', href: '/tools/tasbih', icon: Hash, label: 'Tasbih', color: 'indigo' },
];

const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'hover:bg-emerald-500/20',
    },
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-500/20',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        hover: 'hover:bg-purple-500/20',
    },
    rose: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        hover: 'hover:bg-rose-500/20',
    },
    amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        hover: 'hover:bg-amber-500/20',
    },
    teal: {
        bg: 'bg-teal-500/10',
        text: 'text-teal-600 dark:text-teal-400',
        hover: 'hover:bg-teal-500/20',
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-600 dark:text-cyan-400',
        hover: 'hover:bg-cyan-500/20',
    },
    indigo: {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'hover:bg-indigo-500/20',
    },
};

export default function QuickToolsWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-premium p-6 md:p-8"
        >
            <h3 className="font-semibold text-[var(--color-text)] mb-4">Quick Tools</h3>

            <div className="grid grid-cols-4 gap-3">
                {quickTools.map((tool, index) => {
                    const Icon = tool.icon;
                    const colors = colorClasses[tool.color];

                    return (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={tool.href}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${colors.bg} ${colors.hover}`}
                            >
                                <Icon className={`w-5 h-5 ${colors.text}`} />
                                <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                                    {tool.label}
                                </span>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
