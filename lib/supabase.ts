// ============================================================
// GHG Shield — Supabase Configuration
// ============================================================
import { createClient } from '@supabase/supabase-js';

// These variables must be exposed to the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We keep the client initialization resilient for the build phase.
// If keys are missing during 'next build', we use placeholders to avoid crashes.
// The real keys must be provided in the Vercel/Production environment for runtime.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
