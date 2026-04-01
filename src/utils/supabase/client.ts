import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a dummy client or throw a more helpful error during development
        // but avoid crashing during the static build phase if possible.
        // For @supabase/ssr, we still need strings, so we provide empty ones if missing
        return createBrowserClient(supabaseUrl || '', supabaseAnonKey || '');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
