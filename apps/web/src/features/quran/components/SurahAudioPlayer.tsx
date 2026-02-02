'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    ChevronDown, Repeat, X, Settings, Minimize2, Maximize2
} from 'lucide-react';

// Available reciters from everyayah.com
const RECITERS = [
    { id: 'alafasy', name: 'Mishary Rashid Alafasy', folder: 'Alafasy_128kbps' },
    { id: 'sudais', name: 'Abdul Rahman Al-Sudais', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
    { id: 'shuraim', name: 'Saud Al-Shuraim', folder: 'Saood_Ash-Shuraym_128kbps' },
    { id: 'abdulbasit', name: 'Abdul Basit Abdul Samad', folder: 'Abdul_Basit_Murattal_192kbps' },
    { id: 'shatri', name: 'Abu Bakr Al-Shatri', folder: 'Abu_Bakr_Ash-Shaatree_128kbps' },
    { id: 'husary', name: 'Mahmoud Khalil Al-Husary', folder: 'Husary_128kbps' },
    { id: 'minshawi', name: 'Mohammad Siddiq Al-Minshawi', folder: 'Minshawy_Mujawwad_192kbps' },
    { id: 'maher', name: 'Maher Al-Muaiqly', folder: 'MaherAlMuaiqly128kbps' },
    { id: 'ghamdi', name: 'Saad Al-Ghamdi', folder: 'Ghamadi_40kbps' },
    { id: 'ajamy', name: 'Ahmed Ibn Ali Al-Ajamy', folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net' },
];

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface SurahAudioPlayerProps {
    surahNumber: number;
    surahName: string;
    totalAyahs: number;
    onAyahChange?: (ayahNumber: number) => void;
    ayahRefs?: React.RefObject<Map<number, HTMLDivElement>>;
}

export default function SurahAudioPlayer({
    surahNumber,
    surahName,
    totalAyahs,
    onAyahChange,
    ayahRefs
}: SurahAudioPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentAyah, setCurrentAyah] = React.useState(1);
    const [selectedReciter, setSelectedReciter] = React.useState(RECITERS[0]);
    const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
    const [volume, setVolume] = React.useState(1);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isLooping, setIsLooping] = React.useState(false);
    const [showReciterMenu, setShowReciterMenu] = React.useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isMinimized, setIsMinimized] = React.useState(false);

    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const playerRef = React.useRef<HTMLDivElement>(null);

    // Build audio URL
    const getAudioUrl = (ayah: number) => {
        const surahPad = surahNumber.toString().padStart(3, '0');
        const ayahPad = ayah.toString().padStart(3, '0');
        return `https://everyayah.com/data/${selectedReciter.folder}/${surahPad}${ayahPad}.mp3`;
    };

    // Play specific ayah
    const playAyah = React.useCallback((ayahNumber: number) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        setIsLoading(true);
        const audio = new Audio(getAudioUrl(ayahNumber));
        audio.playbackRate = playbackSpeed;
        audio.volume = isMuted ? 0 : volume;
        audioRef.current = audio;

        audio.oncanplaythrough = () => {
            setIsLoading(false);
        };

        audio.onended = () => {
            if (isLooping) {
                // Replay same ayah
                audio.currentTime = 0;
                audio.play();
            } else if (ayahNumber < totalAyahs) {
                // Move to next ayah
                const nextAyah = ayahNumber + 1;
                setCurrentAyah(nextAyah);
                onAyahChange?.(nextAyah);
                playAyah(nextAyah);
            } else {
                // Surah finished
                setIsPlaying(false);
                setCurrentAyah(1);
            }
        };

        audio.onerror = () => {
            setIsLoading(false);
            console.error('Audio playback error');
        };

        audio.play()
            .then(() => {
                setIsPlaying(true);
                setCurrentAyah(ayahNumber);
                onAyahChange?.(ayahNumber);

                // Scroll to ayah
                if (ayahRefs?.current) {
                    const element = ayahRefs.current.get(ayahNumber);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            })
            .catch(e => {
                console.error('Play error:', e);
                setIsLoading(false);
            });
    }, [selectedReciter, playbackSpeed, volume, isMuted, isLooping, totalAyahs, onAyahChange, ayahRefs, surahNumber]);

    // Toggle play/pause
    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            playAyah(currentAyah);
        }
    };

    // Skip forward/backward
    const skipForward = () => {
        if (currentAyah < totalAyahs) {
            const next = currentAyah + 1;
            if (isPlaying) {
                playAyah(next);
            } else {
                setCurrentAyah(next);
                onAyahChange?.(next);
            }
        }
    };

    const skipBackward = () => {
        if (currentAyah > 1) {
            const prev = currentAyah - 1;
            if (isPlaying) {
                playAyah(prev);
            } else {
                setCurrentAyah(prev);
                onAyahChange?.(prev);
            }
        }
    };

    // Update playback speed
    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    // Update volume
    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Change reciter
    const changeReciter = (reciter: typeof RECITERS[0]) => {
        setSelectedReciter(reciter);
        setShowReciterMenu(false);

        if (isPlaying) {
            // Restart current ayah with new reciter
            setTimeout(() => playAyah(currentAyah), 100);
        }
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    // Close menus when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (playerRef.current && !playerRef.current.contains(e.target as Node)) {
                setShowReciterMenu(false);
                setShowSpeedMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Progress percentage
    const progress = (currentAyah / totalAyahs) * 100;

    // Minimized compact player view
    if (isMinimized) {
        return (
            <motion.div
                ref={playerRef}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="fixed bottom-4 right-4 z-50"
            >
                <div className="bg-[var(--color-bg-card)]/95 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl p-3 flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        disabled={isLoading}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-4 h-4 text-white" fill="white" />
                        ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                        )}
                    </button>

                    {/* Ayah Info */}
                    <div className="text-center">
                        <span className="text-xs text-[var(--color-text)] font-medium block">
                            {currentAyah}/{totalAyahs}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                            {surahName}
                        </span>
                    </div>

                    {/* Expand */}
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                        title="Expand player"
                    >
                        <Maximize2 className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={playerRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-card)]/95 backdrop-blur-xl border-t border-[var(--color-border)] shadow-2xl"
        >
            {/* Progress Bar */}
            <div className="h-1 bg-[var(--color-border)]">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-[var(--color-border)]"
                    >
                        <div className="p-4 max-w-4xl mx-auto">
                            {/* Volume Slider */}
                            <div className="flex items-center gap-4 mb-4">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-5 h-5 text-[var(--color-text-muted)]" />
                                    ) : (
                                        <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="flex-1 h-2 rounded-lg appearance-none bg-[var(--color-border)] accent-[var(--color-primary)]"
                                />
                                <span className="text-sm text-[var(--color-text-muted)] w-12 text-right">
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>

                            {/* Ayah Navigation */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-[var(--color-text-muted)]">Go to Ayah:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max={totalAyahs}
                                    value={currentAyah}
                                    onChange={(e) => {
                                        const num = parseInt(e.target.value);
                                        if (num >= 1 && num <= totalAyahs) {
                                            setCurrentAyah(num);
                                            if (isPlaying) playAyah(num);
                                        }
                                    }}
                                    className="w-20 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-center text-[var(--color-text)]"
                                />
                                <span className="text-sm text-[var(--color-text-muted)]">of {totalAyahs}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Controls */}
            <div className="px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    {/* Minimize Button */}
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors hidden sm:block"
                        title="Minimize player"
                    >
                        <Minimize2 className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </button>

                    {/* Reciter Selector */}
                    <div className="relative hidden sm:block">
                        <button
                            onClick={() => setShowReciterMenu(!showReciterMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors max-w-[180px]"
                        >
                            <span className="text-sm text-[var(--color-text)] truncate">
                                {selectedReciter.name.split(' ').slice(-1)[0]}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
                        </button>

                        <AnimatePresence>
                            {showReciterMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute bottom-full left-0 mb-2 w-64 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50"
                                >
                                    <div className="p-2 border-b border-[var(--color-border)]">
                                        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Select Reciter
                                        </span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {RECITERS.map((reciter) => (
                                            <button
                                                key={reciter.id}
                                                onClick={() => changeReciter(reciter)}
                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-[var(--color-bg-hover)] transition-colors ${selectedReciter.id === reciter.id
                                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                    : 'text-[var(--color-text)]'
                                                    }`}
                                            >
                                                {reciter.name}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Center Controls */}
                    <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
                        {/* Skip Back */}
                        <button
                            onClick={skipBackward}
                            disabled={currentAyah <= 1}
                            className="p-2 rounded-full hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipBack className="w-5 h-5 text-[var(--color-text)]" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            disabled={isLoading}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-5 h-5 text-white" fill="white" />
                            ) : (
                                <Play className="w-5 h-5 text-white ml-1" fill="white" />
                            )}
                        </button>

                        {/* Skip Forward */}
                        <button
                            onClick={skipForward}
                            disabled={currentAyah >= totalAyahs}
                            className="p-2 rounded-full hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipForward className="w-5 h-5 text-[var(--color-text)]" />
                        </button>
                    </div>

                    {/* Ayah Counter */}
                    <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
                        <span className="text-sm text-[var(--color-text)]">
                            Ayah {currentAyah}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">
                            / {totalAyahs}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        {/* Loop Toggle */}
                        <button
                            onClick={() => setIsLooping(!isLooping)}
                            className={`p-2 rounded-lg transition-colors ${isLooping
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                : 'hover:bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]'
                                }`}
                            title="Repeat current ayah"
                        >
                            <Repeat className="w-5 h-5" />
                        </button>

                        {/* Speed Control */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors text-sm"
                            >
                                {playbackSpeed}x
                            </button>

                            <AnimatePresence>
                                {showSpeedMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-full right-0 mb-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50"
                                    >
                                        {PLAYBACK_SPEEDS.map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => {
                                                    setPlaybackSpeed(speed);
                                                    setShowSpeedMenu(false);
                                                }}
                                                className={`w-full px-6 py-2 text-sm text-center hover:bg-[var(--color-bg-hover)] transition-colors ${playbackSpeed === speed
                                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                    : 'text-[var(--color-text)]'
                                                    }`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Expand/Settings */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                        >
                            {isExpanded ? (
                                <X className="w-5 h-5 text-[var(--color-text-muted)]" />
                            ) : (
                                <Settings className="w-5 h-5 text-[var(--color-text-muted)]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Info */}
                <div className="sm:hidden mt-2 text-center">
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {surahName} • Ayah {currentAyah}/{totalAyahs} • {selectedReciter.name.split(' ').slice(-1)[0]}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
