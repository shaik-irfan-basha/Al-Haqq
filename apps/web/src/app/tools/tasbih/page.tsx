'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Save, History, Settings, Volume2, VolumeX, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function TasbihPage() {
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [history, setHistory] = useState<{ date: string, count: number, label: string }[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [showHistory, setShowHistory] = useState(false);

    // Load from local storage
    useEffect(() => {
        const savedHistory = localStorage.getItem('tasbih_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    const handleIncrement = () => {
        const newCount = count + 1;
        setCount(newCount);

        // Haptic feedback
        if (vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Sound effect (simple click)
        if (soundEnabled) {
            const audio = new Audio('/sounds/click.mp3'); // We'll need to add this asset or use a synthesized sound
            // Fallback synthesized click if file doesn't exist (simulated here)
            // In a real app we'd use Web Audio API for low latency
        }

        // Target reached feedback
        if (newCount % target === 0) {
            if (vibrationEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
        }
    };

    const handleReset = () => {
        if (count > 0) {
            const entry = {
                date: new Date().toLocaleString(),
                count,
                label: `Session ${history.length + 1}`
            };
            const newHistory = [entry, ...history].slice(0, 10); // Keep last 10
            setHistory(newHistory);
            localStorage.setItem('tasbih_history', JSON.stringify(newHistory));
        }
        setCount(0);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[var(--color-bg)] flex flex-col">
            <div className="max-w-md mx-auto w-full px-6 flex-1 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/tools" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                        ← Back
                    </Link>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setVibrationEnabled(!vibrationEnabled)}
                            className={`p-2 rounded-full ${vibrationEnabled ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-[var(--color-text-muted)]'}`}
                        >
                            <Smartphone className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2 rounded-full ${showHistory ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-[var(--color-text-muted)]'}`}
                        >
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Counter Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative">

                    {/* Progress Ring Background */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <div className="w-72 h-72 rounded-full border-4 border-[var(--color-text)] scale-150"></div>
                        <div className="absolute w-96 h-96 rounded-full border-2 border-[var(--color-text)]"></div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleIncrement}
                        className="w-64 h-64 rounded-full bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg)] border-8 border-[var(--color-bg-card)] shadow-2xl shadow-emerald-500/10 flex flex-col items-center justify-center relative z-10 group select-none"
                    >
                        <div className="absolute inset-0 rounded-full bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-2">Count</span>
                        <span className="text-7xl font-bold font-serif text-[var(--color-text)] tabular-nums">
                            {count}
                        </span>

                        {/* Target Progress */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`h-1.5 w-1.5 rounded-full ${Math.floor(count / target) > i ? 'bg-emerald-500' : 'bg-[var(--color-border)]'
                                    }`} />
                            ))}
                        </div>
                    </motion.button>

                    <div className="mt-12 flex items-center gap-6">
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset</span>
                        </button>

                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
                            <span className="text-sm text-[var(--color-text-muted)]">Target:</span>
                            <select
                                value={target}
                                onChange={(e) => setTarget(parseInt(e.target.value))}
                                className="bg-transparent font-medium outline-none text-[var(--color-text)]"
                            >
                                <option value="33">33</option>
                                <option value="99">99</option>
                                <option value="100">100</option>
                                <option value="1000">1000</option>
                            </select>
                        </div>
                    </div>

                </div>

                {/* History Overlay */}
                <AnimatePresence>
                    {showHistory && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="fixed inset-x-0 bottom-0 bg-[var(--color-bg-card)] border-t border-[var(--color-border)] rounded-t-3xl p-6 shadow-2xl z-50 max-h-[50vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-serif text-lg">History</h3>
                                <button onClick={() => setShowHistory(false)} className="text-sm text-[var(--color-primary)]">Close</button>
                            </div>

                            {history.length === 0 ? (
                                <p className="text-center text-[var(--color-text-muted)] py-8">No sessions recorded yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((entry, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
                                            <div>
                                                <p className="font-medium">{entry.label}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{entry.date}</p>
                                            </div>
                                            <span className="text-xl font-bold font-serif text-[var(--color-primary)]">{entry.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
