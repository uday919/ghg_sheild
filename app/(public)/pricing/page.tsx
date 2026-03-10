'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, Modal } from '@/components/ui';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const checkoutSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Valid email required'),
    companyName: z.string().min(2, 'Company name is required'),
    industry: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function PricingPage() {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
    });

    const tiers = [
        {
            id: 'standard',
            name: 'Standard',
            setupFee: 4999,
            monthly: 1999,
            description: 'Perfect for companies with 1–3 facilities',
            features: [
                '1–3 facilities',
                'Scope 1 & 2 emissions',
                'Dashboard access',
                'Data storage',
                'Annual GHG inventory report',
                'ISO-aligned documentation',
                'Monthly updates',
            ],
            popular: false,
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            setupFee: 9999,
            monthly: 3999,
            description: 'For organizations needing comprehensive coverage',
            features: [
                'Unlimited facilities',
                'Scope 1, 2, 3 emissions',
                'Supplier emissions',
                'Custom emission factors',
                'Audit / verification preparation',
                'Priority support',
                'Custom reporting',
            ],
            popular: true,
        },
    ];

    const handleCheckout = async (data: CheckoutForm) => {
        if (!selectedTier) return;

        try {
            setIsSubmitting(true);

            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: selectedTier,
                    email: data.email,
                    name: data.name,
                    companyName: data.companyName,
                    industry: data.industry,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Checkout failed');
            }

            if (result.checkoutUrl) {
                // Redirect to DodPayments checkout
                window.location.href = result.checkoutUrl;
            } else {
                toast.error('No checkout URL returned');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
            console.error('Checkout error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCheckout = (tierId: string) => {
        setSelectedTier(tierId);
    };

    const closeCheckout = () => {
        setSelectedTier(null);
        reset();
    };

    const activeTier = tiers.find((t) => t.id === selectedTier);

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-white">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { background: '#0d1a0d', color: '#fff', border: '1px solid #1a5c3844' },
                }}
            />

            {/* Navigation */}
            <nav className="border-b border-[#1a5c3844]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4 text-gray-400" />
                            <Shield className="w-7 h-7 text-[#4CAF80]" />
                            <span className="text-xl font-bold font-[family-name:var(--font-syne)]">GHG Shield</span>
                        </Link>
                        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Client Login →
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-syne)] mb-4">
                        Pricing That Makes Sense
                    </h1>
                    <p className="text-xl text-gray-400 max-w-xl mx-auto">
                        Full-service GHG compliance at a fraction of what the big firms charge.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`relative bg-[#0d1a0d] border rounded-2xl p-8 ${tier.popular ? 'border-[#4CAF80] shadow-xl shadow-[#4CAF80]/10' : 'border-[#1a5c3844]'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF80] text-black text-xs font-bold px-4 py-1 rounded-full">
                                    RECOMMENDED
                                </div>
                            )}

                            <h2 className="text-2xl font-bold font-[family-name:var(--font-syne)]">{tier.name}</h2>
                            <p className="text-sm text-gray-400 mt-1 mb-6">{tier.description}</p>

                            <div className="mb-4">
                                <span className="text-sm text-gray-400 mb-1 block">Implementation Fee</span>
                                <span className="text-5xl font-bold font-[family-name:var(--font-dm-mono)]">
                                    ${tier.setupFee.toLocaleString()}
                                </span>
                            </div>
                            <div className="mb-8 pt-4 border-t border-[#1a5c3844]">
                                <span className="text-sm text-gray-400 mb-1 block">Annual Carbon Accounting Retainer</span>
                                <span className="text-3xl font-bold text-[#4CAF80] font-[family-name:var(--font-dm-mono)]">
                                    ${(tier.monthly * 12).toLocaleString()}
                                </span>
                                <span className="text-gray-400 ml-2">/year</span>
                                <div className="text-xs text-gray-500 mt-1">Billed at ${tier.monthly.toLocaleString()}/mo</div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-[#4CAF80] mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => openCheckout(tier.id)}
                                className={`flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${tier.popular
                                    ? 'bg-[#4CAF80] text-black hover:bg-[#3d9d6f] hover:scale-[1.02]'
                                    : 'border border-[#4CAF80]/30 text-[#4CAF80] hover:bg-[#4CAF80]/10'
                                    }`}
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Standalone Packages */}
                <div className="mt-16 bg-[#000000] border border-[#1a5c3844] rounded-2xl p-8 lg:p-10 shadow-xl shadow-black/80">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-3xl font-bold font-[family-name:var(--font-syne)] text-white">Scope 3 Package</h2>
                        <span className="bg-[#1a2e1a] text-[#4CAF80] text-xs font-bold px-3 py-1 rounded-full border border-[#1a5c3844]">STANDALONE</span>
                    </div>
                    <p className="text-lg text-gray-400 mb-8 max-w-2xl">
                        Deep supply chain visibility for organizations facing SEC, CARB, or vendor-driven reporting requirements. A dedicated package to map, calculate, and report your full value chain emissions.
                    </p>

                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">What&apos;s Included</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Scope 3 screening assessment', 'Category-level calculations', 'Supplier data collection templates', 'Spend-based emissions estimates', 'Scope 3 reporting documentation', 'Dashboard integration'].map((f, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-[#4CAF80] mt-0.5 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col justify-center flex-shrink-0 lg:w-[320px] lg:border-l lg:border-[#1a5c3844] lg:pl-10">
                            <div className="mb-4">
                                <span className="text-sm text-gray-400 mb-1 block">Implementation Fee</span>
                                <span className="text-4xl font-bold font-[family-name:var(--font-dm-mono)]">$7,999</span>
                            </div>
                            <div className="mb-8 pt-4 border-t border-[#1a5c3844]">
                                <span className="text-sm text-gray-400 mb-1 block">Annual Retainer</span>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-[#4CAF80] font-[family-name:var(--font-dm-mono)]">$29,988</span>
                                    <span className="text-gray-400 ml-1/year">/year</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Billed at $2,499/mo</div>
                            </div>

                            <button
                                onClick={() => openCheckout('scope3')}
                                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl font-bold transition-all border-2 border-[#4CAF80] text-[#4CAF80] hover:bg-[#4CAF80] hover:text-black hover:scale-[1.02]"
                            >
                                Get Scope 3 Package
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ section */}
                <div className="mt-20 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold text-center font-[family-name:var(--font-syne)] mb-8">
                        What&apos;s Included
                    </h3>
                    <div className="space-y-4 text-sm text-gray-400">
                        <div className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6">
                            <p className="font-medium text-white mb-2">One-time Setup Fee Covers:</p>
                            <p>Organizational boundary mapping, facility identification, data collection framework setup, eGRID subregion assignment, and initial emission factor selection.</p>
                        </div>
                        <div className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6">
                            <p className="font-medium text-white mb-2">Monthly Fee Covers:</p>
                            <p>Ongoing data collection management, emission calculations, dashboard access, document management, report preparation, regulatory monitoring, and consultant availability.</p>
                        </div>
                        <div className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6">
                            <p className="font-medium text-white mb-2">Optional Add-ons:</p>
                            <p><strong className="text-white">Assurance/Verification Support (+$5,000 flat fee):</strong> We act as your direct liaison for the mandatory third-party limited assurance audit required by SB 253 starting in 2026.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <Modal
                isOpen={!!selectedTier}
                onClose={closeCheckout}
                title={`Get Started — ${activeTier?.name || ''} Plan`}
                size="md"
            >
                <form onSubmit={handleSubmit(handleCheckout)} className="space-y-4">
                    {activeTier && (
                        <div className="bg-[#0a0f0a] border border-[#1a5c3844] rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Setup Fee</span>
                                <span className="text-white font-bold font-[family-name:var(--font-dm-mono)]">
                                    ${activeTier.setupFee.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-2">
                                <span className="text-gray-400">Monthly (starts after onboarding)</span>
                                <span className="text-[#4CAF80] font-bold font-[family-name:var(--font-dm-mono)]">
                                    ${activeTier.monthly.toLocaleString()}/mo
                                </span>
                            </div>
                        </div>
                    )}

                    <Input
                        label="Full Name"
                        placeholder="John Smith"
                        error={errors.name?.message}
                        {...register('name')}
                    />

                    <Input
                        label="Work Email"
                        type="email"
                        placeholder="john@company.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <Input
                        label="Company Name"
                        placeholder="Acme Manufacturing Inc."
                        error={errors.companyName?.message}
                        {...register('companyName')}
                    />

                    <Input
                        label="Industry (optional)"
                        placeholder="e.g. Manufacturing, Transportation"
                        {...register('industry')}
                    />

                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-full"
                        size="lg"
                    >
                        Proceed to Payment — ${activeTier?.setupFee.toLocaleString()}
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                        You&apos;ll be redirected to our secure payment processor.
                        <br />
                        Your monthly subscription begins after onboarding is complete.
                    </p>
                </form>
            </Modal>
        </div>
    );
}
