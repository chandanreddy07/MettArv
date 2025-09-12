// SendGrid integration - referenced from blueprint:javascript_sendgrid
import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.SERVER_PUBLIC_URL || 'http://localhost:5000';
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com';
  
  return {
    to: email,
    from: fromEmail,
    subject: 'Verify your email address',
    text: `Please verify your email address by clicking this link: ${verificationUrl}`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Verify your email address</h2>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #666; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
      </div>
    `
  };
}