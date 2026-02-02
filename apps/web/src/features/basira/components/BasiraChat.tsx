'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock chat history
const INITIAL_MESSAGES = [
    { role: 'assistant', content: 'Assalamu alaykum. I am Basira, your AI guide to the Al-Haqq platform. How can I assist you with your journey today?' }
];

export default function BasiraChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg = {
                role: 'assistant',
                content: 'I am currently a demo version. I can help you navigate the Quran, Hadith, and Prayer times, but my knowledge base is currently being updated.'
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all border border-emerald-400/20"
                aria-label="Open Basira AI Chat"
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-bg-elevated border border-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                                    <Sparkles size={16} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text">Basira AI</h3>
                                    <p className="text-xs text-secondary font-medium uppercase tracking-wider">Islamic Assistant</p>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="text-text-muted hover:text-text transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg/50 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border ${msg.role === 'user'
                                            ? 'bg-gray-800 text-gray-300 border-gray-700'
                                            : 'bg-primary/10 text-primary border-primary/20'
                                        }`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-bg-elevated border border-border rounded-bl-none text-text shadow-sm'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 flex items-center justify-center mt-1">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-bg-elevated border border-border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                        <div className="flex gap-1.5">
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                                                className="w-1.5 h-1.5 bg-primary rounded-full"
                                            />
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                                className="w-1.5 h-1.5 bg-primary rounded-full"
                                            />
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                                                className="w-1.5 h-1.5 bg-primary rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-bg-elevated">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask Basira anything..."
                                    className="w-full pr-12 pl-4 py-3 bg-bg border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text placeholder-text-muted transition-shadow"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-text-muted">Basira AI can make mistakes. Please verify important religious rulings.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
