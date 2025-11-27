import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// helper function
function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      employeeId: user.employee || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("employee");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employee?._id || null,
      },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// POST /auth/register (admin will use this to create users)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let employee = null;
    if (employeeId) {
      employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(400).json({ message: "Invalid employeeId" });
      }
    }

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "user",
      employee: employee ? employee._id : null,
    });

    res.status(201).json({ id: user._id });
  } catch (err) {
    console.error("Register error", err);
    res.status(500).json({ message: "Server error during register" });
  }
});

export default router;
