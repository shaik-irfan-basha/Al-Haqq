'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Check, X, Clock, Calendar, TrendingUp, Award,
    ChevronLeft, ChevronRight, Sun, Sunset, Moon
} from 'lucide-react';

const PRAYERS = [
    { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', icon: Sun, time: 'Dawn' },
    { id: 'dhuhr', name: 'Dhuhr', arabicName: 'الظهر', icon: Sun, time: 'Noon' },
    { id: 'asr', name: 'Asr', arabicName: 'العصر', icon: Sunset, time: 'Afternoon' },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', icon: Sunset, time: 'Sunset' },
    { id: 'isha', name: 'Isha', arabicName: 'العشاء', icon: Moon, time: 'Night' },
];

type PrayerStatus = 'prayed' | 'missed' | 'qaza' | null;

interface DayLog {
    date: string;
    prayers: Record<string, PrayerStatus>;
}

const STORAGE_KEY = 'al-haqq-prayer-tracker';

export default function PrayerTrackerPage() {
    const [currentWeekStart, setCurrentWeekStart] = React.useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });

    const [prayerLogs, setPrayerLogs] = React.useState<Record<string, DayLog>>({});
    const [stats, setStats] = React.useState({ total: 0, prayed: 0, streak: 0 });

    // Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setPrayerLogs(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    React.useEffect(() => {
        if (Object.keys(prayerLogs).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prayerLogs));
        }
    }, [prayerLogs]);

    // Calculate stats
    React.useEffect(() => {
        let total = 0;
        let prayed = 0;
        let streak = 0;
        let currentStreak = 0;

        const sortedDates = Object.keys(prayerLogs).sort().reverse();

        for (const dateStr of sortedDates) {
            const dayLog = prayerLogs[dateStr];
            let dayPrayed = 0;
            let dayTotal = 0;

            for (const prayer of PRAYERS) {
                const status = dayLog.prayers[prayer.id];
                if (status) {
                    dayTotal++;
                    total++;
                    if (status === 'prayed' || status === 'qaza') {
                        prayed++;
                        dayPrayed++;
                    }
                }
            }

            if (dayPrayed === 5 && dayTotal === 5) {
                currentStreak++;
            } else if (dayTotal > 0) {
                if (streak === 0) streak = currentStreak;
                break;
            }
        }

        if (streak === 0) streak = currentStreak;
        setStats({ total, prayed, streak });
    }, [prayerLogs]);

    const getWeekDays = () => {
        const days: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const isToday = (date: Date) => {
        return formatDate(date) === formatDate(new Date());
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const togglePrayer = (date: Date, prayerId: string) => {
        const dateStr = formatDate(date);
        const currentLog = prayerLogs[dateStr] || { date: dateStr, prayers: {} };
        const currentStatus = currentLog.prayers[prayerId];

        let newStatus: PrayerStatus;
        if (!currentStatus) {
            newStatus = 'prayed';
        } else if (currentStatus === 'prayed') {
            newStatus = 'missed';
        } else if (currentStatus === 'missed') {
            newStatus = 'qaza';
        } else {
            newStatus = null;
        }

        setPrayerLogs({
            ...prayerLogs,
            [dateStr]: {
                ...currentLog,
                prayers: {
                    ...currentLog.prayers,
                    [prayerId]: newStatus,
                },
            },
        });
    };

    const getPrayerStatus = (date: Date, prayerId: string): PrayerStatus => {
        const dateStr = formatDate(date);
        return prayerLogs[dateStr]?.prayers[prayerId] || null;
    };

    const previousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const nextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    const weekDays = getWeekDays();

    return (
        <div className="min-h-screen py-20 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-text)] mb-4">
                        Prayer Tracker
                    </h1>
                    <p className="text-xl font-arabic text-[var(--color-primary)]" dir="rtl">
                        متابعة الصلاة
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
                        Track your daily prayers and build a consistent habit
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                >
                    <div className="card-premium p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-text)]">{stats.prayed}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">Prayers Completed</p>
                    </div>

                    <div className="card-premium p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-text)]">
                            {stats.total > 0 ? Math.round((stats.prayed / stats.total) * 100) : 0}%
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">Completion Rate</p>
                    </div>

                    <div className="card-premium p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-3xl font-bold text-[var(--color-text)]">{stats.streak}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">Day Streak 🔥</p>
                    </div>
                </motion.div>

                {/* Week Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between mb-6"
                >
                    <button
                        onClick={previousWeek}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-[var(--color-text)]" />
                    </button>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                        <span className="font-medium text-[var(--color-text)]">
                            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' - '}
                            {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <button
                        onClick={nextWeek}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-[var(--color-text)]" />
                    </button>
                </motion.div>

                {/* Prayer Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card-premium overflow-hidden"
                >
                    {/* Header Row */}
                    <div className="grid grid-cols-8 border-b border-[var(--color-border)]">
                        <div className="p-4 font-medium text-[var(--color-text-muted)] text-sm">
                            Prayer
                        </div>
                        {weekDays.map((day) => (
                            <div
                                key={day.toISOString()}
                                className={`p-4 text-center ${isToday(day) ? 'bg-[var(--color-primary)]/5' : ''}`}
                            >
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <p className={`text-sm font-medium ${isToday(day) ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                                    {day.getDate()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Prayer Rows */}
                    {PRAYERS.map((prayer) => {
                        const Icon = prayer.icon;
                        return (
                            <div
                                key={prayer.id}
                                className="grid grid-cols-8 border-b border-[var(--color-border)] last:border-b-0"
                            >
                                <div className="p-4 flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
                                    <div>
                                        <p className="font-medium text-[var(--color-text)] text-sm">{prayer.name}</p>
                                        <p className="text-xs text-[var(--color-text-muted)] font-arabic">{prayer.arabicName}</p>
                                    </div>
                                </div>

                                {weekDays.map((day) => {
                                    const status = getPrayerStatus(day, prayer.id);
                                    const canEdit = isToday(day) || isPast(day);

                                    return (
                                        <div
                                            key={`${day.toISOString()}-${prayer.id}`}
                                            className={`p-4 flex items-center justify-center ${isToday(day) ? 'bg-[var(--color-primary)]/5' : ''}`}
                                        >
                                            <button
                                                onClick={() => canEdit && togglePrayer(day, prayer.id)}
                                                disabled={!canEdit}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${status === 'prayed'
                                                    ? 'bg-green-500 text-white'
                                                    : status === 'missed'
                                                        ? 'bg-red-500 text-white'
                                                        : status === 'qaza'
                                                            ? 'bg-amber-500 text-white'
                                                            : canEdit
                                                                ? 'bg-[var(--color-bg-warm)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]'
                                                                : 'bg-[var(--color-bg-warm)]/50 text-[var(--color-text-muted)]/50 cursor-not-allowed'
                                                    }`}
                                                title={
                                                    status === 'prayed' ? 'Prayed' :
                                                        status === 'missed' ? 'Missed' :
                                                            status === 'qaza' ? 'Made up (Qaza)' :
                                                                'Tap to log'
                                                }
                                            >
                                                {status === 'prayed' ? (
                                                    <Check className="w-5 h-5" />
                                                ) : status === 'missed' ? (
                                                    <X className="w-5 h-5" />
                                                ) : status === 'qaza' ? (
                                                    <Clock className="w-5 h-5" />
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-current opacity-30" />
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6 mt-6"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Prayed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
                            <X className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Missed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-[var(--color-text-secondary)]">Qaza (Made up)</span>
                    </div>
                </motion.div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 p-6 rounded-xl bg-[var(--color-bg-warm)] border border-[var(--color-border)]"
                >
                    <h3 className="font-semibold text-[var(--color-text)] mb-3">💡 Tips</h3>
                    <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                        <li>• Tap a cell to cycle through: Empty → Prayed → Missed → Qaza</li>
                        <li>• Your data is saved locally in your browser</li>
                        <li>• Try to maintain a streak by praying all 5 prayers daily</li>
                        <li>• Make up missed prayers (Qaza) as soon as possible</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
