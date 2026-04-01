import { createClient } from '@/utils/supabase/server';
import { HfInference } from '@huggingface/inference';

export const maxDuration = 60;

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { messages, chatId } = await req.json();
        const rawMessage = messages[messages.length - 1].content;
        let latestMessage = rawMessage;

        // --- Acronym Expansion & Query Cleaning ---
        // Expand "RMPS" or "RMPSU" to the full university name for better vector search
        if (/\bRMPSU?\b/i.test(latestMessage)) {
            console.log("ℹ️ RMPS(U) detected, expanding for RAG...");
            latestMessage = latestMessage.replace(/\bRMPSU?\b/gi, "Raja Mahendra Pratap Singh State University");
        }

        // Clean query for text search fallback (remove common stopwords but keep key terms)
        const textSearchQuery = rawMessage.replace(/tell me about|what is|tell when|who is|show me|find|about/gi, '').trim();

        if (chatId && user) {
            supabase.from('messages').insert({
                chat_id: chatId,
                role: 'user',
                content: latestMessage
            }).then(res => {
                if (res.error) console.error("Error saving user message:", res.error);
            });
        }

        // --- RAG: Generate embedding ---
        let embedding: number[] | null = null;
        try {
            const output = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: latestMessage,
            });
            embedding = (Array.isArray(output[0]) ? output[0] : output) as number[];
        } catch (e) {
            console.warn("Embedding generation failed, proceeding without RAG context.", e);
        }

        let contextText = '';
        if (embedding) {
            const { data: documents, error } = await supabase.rpc('match_knowledge_documents', {
                query_embedding: embedding,
                match_threshold: 0.1, // Very lenient for high recall context
                match_count: 5,
                query_text: textSearchQuery || latestMessage // Fallback to raw message if cleaning was too aggressive
            });

            if (error) {
                console.error("RPC Error:", error);
            }

            if (documents && documents.length > 0) {
                console.log(`✅ RAG: Found ${documents.length} relevant chunks.`);
                documents.forEach((doc: any, i: number) => {
                    console.log(`   [${i + 1}] Source: ${doc.source} (Similarity: ${doc.similarity?.toFixed(4)})`);
                });

                contextText = documents
                    .map((doc: { source: string; content: string }) => `Source: ${doc.source}\nContent: ${doc.content}`)
                    .join('\n\n');
            } else {
                console.log("ℹ️ RAG: No relevant documents found for this query.");
            }
        }

        const systemPrompt = `You are the RMPSU AI Tour Guide, an intelligent, conversational virtual campus guide for Raja Mahendra Pratap Singh University.
Your goal is to provide accurate, contextual, and polite answers to students, parents, and visitors.
Adopt a tone of "calm intelligence and structured curiosity". Be helpful, precise, and concise.

IMPORTANT RULE: Base your answers primarily on the provided context. If the context does not contain the answer, politely state that you do not have that specific information and offer to help with something else. DO NOT hallucinate facts.

CONTEXT KNOWLEDGE:
${contextText || "No relevant university documents found for this query."}`;

        // Build message history for HF chat
        const hfMessages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            })),
        ];

        // Stream directly from HF Inference API, encode as AI SDK data-stream protocol
        // Protocol: each text token is sent as: 0:"<escaped token>"\n
        const encoder = new TextEncoder();
        let fullResponse = '';

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const chatStream = hf.chatCompletionStream({
                        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
                        messages: hfMessages,
                        max_tokens: 1024,
                        temperature: 0.7,
                    });

                    for await (const chunk of chatStream) {
                        const token = chunk.choices?.[0]?.delta?.content;
                        if (token) {
                            fullResponse += token;
                            // AI SDK useChat data-stream protocol: type 0 = text delta
                            const encoded = JSON.stringify(token);
                            controller.enqueue(encoder.encode(`0:${encoded}\n`));
                        }
                    }

                    // Save assistant response to DB
                    if (chatId && user && fullResponse) {
                        supabase.from('messages').insert({
                            chat_id: chatId,
                            role: 'assistant',
                            content: fullResponse,
                        }).then(res => {
                            if (res.error) console.error("Error saving assistant message:", res.error);
                        });
                    }
                } catch (err) {
                    console.error('HF Streaming error:', err);
                    controller.enqueue(encoder.encode(`3:"An error occurred while generating response."\n`));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-Data-Stream': 'v1',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
