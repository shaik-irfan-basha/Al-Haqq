'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ScrollText, Bookmark, Copy, Check, Share2, Loader2 } from 'lucide-react';
import React from 'react';
import { hadithCollections as localCollections } from '@/data/hadith-collections';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface HadithData {
    id: number;
    hadith_number: number;
    arabic_text: string;
    english_narrator: string;
    english_text: string;
    grade: string;
    reference: string;
}

interface ChapterInfo {
    id: number;
    chapter_number: number;
    arabic_title: string;
    english_title: string;
}

// Bookmarks storage
const BOOKMARKS_KEY = 'alhaqq_bookmarks';
const getBookmarks = (): string[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
};
const toggleBookmark = (id: string): boolean => {
    const bookmarks = getBookmarks();
    const index = bookmarks.indexOf(id);
    if (index > -1) {
        bookmarks.splice(index, 1);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        return false;
    } else {
        bookmarks.push(id);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        return true;
    }
};

// Memoized Hadith Card
const HadithCard = React.memo(({
    hadith,
    collection,
    isBookmarked,
    isCopied,
    onBookmark,
    onCopy,
    onShare,
    bookName,
    index
}: {
    hadith: HadithData;
    collection: string;
    isBookmarked: boolean;
    isCopied: boolean;
    onBookmark: (num: number) => void;
    onCopy: (hadith: HadithData) => void;
    onShare: (hadith: HadithData) => void;
    bookName: string;
    index: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
            className="card-premium p-6 md:p-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-[var(--color-accent-dark)] dark:text-[var(--color-accent)]">
                            {hadith.hadith_number}
                        </span>
                    </div>
                    {hadith.grade && (
                        <span className={`badge ${hadith.grade.toLowerCase() === 'sahih' ? 'badge-success' :
                            hadith.grade.toLowerCase() === 'hasan' ? 'badge-gold' : ''
                            }`}>
                            {hadith.grade}
                        </span>
                    )}
                    {hadith.reference && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {hadith.reference}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onBookmark(hadith.hadith_number)}
                        className={`action-btn ${isBookmarked ? 'active' : ''}`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                    >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button onClick={() => onCopy(hadith)} className="action-btn" title="Copy">
                        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => onShare(hadith)} className="action-btn" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {hadith.arabic_text && (
                    <p className="font-arabic text-2xl md:text-3xl text-[var(--color-text)] text-right leading-loose" dir="rtl">
                        {hadith.arabic_text}
                    </p>
                )}
                <div className="space-y-4">
                    {hadith.english_narrator && (
                        <p className="text-sm font-semibold text-[var(--color-text-secondary)] italic">
                            {hadith.english_narrator}
                        </p>
                    )}
                    <p className="text-[var(--color-text)] leading-relaxed text-lg">
                        {hadith.english_text || (
                            <span className="text-[var(--color-text-muted)] italic text-sm">
                                English translation for this hadith is currently unavailable in the database.
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

export default function ChapterPageClient({ params }: { params: { collection: string; chapter: string } }) {
    const localCollection = localCollections.find(c => c.id === params.collection);

    if (!localCollection) {
        notFound();
    }

    const chapterNumber = parseInt(params.chapter);
    const [bookName, setBookName] = React.useState(localCollection.englishName);
    const [bookArabicName, setBookArabicName] = React.useState(localCollection.arabicName);
    const [chapter, setChapter] = React.useState<ChapterInfo | null>(null);
    const [hadiths, setHadiths] = React.useState<HadithData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [bookmarkedHadiths, setBookmarkedHadiths] = React.useState<Set<string>>(new Set());
    const [copiedHadith, setCopiedHadith] = React.useState<number | null>(null);
    const [usingDatabase, setUsingDatabase] = React.useState(false);
    const [prevChapter, setPrevChapter] = React.useState<number | null>(null);
    const [nextChapter, setNextChapter] = React.useState<number | null>(null);

    // Load bookmarks
    React.useEffect(() => {
        const bookmarks = getBookmarks();
        const hadithBookmarks = bookmarks.filter(b => b.startsWith(`hadith:${params.collection}:`));
        setBookmarkedHadiths(new Set(hadithBookmarks));
    }, [params.collection]);

    // Fetch data from Supabase with Public API fallback
    React.useEffect(() => {
        async function fetchFromPublicAPI() {
            try {
                // Map local slugs to fawazahmed0/hadith-api editions
                const bookMap: Record<string, string> = {
                    'bukhari': 'bukhari',
                    'muslim': 'muslim',
                    'abudawud': 'abudawud',
                    'tirmidhi': 'tirmidhi',
                    'nasai': 'nasai',
                    'ibnmajah': 'ibnmajah',
                    'malik': 'malik',
                    'ahmed': 'ahmed',
                    'darimi': 'darimi',
                };

                const bookSlug = bookMap[params.collection] || params.collection;
                
                // Fetch English and Arabic in parallel
                const [engRes, araRes] = await Promise.all([
                    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${bookSlug}.json`),
                    fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${bookSlug}.json`)
                ]);

                if (!engRes.ok) throw new Error('API fetch failed');
                
                const engData = await engRes.json();
                const araData = araRes.ok ? await araRes.json() : { hadiths: [] };

                if (engData.hadiths) {
                    const chNum = parseInt(params.chapter);
                    // Filter hadiths for this chapter
                    const filteredHadiths = engData.hadiths
                        .filter((h: any) => h.chapterNumber == chNum || h.reference?.book == chNum)
                        .map((h: any, idx: number) => ({
                            id: idx,
                            hadith_number: h.hadithnumber || h.hadith_number || (idx + 1),
                            arabic_text: araData.hadiths?.[idx]?.text || '',
                            english_text: h.text,
                            english_narrator: h.narrator || '',
                            grade: h.grades?.[0]?.grade || '',
                            reference: `${engData.metadata.name} ${h.hadithnumber || h.hadith_number || ''}`
                        }));

                    if (filteredHadiths.length > 0) {
                        setHadiths(filteredHadiths);
                        setBookName(engData.metadata.name);
                        setBookArabicName(araData.metadata.name || '');
                        setChapter({
                            id: chNum,
                            chapter_number: chNum,
                            english_title: `Chapter ${chNum}`,
                            arabic_title: ''
                        });
                        setUsingDatabase(false);
                    }
                }
            } catch (err) {
                console.error('Hadith API Fallback Error:', err);
            }
        }

        async function fetchData() {
            setIsLoading(true);
            try {
                if (isSupabaseConfigured()) {
                    // Fetch book info
                    const { data: bookData } = await supabase
                        .from('hadith_books')
                        .select('*')
                        .eq('slug', params.collection)
                        .single();

                    if (bookData) {
                        setBookName(bookData.english_title);
                        setBookArabicName(bookData.arabic_title);

                        // Fetch chapter info
                        const { data: chapterData } = await supabase
                            .from('hadith_chapters')
                            .select('*')
                            .eq('book_id', bookData.id)
                            .eq('chapter_number', chapterNumber)
                            .single();

                        if (chapterData) {
                            setChapter(chapterData);

                            // Fetch hadiths
                            const { data: hadithsData } = await supabase
                                .from('hadiths')
                                .select('*')
                                .eq('chapter_id', chapterData.id)
                                .order('hadith_number');

                            if (hadithsData && hadithsData.length > 0) {
                                setHadiths(hadithsData);
                                setUsingDatabase(true);
                                
                                // Fetch all chapters for navigation
                                const { data: allChapters } = await supabase
                                    .from('hadith_chapters')
                                    .select('chapter_number')
                                    .eq('book_id', bookData.id)
                                    .order('chapter_number');

                                if (allChapters) {
                                    const currentIndex = allChapters.findIndex(c => c.chapter_number === chapterNumber);
                                    if (currentIndex > 0) {
                                        setPrevChapter(allChapters[currentIndex - 1].chapter_number);
                                    }
                                    if (currentIndex < allChapters.length - 1) {
                                        setNextChapter(allChapters[currentIndex + 1].chapter_number);
                                    }
                                }
                                setIsLoading(false);
                                return;
                            }
                        }
                    }
                }
                
                // If we reach here, Supabase failed or had no data
                await fetchFromPublicAPI();
            } catch (err) {
                console.error('Error fetching from Supabase:', err);
                await fetchFromPublicAPI();
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [params.collection, params.chapter, chapterNumber]);

    // Handle bookmark
    const handleBookmark = (hadithNumber: number) => {
        const id = `hadith:${params.collection}:${hadithNumber}`;
        const isBookmarked = toggleBookmark(id);
        setBookmarkedHadiths(prev => {
            const newSet = new Set(prev);
            if (isBookmarked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };

    // Handle copy
    const handleCopy = async (hadith: HadithData) => {
        const text = `${hadith.arabic_text}\n\n${hadith.english_narrator}\n${hadith.english_text}\n\n— ${bookName}, Hadith ${hadith.hadith_number}${hadith.grade ? ` (${hadith.grade})` : ''}`;
        await navigator.clipboard.writeText(text);
        setCopiedHadith(hadith.hadith_number);
        setTimeout(() => setCopiedHadith(null), 2000);
    };

    // Handle share
    const handleShare = async (hadith: HadithData) => {
        const text = `${hadith.arabic_text}\n\n${hadith.english_text}\n\n— ${bookName}, Hadith ${hadith.hadith_number}`;
        if (navigator.share) {
            await navigator.share({ text });
        } else {
            await navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20">
            {/* Header */}
            <section className="px-6 mb-12">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/hadith/${params.collection}`} className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        {bookName}
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent-dark)] dark:text-[var(--color-accent)] text-sm font-medium mb-4">
                            <ScrollText className="w-4 h-4" />
                            Chapter {chapterNumber}
                            {usingDatabase && (
                                <span className="w-2 h-2 rounded-full bg-green-500 ml-2" title="From database" />
                            )}
                        </div>

                        {/* Arabic Chapter Title */}
                        {chapter?.arabic_title && (
                            <h1 className="font-arabic text-4xl md:text-5xl text-[var(--color-text)] mb-4" dir="rtl">
                                {chapter.arabic_title}
                            </h1>
                        )}

                        <h2 className="font-serif text-xl text-[var(--color-text-secondary)] mb-2">
                            {chapter?.english_title || `Chapter ${chapterNumber}`}
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-sm">
                            {bookName} · {hadiths.length} Hadiths
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Loading State */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin mb-4" />
                    <p className="text-[var(--color-text-muted)]">Loading hadiths...</p>
                </div>
            )}

            {/* Hadiths */}
            {!isLoading && (
                <section className="px-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {hadiths.length > 0 ? (
                            hadiths.map((hadith, index) => (
                                <HadithCard
                                    key={hadith.id}
                                    hadith={hadith}
                                    index={index}
                                    collection={params.collection}
                                    isBookmarked={bookmarkedHadiths.has(`hadith:${params.collection}:${hadith.hadith_number}`)}
                                    isCopied={copiedHadith === hadith.hadith_number}
                                    onBookmark={handleBookmark}
                                    onCopy={handleCopy}
                                    onShare={handleShare}
                                    bookName={bookName}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-[var(--color-text-muted)]">
                                    {isSupabaseConfigured()
                                        ? 'No hadiths found in this chapter.'
                                        : 'Connect to database to view hadiths.'}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Chapter Navigation */}
            <section className="px-6 mt-16">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    {prevChapter ? (
                        <Link
                            href={`/hadith/${params.collection}/${prevChapter}`}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                            <div className="text-left">
                                <p className="text-xs text-[var(--color-text-muted)]">Previous</p>
                                <p className="text-sm font-medium text-[var(--color-text)]">Chapter {prevChapter}</p>
                            </div>
                        </Link>
                    ) : <div />}

                    {nextChapter && (
                        <Link
                            href={`/hadith/${params.collection}/${nextChapter}`}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group"
                        >
                            <div className="text-right">
                                <p className="text-xs text-[var(--color-text-muted)]">Next</p>
                                <p className="text-sm font-medium text-[var(--color-text)]">Chapter {nextChapter}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                        </Link>
                    )}
                </div>
            </section>
        </div>
    );
}
