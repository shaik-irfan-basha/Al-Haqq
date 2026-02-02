'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, RefreshCw, Copy, Check, Share2 } from 'lucide-react';

// Featured hadiths for daily rotation
const HADITHS = [
    {
        id: 1,
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
        text: 'Actions are judged by intentions, so each man will have what he intended.',
        narrator: 'Umar ibn Al-Khattab',
        collection: 'Sahih Bukhari',
        reference: '1',
    },
    {
        id: 2,
        arabic: 'الدِّينُ النَّصِيحَةُ',
        text: 'The religion is sincerity. We asked: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims, and their common people.',
        narrator: 'Tamim al-Dari',
        collection: 'Sahih Muslim',
        reference: '55',
    },
    {
        id: 3,
        arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        text: 'None of you truly believes until he loves for his brother what he loves for himself.',
        narrator: 'Anas ibn Malik',
        collection: 'Sahih Bukhari',
        reference: '13',
    },
    {
        id: 4,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        text: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
        narrator: 'Abu Hurairah',
        collection: 'Sahih Bukhari',
        reference: '6018',
    },
    {
        id: 5,
        arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
        text: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
        narrator: 'Abdullah ibn Amr',
        collection: 'Sahih Bukhari',
        reference: '10',
    },
    {
        id: 6,
        arabic: 'مَنْ لَا يَرْحَمْ النَّاسَ لَا يَرْحَمْهُ اللَّهُ',
        text: 'Whoever does not show mercy to people, Allah will not show mercy to him.',
        narrator: 'Jarir ibn Abdullah',
        collection: 'Sahih Muslim',
        reference: '2319',
    },
    {
        id: 7,
        arabic: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
        text: 'Cleanliness is half of faith.',
        narrator: 'Abu Malik Al-Ashari',
        collection: 'Sahih Muslim',
        reference: '223',
    },
];

interface HadithOfTheDayProps {
    compact?: boolean;
}

export default function HadithOfTheDay({ compact = false }: HadithOfTheDayProps) {
    const [hadith, setHadith] = React.useState(HADITHS[0]);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        // Get hadith based on day of year for consistency
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
        );
        setHadith(HADITHS[dayOfYear % HADITHS.length]);
    }, []);

    const copyHadith = async () => {
        const text = `"${hadith.text}"\n\n- Narrated by ${hadith.narrator}\n${hadith.collection} #${hadith.reference}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareHadith = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Hadith of the Day',
                    text: `"${hadith.text}"\n\n- ${hadith.narrator} (${hadith.collection})`,
                });
            } catch (err) {
                copyHadith();
            }
        } else {
            copyHadith();
        }
    };

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium p-5"
            >
                <div className="flex items-center gap-2 mb-3">
                    <ScrollText className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-xs font-medium text-[var(--color-accent)]">Hadith of the Day</span>
                </div>
                <p className="text-sm text-[var(--color-text)] leading-relaxed mb-2">
                    "{hadith.text}"
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                    — {hadith.narrator} | {hadith.collection}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-8 md:p-10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                        <ScrollText className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-text)]">Hadith of the Day</h3>
                        <p className="text-xs text-[var(--color-text-muted)]">Daily wisdom from the Prophet ﷺ</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={copyHadith}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                        title="Copy"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-green-500" />
                        ) : (
                            <Copy className="w-5 h-5 text-[var(--color-text-muted)]" />
                        )}
                    </button>
                    <button
                        onClick={shareHadith}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>
                </div>
            </div>

            {/* Arabic */}
            <p className="font-arabic text-2xl md:text-3xl text-[var(--color-text)] leading-loose text-right mb-6" dir="rtl">
                {hadith.arabic}
            </p>

            {/* Translation */}
            <p className="font-serif text-xl md:text-2xl text-[var(--color-text-secondary)] italic leading-relaxed mb-6">
                "{hadith.text}"
            </p>

            {/* Source */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--color-border)]">
                <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Narrated by</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{hadith.narrator}</p>
                </div>
                <div className="h-8 w-px bg-[var(--color-border)]" />
                <div>
                    <p className="text-xs text-[var(--color-text-muted)]">Collection</p>
                    <p className="text-sm font-medium text-[var(--color-text)]">{hadith.collection} #{hadith.reference}</p>
                </div>
            </div>
        </motion.div>
    );
}
