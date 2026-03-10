// ============================================================
// GHG Shield — DodPayments Webhook Handler
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { verifyWebhookSignature, createSubscription } from '@/lib/dodpayments';
import { sendEmail, welcomeEmail, adminAlertEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-webhook-signature') || '';

        // Verify webhook signature
        if (process.env.DODPAYMENTS_WEBHOOK_SECRET) {
            const isValid = verifyWebhookSignature(body, signature);
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const payload = JSON.parse(body);
        const { event, data } = payload;

        switch (event) {
            case 'payment.success': {
                // Setup fee payment completed
                const { metadata, customer } = data;

                if (metadata?.type === 'setup_fee' && customer) {
                    // Generate temp password
                    const tempPassword = `GHG${Math.random().toString(36).substring(2, 10)}!`;

                    // Create Clerk user account
                    const clerk = await clerkClient();
                    const clerkUser = await clerk.users.createUser({
                        emailAddress: [customer.email],
                        password: tempPassword,
                        firstName: customer.name.split(' ')[0],
                        lastName: customer.name.split(' ').slice(1).join(' ') || undefined,
                    });

                    // Create client document in Supabase
                    const { error } = await supabase
                        .from('clients')
                        .insert([{
                            clerk_id: clerkUser.id,
                            company_name: metadata.companyName || customer.name,
                            contact_name: customer.name,
                            contact_email: customer.email,
                            industry: metadata.industry || 'Unknown',
                            setup_fee: data.amount / 100, // convert cents
                            monthly_fee: parseFloat(metadata.monthlyFee || '1999'),
                            dod_customer_id: data.customer?.id || '',
                            compliance_status: 'on_track',
                            is_active: false, // Activated when subscription starts
                            contract_start: new Date().toISOString(),
                        }]);

                    // Fetch the inserted client to get the exact ID if needed
                    const { data: newClient } = await supabase
                        .from('clients')
                        .select('id')
                        .eq('clerk_id', clerkUser.id)
                        .single();

                    const clientId = newClient?.id;

                    // Send welcome email
                    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
                    const emailData = welcomeEmail(customer.name, customer.email, tempPassword, loginUrl);
                    await sendEmail(emailData);

                    // Auto-start monthly subscription with clientId linked
                    try {
                        const tierPlanMap: Record<string, string> = {
                            standard: 'plan_standard_monthly',
                            scope3: 'plan_scope3_monthly',
                            enterprise: 'plan_enterprise_monthly',
                        };
                        const planId = tierPlanMap[metadata.tier] || 'plan_standard_monthly';

                        await createSubscription({
                            planId,
                            customerEmail: customer.email,
                            customerName: customer.name,
                            metadata: {
                                clientId,
                                tier: metadata.tier,
                            },
                        });
                    } catch (subError) {
                        console.error('Failed to auto-start subscription:', subError);
                        // Alert admin about failed subscription start
                        const alertEmail = adminAlertEmail(
                            `Subscription Auto-Start Failed — ${customer.email}`,
                            `Setup fee was paid but the monthly subscription could not be started for client ${clientId}. Please manually create the subscription in DodPayments.`
                        );
                        await sendEmail(alertEmail);
                    }
                }
                break;
            }

            case 'subscription.activated': {
                const { metadata } = data;
                const clientId = metadata?.clientId;

                if (clientId) {
                    await supabase
                        .from('clients')
                        .update({
                            dod_subscription_id: data.id,
                            is_active: true,
                        })
                        .eq('id', clientId);
                }
                break;
            }

            case 'subscription.cancelled':
            case 'payment.failed': {
                const { metadata } = data;
                const clientId = metadata?.clientId;

                if (clientId) {
                    await supabase
                        .from('clients')
                        .update({ is_active: false })
                        .eq('id', clientId);


                    // Alert admin
                    const alertEmail = adminAlertEmail(
                        `${event} — Client ${clientId}`,
                        `The event "${event}" was triggered for client ${clientId}. Please check the DodPayments dashboard for details.`
                    );
                    await sendEmail(alertEmail);
                }
                break;
            }

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
