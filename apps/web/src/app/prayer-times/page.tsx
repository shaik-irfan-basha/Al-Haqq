'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Loader2, Sun, Sunrise, Moon, CloudSun, Sunset, Search, Navigation, Edit3 } from 'lucide-react';

interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Midnight: string;
}

interface LocationData {
    city: string;
    country: string;
    lat: number;
    lng: number;
}

const prayerInfo = [
    {
        name: 'Fajr',
        arabic: 'الفجر',
        icon: Sunrise,
        color: 'purple',
        endsAt: 'Sunrise',
        description: 'Dawn prayer'
    },
    {
        name: 'Sunrise',
        arabic: 'الشروق',
        icon: Sun,
        color: 'orange',
        isExtra: true,
        description: 'Sun rises - Fajr ends'
    },
    {
        name: 'Dhuhr',
        arabic: 'الظهر',
        icon: CloudSun,
        color: 'yellow',
        endsAt: 'Asr',
        description: 'Noon prayer'
    },
    {
        name: 'Asr',
        arabic: 'العصر',
        icon: Sun,
        color: 'orange',
        endsAt: 'Maghrib',
        description: 'Afternoon prayer'
    },
    {
        name: 'Maghrib',
        arabic: 'المغرب',
        icon: Sunset,
        color: 'pink',
        endsAt: 'Isha',
        description: 'Sunset prayer'
    },
    {
        name: 'Isha',
        arabic: 'العشاء',
        icon: Moon,
        color: 'indigo',
        endsAt: 'Midnight',
        description: 'Night prayer'
    },
];

export default function PrayerTimesPage() {
    const [location, setLocation] = React.useState<LocationData | null>(null);
    const [prayerTimes, setPrayerTimes] = React.useState<PrayerTimes | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const [manualCity, setManualCity] = React.useState('');
    const [showManualInput, setShowManualInput] = React.useState(false);
    const [locationMethod, setLocationMethod] = React.useState<'auto' | 'manual'>('auto');

    // Update current time every minute
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Get location and prayer times
    React.useEffect(() => {
        if (locationMethod === 'auto') {
            getLocationAndTimes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationMethod]);

    async function getLocationAndTimes() {
        setIsLoading(true);
        setError(null);

        try {
            let latitude, longitude;

            try {
                // Try to get user's location via GPS
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000 // 5 seconds timeout
                    });
                });
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            } catch (gpsError) {
                console.warn('GPS failed, trying IP geolocation...', gpsError);
                // Fallback to IP geolocation
                try {
                    const ipResponse = await fetch('https://ipapi.co/json/');
                    const ipData = await ipResponse.json();
                    latitude = ipData.latitude;
                    longitude = ipData.longitude;

                    console.log('Using IP location:', ipData.city);
                } catch (ipError) {
                    throw new Error('Could not determine location. Please enter city manually.');
                }
            }

            if (!latitude || !longitude) {
                throw new Error('Invalid coordinates');
            }

            await fetchPrayerTimesByCoords(latitude, longitude);
        } catch (err: any) {
            console.error('Error:', err);
            setError('Could not get your location automatically.');
            setShowManualInput(true);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchPrayerTimesByCoords(latitude: number, longitude: number) {
        // Get city name from coordinates (reverse geocoding)
        const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const geoData = await geoResponse.json();

        setLocation({
            city: geoData.city || geoData.locality || 'Unknown City',
            country: geoData.countryName || '',
            lat: latitude,
            lng: longitude
        });

        // Get prayer times from Al-Adhan API
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const timesResponse = await fetch(
            `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const timesData = await timesResponse.json();

        if (timesData.data?.timings) {
            setPrayerTimes({
                Fajr: timesData.data.timings.Fajr,
                Sunrise: timesData.data.timings.Sunrise,
                Dhuhr: timesData.data.timings.Dhuhr,
                Asr: timesData.data.timings.Asr,
                Maghrib: timesData.data.timings.Maghrib,
                Isha: timesData.data.timings.Isha,
                Midnight: timesData.data.timings.Midnight
            });
        }
    }

    // Manual city search
    const searchCity = async () => {
        if (!manualCity.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const today = new Date();
            const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

            const timesResponse = await fetch(
                `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(manualCity)}&country=&method=2`
            );
            const timesData = await timesResponse.json();

            if (timesData.data?.timings) {
                setLocation({
                    city: manualCity,
                    country: '',
                    lat: 0,
                    lng: 0
                });
                setPrayerTimes({
                    Fajr: timesData.data.timings.Fajr,
                    Sunrise: timesData.data.timings.Sunrise,
                    Dhuhr: timesData.data.timings.Dhuhr,
                    Asr: timesData.data.timings.Asr,
                    Maghrib: timesData.data.timings.Maghrib,
                    Isha: timesData.data.timings.Isha,
                    Midnight: timesData.data.timings.Midnight
                });
                setError(null);
                setShowManualInput(false);
                setLocationMethod('manual');
            } else {
                setError('Could not find prayer times for this city. Please check spelling.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Get next prayer
    const getNextPrayer = (): { name: string; time: string } | null => {
        if (!prayerTimes) return null;

        const now = currentTime;
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

        for (const prayer of prayers) {
            const [hours, minutes] = prayerTimes[prayer].split(':').map(Number);
            const prayerTime = new Date(now);
            prayerTime.setHours(hours, minutes, 0);

            if (prayerTime > now) {
                return { name: prayer, time: prayerTimes[prayer] };
            }
        }

        return { name: 'Fajr', time: prayerTimes.Fajr };
    };

    // Get end time for a prayer
    const getEndTime = (prayer: typeof prayerInfo[0]): string | null => {
        if (!prayerTimes || !prayer.endsAt) return null;
        return prayerTimes[prayer.endsAt as keyof PrayerTimes] || null;
    };

    const nextPrayer = getNextPrayer();

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-8">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            أوقات الصلاة
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-4">
                            Prayer Times
                        </h2>

                        {location && (
                            <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)]">
                                <MapPin className="w-4 h-4" />
                                <span>{location.city}{location.country ? `, ${location.country}` : ''}</span>
                                <button
                                    onClick={() => setShowManualInput(true)}
                                    className="ml-2 p-1 rounded hover:bg-[var(--color-bg-hover)] transition-colors"
                                    title="Change location"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Location Selection */}
            {(showManualInput || !prayerTimes) && !isLoading && (
                <section className="px-6 mb-8">
                    <div className="max-w-md mx-auto">
                        <div className="card-premium p-6">
                            <h3 className="font-medium text-[var(--color-text)] mb-4 text-center">
                                Set Your Location
                            </h3>

                            {/* Location Method Toggle */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => {
                                        setLocationMethod('auto');
                                        getLocationAndTimes();
                                    }}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${locationMethod === 'auto'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                        }`}
                                >
                                    <Navigation className="w-4 h-4" />
                                    Auto-detect
                                </button>
                                <button
                                    onClick={() => setLocationMethod('manual')}
                                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${locationMethod === 'manual'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-bg-warm)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)]'
                                        }`}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Manual
                                </button>
                            </div>

                            {/* Manual City Input */}
                            {locationMethod === 'manual' && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={manualCity}
                                        onChange={(e) => setManualCity(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                                        placeholder="Enter city name (e.g., London, Dubai, Tokyo)"
                                        className="input-premium flex-1"
                                    />
                                    <button onClick={searchCity} className="btn-primary">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {error && (
                                <p className="text-sm text-red-500 mt-3 text-center">{error}</p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mb-4" />
                    <p className="text-[var(--color-text-muted)]">Getting prayer times...</p>
                </div>
            )}

            {/* Next Prayer Highlight */}
            {nextPrayer && prayerTimes && !showManualInput && (
                <section className="px-6 mb-8">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card-premium p-8 text-center bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10"
                        >
                            <p className="text-sm text-[var(--color-text-muted)] mb-2">Next Prayer</p>
                            <h3 className="font-serif text-3xl text-[var(--color-text)] mb-1">{nextPrayer.name}</h3>
                            <p className="text-4xl font-light text-[var(--color-primary)]">{nextPrayer.time}</p>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Prayer Times Grid */}
            {prayerTimes && !showManualInput && (
                <section className="px-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-3">
                            {prayerInfo.map((prayer, index) => {
                                const time = prayerTimes[prayer.name as keyof PrayerTimes];
                                const endTime = getEndTime(prayer);
                                const isNext = nextPrayer?.name === prayer.name;

                                return (
                                    <motion.div
                                        key={prayer.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`card-premium p-4 flex items-center justify-between ${isNext ? 'ring-2 ring-[var(--color-primary)]' : ''
                                            } ${prayer.isExtra ? 'opacity-70' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-warm)] flex items-center justify-center">
                                                <prayer.icon className="w-6 h-6 text-[var(--color-text-muted)]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-text)]">{prayer.name}</p>
                                                <p className="text-sm text-[var(--color-text-muted)] font-arabic">{prayer.arabic}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-light text-[var(--color-text)]">{time}</p>
                                            {endTime && !prayer.isExtra && (
                                                <p className="text-xs text-[var(--color-text-muted)]">
                                                    Ends at {endTime}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Note about times */}
                        <div className="mt-6 p-4 rounded-xl bg-[var(--color-bg-warm)] border border-[var(--color-border)]">
                            <p className="text-sm text-[var(--color-text-muted)] text-center">
                                💡 Prayer times are calculated using the ISNA method. Each prayer starts at the shown time and ends when the next prayer begins.
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
