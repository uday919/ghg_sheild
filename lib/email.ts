// ============================================================
// GHG Shield — Email Service (Resend)
// ============================================================

const RESEND_API_URL = 'https://api.resend.com/emails';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ id: string }> {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: options.from || 'GHG Shield <noreply@ghgshield.com>',
      to: [options.to],
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${response.status} — ${error}`);
  }

  return response.json();
}

// --------------- Email Templates ---------------

export function welcomeEmail(name: string, email: string, tempPassword: string, loginUrl: string) {
  return {
    to: email,
    subject: '🛡️ Welcome to GHG Shield — Your Compliance Dashboard is Ready',
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 16px; border: 1px solid #1a5c3844;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #4CAF80; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">GHG SHIELD</h1>
          <p style="color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Your GHG Compliance Partner</p>
        </div>
        
        <h2 style="color: #fff; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Welcome, ${name}!</h2>
        <p style="line-height: 1.6; color: #b0b0b0;">Your GHG Shield account has been successfully provisioned. You now have full access to your environmental compliance portal to track emissions, manage facilities, and generate reports.</p>
        
        <div style="background: #0d1a0d; border-left: 4px solid #4CAF80; border-radius: 8px; padding: 24px; margin: 32px 0;">
          <h3 style="color: #fff; font-size: 16px; margin: 0 0 16px 0;">Your Access Credentials</h3>
          <p style="margin: 0 0 10px; font-size: 15px;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #4CAF80; text-decoration: none;">${loginUrl}</a></p>
          <p style="margin: 0 0 10px; font-size: 15px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0; font-size: 15px;"><strong>Temporary Password:</strong> <code style="background: #1a2e1a; padding: 2px 6px; border-radius: 4px; color: #fff; font-family: monospace;">${tempPassword}</code></p>
        </div>
        
        <div style="background: #1a2e1a; border-radius: 8px; padding: 16px; margin-bottom: 32px; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #4CAF80;">⚠️ For security, you will be prompted to <strong>reset your password</strong> immediately after your first successful login.</p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${loginUrl}" style="background: #4CAF80; color: #000; padding: 16px 48px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px 0 rgba(76, 175, 128, 0.39);">Launch Dashboard</a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #1a5c3822; margin: 40px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center; line-height: 1.5;">
          This is an automated message from GHG Shield. Please do not reply to this email.<br>
          If you encounter any issues, contact <a href="mailto:support@ghgshield.com" style="color: #4CAF80; text-decoration: none;">support@ghgshield.com</a>
        </p>
      </div>
    `,
  };
}

export function reportReadyEmail(name: string, email: string, reportName: string, dashboardUrl: string) {
  return {
    to: email,
    subject: `Your GHG Report is Ready — ${reportName}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4CAF80; font-size: 28px; margin: 0;">🛡️ GHG Shield</h1>
        </div>
        <h2 style="color: #fff; font-size: 20px;">Hi ${name},</h2>
        <p>Your GHG emissions report <strong>"${reportName}"</strong> has been finalized and is ready for download.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="background: #4CAF80; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Report</a>
        </div>
      </div>
    `,
  };
}

export function adminAlertEmail(subject: string, message: string) {
  return {
    to: 'admin@ghgshield.com',
    subject: `[GHG Shield Alert] ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #e74c3c;">⚠️ Admin Alert</h2>
        <p>${message}</p>
        <p style="font-size: 12px; color: #666;">GHG Shield Automated Alert System</p>
      </div>
    `,
  };
}

export function documentAvailableEmail(name: string, email: string, docName: string, loginUrl: string) {
  return {
    to: email,
    subject: 'New document available in your GHG Shield portal',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 12px; border: 1px solid #1a5c3844;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4CAF80; font-size: 28px; margin: 0;">🛡️ GHG Shield</h1>
        </div>
        <h2 style="color: #fff; font-size: 20px;">Hi ${name},</h2>
        <p>A new document has been made available in your portal:</p>
        <div style="background: #0d1a0d; border-left: 4px solid #4CAF80; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; font-size: 16px; color: #4CAF80; font-weight: 600;">📄 ${docName}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginUrl}" style="background: #4CAF80; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">View Documents</a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">You're receiving this because a document was shared with your account.</p>
      </div>
    `,
  };
}

export function adminDirectMessageEmail(name: string, email: string, message: string, loginUrl: string) {
  return {
    to: email,
    subject: 'New Message from your GHG Shield Consultant',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 12px; border: 1px solid #1a5c3844;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4CAF80; font-size: 28px; margin: 0;">🛡️ GHG Shield</h1>
        </div>
        <h2 style="color: #fff; font-size: 20px;">Hi ${name},</h2>
        <p>Your GHG Shield consultant has sent you a new message regarding your compliance portal:</p>
        <div style="background: #0d1a0d; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #1a5c3822;">
          <p style="margin: 0; font-size: 16px; color: #fff; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginUrl}" style="background: #4CAF80; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reply in Dashboard</a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">This is a secure communication from the GHG Shield administration team.</p>
      </div>
    `,
  };
}

export function actionItemEmail(name: string, email: string, actionText: string, priority: string, loginUrl: string) {
  const priorityColor = priority === 'high' ? '#ff4d4d' : priority === 'medium' ? '#ff9f43' : '#4CAF80';
  return {
    to: email,
    subject: `New Compliance Task Assigned — ${priority.toUpperCase()} Priority`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 12px; border: 1px solid #1a5c3844;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4CAF80; font-size: 28px; margin: 0;">🛡️ GHG Shield</h1>
        </div>
        <h2 style="color: #fff; font-size: 20px;">Hi ${name},</h2>
        <p>A new compliance task has been assigned to your portal for review or action.</p>
        <div style="background: #0d1a0d; border-left: 4px solid ${priorityColor}; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: ${priorityColor}; font-weight: 700; text-transform: uppercase;">${priority} Priority</p>
          <p style="margin: 0; font-size: 16px; color: #fff;">${actionText}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${loginUrl}" style="background: #4CAF80; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Open Action Items</a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">Stay ahead of your compliance deadlines by completing these items promptly.</p>
      </div>
    `,
  };
} export function clientToAdminEmail(clientName: string, clientEmail: string, message: string) {
  return {
    to: 'support@ghgshield.com', // In production, this would be your support inbox
    subject: `📩 New Client Inquiry: ${clientName}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f0a; color: #e0e0e0; padding: 40px; border-radius: 12px; border: 1px solid #1a5c3844;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #4CAF80; font-size: 28px; margin: 0;">🛡️ GHG Shield Admin</h1>
        </div>
        <h2 style="color: #fff; font-size: 20px;">Support Request</h2>
        <p>A client has sent a new inquiry from their dashboard profile:</p>
        <div style="background: #0d1a0d; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #1a5c3822;">
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #4CAF80;"><strong>Client:</strong> ${clientName} (${clientEmail})</p>
          <p style="margin: 0; font-size: 16px; color: #fff; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="mailto:${clientEmail}?subject=Re: your GHG Shield inquiry" style="background: #4CAF80; color: #000; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Reply to Client</a>
        </div>
        <p style="font-size: 12px; color: #666; text-align: center;">This message was generated from the Client Concierge messenger.</p>
      </div>
    `,
  };
}
