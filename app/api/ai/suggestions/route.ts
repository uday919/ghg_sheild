import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { keysToCamelCase } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function POST(req: Request) {
    try {
        const { clientId } = await req.json();

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        // 1. Fetch client info and emissions
        const { data: clientData, error: cError } = await supabase
            .from('clients')
            .select('ai_api_key')
            .eq('id', clientId)
            .single();

        if (cError) throw cError;

        const { data: emissions, error: eError } = await supabase
            .from('emission_data')
            .select('scope, t_co2e, category')
            .eq('client_id', clientId);

        if (eError) throw eError;

        // Use user key or fallback
        const effectiveApiKey = clientData?.ai_api_key || process.env.ANTHROPIC_API_KEY;

        if (!effectiveApiKey) {
            return NextResponse.json({ error: 'No AI API Key configured' }, { status: 400 });
        }

        // Calculate totals
        const scope1 = emissions?.filter(e => e.scope === '1').reduce((sum, e) => sum + (e.t_co2e || 0), 0) || 0;
        const scope2 = emissions?.filter(e => e.scope === '2').reduce((sum, e) => sum + (e.t_co2e || 0), 0) || 0;
        const scope3 = emissions?.filter(e => e.scope === '3').reduce((sum, e) => sum + (e.t_co2e || 0), 0) || 0;

        // 2. Call Claude for suggestions
        const prompt = `You are a professional sustainability consultant. Based on the following carbon footprint, provide 3 highly actionable, specific carbon reduction suggestions.
    
    FOOTPRINT DATA:
    - Scope 1 (Direct): ${scope1.toFixed(2)} tCO2e
    - Scope 2 (Electricity): ${scope2.toFixed(2)} tCO2e
    - Scope 3 (Value Chain): ${scope3.toFixed(2)} tCO2e
    
    TOTAL: ${(scope1 + scope2 + scope3).toFixed(2)} tCO2e
    
    Return a JSON array of objects with these keys: "title", "description", "impact" (High/Medium/Low), "difficulty" (Easy/Moderate/Hard).
    Keep suggestions concise and enterprise-focused. Return ONLY the JSON array.`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': effectiveApiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            throw new Error(`AI Service Error: ${response.status}`);
        }

        const aiData = await response.json();
        const text = aiData.content[0]?.text;
        const suggestions = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] || '[]');

        return NextResponse.json({ suggestions });
    } catch (error: any) {
        console.error('AI Suggestions Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
