// ============================================================
// GHG Shield — Supabase Configuration
// ============================================================
import { createClient } from '@supabase/supabase-js';

// These variables must be exposed to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure these variables exist
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

// Client for standard browser usage (respects RLS, requires user token if enabled)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
