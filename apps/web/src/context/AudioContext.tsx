
'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type AudioState = {
    isPlaying: boolean;
    currentSurah: number | null;
    currentAyah: number | null;
    totalAyahs: number | null;
    reciterId: string;
};

type AudioContextType = {
    audioState: AudioState;
    playSurah: (surahId: number, startAyah?: number) => void;
    pauseAudio: () => void;
    resumeAudio: () => void;
    nextAyah: () => void;
    prevAyah: () => void;
    seek: (time: number) => void;
    progress: number;
    duration: number;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [audioState, setAudioState] = useState<AudioState>({
        isPlaying: false,
        currentSurah: null,
        currentAyah: null,
        totalAyahs: null,
        reciterId: 'ar.alafasy',
    });

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            nextAyah();
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioState.currentAyah]); // Re-attach listeners isn't strictly necessary but safe

    const playSurah = async (surahId: number, startAyah = 1) => {
        setAudioState(prev => ({
            ...prev,
            currentSurah: surahId,
            currentAyah: startAyah,
            isPlaying: true
        }));

        playUrl(surahId, startAyah);
    };

    const playUrl = (surah: number, ayah: number) => {
        if (!audioRef.current) return;

        const surahStr = surah.toString().padStart(3, '0');
        const ayahStr = ayah.toString().padStart(3, '0');
        const url = `https://everyayah.com/data/Alafasy_128kbps/${surahStr}${ayahStr}.mp3`;

        audioRef.current.src = url;
        audioRef.current.play().catch(e => console.error("Playback failed", e));
    };

    const pauseAudio = () => {
        audioRef.current?.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    const resumeAudio = () => {
        audioRef.current?.play();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const nextAyah = () => {
        if (audioState.currentSurah && audioState.currentAyah) {
            const next = audioState.currentAyah + 1;
            setAudioState(prev => ({ ...prev, currentAyah: next }));
            playUrl(audioState.currentSurah, next);
        }
    };

    const prevAyah = () => {
        if (audioState.currentSurah && audioState.currentAyah && audioState.currentAyah > 1) {
            const previousAyahNum = audioState.currentAyah - 1;
            setAudioState(currentState => ({ ...currentState, currentAyah: previousAyahNum }));
            playUrl(audioState.currentSurah, previousAyahNum);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    return (
        <AudioContext.Provider value={{
            audioState,
            playSurah,
            pauseAudio,
            resumeAudio,
            nextAyah,
            prevAyah,
            seek,
            progress,
            duration
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within AudioProvider');
    return context;
};
