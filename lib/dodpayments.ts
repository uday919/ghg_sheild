// ============================================================
// GHG Shield — DodPayments Integration
// ============================================================

const DOD_API_URL = 'https://api.dodpayments.com/v1';

interface CreatePaymentOptions {
    amount: number;
    currency?: string;
    customerEmail: string;
    customerName: string;
    description: string;
    metadata?: Record<string, string>;
    successUrl?: string;
    cancelUrl?: string;
}

interface CreateSubscriptionOptions {
    planId: string;
    customerEmail: string;
    customerName: string;
    metadata?: Record<string, string>;
}

export async function createOneTimePayment(options: CreatePaymentOptions) {
    const response = await fetch(`${DOD_API_URL}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DODPAYMENTS_KEY}`,
        },
        body: JSON.stringify({
            amount: options.amount,
            currency: options.currency || 'usd',
            customer: {
                email: options.customerEmail,
                name: options.customerName,
            },
            description: options.description,
            metadata: options.metadata,
            success_url: options.successUrl,
            cancel_url: options.cancelUrl,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`DodPayments error: ${response.status} — ${error}`);
    }

    return response.json();
}

export async function createSubscription(options: CreateSubscriptionOptions) {
    const response = await fetch(`${DOD_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DODPAYMENTS_KEY}`,
        },
        body: JSON.stringify({
            plan_id: options.planId,
            customer: {
                email: options.customerEmail,
                name: options.customerName,
            },
            metadata: options.metadata,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`DodPayments subscription error: ${response.status} — ${error}`);
    }

    return response.json();
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const secret = process.env.DODPAYMENTS_WEBHOOK_SECRET || '';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const computed = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
}
