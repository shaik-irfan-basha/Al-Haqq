'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Moon, Sun, Clock, Check, X, Utensils,
    ChevronLeft, ChevronRight, Award, TrendingUp, Timer
} from 'lucide-react';

const STORAGE_KEY = 'al-haqq-fasting-tracker';

interface FastingDay {
    date: string;
    status: 'fasted' | 'missed' | 'makeup' | null;
    suhoor: boolean;
    iftar: boolean;
    notes?: string;
}

const SUNNAH_FASTS = [
    { name: 'Monday & Thursday', description: 'Weekly sunnah fasts' },
    { name: 'Ayyam al-Beed', description: '13th, 14th, 15th of each Hijri month' },
    { name: '6 Days of Shawwal', description: 'After Eid al-Fitr' },
    { name: 'Day of Arafah', description: '9th Dhul Hijjah' },
    { name: 'Day of Ashura', description: '10th Muharram' },
];

export default function FastingTrackerPage() {
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [fastingLogs, setFastingLogs] = React.useState<Record<string, FastingDay>>({});
    const [stats, setStats] = React.useState({ fasted: 0, missed: 0, makeup: 0, streak: 0 });

    // Load from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setFastingLogs(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    React.useEffect(() => {
        if (Object.keys(fastingLogs).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fastingLogs));
        }
    }, [fastingLogs]);

    // Calculate stats
    React.useEffect(() => {
        let fasted = 0;
        let missed = 0;
        let makeup = 0;

        Object.values(fastingLogs).forEach((day) => {
            if (day.status === 'fasted') fasted++;
            if (day.status === 'missed') missed++;
            if (day.status === 'makeup') makeup++;
        });

        setStats({ fasted, missed, makeup, streak: 0 });
    }, [fastingLogs]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before the first day
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
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

    const toggleFastStatus = (date: Date) => {
        const dateStr = formatDate(date);
        const currentLog = fastingLogs[dateStr] || { date: dateStr, status: null, suhoor: false, iftar: false };
        const currentStatus = currentLog.status;

        let newStatus: FastingDay['status'];
        if (!currentStatus) {
            newStatus = 'fasted';
        } else if (currentStatus === 'fasted') {
            newStatus = 'missed';
        } else if (currentStatus === 'missed') {
            newStatus = 'makeup';
        } else {
            newStatus = null;
        }

        setFastingLogs({
            ...fastingLogs,
            [dateStr]: {
                ...currentLog,
                status: newStatus,
            },
        });
    };

    const getFastStatus = (date: Date): FastingDay['status'] => {
        const dateStr = formatDate(date);
        return fastingLogs[dateStr]?.status || null;
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
                        Fasting Tracker
                    </h1>
                    <p className="text-xl font-arabic text-[var(--color-primary)]" dir="rtl">
                        متابعة الصيام
                    </p>
                    <p className="text-[var(--color-text-secondary)] mt-4 max-w-2xl mx-auto">
                        Track your fasts throughout the year - Ramadan, Sunnah fasts, and makeup days
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                >
                    <div className="card-premium p-5 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{stats.fasted}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Days Fasted</p>
                    </div>

                    <div className="card-premium p-5 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <X className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{stats.missed}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Missed</p>
                    </div>

                    <div className="card-premium p-5 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Timer className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-text)]">{stats.makeup}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Makeup Days</p>
                    </div>

                    <div className="card-premium p-5 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                            {stats.missed > 0 ? stats.missed : '✓'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">To Make Up</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 card-premium p-6"
                    >
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={previousMonth}
                                className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-[var(--color-text)]" />
                            </button>

                            <h2 className="text-xl font-semibold text-[var(--color-text)]">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>

                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-[var(--color-text)]" />
                            </button>
                        </div>

                        {/* Week Days Header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-[var(--color-text-muted)] py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const status = getFastStatus(day);
                                const canEdit = isToday(day) || isPast(day);

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => canEdit && toggleFastStatus(day)}
                                        disabled={!canEdit}
                                        className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${isToday(day)
                                            ? 'ring-2 ring-[var(--color-primary)]'
                                            : ''
                                            } ${status === 'fasted'
                                                ? 'bg-green-500 text-white'
                                                : status === 'missed'
                                                    ? 'bg-red-500 text-white'
                                                    : status === 'makeup'
                                                        ? 'bg-amber-500 text-white'
                                                        : canEdit
                                                            ? 'bg-[var(--color-bg-warm)] hover:bg-[var(--color-bg-hover)]'
                                                            : 'bg-[var(--color-bg-warm)]/50'
                                            }`}
                                    >
                                        <span className={`text-sm font-medium ${status ? 'text-white' : 'text-[var(--color-text)]'
                                            }`}>
                                            {day.getDate()}
                                        </span>
                                        {status === 'fasted' && (
                                            <Moon className="w-3 h-3 mt-0.5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-[var(--color-border)]">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-green-500" />
                                <span className="text-xs text-[var(--color-text-secondary)]">Fasted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-red-500" />
                                <span className="text-xs text-[var(--color-text-secondary)]">Missed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-amber-500" />
                                <span className="text-xs text-[var(--color-text-secondary)]">Makeup</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sunnah Fasts */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-premium p-6"
                    >
                        <h3 className="font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-[var(--color-primary)]" />
                            Sunnah Fasts
                        </h3>

                        <div className="space-y-4">
                            {SUNNAH_FASTS.map((fast) => (
                                <div
                                    key={fast.name}
                                    className="p-4 rounded-xl bg-[var(--color-bg-warm)] border border-[var(--color-border)]"
                                >
                                    <p className="font-medium text-[var(--color-text)]">{fast.name}</p>
                                    <p className="text-sm text-[var(--color-text-muted)]">{fast.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                            <p className="text-sm text-[var(--color-text)]">
                                <span className="font-medium">Tip:</span> The Prophet ﷺ said: &quot;Whoever fasts Ramadan then follows it with six days of Shawwal, it will be as if he fasted for a lifetime.&quot;
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">— Sahih Muslim</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
