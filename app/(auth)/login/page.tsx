import { SignIn } from "@clerk/nextjs";
import { Shield } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                    <Shield className="w-8 h-8 text-[#4CAF80]" />
                    <span className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">
                        GHG Shield
                    </span>
                </div>
                <p className="text-gray-400 text-sm">Sign in to your compliance dashboard</p>
            </div>

            <SignIn
                routing="hash"
                signUpUrl="/signup"
                fallbackRedirectUrl="/sync"
                appearance={{
                    elements: {
                        rootBox: "w-full mx-auto",
                        card: "bg-[#0a0f0a] border border-[#1a5c3844] shadow-xl w-full max-w-md shadow-2xl rounded-xl",
                        headerTitle: "hidden", // We have our own title above
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "text-white border-gray-700 hover:bg-gray-800",
                        socialButtonsBlockButtonText: "text-white font-medium",
                        dividerLine: "bg-gray-800",
                        dividerText: "text-gray-500",
                        formButtonPrimary: "bg-[#4CAF80] hover:bg-[#3d8c66] text-white shadow-lg shadow-[#4CAF80]/20",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-[#131b13] border-gray-800 text-white focus:border-[#4CAF80] focus:ring-[#4CAF80]/20",
                        footerActionText: "text-gray-400",
                        footerActionLink: "text-[#4CAF80] hover:text-[#5ddb9a]",
                        identityPreviewText: "text-gray-300",
                        identityPreviewEditButtonIcon: "text-gray-400 hover:text-white"
                    }
                }}
            />
        </div>
    );
}
