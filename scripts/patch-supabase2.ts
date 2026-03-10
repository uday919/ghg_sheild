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
    console.log('🔧 Completing Supabase Schema Patches...');
    try {
        await sql`ALTER TABLE emission_data ADD COLUMN IF NOT EXISTS data_quality VARCHAR(50);`;
        await sql`ALTER TABLE emission_data ADD COLUMN IF NOT EXISTS notes TEXT;`;
        await sql`ALTER TABLE emission_data ADD COLUMN IF NOT EXISTS supplier_name VARCHAR(255);`;
        await sql`ALTER TABLE emission_data ADD COLUMN IF NOT EXISTS spend_amount DOUBLE PRECISION;`;
        console.log('✅ Added missing client-side columns to emission_data');

        await sql`NOTIFY pgrst, 'reload schema';`;
        console.log('✅ Instructed PostgREST to reload schema cache.');
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

patchDatabase();
