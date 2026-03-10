import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonInsert() {
    console.log("Testing Anon Insert...");

    try {
        // Find a client ID to use
        const { data: clients } = await supabase.from('clients').select('id').limit(1);
        if (!clients || clients.length === 0) {
            console.log("No clients found");
            return;
        }

        const clientId = clients[0].id;

        // Find a facility ID
        const { data: facs } = await supabase.from('facilities').select('id').limit(1);
        const facilityId = facs?.[0]?.id;

        const { error: insertError } = await supabase
            .from('emission_data')
            .insert([{
                client_id: clientId,
                facility_id: facilityId || null,
                reporting_year: 2025,
                month: 1,
                scope: '1',
                category: 'Stationary Combustion',
                fuel_type: 'Natural Gas',
                activity_data: 500,
                activity_unit: 'therms',
                data_source: 'Estimate',
                data_quality: 'Medium',
                notes: 'test',
                supplier_name: null,
                spend_amount: null,
                emission_factor_override: null,
                ef_unit: 'kgCO2e/therm',
                kgco2e: 26.53,
                tco2e: 0.02653,
                verified: false,
                calculation_method: 'EPA',
                factor_year: 2024,
                factor_version: 'v1.0',
                calculated_at: new Date().toISOString(),
            }]);

        if (insertError) {
            console.error("Anon Insert Error:", JSON.stringify(insertError, null, 2));
        } else {
            console.log("Anon Insert Successful!");
        }

    } catch (err) {
        console.error("Exception:", err);
    }
}

testAnonInsert();
