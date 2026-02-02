'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Sample duas data - authentic content
const duasData = [
    {
        id: 1,
        category: 'Morning & Evening',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah",
        translation: "We have entered the morning and the sovereignty belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, without partner.",
        source: "Abu Dawud 4/317"
    },
    {
        id: 2,
        category: 'Morning & Evening',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
        translation: "O Allah, by You we enter the morning, and by You we enter the evening. By You we live and by You we die, and to You is the resurrection.",
        source: "At-Tirmidhi 5/466"
    },
    {
        id: 3,
        category: 'Before Sleep',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "In Your name, O Allah, I die and I live.",
        source: "Sahih Bukhari 6324"
    },
    {
        id: 4,
        category: 'Before Sleep',
        arabic: 'اللَّهُمَّ قِنِى عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        source: "Abu Dawud 4/311"
    },
    {
        id: 5,
        category: 'Protection',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'udhu bikalimatillahit-tammmati min sharri ma khalaq",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        source: "Muslim 4/2081"
    },
    {
        id: 6,
        category: 'Protection',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim",
        translation: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, All-Knowing.",
        source: "At-Tirmidhi 5/465"
    },
    {
        id: 7,
        category: 'Forgiveness',
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
        transliteration: "Astaghfirullaha al-'Adhim alladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh",
        translation: "I seek forgiveness from Allah, the Magnificent, whom there is none worthy of worship except Him, the Living, the Sustainer, and I turn to Him in repentance.",
        source: "At-Tirmidhi 5/569"
    },
    {
        id: 8,
        category: 'Anxiety & Distress',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal",
        translation: "O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from inability and laziness.",
        source: "Sahih Bukhari 7/158"
    },
    {
        id: 9,
        category: 'Before Eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        source: "At-Tirmidhi 4/288"
    },
    {
        id: 10,
        category: 'After Eating',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
        transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
        translation: "Praise be to Allah who has fed me this and provided it for me without any might or power on my part.",
        source: "At-Tirmidhi 5/507"
    },
];

export default function DuasPage() {
    const [copiedId, setCopiedId] = React.useState<number | null>(null);

    const handleCopy = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Group duas by category
    const categories = duasData.reduce((acc: { [key: string]: typeof duasData }, dua) => {
        if (!acc[dua.category]) acc[dua.category] = [];
        acc[dua.category].push(dua);
        return acc;
    }, {});

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <Link href="/resources" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Resources
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-medium mb-6">
                            <Heart className="w-4 h-4" />
                            Hisnul Muslim
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">Duas & Adhkar</h1>
                        <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
                            Authentic supplications from the Qur&apos;an and Sunnah for every moment of your day.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Duas List */}
            <section className="px-6">
                <div className="max-w-4xl mx-auto space-y-12">
                    {Object.entries(categories).map(([category, categoryDuas], catIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                        >
                            <h2 className="font-serif text-2xl text-[var(--color-text)] mb-6 flex items-center gap-3">
                                <span className="w-1 h-8 bg-[var(--color-primary)] rounded-full" />
                                {category}
                            </h2>

                            <div className="space-y-4">
                                {categoryDuas.map((dua, index) => (
                                    <div key={dua.id} className="card-premium p-6">
                                        {/* Arabic */}
                                        <p className="font-arabic text-2xl text-[var(--color-text)] leading-loose text-right mb-4" dir="rtl">
                                            {dua.arabic}
                                        </p>

                                        {/* Transliteration */}
                                        <p className="text-[var(--color-text-secondary)] italic mb-3">
                                            {dua.transliteration}
                                        </p>

                                        {/* Translation */}
                                        <p className="text-[var(--color-text-secondary)] mb-4 pb-4 border-b border-[var(--color-border)]">
                                            {dua.translation}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                                                {dua.source}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleCopy(dua.arabic, dua.id)}
                                                    className="w-9 h-9 rounded-lg bg-[var(--color-bg-warm)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors"
                                                    title="Copy Arabic"
                                                >
                                                    {copiedId === dua.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
