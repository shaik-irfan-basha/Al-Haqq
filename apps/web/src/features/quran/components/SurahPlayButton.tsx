import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function SurahPlayButton({ surahId }: { surahId: number }) {
    const { playSurah, audioState, pauseAudio, resumeAudio } = useAudio();

    const isCurrentSurah = audioState.currentSurah === surahId;
    const isPlaying = isCurrentSurah && audioState.isPlaying;

    const handleClick = () => {
        if (isCurrentSurah) {
            if (isPlaying) pauseAudio();
            else resumeAudio();
        } else {
            playSurah(surahId, 1);
        }
    };

    return (
        <div onClick={handleClick} className="cursor-pointer flex items-center">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </div>
    );
}
