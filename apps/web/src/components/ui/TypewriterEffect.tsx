'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
    words: {
        text: string;
        className?: string;
    }[];
    className?: string;
    cursorClassName?: string;
}

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}: TypewriterEffectProps) => {
    // Split words into characters
    const wordsArray = words.map((word) => {
        return {
            ...word,
            text: word.text.split(''),
        };
    });

    const [scope, setScope] = useState(0);

    useEffect(() => {
        // Simple interval to blink or do something if needed
        // but Framer Motion handles the animation
    }, []);

    const renderWords = () => {
        return (
            <motion.div className="inline">
                {wordsArray.map((word, idx) => {
                    return (
                        <div key={`word-${idx}`} className="inline-block mr-2">
                            {word.text.map((char, index) => (
                                <motion.span
                                    initial={{
                                        opacity: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        delay: idx * 0.3 + index * 0.05,
                                        ease: 'easeInOut',
                                    }}
                                    key={`char-${index}`}
                                    className={word.className}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    );
                })}
            </motion.div>
        );
    };

    return (
        <div className={`text-center ${className}`}>
            {renderWords()}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={`inline-block rounded-sm w-[4px] h-4 md:h-8 lg:h-12 bg-blue-500 ${cursorClassName}`}
            />
        </div>
    );
};
