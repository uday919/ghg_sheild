// ============================================================
// GHG Shield — Supabase Configuration
// ============================================================
import { createClient } from '@supabase/supabase-js';

// These variables must be exposed to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Ensure these variables exist for the client to function
if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ Supabase URL or Anon Key is missing in production!');
    }
}

// Client for standard browser usage
// We use a fallback empty string if missing to avoid "supabaseUrl is required" crash during build
// The functions will still fail at runtime if the URL is literally empty, but the build won't crash.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
