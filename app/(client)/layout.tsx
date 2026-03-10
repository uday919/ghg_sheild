'use client';
// ============================================================
// GHG Shield — Client Portal Layout
// ============================================================
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import {
    Shield,
    LayoutDashboard,
    FileText,
    FolderOpen,
    CheckSquare,
    Building2,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui';
import { NotificationBell } from '@/components/client/NotificationBell';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/documents', label: 'Documents', icon: FolderOpen },
    { href: '/action-items', label: 'Action Items', icon: CheckSquare },
    { href: '/profile', label: 'Company Profile', icon: Building2 },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

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
                </div>
                <div className="flex items-center gap-2">
                    <NotificationBell clientId={user?.clientId} />
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400">
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0d1a0d] border-r border-[#1a5c3844] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="p-6 border-b border-[#1a5c3844]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="w-7 h-7 text-[#4CAF80]" />
                                <span className="text-xl font-bold text-white font-[family-name:var(--font-syne)]">
                                    GHG Shield
                                </span>
                            </div>
                            <div className="hidden lg:block">
                                <NotificationBell clientId={user?.clientId} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Client Portal</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                        ? 'bg-[#4CAF80]/10 text-[#4CAF80] font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a2e1a]'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-[#1a5c3844]">
                        <div className="flex items-center gap-3 mb-3 px-3">
                            <div className="w-8 h-8 rounded-full bg-[#4CAF80]/20 flex items-center justify-center text-[#4CAF80] text-sm font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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

                {/* Main content */}
                <main className="flex-1 min-h-screen">
                    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
