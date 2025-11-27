// src/Components/TaskForm.jsx
import { useState } from "react";
import api from "../api";

export default function TaskForm({ employees, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [employeeId, setEmployeeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !employeeId) {
      setError("Title and employee are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await api.post("/tasks", {
        title,
        description,
        status,
        employee: employeeId,
        dueDate: dueDate ? new Date(dueDate) : null,
      });

      setTitle("");
      setDescription("");
      setStatus("pending");
      setEmployeeId("");
      setDueDate("");

      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create Task</h3>
      {error && <p className="error-message">{error}</p>}

      <div className="form-row">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>

      <div className="form-row">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />
      </div>

      <div className="form-row">
        <label>Assign To</label>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-row">
        <label>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Task"}
      </button>
    </form>
  );
}
