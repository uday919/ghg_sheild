import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonDeleteAndInsert() {
    console.log("Testing Anon Delete and Insert...");

    try {
        // Find a client ID to use
        const { data: clients } = await supabase.from('clients').select('id').limit(1);
        const clientId = clients?.[0]?.id;

        // Find a facility ID
        const { data: facs } = await supabase.from('facilities').select('id').limit(1);
        const facilityId = facs?.[0]?.id;

        const { data: insertData, error: insertError } = await supabase
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
            }])
            .select();

        if (insertError) {
            console.error("Anon Insert Error:", JSON.stringify(insertError, null, 2));
            return;
        } else {
            console.log("Anon Insert Successful!", insertData[0].id);
        }

        const newId = insertData[0].id;

        // Soft delete
        const { error: softError } = await supabase
            .from('emission_data')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', newId);

        if (softError) {
            console.error("Anon Soft Delete Error:", JSON.stringify(softError, null, 2));
        } else {
            console.log("Anon Soft Delete Successful!");
        }

        // Hard delete
        const { error: hardError } = await supabase
            .from('emission_data')
            .delete()
            .eq('id', newId);

        if (hardError) {
            console.error("Anon Hard Delete Error:", JSON.stringify(hardError, null, 2));
        } else {
            console.log("Anon Hard Delete Successful!");
        }

    } catch (err) {
        console.error("Exception:", err);
    }
}

testAnonDeleteAndInsert();
