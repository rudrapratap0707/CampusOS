import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", loginUser);

export default router;
