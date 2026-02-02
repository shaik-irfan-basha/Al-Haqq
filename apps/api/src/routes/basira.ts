/**
 * AI Basira API Routes
 * Islamic Knowledge Assistant with strict guardrails
 */

import { Router, type Response, type Request } from 'express';
// ... imports

export const basiraRouter: Router = Router();

/**
 * Check if query contains blocked topics
 */
function containsBlockedTopic(query: string): string | null {
    const lowerQuery = query.toLowerCase();
    for (const topic of BASIRA_BLOCKED_TOPICS) {
        if (lowerQuery.includes(topic)) {
            return topic;
        }
    }
    return null;
}

/**
 * Retrieve relevant sources using Vector Search with Fallback to Text Search
 */
async function retrieveSources(query: string, limit = 5): Promise<BasiraSource[]> {
    const sources: BasiraSource[] = [];

    try {
        // 1. Generate Embedding
        const result = await embeddingModel.embedContent(query);
        const embedding = result.embedding.values;

        // 2. Search Vectors via RPC
        const { data: vectorResults, error: vectorError } = await supabase.rpc('match_content_embeddings', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: limit
        });

        if (vectorError) {
            console.warn('Vector search failed (RPC likely missing), falling back to Text Search:', vectorError.message);
            throw vectorError;
        }

        if (vectorResults && vectorResults.length > 0) {
            // 3. Hydrate results
            // Results have content_id, content_type. We need to fetch text.
            // Optimize: We could fetch in loop or use IDs.
            for (const match of vectorResults) {
                if (match.content_type === 'ayah') {
                    const { data: video } = await supabase.from('quran_translations')
                        .select('translation_text, ayahs!inner(ayah_number, arabic_text, surahs!inner(number, english_name))')
                        .eq('ayah_id', match.content_id)
                        .eq('language_code', 'en')
                        .single();

                    if (video) {
                        const v = video as any;
                        sources.push({
                            type: 'quran',
                            reference: `Quran ${v.ayahs.surahs.number}:${v.ayahs.ayah_number} (${v.ayahs.surahs.english_name})`,
                            arabicText: v.ayahs.arabic_text,
                            translation: v.translation_text,
                            similarity: match.similarity
                        });
                    }
                }
            }
            // Logic for hadiths omitted for brevity in hybrid merge, assuming ayahs dominant for now or similar logic
        }

    } catch (e) {
        // Fallback or empty
    }

    if (sources.length === 0) {
        // Fallback to Text Search
        // Search Quran
        const { data: quranResults } = await supabase
            .from('quran_translations')
            .select(`
      translation_text,
      ayahs!inner (
        ayah_number,
        arabic_text,
        surahs!inner (number, english_name)
      )
    `)
            .eq('language_code', 'en')
            .textSearch('translation_tsv', query)
            .limit(limit);

        for (const item of quranResults || []) {
            const ayah = item.ayahs as any;
            sources.push({
                type: 'quran',
                reference: `Quran ${ayah.surahs.number}:${ayah.ayah_number} (${ayah.surahs.english_name})`,
                arabicText: ayah.arabic_text,
                translation: item.translation_text,
            });
        }

        // Search Hadith
        const { data: hadithResults } = await supabase
            .from('hadiths')
            .select(`
      hadith_number,
      arabic_text,
      english_text,
      grade,
      hadith_books!inner (slug, english_title)
    `)
            .textSearch('english_tsv', query)
            .limit(limit);

        for (const item of hadithResults || []) {
            const book = item.hadith_books as any;
            sources.push({
                type: 'hadith',
                reference: `${book.english_title}, Hadith ${item.hadith_number}${item.grade ? ` (${item.grade})` : ''}`,
                arabicText: item.arabic_text,
                translation: item.english_text,
            });
        }
    }

    return sources.slice(0, limit);
}

/**
 * Build context for LLM from sources
 */
function buildContext(sources: BasiraSource[]): string {
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
 * Generate response using Gemini
 * Note: This is a placeholder - actual implementation requires Gemini API
 */
async function generateResponse(
    question: string,
    context: string,
    sources: BasiraSource[]
): Promise<string> {
    // In production, this would call Gemini API
    // For now, return a structured response based on sources

    if (sources.length === 0) {
        return "I apologize, but I couldn't find relevant information in my sources to answer your question. Please try rephrasing your question or consult a qualified Islamic scholar for guidance.";
    }

    // Placeholder response that references sources
    let response = `Based on the Islamic sources available to me:\n\n`;

    for (const source of sources.slice(0, 3)) {
        response += `📖 **${source.reference}**\n`;
        response += `"${source.translation.slice(0, 200)}${source.translation.length > 200 ? '...' : ''}"\n\n`;
    }

    response += `\n⚠️ *Note: For detailed religious rulings (fatwa), please consult a qualified Islamic scholar.*`;

    return response;
}

/**
 * POST /api/v1/basira/ask
 * Ask Basira a question
 */
basiraRouter.post('/ask', asyncHandler(async (req, res) => {
    const { question, language = 'en', conversationId } = req.body as BasiraQuery;

    // Validate question
    if (!question || question.trim().length < 5) {
        throw createError('Question must be at least 5 characters', 400, 'INVALID_QUESTION');
    }

    if (question.length > 500) {
        throw createError('Question must be less than 500 characters', 400, 'QUESTION_TOO_LONG');
    }

    // Check for blocked topics
    const blockedTopic = containsBlockedTopic(question);
    if (blockedTopic) {
        const response: BasiraResponse = {
            answer: `I'm not able to provide guidance on "${blockedTopic}" as this requires consultation with a qualified Islamic scholar who can understand your specific situation. Please reach out to a trusted local scholar or Islamic center for personalized advice.`,
            sources: [],
            conversationId: conversationId || crypto.randomUUID(),
        };

        res.json({ success: true, data: response });
        return;
    }

    // Retrieve relevant sources
    const sources = await retrieveSources(question, BASIRA_CONFIG.RERANK_TOP_K);

    // Build context
    const context = buildContext(sources);

    // Generate response (placeholder - will use Gemini in production)
    const answer = await generateResponse(question, context, sources);

    // Create or update conversation
    let convId = conversationId;
    if (!convId) {
        const { data: conv } = await supabase
            .from('ai_conversations')
            .insert({ title: question.slice(0, 100) })
            .select('id')
            .single();
        convId = conv?.id;
    }

    // Save messages
    if (convId) {
        await supabase.from('ai_messages').insert([
            { conversation_id: convId, role: 'user', content: question },
            { conversation_id: convId, role: 'assistant', content: answer, sources },
        ]);
    }

    const response: BasiraResponse = {
        answer,
        sources,
        conversationId: convId || crypto.randomUUID(),
    };

    res.json({ success: true, data: response });
}));

/**
 * GET /api/v1/basira/conversations/:id
 * Get conversation history
 */
basiraRouter.get('/conversations/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { data: conversation, error: convError } = await supabase
        .from('ai_conversations')
        .select('id, title, started_at')
        .eq('id', id)
        .single();

    if (convError || !conversation) {
        throw createError('Conversation not found', 404, 'NOT_FOUND');
    }

    const { data: messages } = await supabase
        .from('ai_messages')
        .select('id, role, content, sources, created_at')
        .eq('conversation_id', id)
        .order('created_at');

    res.json({
        success: true,
        data: {
            id: conversation.id,
            title: conversation.title,
            startedAt: conversation.started_at,
            messages: (messages || []).map(m => ({
                id: m.id,
                role: m.role,
                content: m.content,
                sources: m.sources,
                createdAt: m.created_at,
            })),
        },
    });
}));
