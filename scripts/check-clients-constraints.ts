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

async function checkConstraints() {
    console.log('🔍 Checking Constraints for "clients" table...');
    try {
        const constraints = await sql`
            SELECT
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                tc.constraint_type
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
            WHERE tc.table_name = 'clients';
        `;
        console.log('📋 Existing Constraints in "clients":');
        console.table(constraints);
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        await sql.end();
    }
}

checkConstraints();
