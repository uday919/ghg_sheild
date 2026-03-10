import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);

import { supabase } from '../lib/supabase';

async function testDelete() {
    console.log("Testing soft delete...");
    try {
        // Find any active emission record
        const { data: records, error: fetchErr } = await supabase
            .from('emission_data')
            .select('*')
            .limit(1);

        if (fetchErr) {
            console.error("Fetch Error:", fetchErr);
            return;
        }

        if (!records || records.length === 0) {
            console.log("No records found to delete");
            return;
        }

        const target = records[0];
        console.log(`Attempting to delete record ID: ${target.id}`);

        const { error: updateError } = await supabase
            .from('emission_data')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', target.id);

        if (updateError) {
            console.error("Update Error:", JSON.stringify(updateError, null, 2));
        } else {
            console.log("Soft delete successful on record:", target.id);
        }

    } catch (err) {
        console.error("Caught exception:", err);
    }
}

testDelete();
