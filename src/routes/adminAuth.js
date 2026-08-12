import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Step 1: Verify Password & Direct Login (OTP Skipped)
router.post('/request-otp', async (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid master password' });
  }

  // 🔥 DIRECT LOGIN TOKEN
  const token = jwt.sign(
    { role: 'ADMIN', email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.json({ success: true, token, skipOtp: true, message: 'Admin authenticated successfully' });
});

router.post('/verify-otp', (req, res) => {
  return res.status(400).json({ error: 'OTP is disabled in testing phase' });
});

export default router;
