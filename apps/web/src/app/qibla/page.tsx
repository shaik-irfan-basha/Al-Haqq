'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Loader2, Navigation, RotateCcw, Search, ExternalLink } from 'lucide-react';

export default function QiblaPage() {
    const [location, setLocation] = React.useState<{ lat: number; lng: number; city?: string } | null>(null);
    const [qiblaDirection, setQiblaDirection] = React.useState<number | null>(null);
    const [deviceHeading, setDeviceHeading] = React.useState<number | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [permissionGranted, setPermissionGranted] = React.useState(false);

    // Manual search state
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);
    const [showManualSearch, setShowManualSearch] = React.useState(false);

    // Kaaba coordinates
    const KAABA_LAT = 21.4225;
    const KAABA_LNG = 39.8262;

    // Calculate Qibla direction
    const calculateQibla = (lat: number, lng: number): number => {
        const latRad = (lat * Math.PI) / 180;
        const lngRad = (lng * Math.PI) / 180;
        const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
        const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

        const x = Math.sin(kaabaLngRad - lngRad);
        const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

        let qibla = Math.atan2(x, y) * (180 / Math.PI);
        qibla = (qibla + 360) % 360;

        return qibla;
    };

    // Get location automatically
    React.useEffect(() => {
        getLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLocation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000
                });
            });

            const { latitude, longitude } = position.coords;

            // Get city name
            try {
                const geoResponse = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                const geoData = await geoResponse.json();
                setLocation({
                    lat: latitude,
                    lng: longitude,
                    city: geoData.city || geoData.locality || 'Current Location'
                });
            } catch {
                setLocation({ lat: latitude, lng: longitude, city: 'Current Location' });
            }

            // Calculate Qibla
            const qibla = calculateQibla(latitude, longitude);
            setQiblaDirection(qibla);
            setShowManualSearch(false);

        } catch (err: any) {
            console.error('Error:', err);
            setError('Could not get your location automatically.');
            setShowManualSearch(true); // Show search if auto fails
        } finally {
            setIsLoading(false);
        }
    };

    // Manual location search
    const handleManualSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                setLocation({
                    lat,
                    lng: lon,
                    city: data[0].display_name.split(',')[0] // Use first part of display name
                });

                const qibla = calculateQibla(lat, lon);
                setQiblaDirection(qibla);
                setShowManualSearch(false);
            } else {
                setError('Location not found. Please try another city.');
            }
        } catch (err) {
            setError('Search failed. Please check your connection.');
        } finally {
            setIsSearching(false);
        }
    };

    // Device orientation (compass)
    const requestOrientation = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setPermissionGranted(true);
                    enableCompass();
                } else {
                    setError('Permission denied. Please allow sensor access.');
                }
            } catch (err) {
                setError('Compass permission denied');
            }
        } else if (window.DeviceOrientationEvent) {
            setPermissionGranted(true);
            enableCompass();
        } else {
            setError('Your device does not support compass functionality.');
        }
    };

    const enableCompass = () => {
        window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
        window.addEventListener('deviceorientation', handleOrientation as any, true);
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.absolute && event.alpha !== null) {
            setDeviceHeading(event.alpha);
        } else if ((event as any).webkitCompassHeading !== undefined) {
            setDeviceHeading((event as any).webkitCompassHeading);
        } else if (event.alpha !== null) {
            setDeviceHeading(360 - event.alpha);
        }
    };

    React.useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientationabsolute', handleOrientation as any);
            window.removeEventListener('deviceorientation', handleOrientation as any);
        };
    }, []);

    // Calculate rotation
    const getRotation = (): number => {
        if (qiblaDirection === null) return 0;
        if (deviceHeading === null) return qiblaDirection;
        return (qiblaDirection - deviceHeading + 360) % 360;
    };

    const rotation = getRotation();

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-bg-warm)]/20">
            {/* Header */}
            <section className="px-6 mb-8">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="font-arabic text-5xl md:text-6xl text-[var(--color-text)] mb-4" dir="rtl">
                            اتجاه القبلة
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            Qibla Direction
                        </h2>

                        <AnimatePresence mode="wait">
                            {location?.city ? (
                                <motion.div
                                    key="location"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-2 mt-4"
                                >
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-card)] rounded-full shadow-sm border border-[var(--color-border)]">
                                        <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                                        <span className="text-[var(--color-text)] font-medium">{location.city}</span>
                                        <button
                                            onClick={() => setShowManualSearch(!showManualSearch)}
                                            className="ml-2 text-xs text-[var(--color-primary)] hover:underline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="search-btn"
                                    onClick={() => setShowManualSearch(!showManualSearch)}
                                    className="mt-4 text-sm text-[var(--color-primary)] hover:underline flex items-center justify-center gap-1 mx-auto"
                                >
                                    <Search className="w-3 h-3" />
                                    Set Location Manually
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Application State */}
            <div className="px-6 max-w-md mx-auto relative z-10">

                {/* Manual Search Form */}
                <AnimatePresence>
                    {showManualSearch && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleManualSearch}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter city name (e.g., London)"
                                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={isSearching || !searchQuery.trim()}
                                    className="px-4 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
                                >
                                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find'}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm text-center border border-red-500/20">
                        <p>{error}</p>
                        {!showManualSearch && (
                            <button
                                onClick={() => setShowManualSearch(true)}
                                className="mt-2 text-xs font-semibold hover:underline"
                            >
                                Try searching manually
                            </button>
                        )}
                    </div>
                )}

                {isLoading && !location && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mb-4" />
                        <p className="text-[var(--color-text-muted)]">Finding your location...</p>
                    </div>
                )}
            </div>

            {/* Compass */}
            {qiblaDirection !== null && (
                <section className="px-6 pb-12">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-square max-w-sm mx-auto"
                        >
                            {/* Compass Card Background */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg-warm)] shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] border border-[var(--color-border)]" />

                            {/* Inner Rings */}
                            <div className="absolute inset-4 rounded-full border border-[var(--color-border)] opacity-50" />
                            <div className="absolute inset-12 rounded-full border border-[var(--color-border)] opacity-30" />

                            {/* Degree Markers */}
                            {[0, 90, 180, 270].map((deg) => (
                                <div
                                    key={deg}
                                    className="absolute inset-0 flex flex-col items-center pt-2"
                                    style={{ transform: `rotate(${deg}deg)` }}
                                >
                                    <span className="text-xs font-bold text-[var(--color-text-secondary)]" style={{ transform: `rotate(-${deg}deg)` }}>
                                        {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                                    </span>
                                    <div className="w-0.5 h-2 bg-[var(--color-border)] mt-1" />
                                </div>
                            ))}

                            {/* Rotating Compass Layer */}
                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: rotation }}
                                transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                            >
                                {/* North Indicator */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-red-500 rounded-full opacity-80" />

                                {/* Qibla Arrow Pointer */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
                                    <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                                        <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[24px] border-l-transparent border-r-transparent border-b-[var(--color-primary)] drop-shadow-md" />
                                        <div className="w-1.5 h-16 bg-[var(--color-primary)] -mt-1 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Center Kaaba Icon (Fixed relative to rotation logic) */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-3xl shadow-xl z-20 border-2 border-[var(--color-primary)]"
                            >
                                🕋
                            </div>

                        </motion.div>

                        {/* Direction Info */}
                        <div className="text-center mt-8">
                            <div className="inline-flex flex-col items-center bg-[var(--color-bg-card)] px-6 py-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
                                <span className="text-sm text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Qibla Angle</span>
                                <span className="text-4xl font-light text-[var(--color-text)] mt-1">
                                    {Math.round(qiblaDirection)}°
                                </span>
                            </div>

                            <p className="text-[var(--color-text-muted)] mt-6 text-sm max-w-xs mx-auto">
                                {!permissionGranted && deviceHeading === null
                                    ? "Compass is static. Enable live compass for real-time guidance."
                                    : "Align the arrow with the Kaaba icon."}
                            </p>
                        </div>

                        {/* Enable Compass Button */}
                        {!permissionGranted && deviceHeading === null && (
                            <button
                                onClick={requestOrientation}
                                className="btn-primary w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/20"
                            >
                                <Navigation className="w-5 h-5" />
                                Enable Live Compass
                            </button>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
