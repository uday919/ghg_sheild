import Link from 'next/link';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function OnboardingSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] text-white flex items-center justify-center px-4">
            <div className="max-w-md text-center">
                <div className="w-20 h-20 rounded-full bg-[#4CAF80]/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-[#4CAF80]" />
                </div>

                <h1 className="text-3xl font-bold font-[family-name:var(--font-syne)] mb-4">
                    Welcome to GHG Shield!
                </h1>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    Your setup fee has been received. We&apos;re preparing your compliance
                    dashboard now. You&apos;ll receive a welcome email with your login
                    credentials within the next few minutes.
                </p>

                <div className="bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6 text-left space-y-3 mb-8">
                    <h3 className="text-sm font-semibold text-[#4CAF80] uppercase tracking-wider">
                        What Happens Next
                    </h3>
                    {[
                        'Check your email for login credentials',
                        'Your consultant will schedule a kick-off call',
                        'We begin mapping your organizational boundary',
                        'Data collection framework setup begins',
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-[#4CAF80] font-bold font-[family-name:var(--font-dm-mono)] mt-0.5">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            {step}
                        </div>
                    ))}
                </div>

                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-[#4CAF80] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#3d9d6f] transition-all"
                >
                    Go to Login
                    <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-[#4CAF80]" />
                    <span>GHG Shield — ISO 14064 Certified</span>
                </div>
            </div>
        </div>
    );
}
