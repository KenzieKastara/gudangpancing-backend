import { Resend } from 'resend';

let resend = null;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

// Initialize Resend only if API key exists
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

class EmailService {
  /**
   * Send OTP email for password reset
   */
  async sendOTPEmail(recipientEmail, otp, username) {
    if (!resend) {
      console.warn('RESEND_API_KEY not configured. OTP:', otp);
      // For development: log OTP instead of sending email
      return { success: true, emailId: 'dev-mode', otp };
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a5d3a 0%, #2d8a5e 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Gudang Pancing</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Password Reset</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="color: #333; font-size: 16px;">Halo <strong>${username}</strong>,</p>
          
          <p style="color: #666; font-size: 14px;">Kamu meminta reset password. Gunakan kode OTP berikut:</p>
          
          <div style="background: #1a5d3a; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          
          <p style="color: #666; font-size: 14px;">Kode ini berlaku selama <strong>10 menit</strong>.</p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Jika kamu tidak meminta reset password, abaikan email ini.</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Gudang Pancing. All rights reserved.
        </div>
      </body>
      </html>
    `;

    try {
   const { data, error } = await resend.emails.send({
  from: SENDER_EMAIL,
  to: [recipientEmail],
  subject: 'Kode OTP Reset Password - Gudang Pancing',
  templateId: 'password-reset-otp', // isi dengan ID template kamu
  variables: {
    otp: otp,
    username: username
  }
});

      if (error) {
        console.error('Resend error:', error);
        throw new Error(error.message);
      }

      console.log('OTP email sent:', data?.id);
      return { success: true, emailId: data?.id };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw error;
    }
  }
}

export default new EmailService();
