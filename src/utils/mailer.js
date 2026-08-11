import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // 🔥 Yeh line jaadu karegi (host aur port hatane honge)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"CampusOS Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'CampusOS Admin Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #0f172a; color: #ffffff;">
        <div style="max-w: 400px; margin: auto; background: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="color: #ef4444; margin-top: 0;">CampusOS Admin Access</h2>
          <p style="color: #94a3b8; font-size: 14px;">Your secure one-time password (OTP) for command center login is:</p>
          <div style="background: #0f172a; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #ffffff;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #64748b;">This OTP is valid for 5 minutes. Do not share this code with anyone.</p>
        </div>
      </div>
    `,
  });
};