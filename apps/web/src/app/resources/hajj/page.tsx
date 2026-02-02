'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Check, ChevronDown, ChevronUp, BookOpen,
    AlertCircle, Compass, Footprints, Calendar, Sun
} from 'lucide-react';

const HAJJ_DAYS = [
    {
        day: '8th Dhul Hijjah',
        name: 'Yawm al-Tarwiyah',
        title: 'Day of Quenching Thirst',
        steps: [
            {
                id: 1,
                title: 'Enter Ihram',
                description: 'Make intention for Hajj from your accommodation in Makkah and enter Ihram.',
                details: [
                    'Perform Ghusl (ritual bath)',
                    'Wear Ihram garments',
                    'Make intention: "Labbayk Allahumma Hajjan"',
                    'Begin reciting Talbiyah',
                ],
                dua: 'لَبَّيْكَ اللَّهُمَّ حَجًّا',
            },
            {
                id: 2,
                title: 'Travel to Mina',
                description: 'Proceed to Mina and stay there until after Fajr the next day.',
                details: [
                    'Pray Dhuhr, Asr, Maghrib, Isha shortened in Mina',
                    'Spend the night in Mina',
                    'Continue reciting Talbiyah',
                    'Engage in dua and remembrance',
                ],
            },
        ],
    },
    {
        day: '9th Dhul Hijjah',
        name: 'Yawm Arafah',
        title: 'The Day of Arafah',
        isMain: true,
        steps: [
            {
                id: 3,
                title: 'Travel to Arafah',
                description: 'After Fajr in Mina, proceed to Arafah - the most important pillar of Hajj.',
                details: [
                    'Leave for Arafah after sunrise',
                    'This is the essence of Hajj - "Hajj is Arafah"',
                    'Must be in Arafah before sunset',
                ],
                dua: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
            },
            {
                id: 4,
                title: 'Stand at Arafah (Wuquf)',
                description: 'The main pillar of Hajj. Make extensive dua until sunset.',
                details: [
                    'Pray Dhuhr and Asr combined and shortened',
                    'Face the Qiblah and make dua with raised hands',
                    'This is when all sins can be forgiven',
                    'Best day for dua - supplicate for yourself, family, Ummah',
                    'Stay until after sunset',
                ],
                dua: 'اللَّهُمَّ إِنَّكَ تَسْمَعُ كَلَامِي، وَتَرَى مَكَانِي، وَتَعْلَمُ سِرِّي وَعَلَانِيَتِي',
            },
            {
                id: 5,
                title: 'Travel to Muzdalifah',
                description: 'After sunset, proceed to Muzdalifah. Do not pray Maghrib until you arrive.',
                details: [
                    'Leave Arafah after sunset',
                    'Pray Maghrib and Isha combined at Muzdalifah',
                    'Collect 49-70 pebbles for stoning',
                    'Sleep under the open sky',
                    'Leave after Fajr prayer',
                ],
            },
        ],
    },
    {
        day: '10th Dhul Hijjah',
        name: 'Yawm al-Nahr',
        title: 'Day of Sacrifice (Eid)',
        steps: [
            {
                id: 6,
                title: 'Stone Jamarat al-Aqabah',
                description: 'Proceed to Mina and stone the largest pillar (Jamarat al-Aqabah) with 7 pebbles.',
                details: [
                    'Leave Muzdalifah after Fajr',
                    'Stone only the large Jamrah today',
                    'Say "Allahu Akbar" with each throw',
                    'Stop reciting Talbiyah after stoning',
                ],
                dua: 'بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ',
            },
            {
                id: 7,
                title: 'Animal Sacrifice',
                description: 'Offer the sacrificial animal (Hady) or arrange for it to be done on your behalf.',
                details: [
                    'Sacrifice is obligatory for Tamattu and Qiran Hajj',
                    'Can delegate to organizations',
                    'The meat is distributed to the poor',
                ],
            },
            {
                id: 8,
                title: 'Shave or Trim Hair',
                description: 'Men shave their head (preferred) or trim. Women trim a fingertip length.',
                details: [
                    'Halq (shaving) has more reward for men',
                    'After this, most Ihram restrictions are lifted',
                    'Can wear normal clothes',
                    'Marriage and intimacy still prohibited',
                ],
            },
            {
                id: 9,
                title: 'Tawaf al-Ifadah',
                description: 'Perform Tawaf around the Kaaba - this is a pillar of Hajj.',
                details: [
                    'Go to Masjid al-Haram in Makkah',
                    'Perform Tawaf (7 rounds)',
                    'Pray 2 rakah at Maqam Ibrahim',
                    'Drink Zamzam water',
                ],
            },
            {
                id: 10,
                title: "Sa'i between Safa and Marwa",
                description: 'Perform Sa\'i if doing Tamattu or if not done during arrival.',
                details: [
                    'Walk/jog between Safa and Marwa 7 times',
                    'After this, all Ihram restrictions are lifted',
                    'Return to Mina to spend the nights',
                ],
            },
        ],
    },
    {
        day: '11th-13th Dhul Hijjah',
        name: 'Ayyam al-Tashreeq',
        title: 'Days of Tashreeq',
        steps: [
            {
                id: 11,
                title: 'Stone All Three Jamarat',
                description: 'Each day after Dhuhr, stone all three pillars in order.',
                details: [
                    'Start with the small Jamrah (7 pebbles)',
                    'Then the middle Jamrah (7 pebbles)',
                    'Finally the large Jamrah (7 pebbles)',
                    'Total: 21 pebbles per day',
                    'Make dua after small and middle Jamrah',
                ],
                dua: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ',
            },
            {
                id: 12,
                title: 'Stay in Mina',
                description: 'Spend the nights in Mina and engage in worship.',
                details: [
                    'Stay overnight in Mina (obligatory)',
                    'Can leave after stoning on 12th if in a hurry',
                    'Otherwise stay for 13th (more reward)',
                ],
            },
        ],
    },
    {
        day: 'Before Leaving Makkah',
        name: 'Tawaf al-Wada',
        title: 'Farewell Tawaf',
        steps: [
            {
                id: 13,
                title: 'Farewell Tawaf',
                description: 'Before leaving Makkah, perform the Farewell Tawaf.',
                details: [
                    'Last act before departing Makkah',
                    'Perform Tawaf (7 rounds) without Sa\'i',
                    'Pray 2 rakah at Maqam Ibrahim',
                    'Leave the mosque walking backwards facing Kaaba (sunnah)',
                    'Make final duas',
                ],
                dua: 'اللَّهُمَّ إِنَّ هَذَا بَيْتُكَ، وَأَنَا عَبْدُكَ وَابْنُ عَبْدِكَ',
            },
        ],
    },
];

export default function HajjGuidePage() {
    const [expandedDay, setExpandedDay] = React.useState<number>(0);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

    const toggleDay = (index: number) => {
        setExpandedDay(expandedDay === index ? -1 : index);
    };

    const toggleComplete = (stepId: number) => {
        setCompletedSteps(prev =>
            prev.includes(stepId)
                ? prev.filter(id => id !== stepId)
                : [...prev, stepId]
        );
    };

    const totalSteps = HAJJ_DAYS.reduce((acc, day) => acc + day.steps.length, 0);

    return (
        <div className="min-h-screen py-20 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Compass className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">
                        Hajj Guide
                    </h1>
                    <p className="text-2xl font-arabic text-[var(--color-primary)]" dir="rtl">
                        دليل الحج
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
                        A complete day-by-day guide to performing Hajj with duas and instructions
                    </p>
                </motion.div>

                {/* Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--color-text-muted)]">Progress</span>
                        <span className="text-sm font-medium text-[var(--color-primary)]">
                            {completedSteps.length} / {totalSteps} steps
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-bg-warm)] overflow-hidden">
                        <motion.div
                            className="h-full bg-[var(--color-primary)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedSteps.length / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </motion.div>

                {/* Important Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-8 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-[var(--color-text)]">Important</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        This guide is for reference. Please study with a qualified scholar before Hajj and
                        consult your Hajj group leader for specific instructions based on your Hajj type
                        (Ifrad, Qiran, or Tamattu).
                    </p>
                </motion.div>

                {/* Days */}
                <div className="space-y-4">
                    {HAJJ_DAYS.map((day, dayIndex) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + dayIndex * 0.05 }}
                            className={`card-premium overflow-hidden ${day.isMain ? 'ring-2 ring-[var(--color-primary)]/30' : ''
                                }`}
                        >
                            {/* Day Header */}
                            <button
                                onClick={() => toggleDay(dayIndex)}
                                className="w-full p-6 flex items-center gap-4 text-left"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${day.isMain
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                    }`}>
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg text-[var(--color-text)]">
                                            {day.day}
                                        </h3>
                                        {day.isMain && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                                Most Important
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {day.name} — {day.title}
                                    </p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-[var(--color-text)]">
                                        {day.steps.filter(s => completedSteps.includes(s.id)).length} / {day.steps.length}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">completed</p>
                                </div>
                                {expandedDay === dayIndex ? (
                                    <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                                )}
                            </button>

                            {/* Steps */}
                            <AnimatePresence>
                                {expandedDay === dayIndex && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 space-y-4">
                                            {day.steps.map((step) => {
                                                const isCompleted = completedSteps.includes(step.id);

                                                return (
                                                    <div
                                                        key={step.id}
                                                        className={`p-4 rounded-xl border ${isCompleted
                                                                ? 'bg-green-500/5 border-green-500/20'
                                                                : 'bg-[var(--color-bg-warm)] border-[var(--color-border)]'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                                }`}>
                                                                {isCompleted ? (
                                                                    <Check className="w-4 h-4" />
                                                                ) : (
                                                                    <span className="text-sm font-medium">{step.id}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-[var(--color-text)]">
                                                                    {step.title}
                                                                </h4>
                                                                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                                                    {step.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Details */}
                                                        <ul className="ml-11 space-y-1 mb-3">
                                                            {step.details.map((detail, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                                                                    <span className="text-[var(--color-primary)]">•</span>
                                                                    {detail}
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* Dua */}
                                                        {step.dua && (
                                                            <div className="ml-11 p-3 rounded-lg bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                                                                <p className="font-arabic text-lg text-[var(--color-text)] text-right" dir="rtl">
                                                                    {step.dua}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Complete Button */}
                                                        <button
                                                            onClick={() => toggleComplete(step.id)}
                                                            className={`ml-11 mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isCompleted
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                                                                }`}
                                                        >
                                                            {isCompleted ? '✓ Completed' : 'Mark Complete'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Completion */}
                {completedSteps.length === totalSteps && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
                    >
                        <div className="text-4xl mb-4">🕋</div>
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                            Hajj Mabrur!
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            May Allah accept your Hajj and grant you Hajj Mabrur.
                        </p>
                        <p className="font-arabic text-lg text-[var(--color-primary)] mt-2">
                            حج مبرور وذنب مغفور
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
