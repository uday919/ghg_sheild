// ============================================================
// GHG Shield — Email Send API Route
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, reportReadyEmail, welcomeEmail, documentAvailableEmail, actionItemEmail, adminDirectMessageEmail, clientToAdminEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { type, to, name, ...params } = await req.json();

        if (!type || (!to && type !== 'client_to_admin')) {
            return NextResponse.json({ error: 'type and to are required' }, { status: 400 });
        }

        let emailData;

        switch (type) {
            case 'client_to_admin':
                emailData = clientToAdminEmail(
                    params.clientName || 'Unknown Client',
                    params.clientEmail || 'noreply@ghgshield.com',
                    params.message || ''
                );
                break;
                // ... (existing cases)
                emailData = reportReadyEmail(
                    name || 'Client',
                    to,
                    params.reportName || 'GHG Report',
                    params.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL}/reports`
                );
                break;

            case 'welcome':
                emailData = welcomeEmail(
                    name || 'Client',
                    to,
                    params.tempPassword || 'temp123',
                    params.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/login`
                );
                break;

            case 'custom':
                emailData = {
                    to,
                    subject: params.subject || 'GHG Shield Notification',
                    html: params.html || '<p>Notification from GHG Shield</p>',
                };
                break;

            case 'document_available':
                emailData = documentAvailableEmail(
                    name || 'Client',
                    to,
                    params.docName || 'Document',
                    params.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/documents`
                );
                break;

            case 'action_item':
                emailData = actionItemEmail(
                    name || 'Client',
                    to,
                    params.actionText || 'New Task',
                    params.priority || 'medium',
                    params.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/action-items`
                );
                break;

            case 'direct_admin_message':
                emailData = adminDirectMessageEmail(
                    name || 'Client',
                    to,
                    params.message || '',
                    params.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/login`
                );
                break;

            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        const result = await sendEmail(emailData);
        return NextResponse.json({ success: true, id: result.id });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send email' },
            { status: 500 }
        );
    }
}
