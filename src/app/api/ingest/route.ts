import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

function chunkText(text: string, maxChunkSize: number = 800): string[] {
    // Simple paragraph-based chunker with basic cleaning
    const paragraphs = text.split(/\n\n+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = paragraph;
        } else {
            currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, source, metadata = {} } = await req.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // 1. Chunk the markdown content
        const chunks = chunkText(content);
        if (chunks.length === 0) {
            return NextResponse.json({ error: 'No content to process' }, { status: 400 });
        }

        console.log(`Ingesting ${chunks.length} chunks for source: ${source}`);

        // 2. Generate embeddings for each chunk sequentially
        const results = [];
        for (const chunk of chunks) {
            const output = await hf.featureExtraction({
                model: 'sentence-transformers/all-MiniLM-L6-v2',
                inputs: chunk,
            });

            const embedding = (Array.isArray(output[0]) ? output[0] : output) as number[];

            // 3. Store in Supabase
            const { data, error } = await supabase
                .from('knowledge_base')
                .insert({
                    content: chunk,
                    embedding: embedding,
                    source: source || 'admin-upload',
                    metadata: metadata,
                })
                .select('id')
                .single();

            if (error) {
                console.error("Supabase insert error", error);
                throw error;
            }
            results.push(data.id);
        }

        return NextResponse.json({ success: true, message: `Processed ${chunks.length} chunks.` });

    } catch (error: any) {
        console.error('Ingestion API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
