import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        // We return a proxy that handles common calls or just throws a more descriptive error when called
        // In client-side, we expect these to be there. During build, we want to avoid crashing.
        if (typeof window === 'undefined') {
            console.warn('Supabase client initialized without URL or KEY during server-side execution/build.')
            return null as any
        }
    }

    return createBrowserClient(
        url!,
        key!
    )
}
