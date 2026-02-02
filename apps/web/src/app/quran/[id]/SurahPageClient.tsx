'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, Bookmark, FileText, Copy, Check, Share2, Loader2, Globe, X, Plus, Play } from 'lucide-react';
import React from 'react';
import { surahs as localSurahs } from '@/data/surahs';
import { supabase, createClient, isSupabaseConfigured } from '@/lib/supabase';
import SurahAudioPlayer from '@/features/quran/components/SurahAudioPlayer';

interface AyahData {
    id: number;
    ayah_number: number;
    arabic_text: string;
    translations: {
        translator: string;
        language_code: string;
        translation_text: string;
    }[];
}

interface TranslatorOption {
    translator: string;
    language_code: string;
    language_name: string;
}

// Language mapping
const LANGUAGES: Record<string, { name: string; flag: string; native: string }> = {
    ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    en: { name: 'English', flag: '🇬🇧', native: 'English' },
    bn: { name: 'Bengali', flag: '🇧🇩', native: 'বাংলা' },
    zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
    hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
    ml: { name: 'Malayalam', flag: '🇮🇳', native: 'മലയാളം' },
    ta: { name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
    te: { name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
    ur: { name: 'Urdu', flag: '🇵🇰', native: 'اردو' },
};

// Bookmarks storage
const BOOKMARKS_KEY = 'alhaqq_bookmarks';
const NOTES_KEY = 'alhaqq_notes';

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

const saveNote = (id: string, content: string, title: string) => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(NOTES_KEY);
    const notes = stored ? JSON.parse(stored) : [];
    notes.unshift({
        id: `note-${Date.now()}`,
        type: 'ayah',
        reference: id,
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now()
    });
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export default function SurahPageClient({ params }: { params: { id: string } }) {
    const surahNumber = parseInt(params.id);
    const localSurah = localSurahs.find(s => s.number === surahNumber);

    if (!localSurah) {
        notFound();
    }

    const [surah, setSurah] = React.useState(localSurah);
    const [ayahs, setAyahs] = React.useState<AyahData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(['en']);
    const [availableTranslators, setAvailableTranslators] = React.useState<TranslatorOption[]>([]);
    const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);
    const [bookmarkedAyahs, setBookmarkedAyahs] = React.useState<Set<string>>(new Set());
    const [copiedAyah, setCopiedAyah] = React.useState<number | null>(null);
    const [noteModal, setNoteModal] = React.useState<{ ayah: number; arabic: string } | null>(null);
    const [noteContent, setNoteContent] = React.useState('');
    const [usingDatabase, setUsingDatabase] = React.useState(false);
    const [highlightedAyah, setHighlightedAyah] = React.useState<number | null>(null);
    const ayahElementsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());

    const prevSurah = localSurahs.find(s => s.number === surahNumber - 1);
    const nextSurah = localSurahs.find(s => s.number === surahNumber + 1);

    // Load bookmarks
    React.useEffect(() => {
        const bookmarks = getBookmarks();
        const surahBookmarks = bookmarks.filter(b => b.startsWith(`ayah:${surahNumber}:`));
        setBookmarkedAyahs(new Set(surahBookmarks));
    }, [surahNumber]);

    // Load saved language preference
    React.useEffect(() => {
        const saved = localStorage.getItem('alhaqq_languages');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setSelectedLanguages(parsed);
            }
        }
    }, []);

    // Fetch surah data and ayahs
    React.useEffect(() => {
        async function fetchData() {
            if (!isSupabaseConfigured()) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch surah info
                const { data: surahData } = await supabase
                    .from('surahs')
                    .select('*')
                    .eq('number', surahNumber)
                    .single();

                if (surahData) {
                    setSurah({
                        number: surahData.number,
                        arabicName: surahData.arabic_name,
                        englishName: surahData.english_name,
                        transliteration: surahData.transliteration,
                        revelationType: surahData.revelation_type,
                        totalAyahs: surahData.total_ayahs,
                    });

                    // Fetch ayahs with ALL translations
                    const { data: ayahsData } = await supabase
                        .from('ayahs')
                        .select(`
                            id,
                            ayah_number,
                            arabic_text,
                            translations:quran_translations (
                                translator,
                                language_code,
                                translation_text
                            )
                        `)
                        .eq('surah_id', surahData.id)
                        .order('ayah_number');

                    if (ayahsData && ayahsData.length > 0) {
                        // Extract unique translators with language info
                        const translators = new Map<string, TranslatorOption>();
                        ayahsData.forEach((ayah: any) => {
                            ayah.translations?.forEach((t: any) => {
                                if (t.translator && !translators.has(t.translator)) {
                                    const langInfo = LANGUAGES[t.language_code] || { name: t.language_code, flag: '🌐', native: t.language_code };
                                    translators.set(t.translator, {
                                        translator: t.translator,
                                        language_code: t.language_code,
                                        language_name: langInfo.name
                                    });
                                }
                            });
                        });

                        setAvailableTranslators(Array.from(translators.values()));
                        setAyahs(ayahsData);
                        setUsingDatabase(true);
                    }
                }
            } catch (err) {
                console.error('Error fetching surah:', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [surahNumber]);

    // Toggle language selection
    const toggleLanguage = (langCode: string) => {
        setSelectedLanguages(prev => {
            let newSelection: string[];
            if (prev.includes(langCode)) {
                newSelection = prev.filter(l => l !== langCode);
                // Must have at least one language
                if (newSelection.length === 0) return prev;
            } else {
                newSelection = [...prev, langCode];
            }
            localStorage.setItem('alhaqq_languages', JSON.stringify(newSelection));
            return newSelection;
        });
    };

    // Get unique languages available
    const availableLanguages = React.useMemo(() => {
        const langs = new Map<string, { code: string; info: typeof LANGUAGES['en'] }>();
        availableTranslators.forEach(t => {
            if (!langs.has(t.language_code)) {
                langs.set(t.language_code, {
                    code: t.language_code,
                    info: LANGUAGES[t.language_code] || { name: t.language_code, flag: '🌐', native: t.language_code }
                });
            }
        });
        return Array.from(langs.values());
    }, [availableTranslators]);

    // Handle bookmark toggle
    const handleBookmark = async (ayahNumber: number) => {
        const id = `ayah:${surahNumber}:${ayahNumber}`;
        const isNowBookmarked = !bookmarkedAyahs.has(id);

        // Optimistic update
        setBookmarkedAyahs(prev => {
            const newSet = new Set(prev);
            if (isNowBookmarked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });

        // Persist
        if (isSupabaseConfigured()) {
            const supabaseClient = createClient();
            if (supabaseClient) {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session) {
                    try {
                        if (isNowBookmarked) {
                            await supabaseClient.from('bookmarks').insert({
                                user_id: session.user.id,
                                type: 'verse',
                                title: `Surah ${surah?.transliteration} ${surahNumber}:${ayahNumber}`,
                                description: ayahElementsRef.current.get(ayahNumber)?.innerText.substring(0, 50) + '...',
                                link: `/quran/${surahNumber}#ayah-${ayahNumber}`,
                                metadata: { surah: surahNumber, ayah: ayahNumber }
                            });
                        } else {
                            await supabaseClient.from('bookmarks').delete()
                                .eq('user_id', session.user.id)
                                .eq('link', `/quran/${surahNumber}#ayah-${ayahNumber}`);
                        }
                    } catch (e) {
                        console.error('Bookmark sync failed', e);
                    }
                }
            }
        }

        // Always sync local storage for fallback/speed
        toggleBookmark(id);
    };

    // Handle copy
    const handleCopy = async (ayah: AyahData) => {
        const translations = ayah.translations
            .filter(t => selectedLanguages.includes(t.language_code))
            .map(t => t.translation_text)
            .join('\n\n');

        const text = `${ayah.arabic_text}\n\n${translations}\n\n— Surah ${surah?.transliteration} (${surahNumber}:${ayah.ayah_number})`;
        await navigator.clipboard.writeText(text);
        setCopiedAyah(ayah.ayah_number);
        setTimeout(() => setCopiedAyah(null), 2000);
    };

    // Handle share
    const handleShare = async (ayah: AyahData) => {
        const translation = ayah.translations.find(t => t.language_code === 'en')?.translation_text || '';
        const text = `${ayah.arabic_text}\n\n${translation}\n\n— Surah ${surah?.transliteration} (${surahNumber}:${ayah.ayah_number})`;

        if (navigator.share) {
            await navigator.share({ text, title: `Surah ${surah?.transliteration}` });
        } else {
            await navigator.clipboard.writeText(text);
            setCopiedAyah(ayah.ayah_number);
            setTimeout(() => setCopiedAyah(null), 2000);
        }
    };

    const [playingAyah, setPlayingAyah] = React.useState<number | null>(null);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Handle audio play
    const handlePlay = (ayahNumber: number) => {
        if (playingAyah === ayahNumber) {
            audioRef.current?.pause();
            setPlayingAyah(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const surahPad = surahNumber.toString().padStart(3, '0');
        const ayahPad = ayahNumber.toString().padStart(3, '0');
        const url = `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`;

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
            setPlayingAyah(null);
        };

        audio.play().catch(e => console.error('Audio play error:', e));
        setPlayingAyah(ayahNumber);
    };

    // Clean up audio on unmount
    React.useEffect(() => {
        return () => {
            audioRef.current?.pause();
        };
    }, []);

    // Handle note save
    const handleSaveNote = () => {
        if (!noteModal || !noteContent.trim()) return;
        const title = `${surah?.transliteration} ${surahNumber}:${noteModal.ayah}`;
        saveNote(`ayah:${surahNumber}:${noteModal.ayah}`, noteContent.trim(), title);
        setNoteModal(null);
        setNoteContent('');
    };

    return (
        <div className="min-h-screen pt-24 sm:pt-28 pb-20">
            {/* Header */}
            <section className="px-4 sm:px-6 mb-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Navigation */}
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/quran"
                                className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">All Surahs</span>
                            </Link>
                        </div>

                        {/* Surah Info */}
                        <div className="text-center mb-8">
                            <h1 className="font-arabic text-5xl sm:text-6xl md:text-7xl text-[var(--color-text)] mb-3" dir="rtl">
                                {surah?.arabicName}
                            </h1>
                            <h2 className="font-serif text-xl sm:text-2xl text-[var(--color-text-secondary)] mb-2">
                                {surah?.transliteration}
                            </h2>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {surah?.englishName} • {surah?.totalAyahs} Ayahs • {surah?.revelationType}
                            </p>
                        </div>

                        {/* Language Selector */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <button
                                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                                >
                                    <Globe className="w-4 h-4 text-[var(--color-primary)]" />
                                    <span>Translations ({selectedLanguages.length})</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isLanguageOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] shadow-xl z-50 overflow-hidden"
                                        >
                                            <div className="p-3 border-b border-[var(--color-border)]">
                                                <p className="text-xs text-[var(--color-text-muted)]">
                                                    Arabic is always shown. Select translation languages:
                                                </p>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto p-2">
                                                {availableLanguages.filter(l => l.code !== 'ar').map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => toggleLanguage(lang.code)}
                                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedLanguages.includes(lang.code)
                                                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                                            : 'hover:bg-[var(--color-bg-warm)] text-[var(--color-text)]'
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span>{lang.info.flag}</span>
                                                            <span>{lang.info.name}</span>
                                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                                {lang.info.native}
                                                            </span>
                                                        </span>
                                                        {selectedLanguages.includes(lang.code) && (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-[var(--color-border)]">
                                                <button
                                                    onClick={() => setIsLanguageOpen(false)}
                                                    className="w-full py-2 text-sm text-[var(--color-primary)] hover:bg-[var(--color-bg-warm)] rounded-lg transition-colors"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Database Status */}
                        {usingDatabase && (
                            <div className="flex justify-center mb-4">
                                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                    ✓ Connected to database
                                </span>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Bismillah */}
            {surahNumber !== 1 && surahNumber !== 9 && (
                <section className="px-4 sm:px-6 mb-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="font-arabic text-3xl sm:text-4xl text-[var(--color-primary)]" dir="rtl">
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                    </div>
                </section>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mb-4" />
                    <p className="text-[var(--color-text-muted)]">Loading Surah...</p>
                </div>
            )}

            {/* Ayahs */}
            {!isLoading && (
                <section className="px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-6">
                            {ayahs.map((ayah, index) => {
                                const bookmarkId = `ayah:${surahNumber}:${ayah.ayah_number}`;
                                const isBookmarked = bookmarkedAyahs.has(bookmarkId);
                                const isCopied = copiedAyah === ayah.ayah_number;

                                return (
                                    <motion.div
                                        key={ayah.id}
                                        id={`ayah-${ayah.ayah_number}`}
                                        ref={(el) => {
                                            if (el) ayahElementsRef.current.set(ayah.ayah_number, el);
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                                        className={`card-premium p-5 sm:p-6 group transition-all duration-300 ${highlightedAyah === ayah.ayah_number ? 'ring-2 ring-[var(--color-primary)] shadow-lg bg-[var(--color-primary)]/5' : ''}`}
                                    >
                                        {/* Ayah Number & Actions */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-medium text-sm">
                                                    {ayah.ayah_number}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleBookmark(ayah.ayah_number)}
                                                    className={`action-btn ${isBookmarked ? '!text-[var(--color-accent)] !bg-[var(--color-accent)]/10' : ''}`}
                                                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                                                >
                                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                                </button>
                                                <button
                                                    onClick={() => handlePlay(ayah.ayah_number)}
                                                    className={`action-btn ${playingAyah === ayah.ayah_number ? '!text-[var(--color-primary)] !bg-[var(--color-primary)]/10' : ''}`}
                                                    title={playingAyah === ayah.ayah_number ? 'Pause' : 'Play Audio'}
                                                >
                                                    {playingAyah === ayah.ayah_number ? (
                                                        <span className="animate-pulse">❚❚</span>
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setNoteModal({ ayah: ayah.ayah_number, arabic: ayah.arabic_text });
                                                        setNoteContent('');
                                                    }}
                                                    className="action-btn"
                                                    title="Add Note"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleCopy(ayah)}
                                                    className="action-btn"
                                                    title={isCopied ? 'Copied!' : 'Copy'}
                                                >
                                                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleShare(ayah)}
                                                    className="action-btn"
                                                    title="Share"
                                                >
                                                    <Share2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Arabic Text - ALWAYS SHOWN (Default, cannot be removed) */}
                                        <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-[var(--color-text)] text-right leading-loose mb-6" dir="rtl">
                                            {ayah.arabic_text}
                                            <span className="inline-block w-8 h-8 mx-2 text-base align-middle text-[var(--color-primary)] rounded-full bg-[var(--color-primary)]/10">
                                                {`\u06DD${ayah.ayah_number.toLocaleString('ar-SA')}`}
                                            </span>
                                        </p>

                                        {/* Translations */}
                                        <div className="space-y-4 border-t border-[var(--color-border)] pt-4">
                                            {selectedLanguages.map(langCode => {
                                                const translation = ayah.translations.find(t => t.language_code === langCode);
                                                if (!translation) return null;
                                                const langInfo = LANGUAGES[langCode];

                                                return (
                                                    <div key={langCode}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs">{langInfo?.flag || '🌐'}</span>
                                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                                {langInfo?.name || langCode}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className={`text-base text-[var(--color-text-secondary)] leading-relaxed ${['ar', 'ur'].includes(langCode) ? 'text-right font-arabic text-xl' : ''
                                                                }`}
                                                            dir={['ar', 'ur'].includes(langCode) ? 'rtl' : 'ltr'}
                                                        >
                                                            {translation.translation_text}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation */}
            {!isLoading && (
                <section className="px-4 sm:px-6 mt-12">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        {prevSurah ? (
                            <Link
                                href={`/quran/${prevSurah.number}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm">{prevSurah.transliteration}</span>
                            </Link>
                        ) : <div />}

                        {nextSurah && (
                            <Link
                                href={`/quran/${nextSurah.number}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                            >
                                <span className="text-sm">{nextSurah.transliteration}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* Note Modal */}
            <AnimatePresence>
                {noteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setNoteModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg bg-[var(--color-bg-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                                <h3 className="font-serif text-lg text-[var(--color-text)]">Add Note</h3>
                                <button onClick={() => setNoteModal(null)} className="action-btn">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="font-arabic text-xl text-right text-[var(--color-text-muted)] mb-4" dir="rtl">
                                    {noteModal.arabic.substring(0, 100)}...
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                                    {surah?.transliteration} {surahNumber}:{noteModal.ayah}
                                </p>
                                <textarea
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                    placeholder="Write your thoughts, reflections, or notes..."
                                    rows={4}
                                    className="input-premium resize-none"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3 p-4 border-t border-[var(--color-border)]">
                                <button onClick={() => setNoteModal(null)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSaveNote} className="btn-primary flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Save Note
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Surah Audio Player */}
            {!isLoading && ayahs.length > 0 && (
                <SurahAudioPlayer
                    surahNumber={surahNumber}
                    surahName={surah?.transliteration || ''}
                    totalAyahs={ayahs.length}
                    onAyahChange={(ayahNum) => setHighlightedAyah(ayahNum)}
                    ayahRefs={ayahElementsRef}
                />
            )}

            {/* Bottom Spacing for Audio Player */}
            <div className="h-24" />
        </div>
    );
}
