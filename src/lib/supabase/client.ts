import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // During build time on Vercel or local, env vars might be missing.
    // We provide dummy values to prevent crash but log a warning.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        if (typeof window === 'undefined') {
            // Only warn on server-side to avoid noise in browser console
            console.warn('Supabase client initialized with dummy values.')
        }
    }

    return createBrowserClient(url, key)
}
