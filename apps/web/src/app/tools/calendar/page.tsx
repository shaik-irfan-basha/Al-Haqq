'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Calendar, Moon, Star, ChevronLeft, ChevronRight,
    Sparkles, Sun
} from 'lucide-react';

// Islamic months
const ISLAMIC_MONTHS = [
    { name: 'Muharram', arabic: 'مُحَرَّم', meaning: 'Sacred' },
    { name: 'Safar', arabic: 'صَفَر', meaning: 'Empty' },
    { name: 'Rabi al-Awwal', arabic: 'رَبِيع الأَوَّل', meaning: 'First Spring' },
    { name: 'Rabi al-Thani', arabic: 'رَبِيع الثَّانِي', meaning: 'Second Spring' },
    { name: 'Jumada al-Awwal', arabic: 'جُمَادَى الأَوَّل', meaning: 'First Freeze' },
    { name: 'Jumada al-Thani', arabic: 'جُمَادَى الثَّانِي', meaning: 'Second Freeze' },
    { name: 'Rajab', arabic: 'رَجَب', meaning: 'Respect' },
    { name: 'Sha\'ban', arabic: 'شَعْبَان', meaning: 'Scattered' },
    { name: 'Ramadan', arabic: 'رَمَضَان', meaning: 'Burning Heat' },
    { name: 'Shawwal', arabic: 'شَوَّال', meaning: 'Raised' },
    { name: 'Dhu al-Qi\'dah', arabic: 'ذُو القَعْدَة', meaning: 'Sitting' },
    { name: 'Dhu al-Hijjah', arabic: 'ذُو الحِجَّة', meaning: 'Pilgrimage' }
];

// Important Islamic events
const ISLAMIC_EVENTS = [
    { month: 1, day: 1, name: 'Islamic New Year', arabic: 'رأس السنة الهجرية', type: 'celebration' },
    { month: 1, day: 10, name: 'Day of Ashura', arabic: 'يوم عاشوراء', type: 'fasting' },
    { month: 3, day: 12, name: 'Mawlid al-Nabi', arabic: 'المولد النبوي', type: 'celebration' },
    { month: 7, day: 27, name: 'Isra and Mi\'raj', arabic: 'الإسراء والمعراج', type: 'special' },
    { month: 8, day: 15, name: 'Laylat al-Bara\'at', arabic: 'ليلة البراءة', type: 'special' },
    { month: 9, day: 1, name: 'Start of Ramadan', arabic: 'بداية رمضان', type: 'celebration' },
    { month: 9, day: 27, name: 'Laylat al-Qadr', arabic: 'ليلة القدر', type: 'special' },
    { month: 10, day: 1, name: 'Eid al-Fitr', arabic: 'عيد الفطر', type: 'eid' },
    { month: 12, day: 8, name: 'Day of Tarwiyah', arabic: 'يوم التروية', type: 'hajj' },
    { month: 12, day: 9, name: 'Day of Arafah', arabic: 'يوم عرفة', type: 'fasting' },
    { month: 12, day: 10, name: 'Eid al-Adha', arabic: 'عيد الأضحى', type: 'eid' },
];

// Hijri date calculation (approximate - for display purposes)
function gregorianToHijri(gDate: Date): { year: number; month: number; day: number } {
    const epochJD = 1948439.5; // Julian date of Islamic epoch
    const gregorianEpoch = 1721425.5;

    // Calculate Julian Day Number
    const y = gDate.getFullYear();
    const m = gDate.getMonth() + 1;
    const d = gDate.getDate();

    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;

    const jd = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;

    // Convert to Hijri
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const ll = l - 10631 * n + 354;
    const j = Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719) + Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
    const lll = ll - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;

    const hijriMonth = Math.floor((24 * lll) / 709);
    const hijriDay = lll - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    return { year: hijriYear, month: hijriMonth, day: hijriDay };
}

function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
    const jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;

    const a = jd + 32044;
    const b = Math.floor((4 * a + 3) / 1461);
    const c = a - Math.floor((1461 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1225);
    const e = c - Math.floor((1225 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);

    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);

    return new Date(year, month - 1, day);
}

export default function IslamicCalendarPage() {
    const [currentDate] = React.useState(new Date());
    const [selectedHijriDate, setSelectedHijriDate] = React.useState(() => gregorianToHijri(new Date()));
    const [converterMode, setConverterMode] = React.useState<'toHijri' | 'toGregorian'>('toHijri');
    const [inputDate, setInputDate] = React.useState('');
    const [convertedResult, setConvertedResult] = React.useState<string | null>(null);

    const todayHijri = gregorianToHijri(currentDate);
    const currentMonth = ISLAMIC_MONTHS[todayHijri.month - 1];

    // Get events for current Hijri month
    const currentMonthEvents = ISLAMIC_EVENTS.filter(e => e.month === todayHijri.month);

    // Get upcoming events
    const upcomingEvents = ISLAMIC_EVENTS.filter(e => {
        if (e.month > todayHijri.month) return true;
        if (e.month === todayHijri.month && e.day >= todayHijri.day) return true;
        return false;
    }).slice(0, 5);

    const handleConvert = () => {
        if (!inputDate) return;

        try {
            if (converterMode === 'toHijri') {
                const gDate = new Date(inputDate);
                const hijri = gregorianToHijri(gDate);
                const monthName = ISLAMIC_MONTHS[hijri.month - 1]?.name || 'Unknown';
                setConvertedResult(`${hijri.day} ${monthName} ${hijri.year} AH`);
            } else {
                const parts = inputDate.split('-').map(Number);
                if (parts.length === 3) {
                    const gDate = hijriToGregorian(parts[0], parts[1], parts[2]);
                    setConvertedResult(gDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }));
                }
            }
        } catch (e) {
            setConvertedResult('Invalid date format');
        }
    };

    const navigateMonth = (delta: number) => {
        let newMonth = selectedHijriDate.month + delta;
        let newYear = selectedHijriDate.year;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setSelectedHijriDate({ ...selectedHijriDate, month: newMonth, year: newYear });
    };

    const getEventTypeStyle = (type: string) => {
        switch (type) {
            case 'eid':
                return 'bg-green-500/10 text-green-600 dark:text-green-400';
            case 'fasting':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
            case 'special':
                return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
            case 'hajj':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
            default:
                return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Tools</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            التقويم الهجري
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            Islamic Calendar
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                            Track Hijri dates, convert between calendars, and view upcoming Islamic events.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Today's Date Card */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-premium p-8 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-[var(--color-accent)]" />
                            <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider">Today</span>
                        </div>

                        <div className="mb-4">
                            <p className="font-arabic text-4xl md:text-5xl text-[var(--color-text)] mb-2" dir="rtl">
                                {currentMonth?.arabic}
                            </p>
                            <p className="font-serif text-3xl md:text-4xl text-[var(--color-primary)]">
                                {todayHijri.day} {currentMonth?.name} {todayHijri.year} AH
                            </p>
                        </div>

                        <p className="text-[var(--color-text-secondary)]">
                            {currentDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Date Converter */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                            <h3 className="font-serif text-xl text-[var(--color-text)]">Date Converter</h3>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => { setConverterMode('toHijri'); setConvertedResult(null); }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${converterMode === 'toHijri'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-bg-warm)] text-[var(--color-text-secondary)]'
                                    }`}
                            >
                                Gregorian → Hijri
                            </button>
                            <button
                                onClick={() => { setConverterMode('toGregorian'); setConvertedResult(null); }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${converterMode === 'toGregorian'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-bg-warm)] text-[var(--color-text-secondary)]'
                                    }`}
                            >
                                Hijri → Gregorian
                            </button>
                        </div>

                        {/* Input */}
                        <div className="flex gap-4">
                            <input
                                type={converterMode === 'toHijri' ? 'date' : 'text'}
                                value={inputDate}
                                onChange={(e) => setInputDate(e.target.value)}
                                placeholder={converterMode === 'toGregorian' ? 'YYYY-MM-DD (e.g., 1446-08-14)' : ''}
                                className="input-premium flex-1"
                            />
                            <button
                                onClick={handleConvert}
                                className="btn-primary"
                            >
                                Convert
                            </button>
                        </div>

                        {/* Result */}
                        {convertedResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 rounded-xl bg-[var(--color-bg-warm)] text-center"
                            >
                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Result</p>
                                <p className="font-serif text-xl text-[var(--color-primary)]">{convertedResult}</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Islamic Months */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-[var(--color-accent)]" />
                                <h3 className="font-serif text-xl text-[var(--color-text)]">Islamic Months</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-warm)] transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                                </button>
                                <span className="text-sm text-[var(--color-text-secondary)] min-w-[100px] text-center">
                                    {selectedHijriDate.year} AH
                                </span>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-warm)] transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {ISLAMIC_MONTHS.map((month, index) => {
                                const isCurrentMonth = index + 1 === todayHijri.month;
                                const isSelected = index + 1 === selectedHijriDate.month;

                                return (
                                    <button
                                        key={month.name}
                                        onClick={() => setSelectedHijriDate({ ...selectedHijriDate, month: index + 1 })}
                                        className={`p-4 rounded-xl text-left transition-all ${isSelected
                                                ? 'bg-[var(--color-primary)] text-white'
                                                : isCurrentMonth
                                                    ? 'bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]'
                                                    : 'bg-[var(--color-bg-warm)] hover:bg-[var(--color-border)]'
                                            }`}
                                    >
                                        <p className={`font-arabic text-lg mb-1 ${isSelected ? 'text-white' : 'text-[var(--color-text)]'}`} dir="rtl">
                                            {month.arabic}
                                        </p>
                                        <p className={`text-sm font-medium ${isSelected ? 'text-white/90' : 'text-[var(--color-text-secondary)]'}`}>
                                            {month.name}
                                        </p>
                                        <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}>
                                            {month.meaning}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-premium p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                            <h3 className="font-serif text-xl text-[var(--color-text)]">Upcoming Events</h3>
                        </div>

                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                                <div
                                    key={`${event.month}-${event.day}`}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-warm)]"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEventTypeStyle(event.type)}`}>
                                        <span className="text-lg font-bold">{event.day}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--color-text)]">{event.name}</p>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {ISLAMIC_MONTHS[event.month - 1]?.name} {selectedHijriDate.year} AH
                                        </p>
                                    </div>
                                    <p className="font-arabic text-[var(--color-text-secondary)]" dir="rtl">
                                        {event.arabic}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-center text-[var(--color-text-muted)] py-8">
                                    No upcoming events this year. Events will reset next year.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
