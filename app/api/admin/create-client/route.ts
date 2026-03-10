// ============================================================
// GHG Shield — Admin Create Client API (creates Clerk user + Supabase record)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { sendEmail, welcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function generateTempPassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let pw = '';
    for (let i = 0; i < 15; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    return pw;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { companyName, contactName, contactEmail, industry, annualRevenue,
            facilityCount, fiscalYearStart, fiscalYearEnd, setupFee, monthlyFee, notes } = body;

        if (!companyName || !contactName || !contactEmail) {
            return NextResponse.json({ error: 'companyName, contactName, contactEmail required' }, { status: 400 });
        }

        const tempPassword = generateTempPassword();

        // 1. Create Clerk user
        const clerk = await clerkClient();
        let clerkUser;

        try {
            const nameParts = contactName.trim().split(/\s+/);
            const firstName = nameParts[0] || 'Client';
            const lastName = nameParts.slice(1).join(' ') || '.';

            // Fallback username for Clerk instances that require it
            const username = `u_${contactEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 6)}`;

            console.log('📦 Clerk Create Request:', { email: contactEmail, firstName, lastName, username });

            clerkUser = await clerk.users.createUser({
                emailAddress: [contactEmail],
                username: username,
                password: tempPassword,
                firstName: firstName,
                lastName: lastName,
                publicMetadata: { role: 'client' },
            });
            console.log(`✅ Clerk user created: ${clerkUser.id} (${username})`);
        } catch (clerkErr: any) {
            console.error('Clerk Error Raw:', clerkErr);

            const firstError = clerkErr?.errors?.[0];
            const message = firstError?.longMessage || firstError?.message || clerkErr?.message || 'Clerk user creation failed';

            return NextResponse.json({
                error: `Clerk Error: ${message}`,
                clerkDetail: firstError || clerkErr,
                debug: { sentEmail: contactEmail, passwordLength: tempPassword.length }
            }, { status: 400 });
        }

        // 2. Create client record in Supabase
        const { data: newClient, error: dbError } = await supabase
            .from('clients')
            .insert([{
                clerk_id: clerkUser.id,
                company_name: companyName,
                contact_name: contactName,
                contact_email: contactEmail,
                industry: industry || '',
                annual_revenue: annualRevenue || '',
                facility_count: facilityCount || 0,
                fiscal_year_start: fiscalYearStart || `${new Date().getFullYear()}-01-01`,
                fiscal_year_end: fiscalYearEnd || `${new Date().getFullYear()}-12-31`,
                setup_fee: setupFee || 4999,
                monthly_fee: monthlyFee || 1999,
                notes: notes || '',
                compliance_status: 'on_track',
                is_active: true,
            }])
            .select()
            .single();

        if (dbError) {
            console.error('Supabase error:', dbError);
            // Rollback Clerk user if db fails
            try {
                await (await clerkClient()).users.deleteUser(clerkUser.id);
                console.log(`🗑️ Rolled back Clerk user: ${clerkUser.id}`);
            } catch (rollbackErr) {
                console.error('Rollback failed:', rollbackErr);
            }

            let message = dbError.message;
            if (dbError.code === '23505') {
                message = 'A client with this email already exists in our database.';
            }
            return NextResponse.json({ error: `Database Error: ${message}` }, { status: 400 });
        }
        console.log(`✅ Supabase record created for client: ${newClient.id}`);

        // 3. Send welcome email with temp password
        try {
            const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
            const emailData = welcomeEmail(contactName, contactEmail, tempPassword, loginUrl);
            await sendEmail(emailData);
            console.log(`✅ Welcome email sent to: ${contactEmail}`);
        } catch (emailErr: any) {
            console.error('Email Error (non-blocking):', emailErr);
            // We don't fail the whole process if only the email fails, but we should inform the admin
            return NextResponse.json({
                success: true,
                clientId: newClient.id,
                userId: clerkUser.id,
                message: `Client created, but welcome email failed to send: ${emailErr.message}. Please provide credentials manually.`,
                tempPassword, // Provide password so admin can give it to client manually
            });
        }

        return NextResponse.json({
            success: true,
            clientId: newClient.id,
            userId: clerkUser.id,
            message: `Client "${companyName}" created. Welcome email sent to ${contactEmail}.`,
        });
    } catch (error) {
        console.error('Create client error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create client' },
            { status: 500 }
        );
    }
}
