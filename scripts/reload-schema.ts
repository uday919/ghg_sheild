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

async function reloadSchema() {
    console.log('🔧 Reloading PostgREST Schema Cache...');
    try {
        await sql`NOTIFY pgrst, 'reload schema';`;
        console.log('✅ PostgREST schema cache reloaded.');
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

reloadSchema();
