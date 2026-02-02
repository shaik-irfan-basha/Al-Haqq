'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Check, ChevronDown, ChevronUp, BookOpen,
    Navigation, Clock, AlertCircle, Compass, Footprints
} from 'lucide-react';

const UMRAH_STEPS = [
    {
        id: 1,
        title: 'Ihram & Miqat',
        arabicTitle: 'الإحرام والميقات',
        description: 'Enter the state of Ihram before crossing the Miqat. Make intention for Umrah and recite Talbiyah.',
        details: [
            'Perform Ghusl (ritual bath) and wear Ihram garments',
            'Men wear two white unstitched cloths; women wear normal modest clothing',
            'Make intention: "Labbayk Allahumma bi Umrah"',
            'Begin reciting Talbiyah continuously',
        ],
        dua: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        duaTranslation: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace and sovereignty belong to You. You have no partner.',
    },
    {
        id: 2,
        title: 'Entering Masjid al-Haram',
        arabicTitle: 'دخول المسجد الحرام',
        description: 'Enter the sacred mosque with the right foot first, reciting the dua for entering the mosque.',
        details: [
            'Enter with right foot first',
            'Recite the dua for entering the mosque',
            'Upon seeing the Kaaba, make dua (accepted time)',
            'Stop reciting Talbiyah when beginning Tawaf',
        ],
        dua: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        duaTranslation: 'O Allah, open for me the gates of Your mercy.',
    },
    {
        id: 3,
        title: 'Tawaf (7 Rounds)',
        arabicTitle: 'الطواف',
        description: 'Circumambulate the Kaaba seven times in an anti-clockwise direction, starting from the Black Stone.',
        details: [
            'Start at the Black Stone corner, facing it',
            'Point towards it or kiss it if possible, saying "Bismillahi Allahu Akbar"',
            'Walk anti-clockwise keeping Kaaba on your left',
            'Men do Raml (brisk walking) in first 3 rounds',
            'Make dua throughout, especially between Rukn Yamani and Black Stone',
            'Complete 7 full rounds',
        ],
        dua: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        duaTranslation: 'Our Lord, give us good in this world and good in the Hereafter, and save us from the punishment of the Fire.',
    },
    {
        id: 4,
        title: 'Prayer at Maqam Ibrahim',
        arabicTitle: 'الصلاة عند مقام إبراهيم',
        description: 'Pray two rakah behind Maqam Ibrahim after completing Tawaf.',
        details: [
            'Pray two rakah Sunnah behind Maqam Ibrahim',
            'Recite Surah Al-Kafirun in first rakah',
            'Recite Surah Al-Ikhlas in second rakah',
            'If not possible near Maqam, pray anywhere in the mosque',
        ],
        dua: 'وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى',
        duaTranslation: 'And take the Maqam of Ibrahim as a place of prayer.',
    },
    {
        id: 5,
        title: 'Drink Zamzam',
        arabicTitle: 'شرب ماء زمزم',
        description: 'Drink Zamzam water and make dua, as dua while drinking Zamzam is accepted.',
        details: [
            'Go to the Zamzam water station',
            'Face the Qiblah',
            'Say Bismillah and drink in 3 sips while standing',
            'Make dua - it is a blessed time',
        ],
        dua: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً وَرِزْقاً وَاسِعاً وَشِفَاءً مِنْ كُلِّ دَاءٍ',
        duaTranslation: 'O Allah, I ask You for beneficial knowledge, abundant provision, and cure from every disease.',
    },
    {
        id: 6,
        title: "Sa'i (7 Rounds)",
        arabicTitle: 'السعي',
        description: "Walk between Safa and Marwa seven times, commemorating Hajar's search for water.",
        details: [
            'Start at Safa - climb and face the Kaaba',
            'Make dua at Safa',
            'Walk to Marwa (this is 1 round)',
            'Men jog between the green lights',
            'At Marwa, face Kaaba and make dua',
            'Walk back to Safa (this is 2nd round)',
            'Complete 7 rounds, ending at Marwa',
        ],
        dua: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ',
        duaTranslation: 'Indeed, Safa and Marwa are among the symbols of Allah.',
    },
    {
        id: 7,
        title: 'Halq or Taqsir',
        arabicTitle: 'الحلق أو التقصير',
        description: 'Men shave their head (Halq) or trim hair (Taqsir). Women trim a fingertip length of hair.',
        details: [
            'Men: Shaving the head (Halq) is preferred and has more reward',
            'Men: Trimming (Taqsir) is also permissible',
            'Women: Trim a fingertip length from the ends of hair',
            'After this, Umrah is complete and Ihram restrictions are lifted',
        ],
        dua: 'الْحَمْدُ لِلَّهِ الَّذِي قَضَى عَنَّا نُسُكَنَا',
        duaTranslation: 'Praise be to Allah who has fulfilled our rites for us.',
    },
];

const PROHIBITIONS = [
    { title: 'Cutting hair or nails', icon: '✂️' },
    { title: 'Using perfume', icon: '🌸' },
    { title: 'Covering head (men)', icon: '🧢' },
    { title: 'Covering face (women)', icon: '😷' },
    { title: 'Wearing stitched clothes (men)', icon: '👔' },
    { title: 'Hunting', icon: '🎯' },
    { title: 'Marriage or proposals', icon: '💍' },
    { title: 'Sexual relations', icon: '❌' },
];

export default function UmrahGuidePage() {
    const [expandedStep, setExpandedStep] = React.useState<number | null>(1);
    const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

    const toggleStep = (stepId: number) => {
        setExpandedStep(expandedStep === stepId ? null : stepId);
    };

    const toggleComplete = (stepId: number) => {
        setCompletedSteps(prev =>
            prev.includes(stepId)
                ? prev.filter(id => id !== stepId)
                : [...prev, stepId]
        );
    };

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
                        Umrah Guide
                    </h1>
                    <p className="text-2xl font-arabic text-[var(--color-primary)]" dir="rtl">
                        دليل العمرة
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
                        A complete step-by-step guide to performing Umrah with duas and instructions
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
                            {completedSteps.length} / {UMRAH_STEPS.length} steps
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-bg-warm)] overflow-hidden">
                        <motion.div
                            className="h-full bg-[var(--color-primary)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedSteps.length / UMRAH_STEPS.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </motion.div>

                {/* Prohibitions Warning */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-8 p-6 rounded-xl bg-red-500/5 border border-red-500/20"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold text-[var(--color-text)]">Prohibitions During Ihram</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PROHIBITIONS.map((item) => (
                            <div key={item.title} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <span>{item.icon}</span>
                                <span>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Steps */}
                <div className="space-y-4">
                    {UMRAH_STEPS.map((step, index) => {
                        const isExpanded = expandedStep === step.id;
                        const isCompleted = completedSteps.includes(step.id);

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className={`card-premium overflow-hidden ${isCompleted ? 'ring-2 ring-green-500/30' : ''
                                    }`}
                            >
                                {/* Header */}
                                <button
                                    onClick={() => toggleStep(step.id)}
                                    className="w-full p-6 flex items-center gap-4 text-left"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                        }`}>
                                        {isCompleted ? <Check className="w-6 h-6" /> : step.id}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-[var(--color-text)]">{step.title}</h3>
                                        <p className="text-sm font-arabic text-[var(--color-text-muted)]">{step.arabicTitle}</p>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    )}
                                </button>

                                {/* Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 border-t border-[var(--color-border)]">
                                                <p className="text-[var(--color-text-secondary)] mt-4 mb-4">
                                                    {step.description}
                                                </p>

                                                {/* Details */}
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
                                                        <Footprints className="w-4 h-4" />
                                                        Steps
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {step.details.map((detail, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                                                                <span className="w-5 h-5 rounded-full bg-[var(--color-bg-warm)] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                                                    {i + 1}
                                                                </span>
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Dua */}
                                                <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                                                    <h4 className="text-sm font-medium text-[var(--color-text)] mb-3 flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                                                        Dua
                                                    </h4>
                                                    <p className="font-arabic text-xl text-[var(--color-text)] leading-loose text-right mb-3" dir="rtl">
                                                        {step.dua}
                                                    </p>
                                                    <p className="text-sm text-[var(--color-text-secondary)] italic">
                                                        {step.duaTranslation}
                                                    </p>
                                                </div>

                                                {/* Complete Button */}
                                                <button
                                                    onClick={() => toggleComplete(step.id)}
                                                    className={`mt-4 w-full py-3 rounded-xl font-medium transition-all ${isCompleted
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                                        }`}
                                                >
                                                    {isCompleted ? '✓ Completed' : 'Mark as Complete'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Completion Message */}
                {completedSteps.length === UMRAH_STEPS.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-8 p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
                    >
                        <div className="text-4xl mb-4">🕋</div>
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                            Umrah Complete!
                        </h3>
                        <p className="text-[var(--color-text-secondary)]">
                            May Allah accept your Umrah. Taqabbal Allahu minna wa minkum.
                        </p>
                        <p className="font-arabic text-lg text-[var(--color-primary)] mt-2">
                            تقبل الله منا ومنكم
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
