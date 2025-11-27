// backend/seedData.js
import Employee from "./models/Employee.js";
import Task from "./models/Task.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

export async function seedData() {
  const employeeCount = await Employee.countDocuments();

  // Optional: only seed if DB is empty
  if (employeeCount > 0) {
    console.log("Seed skipped: employees already exist");
    return;
  }

  console.log("Seeding initial data...");

  // clear existing data
  await Promise.all([
    Task.deleteMany({}),
    Employee.deleteMany({}),
    User.deleteMany({}),
  ]);

  // --- EMPLOYEES ---
  const employees = await Employee.insertMany([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Frontend Developer",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Backend Developer",
    },
    {
      name: "Charlie Lee",
      email: "charlie@example.com",
      role: "Project Manager",
    },
  ]);

  // --- TASKS ---
  await Task.insertMany([
    {
      title: "Build Login Page",
      description: "Create responsive login UI with validation",
      status: "in-progress",
      employee: employees[0]._id,
      dueDate: new Date("2025-12-01"),
    },
    {
      title: "Create API for Tasks",
      description: "REST endpoints for CRUD operations on tasks",
      status: "pending",
      employee: employees[1]._id,
      dueDate: new Date("2025-12-03"),
    },
    {
      title: "Prepare Sprint Plan",
      description: "Define tasks and timeline for next sprint",
      status: "completed",
      employee: employees[2]._id,
      dueDate: new Date("2025-11-25"),
    },
  ]);

  // --- USERS (AUTH) ---

  // 1) Admin user
  const adminPassword = "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await User.create({
    name: "System Admin",
    email: "admin@example.com",
    passwordHash: adminHash,
    role: "admin",
    employee: null, // admin not tied to a specific employee
  });

  console.log(
    `⭐ Admin user created: email=admin@example.com password=${adminPassword}`
  );

  // 2) One regular user per employee
  const employeePassword = "password123";
  const employeeHash = await bcrypt.hash(employeePassword, 10);

  for (const emp of employees) {
    await User.create({
      name: emp.name,
      email: emp.email, // same as employee email
      passwordHash: employeeHash,
      role: "user",
      employee: emp._id,
    });
    console.log(
      `👤 Employee user: ${emp.name} -> ${emp.email} / ${employeePassword}`
    );
  }

  console.log("Seeding done ✅ (employees, tasks, users)");
}
