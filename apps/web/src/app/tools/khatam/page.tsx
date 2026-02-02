'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Circle, Trophy, BarChart, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface KhatamState {
    completedJuz: number[]; // Array of completed Juz IDs (1-30)
    lastRead: number; // Date timestamp
    startedAt: number; // Date timestamp
    goalDate?: number; // Optional goal
}

export default function KhatamPage() {
    const [progress, setProgress] = useState<KhatamState>({
        completedJuz: [],
        lastRead: Date.now(),
        startedAt: Date.now()
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const supabase = createClient();
            const session = supabase ? (await supabase.auth.getSession()).data.session : null;

            if (session && supabase) {
                setIsLoggedIn(true);
                const { data: serverData } = await supabase
                    .from('khatam_progress')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (serverData) {
                    setProgress({
                        completedJuz: serverData.completed_juz || [],
                        lastRead: new Date(serverData.updated_at).getTime(),
                        startedAt: new Date(serverData.start_date || serverData.created_at).getTime(),
                        goalDate: serverData.target_date ? new Date(serverData.target_date).getTime() : undefined
                    });
                }
            } else {
                const saved = localStorage.getItem('khatam-progress');
                if (saved) {
                    setProgress(JSON.parse(saved));
                }
            }
        };
        loadData();
    }, []);

    // Save to local storage (Guest) OR Server (Auth)
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('khatam-progress', JSON.stringify(progress));
        }
    }, [progress, isLoggedIn]);

    const toggleJuz = async (juzNumber: number) => {
        let newState: KhatamState | null = null;
        setProgress((prev: KhatamState) => {
            const isCompleted = prev.completedJuz.includes(juzNumber);
            const newList = isCompleted
                ? prev.completedJuz.filter((j: number) => j !== juzNumber)
                : [...prev.completedJuz, juzNumber];

            newState = {
                ...prev,
                completedJuz: newList,
                lastRead: Date.now()
            };
            return newState;
        });

        if (isLoggedIn && newState) {
            // Safe access using the captured variable
            const stateToSave = newState as KhatamState;
            const supabase = createClient();
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    // Check if exists logic could be simpler with upsert if id is known, 
                    // but simple upsert on user_id constraint is easiest if supported.
                    // Assuming user_id unique constraint or doing upsert.
                    const { error } = await supabase.from('khatam_progress').upsert({
                        user_id: session.user.id,
                        completed_juz: stateToSave.completedJuz,
                        current_juz: juzNumber,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });

                    if (error) console.error("Sync error", error);
                }
            }
        }
    };

    const completionPercentage = Math.round((progress.completedJuz.length / 30) * 100);

    const resetProgress = async () => {
        if (confirm("Are you sure you want to reset your Khatam progress? This cannot be undone.")) {
            const emptyState = {
                completedJuz: [],
                lastRead: Date.now(),
                startedAt: Date.now()
            };
            setProgress(emptyState);

            if (isLoggedIn) {
                const supabase = createClient();
                if (supabase) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        await supabase.from('khatam_progress').update({
                            completed_juz: [],
                            is_completed: false,
                            updated_at: new Date().toISOString()
                        }).eq('user_id', session.user.id);
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] text-sm font-medium mb-4">
                        Quran Completion
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-6">Khatam Tracker</h1>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
                        Track your journey through the Holy Quran. Mark each Juz as you complete it.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="card-premium p-8 bg-[var(--color-primary)] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-white/20 mb-6 relative">
                                    <span className="text-2xl font-bold">{completionPercentage}%</span>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-white/10"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                        <path
                                            className="text-[var(--color-accent)] transition-all duration-1000 ease-out"
                                            strokeDasharray={`${completionPercentage}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-medium mb-2">Total Progress</h3>
                                <p className="text-white/70 mb-6">{progress.completedJuz.length} / 30 Juz Completed</p>

                                {completionPercentage === 100 && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white/20 backdrop-blur-md rounded-lg p-4 mb-4"
                                    >
                                        <Trophy className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-2" />
                                        <p className="font-bold">MashaAllah! Khatam Completed!</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-[var(--color-primary)]" />
                                Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-text-secondary)]">Remaining</span>
                                    <span className="font-medium text-[var(--color-text)]">{30 - progress.completedJuz.length} Juz</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[var(--color-text-secondary)]">Started</span>
                                    <span className="font-medium text-[var(--color-text)]">{new Date(progress.startedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={resetProgress}
                                className="w-full mt-6 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Progress
                            </button>
                        </div>
                    </motion.div>

                    {/* Juz Grid */}
                    <div className="lg:col-span-2">
                        <div className="card-premium p-8">
                            <h2 className="font-serif text-2xl mb-6 text-[var(--color-text)]">Juz Tracker</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                                    const isCompleted = progress.completedJuz.includes(juz);
                                    return (
                                        <motion.button
                                            key={juz}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleJuz(juz)}
                                            className={`
                                                relative p-4 rounded-xl border text-center transition-all duration-300
                                                ${isCompleted
                                                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md'
                                                    : 'bg-[var(--color-bg-card)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                                                }
                                            `}
                                        >
                                            <div className="text-xs uppercase tracking-wider opacity-70 mb-1">Juz</div>
                                            <div className="text-xl font-bold font-serif">{juz}</div>
                                            {isCompleted && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-2 right-2"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-[var(--color-accent)]" />
                                                </motion.div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
