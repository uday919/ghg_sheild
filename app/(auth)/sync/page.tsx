'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Shield } from 'lucide-react';

export default function SyncPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user?.role === 'admin') {
                router.push('/admin');
            } else if (user?.role === 'client') {
                router.push('/dashboard');
            } else {
                // If not authenticated or error
                router.push('/login');
            }
        }
    }, [isLoading, user, router]);

    return (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
            <Shield className="w-12 h-12 text-[#4CAF80] animate-pulse mb-4" />
            <p className="text-gray-400 font-[family-name:var(--font-syne)] animate-pulse">
                Authenticating session...
            </p>
        </div>
    );
}
