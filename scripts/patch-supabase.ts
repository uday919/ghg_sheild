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
    console.log('🔧 Patching Supabase Schema...');
    try {
        await sql`ALTER TABLE clients ADD COLUMN IF NOT EXISTS contract_start TIMESTAMP WITH TIME ZONE;`;
        console.log('✅ Added contract_start to clients table');

        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS facility_id VARCHAR(255);`;
        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS address VARCHAR(255);`;
        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS city VARCHAR(255);`;
        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS state VARCHAR(100);`;
        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS zip VARCHAR(50);`;
        await sql`ALTER TABLE facilities ADD COLUMN IF NOT EXISTS country VARCHAR(100);`;
        console.log('✅ Added extended address and metadata columns to facilities table');

    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

patchDatabase();
