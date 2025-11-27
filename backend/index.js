// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Employee from "./models/Employee.js";
import Task from "./models/Task.js";
import { seedData } from "./seedData.js";
import { authenticate, authorizeRole } from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors()); 
console.log("✅ CORS middleware enabled");

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", authenticate, async (req, res) => {
  // same logic as /dashboard OR just:
  res.redirect("/dashboard");
});


// ====== EMPLOYEES ROUTES ======
app.get("/employees", authenticate, authorizeRole("admin"), async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error fetching employees" });
  }
});

// ====== TASKS ROUTES ======
app.get("/tasks", authenticate, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.user.role === "user" && req.user.employeeId) {
      // regular user only sees tasks assigned to their employee record
      filter.employee = req.user.employeeId;
    } else if (req.query.employeeId) {
      // admin can filter by employeeId
      filter.employee = req.query.employeeId;
    }

    const tasks = await Task.find(filter).populate("employee");
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

app.post("/tasks",authenticate, authorizeRole("admin"), async (req, res) => {
  try {
    const { title, description, status, employee, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      employee,
      dueDate,
    });

    const populated = await task.populate("employee");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
});

app.put("/tasks/:id",authenticate, authorizeRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("employee");

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
}); 
// ====== DASHBOARD ROUTE (for ALL authenticated users) ======
app.get("/dashboard", authenticate, async (req, res) => {
  try {
    const user = req.user; // { id, role, employeeId }

    const filter = {};

    if (user.role === "user" && user.employeeId) {
      // regular user → only their tasks
      filter.employee = user.employeeId;
    } else if (user.role === "admin" && req.query.employeeId) {
      // admin → can optionally filter by employeeId
      filter.employee = req.query.employeeId;
    }
    // else admin without employeeId → see all tasks

    const [totalTasks, completedTasks] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: "completed" }),
    ]);

    const completionRate =
      totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    res.json({
      userId: user.id,
      role: user.role,
      totalTasks,
      completedTasks,
      completionRate,
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ message: "Server error fetching dashboard" });
  }
});



mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    if (process.env.SEED_DB === "true") {
      await seedData();
    }
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
