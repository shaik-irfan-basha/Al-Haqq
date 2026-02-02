/**
 * Al-Haqq - Root Layout
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Amiri, Playfair_Display } from 'next/font/google';
import './globals.css';

// English font - Sans
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

// English font - Serif (Premium)
const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-playfair',
});

// Arabic font
const amiri = Amiri({
    weight: ['400', '700'],
    subsets: ['arabic'],
    display: 'swap',
    variable: '--font-amiri',
});

export const metadata: Metadata = {
    title: {
        default: 'Al-Haqq | Islamic Knowledge Platform',
        template: '%s | Al-Haqq',
    },
    description: 'Authentic Quran and Hadith with AI-powered insights. Built for trust, clarity, and longevity.',
    keywords: ['Quran', 'Hadith', 'Islam', 'Islamic', 'Muslim', 'Basira', 'AI'],
    authors: [{ name: 'Al-Haqq Team' }],
    creator: 'Al-Haqq',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Al-Haqq',
        title: 'Al-Haqq | Islamic Knowledge Platform',
        description: 'Authentic Quran and Hadith with AI-powered insights.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Al-Haqq | Islamic Knowledge Platform',
        description: 'Authentic Quran and Hadith with AI-powered insights.',
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    verification: {
        google: 'N_0YgkrZaG-GsiVOXh9qH1raQb7GiT2dQWYxhd4t444',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

import { AudioProvider } from '@/context/AudioContext';
import AudioPlayer from '@/components/AudioPlayer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/MobileNav';
import { ToastProvider } from '@/components/ToastProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
            <body>
                <ToastProvider>
                    <AudioProvider>
                        <Navbar />
                        <main className="pb-16 md:pb-0">
                            {children}
                        </main>
                        <Footer />
                        <AudioPlayer />
                        <MobileNav />
                    </AudioProvider>
                </ToastProvider>
            </body>
        </html>
    );
}

