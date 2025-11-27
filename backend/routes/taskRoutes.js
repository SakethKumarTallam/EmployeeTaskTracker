import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET /tasks?status=&employeeId=
router.get("/", async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (employeeId) filter.employee = employeeId;

    const tasks = await Task.find(filter).populate("employee");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /tasks
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
});

// PUT /tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

export default router;
