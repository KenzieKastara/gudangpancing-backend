import { Resend } from 'resend';

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY not configured');
}

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'GudangPancing <onboarding@resend.dev>';

class EmailService {

  async sendOTPEmail(recipientEmail, otp, username) {
    try {
      // Kalau tidak ada API key, fallback dev mode
      if (!resend) {
        console.warn('Email service not configured. OTP (dev mode):', otp);
        return { success: true, emailId: 'dev-mode', otp };
      }

      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [recipientEmail],
        subject: 'Kode OTP Reset Password - Gudang Pancing',
        template: {
          name: 'password-reset-otp',
          data: {
            otp: otp,
            username: username
          }
        }
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, emailId: data?.id };

    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
