import { createClient } from '@supabase/supabase-js';
import { HfInference } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service role to bypass RLS
const hfKey = process.env.HUGGINGFACE_API_KEY;

if (!supabaseUrl || !supabaseKey || !hfKey) {
  console.error('❌ Missing environment variables. Please check .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, HUGGINGFACE_API_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const hf = new HfInference(hfKey);

const ASSETS_DIR = path.join(process.cwd(), 'Assets for rag');

function chunkText(text, maxChunkSize = 1000, minChunkSize = 200) {
  const parts = text.split(/\n\n+/);
  const chunks = [];
  let currentChunk = "";

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    if ((currentChunk.length + trimmedPart.length > maxChunkSize) && currentChunk.length >= minChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedPart;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmedPart;
    }
  }
  
  if (currentChunk.trim()) {
    // If the last chunk is too small, try to append it to the previous one instead of having a fragment
    if (chunks.length > 0 && currentChunk.length < minChunkSize) {
      chunks[chunks.length - 1] += "\n\n" + currentChunk.trim();
    } else {
      chunks.push(currentChunk.trim());
    }
  }
  return chunks;
}

// Simple frontmatter parser
function parseMarkdown(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);
  let metadata = {};
  let body = content;

  if (match) {
    const yaml = match[1];
    yaml.split('\n').forEach(line => {
      const [key, ...val] = line.split(':');
      if (key && val) {
        metadata[key.trim()] = val.join(':').trim().replace(/^"(.*)"$/, '$1');
      }
    });
    body = content.replace(frontmatterRegex, '');
  }

  // Basic cleaning: remove navigation boilerplate if it starts with long lists of links
  // In the university files, main content often starts after a big list.
  // We'll just take the whole body for now but filter out empty lines.
  return { metadata, body: body.trim() };
}

async function seed() {
  console.log('🚀 Starting RAG Seeding...');
  
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ Directory not found: ${ASSETS_DIR}`);
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} markdown files.`);

  // Clear existing knowledge base to avoid duplicates if re-running
  console.log('🧹 Clearing existing knowledge base...');
  const { error: deleteError } = await supabase.from('knowledge_base').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Error clearing DB:', deleteError);
    // Continue anyway
  }

  for (const file of files) {
    console.log(`\n📄 Processing: ${file}`);
    const fullPath = path.join(ASSETS_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const { metadata, body } = parseMarkdown(content);
    const chunks = chunkText(body);
    
    console.log(`   Split into ${chunks.length} chunks.`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      process.stdout.write(`   ➡️ Embedding chunk ${i + 1}/${chunks.length}... `);
      
      try {
        const output = await hf.featureExtraction({
          model: 'sentence-transformers/all-MiniLM-L6-v2',
          inputs: chunk,
        });
        
        const embedding = (Array.isArray(output[0]) ? output[0] : output);

        const { error: insertError } = await supabase
          .from('knowledge_base')
          .insert({
            content: chunk,
            embedding: embedding,
            source: metadata.url || file,
            metadata: {
              ...metadata,
              file: file,
              chunk_index: i
            }
          });

        if (insertError) {
          console.error('\n❌ Supabase Insert Error:', insertError);
        } else {
          process.stdout.write('✅\n');
        }
      } catch (e) {
        console.error(`\n❌ HF Error: ${e.message}`);
      }
    }
  }

  console.log('\n✨ Seeding Complete!');
}

seed().catch(console.error);
