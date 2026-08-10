import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_campusos_key_2026";

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    console.log(`\n🔍 Login Attempt -> Email: "${email}" | Password length: ${password?.length}`);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      console.log("❌ ERROR: User not found in database!");
      return res.status(401).json({ error: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      console.log("❌ ERROR: Password did not match!");
      return res.status(401).json({ error: "Incorrect password" });
    }

    console.log("✅ SUCCESS: Password matched! Generating token...");
    let profileData = null;
    if (user.role === "STUDENT") {
      profileData = await prisma.student.findUnique({ where: { userId: user.id } });
    } else if (user.role === "FACULTY") {
      profileData = await prisma.faculty.findUnique({ where: { userId: user.id } });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
      profile: profileData,
    });
  } catch (error: any) {
    console.error("🔥 Login Crash Error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
