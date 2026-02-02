
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export type PrayerTime = {
    name: string;
    time: string; // HH:MM AM/PM
    period: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
};

export function getPrayerTimes(lat: number, lng: number): PrayerTime[] {
    const coordinates = new Coordinates(lat, lng);
    const date = new Date();
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Hanafi; // Default, can be configurable later

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const format = (d: Date) => {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return [
        { name: 'Fajr', time: format(prayerTimes.fajr), period: 'fajr' },
        { name: 'Sunrise', time: format(prayerTimes.sunrise), period: 'sunrise' },
        { name: 'Dhuhr', time: format(prayerTimes.dhuhr), period: 'dhuhr' },
        { name: 'Asr', time: format(prayerTimes.asr), period: 'asr' },
        { name: 'Maghrib', time: format(prayerTimes.maghrib), period: 'maghrib' },
        { name: 'Isha', time: format(prayerTimes.isha), period: 'isha' },
    ];
}
