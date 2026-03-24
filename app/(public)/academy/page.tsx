'use client';

import Link from 'next/link';
import { Shield, BookOpen, PlayCircle, FileText, Download, ArrowRight, CheckCircle, Star, Users, Award, Lock, Zap } from 'lucide-react';

const PRODUCTS = [
    {
        id: 'ghg-mastery',
        badge: 'BESTSELLER',
        badgeColor: 'bg-amber-400 text-black',
        icon: BookOpen,
        title: 'GHG Compliance Mastery',
        subtitle: 'Complete Scope 1 & 2 Certification Program',
        description: 'The complete, step-by-step system to build, calculate, and report a compliant GHG inventory from scratch — even if you have zero accounting experience.',
        price: '$497',
        priceNote: 'One-time payment',
        features: [
            '12+ hours of on-demand video lessons',
            'PRISM Framework™ workbooks & templates',
            'Emission factor selection guides (EPA + eGRID)',
            'ISO 14064-1 compliant report templates',
            'SB 253 / CARB submission checklist',
            'Private community access',
            'Lifetime updates included',
        ],
        cta: 'Enroll Now',
        ctaStyle: 'bg-[#4CAF80] text-black hover:bg-[#3d9d6f]',
        popular: true,
    },
    {
        id: 'scope3-starter',
        badge: 'NEW',
        badgeColor: 'bg-blue-500 text-white',
        icon: Zap,
        title: 'Scope 3 Starter Kit',
        subtitle: 'Supply Chain Emissions Fundamentals',
        description: 'A focused, practical toolkit covering the 15 Scope 3 categories — with templates, calculation methods, and supplier data collection tools ready to deploy.',
        price: '$197',
        priceNote: 'One-time payment',
        features: [
            'All 15 Scope 3 categories explained',
            'Spend-based emission calculators (Excel)',
            'Supplier questionnaire templates',
            'Category-level calculation workbooks',
            'Scope 3 screening assessment tool',
            'Dashboard integration guide',
        ],
        cta: 'Get Instant Access',
        ctaStyle: 'border border-[#4CAF80]/40 text-[#4CAF80] hover:bg-[#4CAF80]/10',
        popular: false,
    },
    {
        id: 'prism-playbook',
        badge: 'FRAMEWORK',
        badgeColor: 'bg-purple-500 text-white',
        icon: FileText,
        title: 'PRISM Framework™ Playbook',
        subtitle: 'The Industrial Operations GHG Blueprint',
        description: 'The complete PRISM Framework documentation — a proprietary, field-tested methodology built specifically for manufacturers, distributors, and industrial operators.',
        price: '$97',
        priceNote: 'One-time payment',
        features: [
            'Full PRISM Framework documentation (PDF)',
            'Process mapping template library',
            'Raw data architecture schemas',
            'Verification readiness checklist',
            'Management reporting templates',
            'One-hour recorded walkthrough',
        ],
        cta: 'Download Now',
        ctaStyle: 'border border-[#1a5c3844] text-gray-300 hover:bg-[#0d1a0d]',
        popular: false,
    },
];

const EXTERNAL_COURSE_URL = 'https://academy.ghgshield.com'; // Replace with your actual course platform URL

export default function AcademyPage() {
    const handlePurchase = (productId: string) => {
        // On purchase, redirect to external course platform
        window.location.href = `${EXTERNAL_COURSE_URL}?product=${productId}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0f0a] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a5c3844] bg-[#0a0f0a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Shield className="w-7 h-7 text-[#4CAF80]" />
                            <span className="text-xl font-bold font-[family-name:var(--font-syne)]">GHG Shield</span>
                            <span className="ml-1 text-xs font-bold text-[#4CAF80] border border-[#4CAF80]/30 px-2 py-0.5 rounded-full tracking-widest uppercase">Academy</span>
                        </Link>
                        <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Client Login →
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF80]/5 to-transparent" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#4CAF80]/5 rounded-full blur-3xl" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4CAF80]/10 border border-[#4CAF80]/20 rounded-full text-sm font-semibold text-[#4CAF80] mb-8">
                        <Award className="w-4 h-4" />
                        TÜV SÜD ISO 14064 Certified Instructor
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-bold font-[family-name:var(--font-syne)] leading-tight mb-6">
                        GHG Compliance
                        <br />
                        <span className="text-[#4CAF80]">Self-Service Academy</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Courses, frameworks, and tools built by a certified GHG specialist — so your team can tackle emissions reporting with confidence, at a fraction of consulting costs.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> ISO 14064 Methodology</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> Instant Access</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> Lifetime Updates</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#4CAF80]" /> 200+ Students</span>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                            Choose Your Path
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            One-time purchase. Instant access. Start learning immediately.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PRODUCTS.map((product) => (
                            <div
                                key={product.id}
                                className={`relative flex flex-col bg-[#0d1a0d] rounded-2xl p-8 border transition-all hover:shadow-2xl hover:shadow-[#4CAF80]/5 ${
                                    product.popular
                                        ? 'border-[#4CAF80] shadow-lg shadow-[#4CAF80]/10'
                                        : 'border-[#1a5c3844] hover:border-[#4CAF80]/20'
                                }`}
                            >
                                {product.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF80] text-black text-xs font-bold px-4 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-6">
                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${product.badgeColor}`}>
                                        {product.badge}
                                    </div>
                                    <product.icon className="w-6 h-6 text-[#4CAF80]" />
                                </div>

                                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-syne)] mb-1">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-[#4CAF80] font-medium mb-4">{product.subtitle}</p>
                                <p className="text-sm text-gray-400 leading-relaxed mb-6">{product.description}</p>

                                <ul className="space-y-2.5 mb-8 flex-1">
                                    {product.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-[#4CAF80] mt-0.5 flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold font-[family-name:var(--font-dm-mono)]">{product.price}</span>
                                        <span className="text-sm text-gray-500 ml-2">{product.priceNote}</span>
                                    </div>
                                    <button
                                        onClick={() => handlePurchase(product.id)}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02] ${product.ctaStyle}`}
                                    >
                                        {product.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust / Instructor section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844] bg-[#0d1a0d]/30">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="w-40 h-40 flex-shrink-0 rounded-full bg-[#0d1a0d] border-4 border-[#4CAF80]/20 flex flex-col items-center justify-center shadow-xl">
                        <span className="text-4xl font-black text-[#4CAF80] font-[family-name:var(--font-syne)]">KU</span>
                        <Shield className="w-5 h-5 text-[#4CAF80]/50 mt-1" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-[#4CAF80] tracking-widest uppercase mb-3">Your Instructor</div>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-syne)] mb-4">Kallem Udaykiran</h2>
                        <p className="text-gray-300 leading-relaxed">
                            TÜV SÜD ISO 14064 certified GHG specialist, MS Industrial Technology, EP®(GHG) Designated. Creator of the PRISM Framework™ and founder of GHG Shield. I&apos;ve designed every course here to teach exactly what took me years to learn — in a fraction of the time.
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 Rating</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-[#4CAF80]" /> 200+ Students</span>
                            <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4 text-[#4CAF80]" /> 20+ Hours Content</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Access flow explainer */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-syne)] mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { number: '01', icon: Download, title: 'Purchase', desc: 'Click any product and complete secure checkout.' },
                            { number: '02', icon: Lock, title: 'Get Access', desc: 'You\'ll be redirected to the course platform instantly.' },
                            { number: '03', icon: PlayCircle, title: 'Start Learning', desc: 'Watch videos, download templates, and implement.' },
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#4CAF80]/10 border border-[#4CAF80]/20 flex items-center justify-center mb-4">
                                    <step.icon className="w-6 h-6 text-[#4CAF80]" />
                                </div>
                                <span className="text-xs text-[#4CAF80] font-bold font-[family-name:var(--font-dm-mono)] mb-2">STEP {step.number}</span>
                                <h3 className="text-white font-semibold mb-2 font-[family-name:var(--font-syne)]">{step.title}</h3>
                                <p className="text-sm text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-4 border-t border-[#1a5c3844] text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-[#4CAF80]" />
                    <span className="font-bold font-[family-name:var(--font-syne)]">GHG Shield Academy</span>
                </div>
                <p className="text-sm text-gray-500">
                    Questions? Email <a href="mailto:hello@ghgshield.com" className="text-[#4CAF80] hover:underline">hello@ghgshield.com</a>
                </p>
            </footer>
        </div>
    );
}
