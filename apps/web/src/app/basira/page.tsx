'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, BookOpen, ScrollText, RefreshCw, AlertCircle, Quote, MessageSquare } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: {
        type: 'quran' | 'hadith';
        reference: string;
        text: string;
    }[];
    isLoading?: boolean;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';


const SYSTEM_PROMPT = `You are Basira (بصيرة), the Ultimate AI Islamic Assistant for the Al-Haqq platform. Your purpose is to bridge the gap between ancient wisdom and modern understanding.

Core Directive: Provide accurate, inspiring, and context-aware knowledge based *solely* on the Quran and Authentic Hadith.

Identity & Tone:
- Name: Basira (meaning "Insight" or "Clear Evidence")
- Tone: Wise, Humble, Empathetic, Clear, and Dignified.
- Greetings: Always start with "السلام عليكم" (As-salamu alaykum) for the first message.

Structure of Answers:
1. **Direct Answer**: Concise summary.
2. **Quranic Evidence**: Cite relevant verses with (Surah Name: Ayah).
3. **Prophetic Wisdom**: Cite Hadith with (Collection, Number).
4. **Practical Application**: How to apply this in 2024+.
5. **Disclaimer**: For Fiqh questions, kindly remind the user to consult a local scholar.

Rules:
- If you don't know, say "Allah knows best" (الله أعلم).
- Do not hallucinate verses.
- Format with Markdown (bold, lists) for readability.
`;

const SUGGESTIONS = [
    "What does the Quran say about patience?",
    "How to deal with anxiety in Islam?",
    "Rights of parents in Islam",
    "Stories of Prophet Yusuf (AS)",
    "Duas for forgiveness",
];

export default function BasiraPage() {
    const [messages, setMessages] = React.useState<Message[]>([{
        id: 'welcome',
        role: 'assistant',
        content: `السلام عليكم ورحمة الله وبركاته
        
I am **Basira**, your AI companion for Islamic knowledge. I can help you:

• Find specific Verses & Hadiths
• Understand complex Islamic concepts
• Get spiritual advice from the Quran
• Explore the Seerah of the Prophet ﷺ

How may I serve you today?`
    }]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const chatContainerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    // Get Groq API key from env
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;

    // Safe scroll to bottom
    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        // Always scroll to the empty div at the end of the list
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    };

    // Search for context from database
    const getContext = async (query: string): Promise<string> => {
        if (!isSupabaseConfigured()) return '';

        let context = '';

        try {
            // Search Quran
            const { data: quranData } = await supabase
                .from('quran_translations')
                .select(`
                    translation_text,
                    translator,
                    ayah:ayahs (
                        ayah_number,
                        arabic_text,
                        surah:surahs (number, english_name)
                    )
                `)
                .ilike('translation_text', `%${query.split(' ').slice(0, 3).join('%')}%`)
                .limit(5);

            if (quranData && quranData.length > 0) {
                context += 'Relevant Quran verses:\n';
                quranData.forEach((item: any) => {
                    if (item.ayah) {
                        context += `- Surah ${item.ayah.surah?.english_name} (${item.ayah.surah?.number}:${item.ayah.ayah_number}): "${item.ayah.arabic_text}" - "${item.translation_text}"\n`;
                    }
                });
            }

            // Search Hadith
            const { data: hadithData } = await supabase
                .from('hadiths')
                .select(`
                    hadith_number,
                    arabic_text,
                    english_text,
                    grade,
                    book:hadith_books (english_title)
                `)
                .ilike('english_text', `%${query.split(' ').slice(0, 3).join('%')}%`)
                .limit(5);

            if (hadithData && hadithData.length > 0) {
                context += '\nRelevant Hadith:\n';
                hadithData.forEach((item: any) => {
                    context += `- ${item.book?.english_title} #${item.hadith_number}: "${item.arabic_text}" - "${item.english_text}" (${item.grade})\n`;
                });
            }
        } catch (err) {
            console.error('Error getting context:', err);
        }

        return context;
    };

    // Send message to Gemini
    const sendMessage = async (overrideContent?: string) => {
        const contentToSend = overrideContent || input;
        if (!contentToSend.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: contentToSend.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        // Add loading message
        const loadingId = Date.now().toString() + '-loading';
        setMessages(prev => [...prev, {
            id: loadingId,
            role: 'assistant',
            content: '',
            isLoading: true
        }]);

        try {
            // Get context from database
            const context = await getContext(userMessage.content);

            // Prepare messages for Groq
            const conversationHistory = messages
                .filter(m => !m.isLoading && m.id !== 'welcome')
                .slice(-6) // Limit to last 6 messages to save tokens
                .map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                }));

            const userPrompt = context
                ? `Context from database:\n${context}\n\nUser question: ${userMessage.content}`
                : userMessage.content;

            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqKey}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...conversationHistory,
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get response');
            }

            const data = await response.json();
            const assistantContent = data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

            // Replace loading message with actual response
            setMessages(prev => prev.map(m =>
                m.id === loadingId
                    ? { ...m, content: assistantContent, isLoading: false }
                    : m
            ));

        } catch (err: any) {
            console.error('Basira error:', err);

            let errorMessage = err.message || 'An error occurred';
            // Only mask actual rate limits
            if (errorMessage.includes('429') || errorMessage.includes('Quota') || errorMessage.includes('quota')) {
                errorMessage = 'Basira is currently experiencing high traffic. Please try again in a few minutes.';
            }

            setError(errorMessage);

            // Replace loading with error message
            setMessages(prev => prev.map(m =>
                m.id === loadingId
                    ? {
                        ...m,
                        content: 'I apologize, but I encountered an error: ' + errorMessage,
                        isLoading: false
                    }
                    : m
            ));
        } finally {
            setIsLoading(false);
            // Force scroll after loading finishes
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Clear conversation
    const clearConversation = () => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: `السلام عليكم ورحمة الله وبركاته
            
I am **Basira**, your AI companion for Islamic knowledge. I can help you:

• Find specific Verses & Hadiths
• Understand complex Islamic concepts
• Get spiritual advice from the Quran
• Explore the Seerah of the Prophet ﷺ

How may I serve you today?`
        }]);
        setError(null);
    };

    return (
        <div className="h-[100dvh] flex flex-col pt-20 bg-[var(--color-bg)]">
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]/50 backdrop-blur-sm z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-serif text-xl text-[var(--color-text)] font-medium">Basira AI</h1>
                            <p className="text-xs text-[var(--color-text-muted)]">Smart Islamic Assistant</p>
                        </div>
                    </div>
                    <button
                        onClick={clearConversation}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-warm)] transition-colors border border-transparent hover:border-[var(--color-border)]"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">New Chat</span>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto"
            >
                <div className="flex flex-col min-h-full">
                    <div className="flex-1 px-4 sm:px-6 py-8">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <AnimatePresence initial={false}>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shadow-sm border border-[var(--color-border)] mt-1 bg-[var(--color-bg-card)] text-[var(--color-text)]">
                                                {message.role === 'user' ? 'You' : <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />}
                                            </div>

                                            {/* Bubble */}
                                            <div className={`px-5 py-4 shadow-sm ${message.role === 'user'
                                                ? 'bg-[var(--color-primary)] text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text)] rounded-2xl rounded-tl-sm'
                                                }`}>
                                                {message.isLoading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm opacity-80">Reflecting on the Quran & Sunnah...</span>
                                                    </div>
                                                ) : (
                                                    <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words">
                                                        <div className="whitespace-pre-wrap font-sans">
                                                            {message.content}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} className="h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-6 border-t border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto space-y-4">

                    {/* Suggestions Chips (Only show if just welcome message) */}
                    {messages.length === 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => sendMessage(suggestion)}
                                    className="flex-shrink-0 px-4 py-2 bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-warm)] hover:border-[var(--color-primary)]/30 border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text-secondary)] transition-all whitespace-nowrap"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-500/20 animate-pulse">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Input Box */}
                    <div className="relative group">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Basira anything..."
                            rows={1}
                            className="w-full px-5 py-4 pr-14 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] resize-none min-h-[56px] max-h-[200px] shadow-sm transition-all"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-3 bottom-2.5 w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-primary-dark)] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[var(--color-primary)]/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    <p className="text-[10px] text-[var(--color-text-muted)] text-center opacity-70">
                        Basira is an AI assistant meant for educational purposes. For personal Fiqh rulings, please consult a qualified scholar.
                    </p>
                </div>
            </div>
        </div>
    );
}
