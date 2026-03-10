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

async function checkSchema() {
    console.log('🔍 Checking Schema for "clients" table...');
    try {
        const columns = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'clients';
        `;
        console.log('📋 Existing Columns in "clients":');
        console.table(columns);
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

checkSchema();
