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

async function setupStorage() {
    console.log('🔧 Creating Supabase Storage Buckets...');
    try {
        // Create the documents bucket if it doesn't exist
        await sql`
            INSERT INTO storage.buckets (id, name, public)
            VALUES ('documents', 'documents', true)
            ON CONFLICT (id) DO NOTHING;
        `;

        // Allow public access to the documents bucket (since we aren't using deep RLS for this MVP)
        await sql`
            CREATE POLICY "Public Access" 
            ON storage.objects FOR ALL 
            USING (bucket_id = 'documents');
        `;

        console.log('✅ Storage bucket "documents" created successfully.');
    } catch (err) {
        // Ignore policy already exists error
        if ((err as Error).message.includes('already exists')) {
            console.log('✅ Storage bucket "documents" already configured.');
        } else {
            console.error('❌ SQL Execution Error:', err);
        }
    } finally {
        await sql.end();
    }
}

setupStorage();
