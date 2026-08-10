import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_campusos_key_2026";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "FACULTY" | "STUDENT";
    email?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No Token Provided!" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET) as any;
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or Expired Token!" });
  }
};

export const authorizeRole = (roles: ("ADMIN" | "FACULTY" | "STUDENT")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Unauthorized: Requires one of [${roles.join(", ")}] permissions.` 
      });
    }
    next();
  };
};

export const isAdmin = authorizeRole(["ADMIN"]);
export const isFaculty = authorizeRole(["FACULTY", "ADMIN"]);
export const isStudent = authorizeRole(["STUDENT"]);
