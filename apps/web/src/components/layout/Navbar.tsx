'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, BookOpen, ScrollText, Sparkles, Grid3X3, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePrayerCountdown } from '@/features/prayer-times/hooks/usePrayerCountdown';
import MegaMenu from './MegaMenu';

const navLinks = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Quran', href: '/quran', icon: BookOpen },
    { name: 'Hadith', href: '/hadith', icon: ScrollText },
    { name: 'Basira', href: '/basira', icon: Sparkles },
    { name: 'Tools', href: '/tools', icon: Grid3X3, hasDropdown: true },
    { name: 'Resources', href: '/resources', icon: Grid3X3, hasDropdown: true },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const [hijriDate, setHijriDate] = React.useState('');
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const lastScrollY = React.useRef(0);

    const { scrollY } = useScroll();

    // Custom Hooks
    const { timeLeft, nextPrayerName, progress } = usePrayerCountdown();

    // Hijri Date
    React.useEffect(() => {
        try {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                calendar: 'islamic-umalqura'
            };
            setHijriDate(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', options).format(date));
        } catch (e) {
            setHijriDate('');
        }
    }, [pathname]);

    // Handle scroll - hide on scroll down, show on scroll up
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY.current;

        // Add scrolled state for styling
        setIsScrolled(latest > 20);

        // Hide/show based on scroll direction
        if (latest > previous && latest > 100 && !activeDropdown) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }

        lastScrollY.current = latest;
    });

    // Focus search input when opened
    React.useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Keyboard shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsMobileMenuOpen(false);
                setActiveDropdown(null);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            {/* Navbar */}
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: isHidden ? -100 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 pointer-events-none"
                onMouseLeave={() => setActiveDropdown(null)}
            >
                <nav
                    className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 pointer-events-auto relative ${isScrolled
                        ? 'bg-[var(--color-bg-card)]/80 backdrop-blur-xl shadow-lg border border-[var(--color-border)]/50'
                        : 'bg-[var(--color-bg-card)]/60 backdrop-blur-lg border border-transparent'
                        }`}
                >
                    <div className="px-5 py-3">
                        <div className="flex items-center justify-between">
                            {/* Left: Logo & Time */}
                            <div className="flex items-center gap-6">
                                <Link href="/" className="flex items-center gap-3 group relative z-10">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 text-white relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                                        <span className="relative font-arabic text-xl font-bold leading-none pb-1">ح</span>
                                    </motion.div>
                                    <div className="flex flex-col">
                                        <span className="font-serif text-xl font-semibold text-[var(--color-text)] tracking-tight group-hover:text-[var(--color-primary)] transition-colors">
                                            Al-Haqq
                                        </span>
                                    </div>
                                </Link>

                                {/* Desktop Divider */}
                                <div className="hidden lg:block h-8 w-px bg-[var(--color-border)]/50"></div>

                                {/* Prayer Countdown Pill */}
                                <Link href="/prayer-times" className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-[var(--color-bg-warm)]/50 border border-[var(--color-border)]/50 hover:border-[var(--color-primary)]/30 transition-all group">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-2 h-2">
                                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
                                            {nextPrayerName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--color-text)]">
                                        <span>{timeLeft}</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Center: Navigation */}
                            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                                    return (
                                        <div
                                            key={link.name}
                                            onMouseEnter={() => link.hasDropdown ? setActiveDropdown(link.name) : setActiveDropdown(null)}
                                            className="relative"
                                        >
                                            <Link
                                                href={link.href}
                                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${isActive
                                                    ? 'text-[var(--color-primary-dark)] bg-[var(--color-primary)]/5'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-warm)]/50'
                                                    }`}
                                            >
                                                {link.name}
                                                {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-2 lg:gap-3">
                                {/* Search */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-warm)] hover:text-[var(--color-text)] transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </motion.button>

                                {/* Hijri Date (Desktop) */}
                                {hijriDate && (
                                    <div className="hidden xl:flex items-center px-3 py-1.5 bg-[var(--color-bg-warm)]/30 rounded-lg border border-[var(--color-border)]/30">
                                        <span className="text-xs font-serif font-medium text-[var(--color-text-muted)]">{hijriDate}</span>
                                    </div>
                                )}

                                {/* Mobile Menu Toggle */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="lg:hidden p-2.5 rounded-xl bg-[var(--color-bg-warm)] ml-2"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Mega Menu Dropdown */}
                    <AnimatePresence>
                        {activeDropdown && (
                            <MegaMenu activeTab={activeDropdown} onClose={() => setActiveDropdown(null)} />
                        )}
                    </AnimatePresence>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-[var(--color-bg)] pt-28 px-6 pb-6 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col gap-6">
                            {/* Mobile Links */}
                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]"
                                    >
                                        <span className="text-lg font-medium">{link.name}</span>
                                        {link.icon && <link.icon className="w-5 h-5 text-[var(--color-text-muted)]" />}
                                    </Link>
                                ))}
                            </div>

                            {/* Prayer Times Widget Mobile */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white shadow-xl shadow-[var(--color-primary)]/20">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm opacity-80">Next Prayer: {nextPrayerName}</span>
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="text-3xl font-bold font-mono mb-2">{timeLeft}</div>
                                <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="w-full max-w-2xl bg-[var(--color-bg-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearch} className="p-4 border-b border-[var(--color-border)] flex items-center gap-4">
                                <Search className="w-6 h-6 text-[var(--color-primary)]" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="flex-1 bg-transparent text-lg outline-none"
                                    dir="auto"
                                />
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
