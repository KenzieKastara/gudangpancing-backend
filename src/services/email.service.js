import { Resend } from 'resend';

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('RESEND_API_KEY not configured');
}

const SENDER_EMAIL =
  process.env.SENDER_EMAIL || 'GudangPancing <onboarding@resend.dev>';

class EmailService {
  async sendOTPEmail(recipientEmail, otp, username) {
    try {
      // Dev fallback
      if (!resend) {
        console.warn('Email service not configured. OTP (dev mode):', otp);
        return { success: true, emailId: 'dev-mode', otp };
      }

      const htmlContent = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:40px 0;">
        <div style="max-width:500px;margin:0 auto;background:#ffffff;border-radius:12px;padding:40px;text-align:center;">
          
          <h1 style="margin:0;color:#0f172a;">GudangPancing.id</h1>
          <p style="color:#64748b;margin-top:5px;">Reset Password Verification</p>

          <p style="margin-top:30px;color:#334155;">
            Halo <strong>${username}</strong>,
          </p>

          <p style="color:#334155;">
            Gunakan kode OTP berikut untuk mereset password akun Anda:
          </p>

          <div style="margin:30px 0;">
            <span style="
              display:inline-block;
              padding:18px 30px;
              font-size:28px;
              letter-spacing:6px;
              font-weight:bold;
              background:#0f172a;
              color:#ffffff;
              border-radius:10px;">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px;color:#64748b;">
            Kode berlaku selama 10 menit.
          </p>

          <p style="font-size:12px;color:#94a3b8;margin-top:30px;">
            © 2026 GudangPancing.id
          </p>

        </div>
      </div>
      `;

      const { data, error } = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [recipientEmail],
        subject: 'Kode OTP Reset Password - Gudang Pancing',
        html: htmlContent
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
