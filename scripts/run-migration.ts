// Script to run migrations on Supabase
// Run with: npx tsx scripts/run-migration.ts

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function runMigration() {
    console.log('🚀 Starting migration...')

    // Note: Supabase JS SDK doesn't support raw SQL execution
    // You need to run this migration manually in the Supabase Dashboard SQL Editor
    // or use the Supabase CLI with proper authentication

    console.log('📋 Migration file: supabase/migrations/001_initial_schema.sql')
    console.log('')
    console.log('⚠️  The Supabase JS SDK does not support raw SQL execution.')
    console.log('   Please run the migration manually:')
    console.log('')
    console.log('   1. Go to: https://supabase.com/dashboard/project/gdbojsrmzhydeyitsotc/sql/new')
    console.log('   2. Copy the contents of supabase/migrations/001_initial_schema.sql')
    console.log('   3. Paste in the SQL editor and click "Run"')
    console.log('')

    // Test connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)

    if (error && error.code === '42P01') {
        console.log('❌ Table "profiles" does not exist yet - migration pending')
    } else if (error) {
        console.log('❌ Connection error:', error.message)
    } else {
        console.log('✅ Connection successful! Tables may already exist.')
    }
}

runMigration()
