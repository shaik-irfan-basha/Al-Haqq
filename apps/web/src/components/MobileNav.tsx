'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen, ScrollText, MessageCircle, Compass, Grid3X3,
    Home
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/quran', icon: BookOpen, label: 'Quran' },
    { href: '/hadith', icon: ScrollText, label: 'Hadith' },
    { href: '/basira', icon: MessageCircle, label: 'Basira' },
    { href: '/tools', icon: Grid3X3, label: 'Tools' },
];

export default function MobileNav() {
    const pathname = usePathname();

    // Don't show on desktop
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-bg-card)]/95 backdrop-blur-xl border-t border-[var(--color-border)] safe-area-bottom">
            <div className="flex items-center justify-around py-2 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center py-2 px-4 group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-active"
                                    className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-2xl"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                            <item.icon
                                className={`w-5 h-5 relative z-10 transition-colors ${isActive
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'
                                    }`}
                            />
                            <span
                                className={`text-[10px] mt-1 relative z-10 font-medium transition-colors ${isActive
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
