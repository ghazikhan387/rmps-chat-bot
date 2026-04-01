import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('🔍 Checking Knowledge Base...');

  // 1. Check Row Count
  const { count, error: countError } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error fetching count:', countError.message);
  } else {
    console.log(`✅ Total documents in knowledge_base: ${count}`);
  }

  // 2. Check Sample Data & Embedding Dims
  const { data, error: dataError } = await supabase
    .from('knowledge_base')
    .select('id, content, embedding, source')
    .limit(1);

  if (dataError) {
    console.error('❌ Error fetching sample data:', dataError.message);
  } else if (data && data.length > 0) {
    const sample = data[0];
    const dims = sample.embedding ? JSON.parse(sample.embedding).length : 0;
    console.log('✅ Sample Data Found:');
    console.log(`   ID: ${sample.id}`);
    console.log(`   Source: ${sample.source}`);
    console.log(`   Content Preview: ${sample.content.substring(0, 50)}...`);
    console.log(`   Embedding Dimensions: ${dims}`);
    
    if (dims === 384) {
      console.log('🚀 Embedding dimensions are CORRECT (384).');
    } else {
      console.warn(`⚠️ Warning: Expected 384 dimensions, but found ${dims}.`);
    }
  } else {
    console.log('❓ No data found in knowledge_base. Have you run the seeding script?');
  }
}

check().catch(console.error);
