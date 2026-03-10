'use client';
// ============================================================
// GHG Shield — Password Change Page
// ============================================================
import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function SettingsPage() {
    return (
        <div className="space-y-8 flex flex-col items-center">
            <div className="w-full max-w-4xl space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)] text-left mb-1">
                        Settings
                    </h1>
                    <p className="text-gray-400 text-sm mt-1 text-left">
                        Manage your account settings
                    </p>
                </div>

                <div className="ghg-clerk-profile w-full flex justify-center">
                    <UserProfile
                        routing="hash"
                        appearance={{
                            baseTheme: dark,
                            elements: {
                                cardBox: "shadow-none bg-[#0d1a0d] border border-[#1a5c3844] w-full",
                                rootBox: "w-full",
                                navbar: "bg-[#0d1a0d]",
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
