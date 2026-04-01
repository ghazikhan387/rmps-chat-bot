-- 1. Drop the existing match function as it depends on the old vector size
DROP FUNCTION IF EXISTS match_knowledge_documents(vector, float, int);

-- 2. Alter the knowledge_base table to use 384-dimensional vectors (Hugging Face all-MiniLM-L6-v2)
-- Note: This will delete existing embeddings if they exist. Since we are seeding from scratch, this is intended.
ALTER TABLE public.knowledge_base 
ALTER COLUMN embedding TYPE vector(384);

-- 3. Re-create the RPC Function for similarity search with 384 dims
CREATE OR REPLACE FUNCTION match_knowledge_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  query_text text DEFAULT ''
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source TEXT,
  metadata JSONB,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.source,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE 
    (1 - (kb.embedding <=> query_embedding) > match_threshold)
    OR (query_text <> '' AND (
        kb.content ILIKE '%' || query_text || '%'
        OR kb.content ILIKE '%' || replace(query_text, ' ', '%') || '%'
    ))
  ORDER BY 
    CASE WHEN query_text <> '' AND kb.content ILIKE '%' || query_text || '%' THEN 1 ELSE 0 END DESC,
    kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

