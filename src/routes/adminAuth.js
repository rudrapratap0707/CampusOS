import express from 'express';
import { sendOTPEmail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

let otpStore = {
  code: null,
  expiresAt: null
};

// Step 1: Verify Password and Send OTP
router.post('/request-otp', async (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid master password' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.code = otp;
  otpStore.expiresAt = Date.now() + 5 * 60 * 1000;

  try {
    await sendOTPEmail(process.env.ADMIN_EMAIL, otp);
    return res.json({ success: true, message: 'OTP sent successfully to admin inbox' });
  } catch (error) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to dispatch OTP email' });
  }
});

// Step 2: Verify OTP and Grant Session Token
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;

  if (!otpStore.code || Date.now() > otpStore.expiresAt) {
    return res.status(400).json({ error: 'OTP expired or not requested' });
  }

  if (otp !== otpStore.code) {
    return res.status(400).json({ error: 'Invalid OTP code' });
  }

  otpStore.code = null;
  otpStore.expiresAt = null;

  const token = jwt.sign(
    { role: 'ADMIN', email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.json({ success: true, token, message: 'Admin authenticated successfully' });
});

export default router;