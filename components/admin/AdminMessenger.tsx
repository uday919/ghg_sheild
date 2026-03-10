'use client';
// ============================================================
// GHG Shield — Admin Messenger Component
// ============================================================
import { useState } from 'react';
import { Card, Button, Textarea } from '@/components/ui';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

interface AdminMessengerProps {
    clientId: string;
}

export default function AdminMessenger({ clientId }: AdminMessengerProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            setIsSending(true);

            // 1. Fetch client details (email and name)
            const { data: client, error: clientError } = await supabase
                .from('clients')
                .select('contact_name, contact_email')
                .eq('id', clientId)
                .single();

            if (clientError || !client) {
                throw new Error('Could not find client contact info');
            }

            // 2. Send email via our API
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'direct_admin_message',
                    to: client.contact_email,
                    name: client.contact_name,
                    message: message,
                    loginUrl: `${window.location.origin}/login`,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to send message');
            }

            toast.success('Message sent to client');
            setMessage('');
        } catch (error: any) {
            console.error('Messenger Error:', error);
            toast.error(error.message || 'Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="h-full border-[#1a5c3844] bg-[#0a0f0a]/50 backdrop-blur-sm">
            <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-lg bg-[#4CAF80]/10">
                        <MessageSquare className="w-5 h-5 text-[#4CAF80]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">
                            Client Messenger
                        </h3>
                        <p className="text-xs text-gray-400">Send an email directly to this client</p>
                    </div>
                </div>

                <div className="flex-1">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here... The client will receive this as an email."
                        className="h-full min-h-[150px] bg-[#0d1a0d] border-[#1a5c3844] text-gray-200 placeholder:text-gray-600 focus:border-[#4CAF80] resize-none"
                        disabled={isSending}
                    />
                </div>

                <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !message.trim()}
                    className="w-full bg-[#4CAF80] hover:bg-[#3d8b60] text-[#050a05] font-bold"
                >
                    {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {isSending ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-[10px] text-gray-500 text-center italic">
                    Messages are sent via the secure GHG Shield relay.
                </p>
            </div>
        </Card>
    );
}
