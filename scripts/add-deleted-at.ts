import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const databaseUrl = process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ SUPABASE_DATABASE_URL is missing in environment variables.');
    process.exit(1);
}

const sql = postgres(databaseUrl, { ssl: 'require' });

async function addDeletedAtColumn() {
    console.log('🔧 Adding deleted_at column to emission_data...');
    try {
        await sql`ALTER TABLE emission_data ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;`;
        console.log('✅ Column deleted_at added successfully.');
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

addDeletedAtColumn();
