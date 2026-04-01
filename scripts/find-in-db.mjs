import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findText(text) {
  console.log(`🔎 Searching for "${text}" in DB...`);
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('content, source')
    .ilike('content', `%${text}%`);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${data.length} matches.`);
    data.forEach((d, i) => {
      console.log(`[${i+1}] Source: ${d.source}`);
      console.log(`Content: ${d.content}\n`);
    });
  }
}

const searchInput = process.argv[2] || "Singh";
findText(searchInput).catch(console.error);
