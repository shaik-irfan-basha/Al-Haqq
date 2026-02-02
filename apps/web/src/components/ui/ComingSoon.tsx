'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft, Home } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description?: string;
}

export default function ComingSoon({
    title,
    description = "We are currently crafting this experience with care. Please check back soon."
}: ComingSoonProps) {
    return (
        <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card-premium p-12 text-center max-w-lg w-full relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]" />

                <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-warm)] flex items-center justify-center mx-auto mb-8">
                    <Construction className="w-10 h-10 text-[var(--color-text-muted)] animate-pulse" />
                </div>

                <h1 className="font-serif text-3xl text-[var(--color-text)] mb-4">
                    {title}
                </h1>

                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
                    {description}
                </p>

                <div className="flex flex-col gap-3">
                    <Link href="/" className="btn-primary w-full justify-center">
                        <Home className="w-4 h-4 mr-2" />
                        Return Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary w-full justify-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
