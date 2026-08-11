import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
// @ts-ignore
import adminAuthRouter from "./routes/adminAuth.js"; // 🔥 IMPORT ADMIN ROUTE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://campus-os-mauve.vercel.app",
  credentials: true
}));
app.use(express.json());

// ==========================================
// MOUNT ROUTES
// ==========================================
app.use("/api/auth", authRoutes); // Auth API Base URL
app.use("/api/admin", adminAuthRouter); // 🔥 MOUNT ADMIN ROUTE

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: "success", 
      message: "CampusOS API is running!", 
      database: "Connected" 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed", 
      error: String(error) 
    });
  }
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server!" });
});

app.listen(PORT, () => {
  console.log(`🚀 CampusOS Backend Server running on http://localhost:${PORT}`);
});
