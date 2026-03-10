import postgres from 'postgres';
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const databaseUrl = process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
    console.error('❌ SUPABASE_DATABASE_URL is missing in environment variables.');
    process.exit(1);
}

// Connect to PostgreSQL
const sql = postgres(databaseUrl, { ssl: 'require' });

async function setupDatabase() {
    console.log('🔧 Starting Supabase PostgreSQL Schema Setup...');

    try {
        // Enable UUID extension
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
        console.log('✓ uuid-ossp extension enabled.');

        // ─── 1. Clients Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS clients (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                clerk_id VARCHAR(255) UNIQUE, -- Links to Clerk user
                company_name VARCHAR(255) NOT NULL,
                contact_name VARCHAR(255),
                contact_email VARCHAR(255) UNIQUE NOT NULL,
                industry VARCHAR(255),
                annual_revenue VARCHAR(255),
                facility_count INTEGER DEFAULT 0,
                fiscal_year_start VARCHAR(50),
                fiscal_year_end VARCHAR(50),
                compliance_status VARCHAR(100),
                is_active BOOLEAN DEFAULT true,
                setup_fee INTEGER DEFAULT 0,
                monthly_fee INTEGER DEFAULT 0,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: clients');

        // ─── 2. Facilities Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS facilities (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                egrid_subregion VARCHAR(100),
                facility_type VARCHAR(100),
                in_boundary BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: facilities');

        // ─── 3. Emission Data Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS emission_data (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
                reporting_year INTEGER NOT NULL,
                month INTEGER,
                scope VARCHAR(50) NOT NULL,
                category VARCHAR(100) NOT NULL,
                fuel_type VARCHAR(100),
                activity_data DOUBLE PRECISION NOT NULL,
                activity_unit VARCHAR(50) NOT NULL,
                data_source VARCHAR(255),
                tco2e DOUBLE PRECISION NOT NULL,
                kgco2e DOUBLE PRECISION NOT NULL,
                ef_unit VARCHAR(50),
                verified BOOLEAN DEFAULT false,
                calculation_method VARCHAR(255),
                factor_year VARCHAR(50),
                factor_version VARCHAR(50),
                calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                emission_factor_override DOUBLE PRECISION,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: emission_data');

        // ─── 4. Reports Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS reports (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                reporting_year INTEGER NOT NULL,
                report_name VARCHAR(255) NOT NULL,
                status VARCHAR(50) DEFAULT 'Draft',
                verification_status VARCHAR(50) DEFAULT 'Unverified',
                total_scope1 DOUBLE PRECISION DEFAULT 0,
                total_scope2_location DOUBLE PRECISION DEFAULT 0,
                total_scope3 DOUBLE PRECISION DEFAULT 0,
                final_pdf_url TEXT,
                ai_content TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: reports');

        // ─── 5. Documents Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS documents (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                doc_type VARCHAR(100),
                file_id VARCHAR(255),
                file_url TEXT,
                visible_to_client BOOLEAN DEFAULT false,
                uploaded_by VARCHAR(255),
                upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: documents');

        // ─── 6. Action Items Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS action_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                text TEXT NOT NULL,
                due_date VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Pending',
                priority VARCHAR(50) DEFAULT 'Medium',
                visible_to_client BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: action_items');

        // ─── 7. Activity Log Table ───
        await sql`
            CREATE TABLE IF NOT EXISTS activity_log (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
                action VARCHAR(255) NOT NULL,
                details TEXT,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ Table created: activity_log');

        console.log('\n✅ All Database Tables created successfully!');
    } catch (err) {
        console.error('❌ SQL Execution Error:', err);
    } finally {
        // Close connection
        await sql.end();
    }
}

setupDatabase();
