'use client';
// ============================================================
// GHG Shield — Admin Layout
// ============================================================
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import {
    Shield,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ClipboardList,
} from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
        if (!isLoading && isAuthenticated && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
                <div className="space-y-4 w-64">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    const isClientDetail = pathname.includes('/admin/') && pathname !== '/admin';

    return (
        <div className="min-h-screen bg-[#0a0f0a]">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#0d1a0d',
                        color: '#fff',
                        border: '1px solid #1a5c3844',
                    },
                }}
            />

            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#1a5c3844]">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-[#4CAF80]" />
                    <span className="font-bold text-white font-[family-name:var(--font-syne)]">GHG Shield</span>
                    <span className="text-xs bg-[#4CAF80]/20 text-[#4CAF80] px-2 py-0.5 rounded-full">Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <div className="flex">
                <aside
                    className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0d1a0d] border-r border-[#1a5c3844] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="p-6 border-b border-[#1a5c3844]">
                        <div className="flex items-center gap-2">
                            <Shield className="w-7 h-7 text-[#4CAF80]" />
                            <span className="text-xl font-bold text-white font-[family-name:var(--font-syne)]">
                                GHG Shield
                            </span>
                        </div>
                        <p className="text-xs text-[#4CAF80] mt-2 font-medium">Admin Console</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        <Link
                            href="/admin"
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/admin'
                                ? 'bg-[#4CAF80]/10 text-[#4CAF80] font-medium'
                                : 'text-gray-400 hover:text-white hover:bg-[#1a2e1a]'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            All Clients
                        </Link>

                        {isClientDetail && (
                            <>
                                <Link
                                    href={`${pathname.split('/').slice(0, 4).join('/')}/log`}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mt-2 ${pathname.endsWith('/log')
                                        ? 'bg-[#4CAF80]/10 text-[#4CAF80] font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a2e1a]'
                                        }`}
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    Activity Log
                                </Link>
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 mt-4"
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                    Back to all clients
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t border-[#1a5c3844]">
                        <div className="flex items-center gap-3 mb-3 px-3">
                            <div className="w-8 h-8 rounded-full bg-[#4CAF80] flex items-center justify-center text-black text-sm font-bold">
                                A
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{user?.name}</p>
                                <p className="text-xs text-[#4CAF80]">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                <main className="flex-1 min-h-screen">
                    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
