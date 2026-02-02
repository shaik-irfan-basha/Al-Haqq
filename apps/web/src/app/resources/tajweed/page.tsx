'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mic, Volume2, Info } from 'lucide-react';

const tajweedRules = [
    {
        id: 'ghunna',
        title: 'Ghunna (Nasal Sound)',
        arabic: 'غنة',
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-800',
        description: 'A nasal sound produced from the nose for 2 counts. Occurs on Nun and Mim with Shaddah (ّ).',
        example: 'إِنَّ',
        exampleTrans: 'Inna'
    },
    {
        id: 'qalqala',
        title: 'Qalqala (Echoing)',
        arabic: 'قلقلة',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        borderColor: 'border-red-200 dark:border-red-800',
        description: 'An echoing or bouncing sound when the letter has Sukoon. Letters: qaf, ta, ba, jim, dal (qt-b-j-d).',
        example: 'قُلْ',
        exampleTrans: 'Qul'
    },
    {
        id: 'idgham',
        title: 'Idgham (Merging)',
        arabic: 'إدغام',
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800',
        description: 'Merging one letter into the next. Occurs with Nun Saakin/Tanween followed by y-r-m-l-w-n.',
        example: 'مَن يَقُولُ',
        exampleTrans: 'May-yaqoolu'
    },
    {
        id: 'ikhfa',
        title: 'Ikhfa (Hiding)',
        arabic: 'إخفاء',
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        borderColor: 'border-orange-200 dark:border-orange-800',
        description: 'Hiding the Nun sound between clear and merged, with Ghunna. Occurs with Nun Saakin followed by 15 letters.',
        example: 'أَنزَلْنَ',
        exampleTrans: 'Anzalna'
    },
    {
        id: 'madd',
        title: 'Madd (Elongation)',
        arabic: 'مد',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-800',
        description: 'Stretching the vowel sound for 2, 4, or 6 counts. Mandatory Madd occurs with Madd letters followed by Hamza/Sukoon',
        example: 'جَآءَ',
        exampleTrans: 'Jaaa-a'
    }
];

export default function TajweedPage() {
    const playAudio = (example: string) => {
        // Placeholder for real audio
        alert(`Playing audio for: ${example}`);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
                        Quranic Sciences
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Tajweed Rules</h1>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Master the correct pronunciation and recitation of the Holy Quran through these essential rules.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tajweedRules.map((rule, idx) => (
                        <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`
                                card-premium p-6 border-l-4 overflow-hidden relative group hover:-translate-y-1 transition-transform
                                ${rule.borderColor}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${rule.color}`}>
                                    {rule.arabic}
                                </div>
                                <Volume2 className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] opacity-50 group-hover:opacity-100 transition-all" />
                            </div>

                            <h3 className="font-serif text-xl mb-2 text-[var(--color-text)]">{rule.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                                {rule.description}
                            </p>

                            <div className="mt-auto bg-[var(--color-bg-warm)] rounded-xl p-4 flex items-center justify-between group-hover:bg-[var(--color-bg-elevated)] transition-colors">
                                <div>
                                    <span className="block font-arabic text-2xl mb-1">{rule.example}</span>
                                    <span className="text-xs text-[var(--color-text-muted)] italic">{rule.exampleTrans}</span>
                                </div>
                                <button
                                    onClick={() => playAudio(rule.example)}
                                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[var(--color-primary)] hover:scale-110 active:scale-95 transition-transform"
                                >
                                    <Mic className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Learn More Card */}
                    <div className="card-premium p-8 bg-[var(--color-primary)] text-white flex flex-col justify-center items-center text-center">
                        <BookOpen className="w-12 h-12 mb-4 text-[var(--color-accent)]" />
                        <h3 className="font-serif text-2xl mb-2">Practice Mode</h3>
                        <p className="text-white/70 mb-6">Coming Soon: Interactive exercises to test your recognition of rules.</p>
                        <button className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--color-primary)] w-full justify-center">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
