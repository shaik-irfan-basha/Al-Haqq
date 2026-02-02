import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

interface PlayButtonProps {
    surahId: number;
    ayahId: number;
    className?: string;
    fullSurah?: boolean;
}

export default function PlayButton({ surahId, ayahId, className = '', fullSurah = false }: PlayButtonProps) {
    const { playSurah, audioState, pauseAudio, resumeAudio } = useAudio();

    const isCurrent = audioState.currentSurah === surahId && audioState.currentAyah === ayahId;
    const isPlaying = isCurrent && audioState.isPlaying;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCurrent) {
            if (isPlaying) pauseAudio();
            else resumeAudio();
        } else {
            playSurah(surahId, ayahId);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center rounded-full transition-all duration-200 ${isCurrent
                ? 'bg-primary text-white border-primary'
                : 'bg-transparent text-text-secondary hover:text-primary hover:bg-primary/10'
                } ${className}`}
            title={isPlaying ? "Pause" : "Play"}
        >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
    );
}
