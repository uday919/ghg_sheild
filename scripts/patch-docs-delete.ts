import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const databaseUrl = process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ SUPABASE_DATABASE_URL is missing.');
    process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: 'require' });

async function patchDatabase() {
    console.log('🔧 Completing Supabase Schema Patches for Documents...');
    try {
        await sql`ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;`;
        console.log('✅ Added deleted_at column to documents table');

        await sql`NOTIFY pgrst, 'reload schema';`;
        console.log('✅ Instructed PostgREST to reload schema cache.');
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

patchDatabase();
