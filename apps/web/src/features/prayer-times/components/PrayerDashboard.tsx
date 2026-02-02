
'use client';

import { useState, useEffect } from 'react';
import { getPrayerTimes, PrayerTime } from '@/lib/prayer';

export default function PrayerDashboard() {
    const [times, setTimes] = useState<PrayerTime[]>([]);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [city, setCity] = useState("Locating...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setCity(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`); // Reverse geocoding optional
                },
                (err) => {
                    setError("Location access denied. Using Makkah time.");
                    // Default to Makkah
                    setLocation({ lat: 21.4225, lng: 39.8262 });
                    setCity("Makkah");
                }
            );
        } else {
            setError("Geolocation not supported.");
        }
    }, []);

    useEffect(() => {
        if (location) {
            const pt = getPrayerTimes(location.lat, location.lng);
            setTimes(pt);
        }
    }, [location]);

    return (
        <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-900/30 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        🕌 Prayer Times
                    </h3>
                    <p className="text-sm text-emerald-400 mt-1">{city}</p>
                </div>
                <div className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {times.map((t) => (
                    <div key={t.name} className="bg-black/40 border border-white/5 rounded-lg p-3 text-center hover:border-emerald-500/30 transition-colors">
                        <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">{t.name}</span>
                        <span className="text-lg font-mono text-white font-medium">{t.time}</span>
                    </div>
                ))}
                {times.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-4">
                        Loading prayer times...
                    </div>
                )}
            </div>

            {error && <p className="text-xs text-red-400 mt-4 text-center">{error}</p>}
        </div>
    );
}
