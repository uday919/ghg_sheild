'use client';
// ============================================================
// GHG Shield — Client Notification Bell Component
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, FileText, CheckCircle, X } from 'lucide-react';

interface Notification {
    id: string;
    type: 'document' | 'report' | 'action';
    message: string;
    timestamp: string;
    read: boolean;
}

interface NotificationBellProps {
    clientId?: string;
}

export function NotificationBell({ clientId }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (clientId) fetchNotifications();
    }, [clientId]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchNotifications = async () => {
        if (!clientId) return;
        try {
            // Fetch recent documents made visible to client
            const [docsRes, reportsRes] = await Promise.all([
                supabase
                    .from('documents')
                    .select('id, name, created_at')
                    .eq('client_id', clientId)
                    .eq('visible_to_client', true)
                    .order('created_at', { ascending: false })
                    .limit(10),
                supabase
                    .from('reports')
                    .select('id, report_name, created_at, updated_at, status')
                    .eq('client_id', clientId)
                    .order('created_at', { ascending: false })
                    .limit(5),
            ]);

            const notifs: Notification[] = [];

            // Document notifications
            if (docsRes.data) {
                docsRes.data.forEach(doc => {
                    notifs.push({
                        id: `doc-${doc.id}`,
                        type: 'document',
                        message: `New document: ${doc.name}`,
                        timestamp: doc.created_at,
                        read: false,
                    });
                });
            }

            // Report notifications
            if (reportsRes.data) {
                reportsRes.data.forEach(doc => {
                    if (doc.status === 'final') {
                        notifs.push({
                            id: `report-${doc.id}`,
                            type: 'report',
                            message: `Report ready: ${doc.report_name}`,
                            timestamp: doc.updated_at || doc.created_at,
                            read: false,
                        });
                    }
                });
            }

            // Sort by timestamp
            notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            // Restore read state from localStorage
            const stored = localStorage.getItem(`ghg-notifs-read-${clientId}`);
            if (stored) {
                const storedIds = new Set(JSON.parse(stored) as string[]);
                setReadIds(storedIds);
                notifs.forEach(n => {
                    if (storedIds.has(n.id)) n.read = true;
                });
            }

            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAllRead = () => {
        const allIds = new Set(notifications.map(n => n.id));
        setReadIds(allIds);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        localStorage.setItem(`ghg-notifs-read-${clientId}`, JSON.stringify([...allIds]));
    };

    const unreadCount = notifications.filter(n => !readIds.has(n.id) && !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'document': return <FileText className="w-4 h-4 text-[#4CAF80]" />;
            case 'report': return <CheckCircle className="w-4 h-4 text-green-400" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    const timeAgo = (ts: string) => {
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-[#1a2e1a] rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4CAF80] text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a5c3844]">
                        <h4 className="text-white text-sm font-semibold font-[family-name:var(--font-syne)]">Notifications</h4>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-[#4CAF80] hover:underline">
                                    Mark all read
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-[#1a2e1a]/50 transition-colors border-b border-[#1a5c3844]/50 ${!notif.read && !readIds.has(notif.id) ? 'bg-[#4CAF80]/5' : ''
                                        }`}
                                >
                                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-300 truncate">{notif.message}</p>
                                        <p className="text-xs text-gray-600 mt-0.5">{timeAgo(notif.timestamp)}</p>
                                    </div>
                                    {!notif.read && !readIds.has(notif.id) && (
                                        <div className="w-2 h-2 bg-[#4CAF80] rounded-full mt-1.5 shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
