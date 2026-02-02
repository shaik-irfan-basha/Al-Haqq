
'use client';

import { useAudio } from '@/context/AudioContext';
import { useState, useEffect } from 'react';

export default function AudioPlayer() {
    const { audioState, pauseAudio, resumeAudio, nextAyah, prevAyah, progress, duration, seek } = useAudio();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (audioState.currentSurah) {
            setIsVisible(true);
        }
    }, [audioState.currentSurah]);

    if (!isVisible) return null;

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 animate-slideUp">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">
                        Surah {audioState.currentSurah}
                    </h4>
                    <p className="text-emerald-400 text-sm">
                        Ayah {audioState.currentAyah} • Al-Afasy
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="flex items-center gap-6">
                        <button onClick={prevAyah} className="text-gray-400 hover:text-white transition">
                            ⏮
                        </button>

                        <button
                            onClick={audioState.isPlaying ? pauseAudio : resumeAudio}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
                        >
                            {audioState.isPlaying ? '⏸' : '▶'}
                        </button>

                        <button onClick={nextAyah} className="text-gray-400 hover:text-white transition">
                            ⏭
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3 w-full max-w-md">
                        <span className="text-xs text-gray-500">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={progress}
                            onChange={(e) => seek(Number(e.target.value))}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
                        />
                        <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex-1 flex justify-end gap-3">
                    <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white">
                        ✕
                    </button>
                </div>

            </div>
        </div>
    );
}
