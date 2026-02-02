/**
 * AI Basira Engine
 * Main class for the Islamic Knowledge Assistant
 * Uses Groq API for fast LLM inference
 */

import Groq from 'groq-sdk';
import { Guardrails } from './guardrails.js';
import { SourceRetriever } from './retriever.js';
import { SYSTEM_PROMPT } from './prompts.js';
import type { BasiraConfig, BasiraRequest, BasiraAnswer, Source, Message } from './types.js';

export class BasiraEngine {
    private groq: Groq;
    private model: string;
    private temperature: number;
    private maxTokens: number;
    private retriever: SourceRetriever | null = null;

    constructor(config: BasiraConfig) {
        this.groq = new Groq({ apiKey: config.groqApiKey });
        this.model = config.model || 'llama-3.3-70b-versatile';
        this.temperature = config.temperature || 0.3;
        this.maxTokens = config.maxTokens || 2000;
    }

    /**
     * Set up the source retriever
     */
    setRetriever(retriever: SourceRetriever): void {
        this.retriever = retriever;
    }

    /**
     * Answer a question using RAG
     */
    async ask(request: BasiraRequest): Promise<BasiraAnswer> {
        // Step 1: Check guardrails
        const guardrailCheck = Guardrails.checkInput(request.question);
        if (!guardrailCheck.allowed) {
            return {
                answer: Guardrails.getBlockedResponse(guardrailCheck.reason || ''),
                sources: [],
                blocked: true,
                blockedReason: guardrailCheck.blockedTopic,
            };
        }

        // Step 2: Retrieve relevant sources
        let sources: Source[] = [];
        if (this.retriever) {
            sources = await this.retriever.search(request.question, 10);
        }

        // Step 3: Build context from sources
        const context = this.buildContext(sources);

        // Step 4: Generate response with Groq
        const answer = await this.generateResponse(
            request.question,
            context,
            request.conversationHistory || []
        );

        // Step 5: Validate output
        const outputCheck = Guardrails.checkOutput(answer, sources);
        if (!outputCheck.allowed) {
            return {
                answer: "I apologize, but I couldn't find relevant sources to answer your question accurately. Could you please rephrase or ask about a specific Quran verse or Hadith?",
                sources: [],
                blocked: true,
                blockedReason: 'no_sources',
            };
        }

        // Step 6: Add disclaimer and return
        return {
            answer: answer + Guardrails.getDisclaimer(),
            sources: sources.slice(0, 5), // Return top 5 sources
        };
    }

    /**
     * Build context string from sources
     */
    private buildContext(sources: Source[]): string {
        if (sources.length === 0) {
            return 'No relevant sources found in the database.';
        }

        let context = 'RELEVANT SOURCES:\n\n';

        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            context += `[${i + 1}] ${source.reference}\n`;
            context += `Arabic: ${source.arabicText}\n`;
            context += `Translation: ${source.translation}\n\n`;
        }

        return context;
    }

    /**
     * Generate response using Groq
     */
    private async generateResponse(
        question: string,
        context: string,
        history: Message[]
    ): Promise<string> {
        // Build conversation messages
        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
            { role: 'system', content: SYSTEM_PROMPT },
        ];

        // Add conversation history
        for (const msg of history) {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
            });
        }

        // Add the current question with context
        const userPrompt = `${context}\n\nUser Question: ${question}\n\nBased on the sources above, please provide an educational response. If the sources don't contain relevant information, say so clearly.`;
        messages.push({ role: 'user', content: userPrompt });

        const completion = await this.groq.chat.completions.create({
            model: this.model,
            messages: messages,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
        });

        return completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    }
}
