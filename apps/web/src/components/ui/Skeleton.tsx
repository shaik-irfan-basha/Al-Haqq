'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`bg-[var(--color-border)] rounded-lg ${className}`}
        />
    );
}

// Common skeleton patterns
export function CardSkeleton() {
    return (
        <div className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function AyahSkeleton() {
    return (
        <div className="card-premium p-6 space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-6" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-3/4" />
        </div>
    );
}

export function SurahListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-bg-card)]">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="w-16 h-6" />
                </div>
            ))}
        </div>
    );
}

export function HadithSkeleton() {
    return (
        <div className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function PageHeaderSkeleton() {
    return (
        <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
    );
}

export function GridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export default Skeleton;
