import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
    try {
        console.log("Seeding database...");

        // 1. Create demo clients
        const clients = Array.from({ length: 3 }).map((_, i) => ({
            id: randomUUID(),
            clerk_id: `demo-clerk-${i}-${Date.now()}`,
            company_name: ['Acme Corp', 'Globex Inc', 'Initech'][i],
            contact_name: ['Jane Doe', 'John Smith', 'Peter Gibbons'][i],
            contact_email: `demo${i}-${Date.now()}@example.com`,
            industry: ['Manufacturing', 'Technology', 'Logistics'][i],
            setup_fee: 4999,
            monthly_fee: 1999,
            compliance_status: ['on_track', 'needs_attention', 'compliant'][i],
            is_active: true,
            contract_start: new Date().toISOString()
        }));

        const { error: clientErr } = await supabase.from('clients').insert(clients);
        if (clientErr) throw clientErr;

        for (const client of clients) {
            // 2. Create facilities
            const facilityTypes = ['Office', 'Plant', 'Warehouse'];
            const facilities = Array.from({ length: 3 }).map((_, j) => ({
                id: randomUUID(),
                client_id: client.id,
                facility_id: `fac-${j}-${client.id.substring(0, 8)}`,
                name: `${client.company_name} - ${['HQ', 'East Region', 'West Station'][j]}`,
                facility_type: facilityTypes[j],
                address: '123 Fake St',
                city: 'San Jose',
                state: 'CA',
                zip: '95123',
                country: 'USA',
                egrid_subregion: 'CAMX'
            }));

            const { error: facErr } = await supabase.from('facilities').insert(facilities);
            if (facErr) throw facErr;

            // 3. Create Emissions Data
            const emissions = [];
            const reportingYear = 2025;
            for (const fac of facilities) {
                for (let m = 1; m <= 12; m++) {
                    // Mobile
                    emissions.push({
                        client_id: client.id,
                        facility_id: fac.id,
                        reporting_year: reportingYear,
                        month: m,
                        scope: '1',
                        category: 'Mobile Combustion',
                        fuel_type: 'Motor Gasoline',
                        activity_data: Math.floor(Math.random() * 500) + 100,
                        activity_unit: 'gallons',
                        tco2e: (Math.floor(Math.random() * 5) + 1),
                        kgco2e: (Math.floor(Math.random() * 5) + 1) * 1000,
                        calculation_method: 'EPA Emission Factors',
                        factor_version: '2024',
                        verified: m <= 6,
                        data_source: 'Fleet Logs'
                    });

                    // Electricity
                    emissions.push({
                        client_id: client.id,
                        facility_id: fac.id,
                        reporting_year: reportingYear,
                        month: m,
                        scope: '2',
                        category: 'Purchased Electricity',
                        fuel_type: 'Grid Mix',
                        activity_data: Math.floor(Math.random() * 10000) + 5000,
                        activity_unit: 'kWh',
                        tco2e: (Math.floor(Math.random() * 10) + 2),
                        kgco2e: (Math.floor(Math.random() * 10) + 2) * 1000,
                        calculation_method: 'EPA eGRID',
                        factor_version: '2024',
                        verified: m <= 6,
                        data_source: 'Utility Bills'
                    });
                }
            }

            // Chunk emissions payload just in case it hits row limits on the Supabase free tier
            const chunkSize = 100;
            for (let i = 0; i < emissions.length; i += chunkSize) {
                const chunk = emissions.slice(i, i + chunkSize);
                const { error: emitErr } = await supabase.from('emission_data').insert(chunk);
                if (emitErr) throw emitErr;
            }
        }

        return NextResponse.json({ success: true, message: 'Database seeded successfully' });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: JSON.stringify(error, null, 2) }, { status: 500 });
    }
}
