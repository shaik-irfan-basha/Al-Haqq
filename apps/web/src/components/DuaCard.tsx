
'use client';

import { motion } from 'framer-motion';
import { Copy, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface DuaCardProps {
    category: string;
    arabic: string;
    transliteration?: string;
    translation: string;
    source?: string;
    index: number;
}

export default function DuaCard({ category, arabic, transliteration, translation, source, index }: DuaCardProps) {
    const [liked, setLiked] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${arabic}\n\n${translation}\n\n(${source})`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gray-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-gray-900/80 transition-all hover:border-emerald-500/20"
        >
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                    title="Copy Text"
                >
                    <Copy className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setLiked(!liked)}
                    className={`p-2 rounded-full hover:bg-white/10 transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                    {category}
                </span>
            </div>

            <div className="space-y-6">
                <p className="text-3xl md:text-4xl text-right font-amiri leading-[2.2] text-white" dir="rtl">
                    {arabic}
                </p>

                {transliteration && (
                    <p className="text-gray-400 text-sm md:text-base italic leading-relaxed">
                        {transliteration}
                    </p>
                )}

                <div>
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                        {translation}
                    </p>
                    {source && (
                        <p className="mt-2 text-xs text-gray-500 font-medium">
                            — {source}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
