import Link from 'next/link';
import {
    Shield, ArrowRight, CheckCircle, Building2, BarChart3,
    FileText, Clock, Zap, DollarSign, AlertTriangle,
    Users, Award, ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a5c3844] bg-[#0a0f0a]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="w-7 h-7 text-[#4CAF80]" />
                            <span className="text-xl font-bold font-[family-name:var(--font-syne)]">GHG Shield</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <Link href="/login" className="text-[#4CAF80] hover:text-[#5DC090] transition-colors font-medium">
                                Client Login
                            </Link>
                            <Link
                                href="/pricing"
                                className="bg-[#4CAF80] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3d9d6f] transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF80]/5 to-transparent" />
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#4CAF80]/5 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center flex-wrap justify-center gap-2 px-5 py-2 bg-[#4CAF80]/10 border border-[#4CAF80]/20 rounded-full text-sm font-semibold text-[#4CAF80] mb-8 max-w-3xl">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span className="text-center leading-snug">
                            TÜV SÜD ISO 14064 Certified <span className="text-gray-500 mx-1">|</span> MS Industrial Technology <span className="text-gray-500 mx-1">|</span> PRISM Framework™ <span className="text-gray-500 mx-1">|</span> EP®(GHG) Designated
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-syne)] leading-tight mb-6">
                        GHG Compliance.
                        <br />
                        <span className="text-[#4CAF80]">Done For You.</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        California&apos;s SB 253 mandates GHG reporting for companies with $1B+ revenue by 2026.
                        We handle everything — data collection, calculation, ISO-compliant reports, and submission.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-[#4CAF80] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#3d9d6f] transition-all hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 border border-[#1a5c3844] text-gray-300 px-8 py-4 rounded-xl font-medium text-lg hover:bg-[#0d1a0d] transition-colors"
                        >
                            Book a Call
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> SB 253 Compliant</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> ISO 14064</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#4CAF80]" /> GHG Protocol</span>
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844] bg-[#0d1a0d]/30">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4CAF80]/10 border border-[#4CAF80]/20 rounded-full text-xs font-bold text-[#4CAF80] mb-6 tracking-wider uppercase">
                            Principal Consultant
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-6">
                            Hi, I&apos;m Kallem Udaykiran
                        </h2>
                        <div className="space-y-5 text-lg text-gray-300 leading-relaxed">
                            <p>
                                I&apos;m a TÜV SÜD ISO 14064 certified GHG specialist with an MS in Industrial Technology and 5+ years of data engineering experience.
                            </p>
                            <p>
                                I created GHG Shield because mid-size California companies deserve expert-led GHG compliance without the $100,000 price tag of a Big 4 firm.
                            </p>
                            <div className="pl-5 border-l-2 border-[#4CAF80]/50 py-1">
                                <p className="font-medium text-white italic">
                                    Every client gets me — not a junior analyst, not a software bot. A certified specialist who understands your operations.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 rounded-full bg-gradient-to-br from-[#1a5c38] to-[#0a0f0a] border-4 border-[#4CAF80]/20 flex items-center justify-center p-1 shadow-2xl shadow-[#4CAF80]/5 relative">
                        <div className="absolute inset-0 rounded-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="w-full h-full rounded-full bg-[#0d1a0d] flex flex-col items-center justify-center border-2 border-[#1a5c3844] z-10">
                            <span className="text-6xl font-bold text-[#4CAF80] font-[family-name:var(--font-syne)] tracking-tighter">KU</span>
                            <Shield className="w-6 h-6 text-[#4CAF80]/50 mt-2" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                            GHG Reporting Shouldn&apos;t Be This Hard
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Most mid-size companies face three losing options
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: DollarSign,
                                title: 'Big Firms = Big Bills',
                                description: 'Large consulting firms charge $50K-$150K for GHG audits. That\'s enterprise pricing for a mid-size company\'s budget.',
                                color: 'text-red-400',
                            },
                            {
                                icon: AlertTriangle,
                                title: 'Software ≠ Solution',
                                description: 'GHG software tools require expertise to operate. Without a trained analyst, you\'re guessing at emission factors and methodologies.',
                                color: 'text-amber-400',
                            },
                            {
                                icon: Clock,
                                title: 'DIY = Risky',
                                description: 'Building spreadsheets internally means audit risk, non-compliant reports, and wasted months. One wrong emission factor invalidates everything.',
                                color: 'text-orange-400',
                            },
                        ].map((card, idx) => (
                            <div
                                key={idx}
                                className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-8 hover:border-[#4CAF80]/20 transition-colors"
                            >
                                <card.icon className={`w-8 h-8 ${card.color} mb-4`} />
                                <h3 className="text-lg font-semibold text-white mb-3 font-[family-name:var(--font-syne)]">
                                    {card.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844] bg-[#0d1a0d]/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                            4 Steps to Full Compliance
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            We do the heavy lifting. You stay focused on running your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: '01', icon: Users, title: 'Onboarding', description: 'We map your organizational boundary, identify facilities, and set up your data collection framework.' },
                            { step: '02', icon: BarChart3, title: 'Data Collection', description: 'We gather utility bills, fleet records, and facility data. You just share access — we do the rest.' },
                            { step: '03', icon: Zap, title: 'Calculation & AI', description: 'EPA emission factors + eGRID data + AI-powered report narrative = ISO 14064-compliant GHG inventory.' },
                            { step: '04', icon: FileText, title: 'Report & Submit', description: 'Professional PDF report, third-party verified, submitted to CARB under SB 253. You\'re compliant.' },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#4CAF80]/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-7 h-7 text-[#4CAF80]" />
                                </div>
                                <span className="text-xs text-[#4CAF80] font-bold font-[family-name:var(--font-dm-mono)]">
                                    STEP {item.step}
                                </span>
                                <h3 className="text-lg font-semibold text-white mt-2 mb-2 font-[family-name:var(--font-syne)]">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                            Everything You Get
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {[
                            'Dedicated ISO 14064 certified consultant',
                            'Complete Scope 1 & 2 GHG inventory',
                            'EPA & eGRID emission factor calculations',
                            'AI-powered report narrative generation',
                            'Professional PDF report (50+ pages)',
                            'Real-time compliance dashboard',
                            'Document vault for all records',
                            'SB 253 submission to CARB',
                            'Third-party verification coordination',
                            'Year-over-year trend tracking',
                            'Multi-facility support',
                            'Dedicated action item tracking',
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#0d1a0d] transition-colors">
                                <CheckCircle className="w-5 h-5 text-[#4CAF80] flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844] bg-[#0d1a0d]/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-gray-400">
                            No hidden fees. No surprise invoices. Just full compliance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                name: 'Core',
                                setupFee: '$4,999',
                                monthly: '$1,499',
                                retainer: '$17,988',
                                description: '1–3 facilities',
                                features: ['1–3 facilities', 'Scope 1 & 2 emissions', 'Dashboard access', 'Data storage', 'Annual GHG inventory report', 'ISO-aligned documentation', 'Monthly updates'],
                                popular: false,
                            },
                            {
                                name: 'Advanced',
                                setupFee: '$9,999',
                                monthly: '$2,499',
                                retainer: '$29,988',
                                description: 'Unlimited facilities',
                                features: ['Unlimited facilities', 'Scope 1, 2, 3 emissions', 'Supplier emissions', 'Custom emission factors', 'Audit / verification preparation', 'Priority support', 'Custom reporting'],
                                popular: true,
                            },
                        ].map((tier, idx) => (
                            <div
                                key={idx}
                                className={`relative bg-[#0d1a0d] border rounded-2xl p-8 ${tier.popular ? 'border-[#4CAF80] shadow-lg shadow-[#4CAF80]/10' : 'border-[#1a5c3844]'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4CAF80] text-black text-xs font-bold px-4 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white font-[family-name:var(--font-syne)]">{tier.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{tier.description}</p>

                                <div className="my-6">
                                    <div className="mb-1 text-sm text-gray-400">Implementation Fee</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-white font-[family-name:var(--font-dm-mono)]">{tier.setupFee}</span>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[#1a5c3844]">
                                        <div className="mb-1 text-sm text-gray-400">Annual Carbon Accounting Retainer</div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-[#4CAF80] font-[family-name:var(--font-dm-mono)]">{tier.retainer}</span>
                                            <span className="text-sm text-gray-400">/year</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Billed at {tier.monthly}/mo</div>
                                    </div>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-[#4CAF80]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/pricing"
                                    className={`block text-center py-3 px-6 rounded-xl font-medium transition-all ${tier.popular
                                        ? 'bg-[#4CAF80] text-black hover:bg-[#3d9d6f]'
                                        : 'border border-[#1a5c3844] text-gray-300 hover:bg-[#1a2e1a]'
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Standalone Packages */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="bg-[#000000] border border-[#1a5c3844] rounded-2xl p-8 hover:border-[#4CAF80]/40 transition-colors shadow-lg shadow-black/50">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">Scope 3 Package</h4>
                                        <span className="bg-gray-800 text-[#4CAF80] text-xs font-bold px-3 py-1 rounded-full border border-gray-700">STANDALONE</span>
                                    </div>
                                    <p className="text-gray-400">Deep supply chain visibility for organizations facing SEC, CARB, or vendor-driven reporting requirements.</p>

                                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {['Scope 3 screening assessment', 'Category-level calculations', 'Supplier data collection templates', 'Spend-based emissions estimates', 'Scope 3 reporting documentation', 'Dashboard integration'].map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                <CheckCircle className="w-4 h-4 text-[#4CAF80] mt-0.5 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col justify-center flex-shrink-0 w-full md:w-auto md:min-w-[240px] md:border-l md:border-[#1a5c3844] md:pl-8">
                                    <div className="mb-2">
                                        <div className="text-sm text-gray-400 mb-1">Implementation Fee</div>
                                        <div className="text-3xl font-bold text-white font-[family-name:var(--font-dm-mono)]">$7,499</div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-[#1a5c3844]">
                                        <div className="text-sm text-gray-400 mb-1">Annual Retainer</div>
                                        <div className="flex items-baseline gap-1">
                                            <div className="text-xl font-bold text-[#4CAF80] font-[family-name:var(--font-dm-mono)]">${(2999 * 12).toLocaleString()}</div>
                                            <div className="text-sm text-gray-400">/year</div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Billed at $2,999/mo</div>
                                    </div>

                                    <Link
                                        href="/pricing"
                                        className="mt-6 block w-full text-center py-3 px-6 rounded-xl font-medium border border-[#4CAF80]/30 text-[#4CAF80] hover:bg-[#4CAF80]/10 transition-all"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 max-w-4xl mx-auto bg-[#0d1a0d] border border-[#1a5c3844] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[#4CAF80]/20 transition-colors">
                        <div>
                            <h4 className="text-lg font-bold text-white font-[family-name:var(--font-syne)] flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#4CAF80]" />
                                Optional Add-on: Assurance & Verification Support
                            </h4>
                            <p className="text-sm text-gray-400 mt-1 max-w-lg">
                                We act as your liaison during the required third-party limited assurance audit, answering auditor questions and defending the methodology on your behalf.
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-center sm:text-right">
                            <span className="block text-2xl font-bold text-white font-[family-name:var(--font-dm-mono)]">+$5,000</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Flat Fee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-3 px-6 py-4 bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl">
                            <Award className="w-8 h-8 text-[#4CAF80]" />
                            <div className="text-left">
                                <p className="text-white font-semibold">ISO 14064</p>
                                <p className="text-xs text-gray-400">Certified Consultant</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl">
                            <Shield className="w-8 h-8 text-[#4CAF80]" />
                            <div className="text-left">
                                <p className="text-white font-semibold">SB 253</p>
                                <p className="text-xs text-gray-400">Full Compliance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-4 bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl">
                            <Building2 className="w-8 h-8 text-[#4CAF80]" />
                            <div className="text-left">
                                <p className="text-white font-semibold">GHG Protocol</p>
                                <p className="text-xs text-gray-400">Corporate Standard</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844] bg-gradient-to-b from-[#0d1a0d] to-[#0a0f0a]">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-400 mb-6">
                        <Clock className="w-4 h-4" />
                        Deadline: August 10, 2026
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-syne)] mb-6">
                        Don&apos;t Wait Until It&apos;s Too Late
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        SB 253 deadlines are approaching fast. Start your compliance journey today and
                        avoid last-minute rushes, penalties, and audit risks.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 bg-[#4CAF80] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#3d9d6f] transition-all hover:scale-105"
                        >
                            Start Compliance Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1a5c3844]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#4CAF80]" />
                        <span className="font-bold font-[family-name:var(--font-syne)]">GHG Shield</span>
                        <span className="text-xs text-gray-500 ml-2">© {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="mailto:support@ghgshield.com" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
