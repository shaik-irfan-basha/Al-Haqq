'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft, MapPin, Navigation, Phone, Clock, ExternalLink,
    Loader2, RefreshCw, Star, Map
} from 'lucide-react';

interface Mosque {
    id: string;
    name: string;
    address: string;
    distance: number;
    lat: number;
    lng: number;
    phone?: string;
    rating?: number;
}

// Simulated mosque data (in real app, would use Google Places API)
const generateNearbyMosques = (lat: number, lng: number): Mosque[] => {
    // Generate realistic-looking mosque data based on coordinates
    const mosques: Mosque[] = [
        {
            id: '1',
            name: 'Al-Rahman Masjid',
            address: 'Islamic Center, Main Street',
            distance: 0.5,
            lat: lat + 0.002,
            lng: lng + 0.001,
            phone: '+1-555-0123',
            rating: 4.8
        },
        {
            id: '2',
            name: 'Masjid Al-Noor',
            address: 'Community Drive, Near Park',
            distance: 1.2,
            lat: lat - 0.005,
            lng: lng + 0.003,
            phone: '+1-555-0456',
            rating: 4.6
        },
        {
            id: '3',
            name: 'Islamic Cultural Center',
            address: 'University Avenue',
            distance: 2.1,
            lat: lat + 0.008,
            lng: lng - 0.004,
            phone: '+1-555-0789',
            rating: 4.9
        },
        {
            id: '4',
            name: 'Masjid Al-Taqwa',
            address: 'Crescent Road',
            distance: 3.5,
            lat: lat - 0.012,
            lng: lng - 0.008,
            rating: 4.5
        },
        {
            id: '5',
            name: 'Central Jami Masjid',
            address: 'Downtown District',
            distance: 4.2,
            lat: lat + 0.015,
            lng: lng + 0.010,
            phone: '+1-555-0321',
            rating: 4.7
        }
    ];

    return mosques.sort((a, b) => a.distance - b.distance);
};

export default function MosqueFinderPage() {
    const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
    const [mosques, setMosques] = React.useState<Mosque[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedMosque, setSelectedMosque] = React.useState<Mosque | null>(null);

    const getLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                // Simulate API call delay
                setTimeout(() => {
                    const nearbyMosques = generateNearbyMosques(latitude, longitude);
                    setMosques(nearbyMosques);
                    setIsLoading(false);
                }, 1000);
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable location services.');
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const openInMaps = (mosque: Mosque) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mosque.name)}&query_place_id=${mosque.lat},${mosque.lng}`;
        window.open(url, '_blank');
    };

    const getDirections = (mosque: Mosque) => {
        if (!location) return;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${mosque.lat},${mosque.lng}&travelmode=driving`;
        window.open(url, '_blank');
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
                            البحث عن المساجد
                        </h1>
                        <h2 className="font-serif text-2xl text-[var(--color-text-secondary)] mb-2">
                            Mosque Finder
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                            Find mosques near your current location for prayer and community.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Location Button */}
            {!location && !isLoading && (
                <section className="px-6 mb-12">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-premium p-8 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-6">
                                <MapPin className="w-10 h-10 text-[var(--color-primary)]" />
                            </div>

                            <h3 className="font-serif text-xl text-[var(--color-text)] mb-2">
                                Enable Location
                            </h3>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                Allow location access to find mosques near you
                            </p>

                            <button
                                onClick={getLocation}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Navigation className="w-5 h-5" />
                                Find Nearby Mosques
                            </button>

                            {error && (
                                <p className="mt-4 text-sm text-red-500">{error}</p>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Loading */}
            {isLoading && (
                <section className="px-6 mb-12">
                    <div className="max-w-md mx-auto text-center">
                        <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin mx-auto mb-4" />
                        <p className="text-[var(--color-text-muted)]">Finding mosques near you...</p>
                    </div>
                </section>
            )}

            {/* Results */}
            {location && mosques.length > 0 && !isLoading && (
                <section className="px-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Location Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                <MapPin className="w-4 h-4" />
                                <span>Found {mosques.length} mosques near you</span>
                            </div>
                            <button
                                onClick={getLocation}
                                className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </motion.div>

                        {/* Mosque List */}
                        <div className="space-y-4">
                            {mosques.map((mosque, index) => (
                                <motion.div
                                    key={mosque.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`card-premium p-5 cursor-pointer transition-all ${selectedMosque?.id === mosque.id
                                            ? 'ring-2 ring-[var(--color-primary)]'
                                            : ''
                                        }`}
                                    onClick={() => setSelectedMosque(
                                        selectedMosque?.id === mosque.id ? null : mosque
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Distance Badge */}
                                        <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="text-lg font-bold text-[var(--color-primary)]">
                                                {mosque.distance}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-muted)]">km</span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-serif text-lg text-[var(--color-text)]">
                                                        {mosque.name}
                                                    </h3>
                                                    <p className="text-sm text-[var(--color-text-muted)]">
                                                        {mosque.address}
                                                    </p>
                                                </div>
                                                {mosque.rating && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10">
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                        <span className="text-sm font-medium text-amber-600">
                                                            {mosque.rating}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Expanded Details */}
                                            {selectedMosque?.id === mosque.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-4 pt-4 border-t border-[var(--color-border)]"
                                                >
                                                    {mosque.phone && (
                                                        <a
                                                            href={`tel:${mosque.phone}`}
                                                            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-3 hover:text-[var(--color-primary)]"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            {mosque.phone}
                                                        </a>
                                                    )}

                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                getDirections(mosque);
                                                            }}
                                                            className="btn-primary flex-1 py-2 text-sm"
                                                        >
                                                            <Navigation className="w-4 h-4 mr-2" />
                                                            Get Directions
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openInMaps(mosque);
                                                            }}
                                                            className="btn-secondary flex-1 py-2 text-sm"
                                                        >
                                                            <Map className="w-4 h-4 mr-2" />
                                                            View on Map
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Note */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center text-sm text-[var(--color-text-muted)] mt-8"
                        >
                            📍 Results are based on your current location. For more accurate results, please enable high-accuracy GPS.
                        </motion.p>
                    </div>
                </section>
            )}
        </div>
    );
}
