import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// 1. SARE DEPARTMENTS FETCH KARNE KE LIYE (GET)
router.get("/", async (req, res) => {
  try {
    const departments = await prisma.department.findMany();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// 2. NAYA DEPARTMENT ADD KARNE KE LIYE (POST)
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newDept = await prisma.department.create({
      data: { name }
    });
    res.status(201).json(newDept);
  } catch (error) {
    res.status(500).json({ error: "Failed to create department. It might already exist." });
  }
});

// 3. DEPARTMENT DELETE KARNE KE LIYE (DELETE)
router.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    await prisma.department.delete({
      where: { name } // Name unique hai schema mein, toh direct delete kar sakte hain
    });
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete department" });
  }
});

export default router;