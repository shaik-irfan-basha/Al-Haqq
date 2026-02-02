'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Clock, CheckCircle, XCircle, ArrowRight,
    RotateCcw, Star, Sparkles, BookOpen, Target
} from 'lucide-react';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
    explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        question: "How many Surahs are in the Quran?",
        options: ["100", "114", "120", "99"],
        correctIndex: 1,
        category: "Quran",
        explanation: "The Quran contains 114 Surahs (chapters)."
    },
    {
        id: 2,
        question: "Which is the longest Surah in the Quran?",
        options: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Maidah"],
        correctIndex: 1,
        category: "Quran",
        explanation: "Surah Al-Baqarah is the longest with 286 verses."
    },
    {
        id: 3,
        question: "How many times is the word 'Allah' mentioned in the Quran?",
        options: ["1000", "2698", "3500", "5000"],
        correctIndex: 1,
        category: "Quran",
        explanation: "The word 'Allah' appears 2698 times in the Quran."
    },
    {
        id: 4,
        question: "What is the first pillar of Islam?",
        options: ["Salah", "Zakat", "Shahada", "Sawm"],
        correctIndex: 2,
        category: "Pillars",
        explanation: "Shahada (declaration of faith) is the first and most important pillar."
    },
    {
        id: 5,
        question: "How many rakats are in Fajr prayer?",
        options: ["2", "3", "4", "5"],
        correctIndex: 0,
        category: "Prayer",
        explanation: "Fajr prayer consists of 2 obligatory rakats."
    },
    {
        id: 6,
        question: "In which month was the Quran revealed?",
        options: ["Shaban", "Rajab", "Ramadan", "Dhul Hijjah"],
        correctIndex: 2,
        category: "Quran",
        explanation: "The Quran was first revealed in the month of Ramadan."
    },
    {
        id: 7,
        question: "Who was the first Muezzin in Islam?",
        options: ["Abu Bakr", "Umar", "Bilal", "Ali"],
        correctIndex: 2,
        category: "History",
        explanation: "Bilal ibn Rabah was the first Muezzin, chosen by Prophet Muhammad ﷺ."
    },
    {
        id: 8,
        question: "How many Prophets are mentioned by name in the Quran?",
        options: ["20", "25", "30", "35"],
        correctIndex: 1,
        category: "Prophets",
        explanation: "25 Prophets are mentioned by name in the Quran."
    },
    {
        id: 9,
        question: "What is the meaning of 'Subhanallah'?",
        options: ["Praise be to Allah", "Glory be to Allah", "Allah is Great", "Peace be upon you"],
        correctIndex: 1,
        category: "Arabic",
        explanation: "Subhanallah means 'Glory be to Allah' - declaring His perfection."
    },
    {
        id: 10,
        question: "Which Prophet was swallowed by a whale?",
        options: ["Musa", "Isa", "Yunus", "Yusuf"],
        correctIndex: 2,
        category: "Prophets",
        explanation: "Prophet Yunus (Jonah) was swallowed by a whale as mentioned in the Quran."
    },
    {
        id: 11,
        question: "What is the Night of Power (Laylatul Qadr) better than?",
        options: ["100 nights", "500 nights", "1000 months", "100 years"],
        correctIndex: 2,
        category: "Quran",
        explanation: "Laylatul Qadr is better than 1000 months (Surah Al-Qadr)."
    },
    {
        id: 12,
        question: "What is the Nisab for Zakat on gold?",
        options: ["50 grams", "87.48 grams", "100 grams", "150 grams"],
        correctIndex: 1,
        category: "Pillars",
        explanation: "The Nisab for gold is 87.48 grams (approximately 7.5 tolas)."
    },
];

const CATEGORIES = ['All', 'Quran', 'Pillars', 'Prayer', 'History', 'Prophets', 'Arabic'];

export default function QuizPage() {
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [gameState, setGameState] = React.useState<'menu' | 'playing' | 'result'>('menu');
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
    const [showExplanation, setShowExplanation] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [timer, setTimer] = React.useState(30);
    const [isTimerActive, setIsTimerActive] = React.useState(false);

    // Timer effect
    React.useEffect(() => {
        if (!isTimerActive || timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const startQuiz = () => {
        const filtered = selectedCategory === 'All'
            ? QUIZ_QUESTIONS
            : QUIZ_QUESTIONS.filter(q => q.category === selectedCategory);

        // Shuffle and pick 10 questions
        const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimer(30);
        setIsTimerActive(true);
        setGameState('playing');
    };

    const handleTimeout = () => {
        setIsTimerActive(false);
        setShowExplanation(true);
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        setIsTimerActive(false);
        setShowExplanation(true);

        if (index === questions[currentIndex].correctIndex) {
            setScore(prev => prev + Math.ceil(timer / 3)); // Bonus for quick answers
        }
    };

    const nextQuestion = () => {
        if (currentIndex + 1 >= questions.length) {
            setGameState('result');
        } else {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimer(30);
            setIsTimerActive(true);
        }
    };

    const currentQuestion = questions[currentIndex];
    const maxScore = questions.length * 10;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return (
        <div className="min-h-screen py-20 px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* Menu Screen */}
                    {gameState === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                <Target className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">
                                Islamic Quiz
                            </h1>
                            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                                Test your knowledge of Islam with questions about the Quran, Prophets, Pillars, and more.
                            </p>

                            {/* Category Selection */}
                            <div className="mb-8">
                                <p className="text-sm text-[var(--color-text-muted)] mb-3">Select Category</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                                                    ? 'bg-[var(--color-primary)] text-white'
                                                    : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Start Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startQuiz}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Quiz
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            {/* Stats Preview */}
                            <div className="mt-12 grid grid-cols-3 gap-4">
                                <div className="card-premium p-4">
                                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-[var(--color-primary)]" />
                                    <p className="text-2xl font-bold text-[var(--color-text)]">{QUIZ_QUESTIONS.length}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">Questions</p>
                                </div>
                                <div className="card-premium p-4">
                                    <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--color-accent)]" />
                                    <p className="text-2xl font-bold text-[var(--color-text)]">30s</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">Per Question</p>
                                </div>
                                <div className="card-premium p-4">
                                    <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                                    <p className="text-2xl font-bold text-[var(--color-text)]">10</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">Max Points</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Playing Screen */}
                    {gameState === 'playing' && currentQuestion && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-[var(--color-text-muted)]">
                                        Question {currentIndex + 1} of {questions.length}
                                    </span>
                                    <span className="text-sm font-medium text-[var(--color-primary)]">
                                        Score: {score}
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--color-bg-warm)] overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[var(--color-primary)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Timer */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    animate={{
                                        scale: timer <= 5 ? [1, 1.1, 1] : 1,
                                        color: timer <= 5 ? '#ef4444' : 'var(--color-text)'
                                    }}
                                    transition={{ duration: 0.5, repeat: timer <= 5 ? Infinity : 0 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-warm)]"
                                >
                                    <Clock className="w-5 h-5" />
                                    <span className="text-2xl font-bold tabular-nums">{timer}s</span>
                                </motion.div>
                            </div>

                            {/* Category Badge */}
                            <div className="text-center mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                    {currentQuestion.category}
                                </span>
                            </div>

                            {/* Question */}
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="card-premium p-8 mb-6"
                            >
                                <h2 className="text-xl md:text-2xl font-medium text-[var(--color-text)] text-center">
                                    {currentQuestion.question}
                                </h2>
                            </motion.div>

                            {/* Options */}
                            <div className="grid gap-3 mb-6">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedAnswer === index;
                                    const isCorrect = index === currentQuestion.correctIndex;
                                    const showResult = showExplanation;

                                    let bgClass = 'bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)]';
                                    let borderClass = 'border-[var(--color-border)]';

                                    if (showResult) {
                                        if (isCorrect) {
                                            bgClass = 'bg-green-500/10';
                                            borderClass = 'border-green-500';
                                        } else if (isSelected && !isCorrect) {
                                            bgClass = 'bg-red-500/10';
                                            borderClass = 'border-red-500';
                                        }
                                    } else if (isSelected) {
                                        bgClass = 'bg-[var(--color-primary)]/10';
                                        borderClass = 'border-[var(--color-primary)]';
                                    }

                                    return (
                                        <motion.button
                                            key={index}
                                            whileHover={!showExplanation ? { scale: 1.02 } : {}}
                                            whileTap={!showExplanation ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswer(index)}
                                            disabled={showExplanation}
                                            className={`w-full p-4 rounded-xl border-2 ${bgClass} ${borderClass} text-left transition-all flex items-center gap-3`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${showResult && isCorrect
                                                    ? 'bg-green-500 text-white'
                                                    : showResult && isSelected && !isCorrect
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-[var(--color-bg-warm)] text-[var(--color-text)]'
                                                }`}>
                                                {showResult && isCorrect ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : showResult && isSelected && !isCorrect ? (
                                                    <XCircle className="w-5 h-5" />
                                                ) : (
                                                    String.fromCharCode(65 + index)
                                                )}
                                            </span>
                                            <span className="text-[var(--color-text)]">{option}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            <AnimatePresence>
                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-6"
                                    >
                                        <div className="p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                💡 {currentQuestion.explanation}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Next Button */}
                            {showExplanation && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={nextQuestion}
                                    className="w-full py-4 rounded-xl bg-[var(--color-primary)] text-white font-medium flex items-center justify-center gap-2"
                                >
                                    {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* Result Screen */}
                    {gameState === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
                            >
                                <Trophy className="w-12 h-12 text-white" />
                            </motion.div>

                            <h2 className="font-serif text-3xl md:text-4xl text-[var(--color-text)] mb-2">
                                {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
                            </h2>
                            <p className="text-[var(--color-text-secondary)] mb-8">
                                You completed the quiz
                            </p>

                            {/* Score Display */}
                            <div className="card-premium p-8 mb-8">
                                <div className="text-6xl font-bold text-[var(--color-primary)] mb-2">
                                    {score}
                                </div>
                                <p className="text-[var(--color-text-muted)]">points earned</p>

                                <div className="mt-6 pt-6 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--color-text)]">{percentage}%</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">Accuracy</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[var(--color-text)]">{questions.length}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">Questions</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setGameState('menu')}
                                    className="flex-1 py-4 rounded-xl bg-[var(--color-bg-warm)] text-[var(--color-text)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-bg-hover)] transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Play Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
