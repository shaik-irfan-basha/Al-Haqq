'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight, FolderOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

interface BookmarkItem {
    id: string;
    type: 'verse' | 'hadith' | 'dua';
    title: string;
    description: string;
    link: string;
    dateAdded: number;
    user_id?: string;
    metadata?: any;
    created_at?: string;
}

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // 1. Check Auth Status
                const supabase = createClient();
                const session = supabase ? (await supabase.auth.getSession()).data.session : null;

                if (session && supabase) {
                    setIsLoggedIn(true);
                    // 2. Load from Server
                    const { data: serverData, error } = await supabase
                        .from('bookmarks')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (serverData) {
                        const formattedDetails: BookmarkItem[] = serverData.map((b: any) => ({
                            id: b.id,
                            type: b.type,
                            title: b.title,
                            description: b.description || '',
                            link: b.link,
                            dateAdded: new Date(b.created_at).getTime(),
                            metadata: b.metadata,
                            user_id: b.user_id
                        }));
                        setBookmarks(formattedDetails);
                    }
                } else {
                    setIsLoggedIn(false);
                    // 3. Load from Local Storage
                    const saved = localStorage.getItem('bookmarks');
                    if (saved) {
                        setBookmarks(JSON.parse(saved));
                    }
                }
            } catch (error) {
                console.error("Failed to load bookmarks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleRemoveBookmark = async (id: string) => {
        // Optimistic Update
        const previousBookmarks = [...bookmarks];
        setBookmarks(prev => prev.filter(b => b.id !== id));

        try {
            if (isLoggedIn) {
                const supabase = createClient();
                if (supabase) {
                    const { error } = await supabase
                        .from('bookmarks')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                }
            } else {
                const next = previousBookmarks.filter(b => b.id !== id);
                localStorage.setItem('bookmarks', JSON.stringify(next));
            }
        } catch (error) {
            console.error("Failed to delete bookmark:", error);
            // Revert on error
            setBookmarks(previousBookmarks);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 bg-[var(--color-bg)]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="font-serif text-4xl text-[var(--color-text)]">Bookmarks</h1>
                        <p className="text-[var(--color-text-secondary)] mt-1">
                            {bookmarks.length} Saved Items
                            {isLoggedIn && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Synced</span>}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-text-muted)]" />
                    </div>
                ) : bookmarks.length > 0 ? (
                    <div className="grid gap-4">
                        {bookmarks.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="card-premium p-6 flex flex-col md:flex-row items-start md:items-center gap-6 group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 
                                    ${item.type === 'verse' ? 'bg-green-100 text-green-700' :
                                        item.type === 'hadith' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                                `}>
                                    <Bookmark className="w-6 h-6" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[var(--color-bg-warm)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                                            {item.type}
                                        </span>
                                        <h3 className="font-serif text-xl text-[var(--color-text)]">{item.title}</h3>
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] line-clamp-1">{item.description}</p>
                                    <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                                        Saved on {new Date(item.dateAdded).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                    <Link
                                        href={item.link}
                                        className="flex-1 md:flex-initial btn-secondary py-2 px-4 text-sm"
                                    >
                                        View
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                    <button
                                        onClick={() => handleRemoveBookmark(item.id)}
                                        className="btn-secondary py-2 px-3 text-red-500 hover:bg-red-50 hover:border-red-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--color-bg-warm)] rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)]">
                        <div className="w-20 h-20 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <FolderOpen className="w-10 h-10 text-[var(--color-text-muted)]" />
                        </div>
                        <h2 className="text-xl font-medium text-[var(--color-text)] mb-2">No bookmarks yet</h2>
                        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-8">
                            Save verses, hadiths, and duas while you read to access them quickly here.
                        </p>
                        <Link href="/quran" className="btn-primary">
                            Start Reading
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
