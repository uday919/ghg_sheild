// ============================================================
// GHG Shield — Create Checkout Session API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createOneTimePayment, createSubscription } from '@/lib/dodpayments';

export async function POST(req: NextRequest) {
    try {
        const { tier, email, name, companyName, industry } = await req.json();

        if (!tier || !email || !name) {
            return NextResponse.json(
                { error: 'tier, email, and name are required' },
                { status: 400 }
            );
        }

        const tiers: Record<string, { setupFee: number; monthlyFee: number; description: string }> = {
            core: {
                setupFee: 4999,
                monthlyFee: 1499,
                description: 'GHG Shield — Core Plan (1-3 facilities)',
            },
            scope3: {
                setupFee: 7499,
                monthlyFee: 2999,
                description: 'GHG Shield — Scope 3 Package',
            },
            advanced: {
                setupFee: 9999,
                monthlyFee: 2499,
                description: 'GHG Shield — Advanced Plan (Unlimited facilities)',
            },
        };

        const selectedTier = tiers[tier];
        if (!selectedTier) {
            return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Step 1: Create one-time payment for setup fee
        const payment = await createOneTimePayment({
            amount: selectedTier.setupFee * 100, // Convert to cents
            currency: 'USD',
            customerEmail: email,
            customerName: name,
            description: `${selectedTier.description} — Setup Fee`,
            metadata: {
                type: 'setup_fee',
                tier,
                companyName: companyName || name,
                industry: industry || 'Unknown',
                monthlyFee: String(selectedTier.monthlyFee),
            },
            successUrl: `${appUrl}/onboarding/success?tier=${tier}`,
            cancelUrl: `${appUrl}/pricing`,
        });

        return NextResponse.json({
            success: true,
            checkoutUrl: payment.checkoutUrl,
            paymentId: payment.id,
        });
    } catch (error) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
