'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileQuestion, Home } from 'lucide-react';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';

export default function NotFound() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 rounded-3xl bg-[var(--color-bg-warm)] flex items-center justify-center mx-auto mb-6 border border-[var(--color-border)] shadow-lg">
                        <FileQuestion className="w-12 h-12 text-[var(--color-text-muted)]" />
                    </div>
                </motion.div>

                <h1 className="font-serif text-6xl md:text-8xl text-[var(--color-primary)] mb-6 opacity-20 select-none">
                    404
                </h1>

                <div className="h-16 flex items-center justify-center mb-6">
                    <TypewriterEffect
                        words={[
                            { text: "Page", className: "text-2xl md:text-3xl font-serif text-[var(--color-text)]" },
                            { text: "Not", className: "text-2xl md:text-3xl font-serif text-[var(--color-text)] mx-2" },
                            { text: "Found.", className: "text-2xl md:text-3xl font-serif text-[var(--color-text)] text-[var(--color-primary)]" },
                        ]}
                        cursorClassName="bg-[var(--color-primary)] h-8"
                    />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-md mx-auto"
                >
                    The path you seek is hidden or does not exist. Let us guide you back to the light.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
                        <Home className="w-5 h-5" />
                        Return to Homepage
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
