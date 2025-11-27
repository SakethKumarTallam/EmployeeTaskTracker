// backend/routes/dashboardRoutes.js
import express from "express";
import Task from "../models/Task.js";
import { authenticate } from "../middleware/auth.js"; // ✅ named import

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const user = req.user; // decoded from token: { id, role, employeeId }

    let tasks;

    if (user.role === "admin") {
      // Admin: all tasks
      tasks = await Task.find().populate("employee", "name email");
    } else {
      // User: only their tasks
      tasks = await Task.find({ employee: user.employeeId }).populate(
        "employee",
        "name email"
      );
    }

    res.json({
      userId: user.id,
      role: user.role,
      totalTasks: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

export default router;
