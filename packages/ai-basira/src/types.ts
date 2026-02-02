/**
 * AI Basira Types
 */

export interface BasiraConfig {
    groqApiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface Source {
    type: 'quran' | 'hadith';
    reference: string;
    arabicText: string;
    translation: string;
    relevanceScore?: number;
}

export interface BasiraRequest {
    question: string;
    language?: string;
    conversationHistory?: Message[];
}

export interface BasiraAnswer {
    answer: string;
    sources: Source[];
    blocked?: boolean;
    blockedReason?: string;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface GuardrailResult {
    allowed: boolean;
    reason?: string;
    blockedTopic?: string;
}
