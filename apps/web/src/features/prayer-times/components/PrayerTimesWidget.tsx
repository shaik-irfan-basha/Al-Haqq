'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Sunrise, Sun, SunDim, Sunset, Moon, MapPin, RefreshCw, Edit3 } from 'lucide-react';

interface PrayerTime {
    name: string;
    arabicName: string;
    time: string;
    icon: React.ElementType;
}

export default function PrayerTimesWidget() {
    const [prayerTimes, setPrayerTimes] = React.useState<PrayerTime[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [location, setLocation] = React.useState('');
    const [nextPrayer, setNextPrayer] = React.useState<string | null>(null);
    const [countdown, setCountdown] = React.useState('');

    React.useEffect(() => {
        fetchPrayerTimes();
    }, []);

    React.useEffect(() => {
        if (prayerTimes.length === 0) return;

        const interval = setInterval(() => {
            updateNextPrayer();
        }, 1000);

        return () => clearInterval(interval);
    }, [prayerTimes]);

    const fetchPrayerTimes = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

            // 1. Check for manual location override
            const manualLoc = localStorage.getItem('alhaqq_manual_location');
            let lat, lng, methodName;

            if (manualLoc) {
                // Use Geocoding API (or simple search query param if supported, otherwise just show label)
                // For Al-Adhan, we can search by city/country
                const searchRes = await fetch(`https://api.aladhan.com/v1/timingsByAddress/${date}?address=${encodeURIComponent(manualLoc)}&method=2`);
                const searchData = await searchRes.json();

                if (searchData.code === 200) {
                    // Success with manual location
                    const timings = searchData.data.timings;
                    const meta = searchData.data.meta;
                    setLocation(manualLoc); // Keep user's input string

                    setPrayerTimes([
                        { name: 'Fajr', arabicName: 'الفجر', time: timings.Fajr, icon: Sunrise },
                        { name: 'Dhuhr', arabicName: 'الظهر', time: timings.Dhuhr, icon: Sun },
                        { name: 'Asr', arabicName: 'العصر', time: timings.Asr, icon: SunDim },
                        { name: 'Maghrib', arabicName: 'المغرب', time: timings.Maghrib, icon: Sunset },
                        { name: 'Isha', arabicName: 'العشاء', time: timings.Isha, icon: Moon },
                    ]);
                    setLoading(false);
                    return;
                }
            }

            // 2. Fallback to Geolocation
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                });
            });

            const { latitude, longitude } = position.coords;

            // Fetch from Al-Adhan API
            const response = await fetch(
                `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            const data = await response.json();

            if (data.code === 200) {
                const timings = data.data.timings;
                const meta = data.data.meta;

                setLocation(`${meta.timezone?.split('/').pop()?.replace('_', ' ') || 'Unknown'}`);

                setPrayerTimes([
                    { name: 'Fajr', arabicName: 'الفجر', time: timings.Fajr, icon: Sunrise },
                    { name: 'Dhuhr', arabicName: 'الظهر', time: timings.Dhuhr, icon: Sun },
                    { name: 'Asr', arabicName: 'العصر', time: timings.Asr, icon: SunDim },
                    { name: 'Maghrib', arabicName: 'المغرب', time: timings.Maghrib, icon: Sunset },
                    { name: 'Isha', arabicName: 'العشاء', time: timings.Isha, icon: Moon },
                ]);
            }
        } catch (error) {
            // Fallback with demo times
            setPrayerTimes([
                { name: 'Fajr', arabicName: 'الفجر', time: '05:30', icon: Sunrise },
                { name: 'Dhuhr', arabicName: 'الظهر', time: '12:30', icon: Sun },
                { name: 'Asr', arabicName: 'العصر', time: '15:45', icon: SunDim },
                { name: 'Maghrib', arabicName: 'المغرب', time: '18:15', icon: Sunset },
                { name: 'Isha', arabicName: 'العشاء', time: '19:45', icon: Moon },
            ]);
            setLocation('Enable location');
        } finally {
            setLoading(false);
        }
    };

    const updateNextPrayer = () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        for (const prayer of prayerTimes) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerMinutes = hours * 60 + minutes;

            if (prayerMinutes > currentMinutes) {
                setNextPrayer(prayer.name);

                const diff = prayerMinutes - currentMinutes;
                const h = Math.floor(diff / 60);
                const m = diff % 60;
                setCountdown(h > 0 ? `${h}h ${m}m` : `${m}m`);
                return;
            }
        }

        // All prayers passed, next is Fajr tomorrow
        setNextPrayer('Fajr');
        const [fajrH, fajrM] = prayerTimes[0]?.time.split(':').map(Number) || [5, 30];
        const fajrMinutes = fajrH * 60 + fajrM;
        const diff = (24 * 60 - currentMinutes) + fajrMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setCountdown(`${h}h ${m}m`);
    };

    if (loading) {
        return (
            <div className="card-premium p-8">
                <div className="flex items-center justify-center gap-3">
                    <RefreshCw className="w-5 h-5 animate-spin text-[var(--color-primary)]" />
                    <span className="text-[var(--color-text-muted)]">Loading prayer times...</span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-premium p-6 md:p-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--color-text)]">Prayer Times</h3>
                        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] group cursor-pointer" onClick={() => {
                            const manualLoc = prompt('Enter your City and Country (e.g., London, UK):');
                            if (manualLoc) {
                                localStorage.setItem('alhaqq_manual_location', manualLoc);
                                window.location.reload();
                            }
                        }}>
                            <MapPin className="w-3 h-3" />
                            {location}
                            <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                        </div>
                    </div>
                </div>

                {nextPrayer && (
                    <div className="text-right">
                        <span className="text-xs text-[var(--color-text-muted)]">Next: {nextPrayer}</span>
                        <p className="text-lg font-semibold text-[var(--color-primary)]">{countdown}</p>
                    </div>
                )}
            </div>

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-5 gap-2">
                {prayerTimes.map((prayer) => {
                    const Icon = prayer.icon;
                    const isNext = prayer.name === nextPrayer;

                    return (
                        <div
                            key={prayer.name}
                            className={`text-center p-3 rounded-xl transition-all ${isNext
                                ? 'bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]/30'
                                : 'bg-[var(--color-bg-warm)]'
                                }`}
                        >
                            <Icon
                                className={`w-5 h-5 mx-auto mb-2 ${isNext ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
                                    }`}
                            />
                            <p className={`text-xs font-medium mb-0.5 ${isNext ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
                                }`}>
                                {prayer.name}
                            </p>
                            <p className={`text-sm font-semibold ${isNext ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                                }`}>
                                {prayer.time}
                            </p>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
