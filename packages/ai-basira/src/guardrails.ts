/**
 * AI Basira Guardrails
 * Ensures safe and appropriate responses
 */

import type { GuardrailResult } from './types.js';

/**
 * Topics that Basira should NOT provide guidance on
 */
const BLOCKED_TOPICS = [
    'fatwa',
    'religious ruling',
    'halal certification',
    'personal spiritual advice',
    'sectarian disputes',
    'political interpretation',
    'medical advice',
    'legal advice',
    'marriage counseling',
    'divorce ruling',
    'inheritance ruling',
    'financial ruling',
];

/**
 * Phrases that indicate the user wants a religious ruling
 */
const RULING_INDICATORS = [
    'is it halal',
    'is it haram',
    'is it permissible',
    'is it allowed',
    'what is the ruling',
    'can i do',
    'should i do',
    'give me fatwa',
];

export class Guardrails {
    /**
     * Check if the input contains blocked topics
     */
    static checkInput(input: string): GuardrailResult {
        const lowerInput = input.toLowerCase();

        // Check for blocked topics
        for (const topic of BLOCKED_TOPICS) {
            if (lowerInput.includes(topic)) {
                return {
                    allowed: false,
                    reason: `Questions about "${topic}" require consultation with a qualified Islamic scholar.`,
                    blockedTopic: topic,
                };
            }
        }

        // Check for ruling indicators
        for (const indicator of RULING_INDICATORS) {
            if (lowerInput.includes(indicator)) {
                return {
                    allowed: false,
                    reason: 'Questions seeking religious rulings (fatwa) should be directed to a qualified scholar.',
                    blockedTopic: 'religious ruling',
                };
            }
        }

        return { allowed: true };
    }

    /**
     * Check if the output contains fabricated content
     */
    static checkOutput(output: string, sources: { reference: string }[]): GuardrailResult {
        // If there are no sources but the response claims to quote something
        if (sources.length === 0) {
            const quotePatterns = [
                /quran says/i,
                /prophet said/i,
                /hadith states/i,
                /allah says/i,
            ];

            for (const pattern of quotePatterns) {
                if (pattern.test(output)) {
                    return {
                        allowed: false,
                        reason: 'Response claims to quote sources but no sources were found.',
                    };
                }
            }
        }

        return { allowed: true };
    }

    /**
     * Get the disclaimer to append to responses
     */
    static getDisclaimer(): string {
        return `

---
⚠️ **Important**: This information is for educational purposes only. For religious rulings (fatwa) or personal guidance, please consult a qualified Islamic scholar.`;
    }

    /**
     * Get blocked topic response
     */
    static getBlockedResponse(reason: string): string {
        return `I appreciate your question, but I'm not able to provide guidance on this topic. ${reason}

**Recommendation**: Please consult a qualified Islamic scholar or local imam who can understand your specific situation and provide personalized guidance based on authentic Islamic scholarship.

You can still ask me about:
- Quran verses and their translations
- Hadith narrations and their meanings
- General Islamic history and concepts
- Educational information about Islamic practices`;
    }
}
