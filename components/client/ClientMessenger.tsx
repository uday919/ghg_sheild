'use client';

import { useState } from 'react';
import { Card, Textarea, Button } from '@/components/ui';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface ClientMessengerProps {
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
}

export function ClientMessenger({ clientId, clientName, clientEmail }: ClientMessengerProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.error('Please enter a message');
            return;
        }

        try {
            setIsSending(true);
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'client_to_admin',
                    clientId,
                    clientName,
                    clientEmail,
                    message: message.trim(),
                }),
            });

            if (!response.ok) throw new Error('Failed to send message');

            toast.success('Message sent to your consultant');
            setMessage('');
        } catch (error) {
            console.error('Messenger Error:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="border-[#4CAF80]/20 bg-gradient-to-br from-[#0d1a0d] to-[#050a05]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#4CAF80]/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-[#4CAF80]" />
                </div>
                <div>
                    <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">Contact Consultant</h3>
                    <p className="text-xs text-gray-400">Direct line to the GHG Shield expert team</p>
                </div>
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder="How can we help you today? Ask about your report, data verification, or general GHG strategy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] bg-black/40 border-white/5 focus:border-[#4CAF80]/50 placeholder:text-gray-600"
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3 text-[#4CAF80]" />
                        Managed Service Support
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        isLoading={isSending}
                        disabled={!message.trim()}
                        size="sm"
                        className="gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Send Inquiry
                    </Button>
                </div>
            </div>
        </Card>
    );
}
