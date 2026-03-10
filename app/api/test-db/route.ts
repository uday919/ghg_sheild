import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: records, error: fetchErr } = await supabase
            .from('emission_data')
            .select('*')
            .limit(1);

        if (fetchErr) return NextResponse.json({ error: 'fetch', details: fetchErr });
        if (!records || records.length === 0) return NextResponse.json({ message: 'No records' });

        const target = records[0];

        const { error: updateError } = await supabase
            .from('emission_data')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', target.id);

        const { error: deleteError } = await supabase
            .from('emission_data')
            .delete()
            .eq('id', target.id);

        return NextResponse.json({
            targetId: target.id,
            updateError: updateError || 'Success',
            deleteError: deleteError || 'Success'
        });
    } catch (err) {
        return NextResponse.json({ Exception: err });
    }
}
