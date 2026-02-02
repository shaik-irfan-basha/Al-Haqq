'use client';

import Link from 'next/link';
import { BookOpen, Heart, Mail } from 'lucide-react';

const footerLinks = {
    explore: [
        { name: 'Quran', href: '/quran' },
        { name: 'Hadith', href: '/hadith' },
        { name: 'Basira AI', href: '/basira' },
        { name: 'Resources', href: '/resources' },
    ],
    resources: [
        { name: 'Prayer Times', href: '/prayer-times' },
        { name: 'Qibla Finder', href: '/qibla' },
        { name: 'Duas', href: '/duas' },
        { name: 'Bookmarks', href: '/bookmarks' },
        { name: 'Notes', href: '/notes' },
    ],
    about: [
        { name: 'About Al-Haqq', href: '/about' },
        { name: 'Our Sources', href: '/about#sources' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Contact', href: 'mailto:muhammadirfanbasha@gmail.com' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[var(--color-bg-warm)] border-t border-[var(--color-border)]">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
                                <span className="text-white font-arabic text-lg font-bold">ح</span>
                            </div>
                            <span className="font-serif text-xl font-medium text-[var(--color-text)]">Al-Haqq</span>
                        </Link>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            The Qur&apos;an and Sunnah. Clear. Authentic. Timeless.
                        </p>
                        <a
                            href="mailto:muhammadirfanbasha@gmail.com"
                            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
                        >
                            <Mail className="w-3 h-3" />
                            muhammadirfanbasha@gmail.com
                        </a>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="font-medium text-[var(--color-text)] mb-4">Explore</h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-medium text-[var(--color-text)] mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="font-medium text-[var(--color-text)] mb-4">About</h4>
                        <ul className="space-y-3">
                            {footerLinks.about.map((link) => (
                                <li key={link.name}>
                                    {link.href.startsWith('mailto:') ? (
                                        <a href={link.href} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        © {new Date().getFullYear()} Al-Haqq. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-rose-500" /> for the Ummah
                    </p>
                </div>
            </div>
        </footer>
    );
}

