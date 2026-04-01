import { createClient } from '@supabase/supabase-js';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hfKey = process.env.HUGGINGFACE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const hf = new HfInference(hfKey);

async function testRetrieval(query) {
  console.log(`\n🔍 Testing Retrieval for: "${query}"`);
  
  let latestMessage = query;
  // --- Acronym Expansion & Query Cleaning ---
  if (/\bRMPSU?\b/i.test(latestMessage)) {
      latestMessage = latestMessage.replace(/\bRMPSU?\b/gi, "Raja Mahendra Pratap Singh State University");
  }
  const textSearchQuery = query.replace(/tell me about|what is|tell when|who is|show me|find|about/gi, '').trim();

  // 1. Generate Query Embedding
  const output = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: latestMessage,
  });
  const embedding = (Array.isArray(output[0]) ? output[0] : output);

  // 2. Search DB
  const { data: documents, error } = await supabase.rpc('match_knowledge_documents', {
    query_embedding: embedding,
    match_threshold: 0.1,
    match_count: 5,
    query_text: textSearchQuery || latestMessage,
  });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!documents || documents.length === 0) {
    console.log('ℹ️ No documents matched.');
    return;
  }

  console.log(`✅ Found ${documents.length} matches:\n`);
  documents.forEach((doc, i) => {
    console.log(`--- Match ${i + 1} (Similarity: ${doc.similarity.toFixed(4)}) ---`);
    console.log(`Source: ${doc.source}`);
    console.log(`Content: ${doc.content.substring(0, 200)}...`);
    console.log('-------------------------------------------\n');
  });
}

const query = process.argv[2] || "What is the mission of the university?";
testRetrieval(query).catch(console.error);
