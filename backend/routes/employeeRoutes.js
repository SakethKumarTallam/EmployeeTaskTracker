import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

// GET /employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
