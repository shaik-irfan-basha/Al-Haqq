/**
 * Header Component
 */

import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
    showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoArabic}>الحق</span>
                    <span className={styles.logoText}>Al-Haqq</span>
                </Link>

                {showNav && (
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Home</Link>
                        <Link href="/quran" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Quran</Link>
                        <Link href="/hadith" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Hadith</Link>
                        <Link href="/duas" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Duas</Link>
                        <Link href="/utilities/zakat" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Zakat</Link>
                        <Link href="/basira" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">AI Basira</Link>
                        <Link href="/search" className="text-gray-300 hover:text-emerald-400 transition-colors text-sm font-medium">Search</Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
