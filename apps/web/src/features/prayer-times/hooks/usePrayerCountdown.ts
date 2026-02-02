import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export function usePrayerCountdown() {
    const [timeLeft, setTimeLeft] = useState('');
    const [nextPrayerName, setNextPrayerName] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Try to get location from localStorage (saved by Qibla page)
        // or default to Makkah for demo purposes
        let lat = 21.4225;
        let lng = 39.8262;

        try {
            const savedLoc = localStorage.getItem('user_location');
            if (savedLoc) {
                const { latitude, longitude } = JSON.parse(savedLoc);
                lat = latitude;
                lng = longitude;
            }
        } catch (e) {
            // Ignore
        }

        const updateTimer = () => {
            const coordinates = new Coordinates(lat, lng);
            const date = new Date();
            const params = CalculationMethod.MuslimWorldLeague();
            params.madhab = Madhab.Hanafi;

            const prayerTimes = new PrayerTimes(coordinates, date, params);

            // Get next prayer
            const now = new Date();
            let next = prayerTimes.fajr;
            let name = 'Fajr';
            let previous = prayerTimes.isha; // Default previous to yesterday's Isha approximately

            if (now < prayerTimes.fajr) {
                next = prayerTimes.fajr;
                name = 'Fajr';
                // Previous was Isha from yesterday, but for progress bar involving midnight, it's tricky.
                // Simplified: usage logic
            } else if (now < prayerTimes.sunrise) {
                next = prayerTimes.sunrise;
                name = 'Sunrise';
                previous = prayerTimes.fajr;
            } else if (now < prayerTimes.dhuhr) {
                next = prayerTimes.dhuhr;
                name = 'Dhuhr';
                previous = prayerTimes.sunrise;
            } else if (now < prayerTimes.asr) {
                next = prayerTimes.asr;
                name = 'Asr';
                previous = prayerTimes.dhuhr;
            } else if (now < prayerTimes.maghrib) {
                next = prayerTimes.maghrib;
                name = 'Maghrib';
                previous = prayerTimes.asr;
            } else if (now < prayerTimes.isha) {
                next = prayerTimes.isha;
                name = 'Isha';
                previous = prayerTimes.maghrib;
            } else {
                // Next is Fajr tomorrow
                const tomorrow = new Date(date);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
                next = tomorrowTimes.fajr;
                name = 'Fajr';
                previous = prayerTimes.isha;
            }

            setNextPrayerName(name);

            const diff = next.getTime() - now.getTime();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`-${hours}h ${minutes}m ${seconds}s`);

                // Progress calculation
                const totalDuration = next.getTime() - previous.getTime();
                const elapsed = now.getTime() - previous.getTime();
                setProgress(Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)));
            } else {
                setTimeLeft('Now');
                setProgress(100);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return { timeLeft, nextPrayerName, progress };
}
